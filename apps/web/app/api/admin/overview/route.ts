export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

function adminGuard(role: string | undefined): NextResponse | null {
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

export async function GET() {
  const session = await auth();
  const guard = adminGuard((session?.user as { role?: string } | undefined)?.role);
  if (guard) return guard;

  const [userCount, ledgerCount, unusedCodes, usedCodes] = await Promise.all([
    prisma.user.count(),
    prisma.mnemLedger.count(),
    prisma.accessCode.count({ where: { used: false } }),
    prisma.accessCode.count({ where: { used: true } }),
  ]);

  return NextResponse.json({ userCount, ledgerCount, unusedCodes, usedCodes });
}
