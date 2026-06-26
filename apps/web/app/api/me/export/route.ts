export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user, profile, settings, psyche, progress, choices, entitlements, ledger] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, nickname: true, email: true, role: true, createdAt: true },
      }),
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.userSettings.findUnique({ where: { userId } }),
      prisma.psycheStats.findUnique({ where: { userId } }),
      prisma.readingProgress.findMany({ where: { userId } }),
      prisma.choiceEvent.findMany({ where: { userId } }),
      prisma.entitlement.findMany({ where: { userId } }),
      prisma.mnemLedger.findMany({ where: { userId } }),
    ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    user,
    profile,
    settings,
    psyche,
    readingProgress: progress,
    choices,
    entitlements,
    mnemLedger: ledger,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="synthoma-export-${userId}.json"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
