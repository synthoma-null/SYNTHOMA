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

  const [
    userCount,
    activeUsers7d,
    newUsers30d,
    ledgerCount,
    unusedCodes,
    usedCodes,
    pendingWhispers,
    approvedWhispers,
    totalMnemAgg,
    auditCount,
    managedBookCount,
    managedChapterCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastLoginAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.mnemLedger.count(),
    prisma.accessCode.count({ where: { used: false } }),
    prisma.accessCode.count({ where: { used: true } }),
    prisma.whisper.count({ where: { status: 'pending' } }),
    prisma.whisper.count({ where: { status: 'approved' } }),
    prisma.mnemLedger.aggregate({ _sum: { amount: true } }),
    prisma.adminAuditLog.count(),
    prisma.managedBook.count(),
    prisma.managedChapter.count(),
  ]);

  return NextResponse.json({
    userCount,
    activeUsers7d,
    newUsers30d,
    ledgerCount,
    unusedCodes,
    usedCodes,
    pendingWhispers,
    approvedWhispers,
    totalMnemBalance: totalMnemAgg._sum.amount ?? 0,
    auditCount,
    managedBookCount,
    managedChapterCount,
    generatedAt: new Date().toISOString(),
  });
}
