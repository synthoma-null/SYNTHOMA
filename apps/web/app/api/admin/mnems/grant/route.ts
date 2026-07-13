export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';
import { adjustMnems, isEconomyError, lockMnemAccount } from '../../../../../src/server/economy';

function adminGuard(role: string | undefined): NextResponse | null {
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const guard = adminGuard((session?.user as { role?: string } | undefined)?.role);
  if (guard) return guard;
  const actorUserId = session?.user?.id;
  if (!actorUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const requestKey = req.headers.get('idempotency-key')?.trim();
  if (!requestKey || !/^[A-Za-z0-9:_-]{12,128}$/.test(requestKey)) {
    return NextResponse.json({ error: 'Platný Idempotency-Key je povinný.' }, { status: 400 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { identifier, amount, reason } = body as Record<string, unknown>;

  if (typeof identifier !== 'string' || !identifier.trim()) {
    return NextResponse.json({ error: 'identifier je povinný.' }, { status: 400 });
  }
  if (typeof amount !== 'number' || !Number.isInteger(amount)) {
    return NextResponse.json({ error: 'amount musí být celé číslo.' }, { status: 400 });
  }
  if (amount < -100000 || amount > 100000) {
    return NextResponse.json({ error: 'amount mimo povolený rozsah (-100000 až 100000).' }, { status: 400 });
  }
  const reasonStr = typeof reason === 'string' && reason.trim()
    ? reason.trim().slice(0, 100)
    : 'admin_grant';

  const lower = identifier.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: { OR: [{ emailLower: lower }, { nicknameLower: lower }] },
    select: { id: true, email: true, nickname: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Uživatel nebyl nalezen.' }, { status: 404 });
  }

  let entry;
  try {
    entry = await prisma.$transaction(async (tx) => {
      await lockMnemAccount(tx, user.id);
      const ledger = await adjustMnems({
        userId: user.id,
        amount,
        reason: reasonStr,
        idempotencyKey: `admin:mnem:${requestKey}`,
        actorUserId,
        externalReference: requestKey,
      }, tx);
      await tx.adminAuditLog.upsert({
        where: { reference: `admin:mnem:${requestKey}` },
        create: {
          actorUserId,
          targetUserId: user.id,
          action: 'mnem_adjustment',
          reference: `admin:mnem:${requestKey}`,
          metadata: { amount, reason: reasonStr, ledgerEntryId: ledger.id },
        },
        update: {},
      });
      return ledger;
    });
  } catch (error) {
    if (isEconomyError(error)) {
      return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: error.status });
    }
    throw error;
  }

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, nickname: user.nickname },
    entry: { amount: entry.amount, reason: entry.reason },
    newBalance: entry.balanceAfter,
  });
}
