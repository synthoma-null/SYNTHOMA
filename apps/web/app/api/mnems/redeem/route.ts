export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import {
  grantEntitlement,
  grantMnems,
  grantPackage,
  lockMnemAccount,
} from '../../../../src/server/economy';
import { isContentType } from '../../../../src/content/catalog';

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let code: string;
  try {
    const body = await req.json();
    code = (body.code as string | undefined) ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode || !normalizedCode.startsWith('MNEM-')) {
    return NextResponse.json({ error: 'Neplatný formát kódu.' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const allCodes = await tx.accessCode.findMany({
        where: { used: false },
        select: {
          id: true,
          codeHash: true,
          packageId: true,
          grantType: true,
          contentType: true,
          contentId: true,
          mnemAmount: true,
          expiresAt: true,
        },
      });

      let matched: (typeof allCodes)[number] | null = null;
      for (const row of allCodes) {
        const ok = await compare(normalizedCode, row.codeHash);
        if (ok) { matched = row; break; }
      }

      if (!matched) {
        return { error: 'Kód neexistuje nebo byl již použit.', status: 404 };
      }

      if (matched.expiresAt && matched.expiresAt < new Date()) {
        return { error: 'Platnost kódu vypršela.', status: 410 };
      }

      const validGrant =
        (matched.grantType === 'package' && Boolean(matched.packageId)) ||
        (matched.grantType === 'content' &&
          Boolean(matched.contentType && isContentType(matched.contentType) && matched.contentId)) ||
        (matched.grantType === 'mnems' && (matched.mnemAmount ?? 0) > 0);
      if (!validGrant) return { error: 'Kód nemá platný grant.', status: 409 };

      await lockMnemAccount(tx, userId);
      await tx.accessCode.update({
        where: { id: matched.id },
        data: { used: true, usedAt: new Date(), userId },
      });

      if (matched.grantType === 'package' && matched.packageId) {
        await grantPackage({
          userId,
          packageId: matched.packageId,
          source: 'access_code',
          sourceReference: matched.id,
          idempotencyKey: `access-code:${matched.id}`,
        }, tx);
      } else if (
        matched.grantType === 'content' &&
        matched.contentType &&
        isContentType(matched.contentType) &&
        matched.contentId
      ) {
        await grantEntitlement({
          userId,
          contentType: matched.contentType,
          contentId: matched.contentId,
          source: 'access_code',
          sourceReference: matched.id,
        }, tx);
      } else if (matched.grantType === 'mnems' && (matched.mnemAmount ?? 0) > 0) {
        await grantMnems({
          userId,
          amount: matched.mnemAmount ?? 0,
          reason: 'Uplatněný MNEM přístupový kód',
          idempotencyKey: `access-code:${matched.id}`,
          externalReference: matched.id,
        }, tx);
      }

      return { ok: true, packageId: matched.packageId, status: 200 };
    });

    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: result.ok, packageId: result.packageId });
  } catch (err) {
    console.error('[REDEEM ERROR]', err);
    return NextResponse.json(
      { error: 'Chyba serveru při uplatňování kódu. Zkus to znovu.' },
      { status: 500 },
    );
  }
}
