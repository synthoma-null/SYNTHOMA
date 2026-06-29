export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { grantPackage } from '../../../../src/lib/access';

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
        select: { id: true, codeHash: true, packageId: true, expiresAt: true },
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

      await tx.accessCode.update({
        where: { id: matched.id },
        data: { used: true, usedAt: new Date(), userId },
      });

      await grantPackage(userId, matched.packageId, 'access_code', undefined, tx);

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
