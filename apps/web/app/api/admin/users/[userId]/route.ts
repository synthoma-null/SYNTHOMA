export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';
import { getMnemBalance } from '../../../../../src/server/economy';

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === 'admin';
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: 'userId je povinný.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      profile: {
        select: {
          displayName: true,
          bio: true,
          title: true,
          publicProfile: true,
          showPsycheMap: true,
          showProgress: true,
          showChoices: true,
        },
      },
      settings: {
        select: {
          theme: true,
          animations: true,
          typewriterSpeed: true,
          ttsEnabled: true,
        },
      },
      mnemLedger: {
        select: { id: true, amount: true, reason: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      reading: {
        select: {
          chapterId: true,
          chapterTitle: true,
          progressPercent: true,
          completed: true,
          completedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      },
      choices: {
        select: {
          chapterId: true,
          choiceText: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Uživatel nenalezen.' }, { status: 404 });
  }

  const [run, entityRelations, artifacts, badges, mnemBalance] = await Promise.all([
    prisma.userRun.findUnique({ where: { userId } }),
    prisma.entityRelation.findMany({ where: { userId }, orderBy: { entity: 'asc' } }),
    prisma.userArtifact.findMany({ where: { userId }, select: { artifactId: true, source: true, unlockedAt: true } }),
    prisma.subjectBadge.findMany({ where: { userId }, select: { badgeId: true, earnedAt: true, source: true } }),
    getMnemBalance(userId),
  ]);

  return NextResponse.json({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    profile: user.profile,
    settings: user.settings,
    mnemBalance,
    recentLedger: user.mnemLedger,
    recentReading: user.reading,
    recentChoices: user.choices,
    run: run ?? null,
    entityRelations,
    artifacts,
    badges,
  });
}
