import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { updateRunStats, checkAndActivateMissions } from '../../../../src/lib/access';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const [run, psyche, entities, artifacts, nameFragments, missions, cyklusRun] = await Promise.all([
    prisma.userRun.findUnique({ where: { userId } }),
    prisma.psycheStats.findUnique({ where: { userId } }),
    prisma.entityRelation.findMany({ where: { userId } }),
    prisma.userArtifact.findMany({ where: { userId }, orderBy: { unlockedAt: 'desc' } }),
    prisma.userNameFragment.findMany({ where: { userId }, orderBy: { unlockedAt: 'asc' } }),
    prisma.userMission.findMany({ where: { userId } }),
    prisma.cyklusRun.findUnique({ where: { userId }, select: { progressionJson: true, historyJson: true } as any }).catch(() => null),
  ]);

  return NextResponse.json({
    run, psyche, entities, artifacts, nameFragments, missions,
    cyklusProgression: (cyklusRun as any)?.progressionJson ?? null,
    cyklusHistory: cyklusRun?.historyJson ?? null,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json();
  const { stabilityDelta = 0, pressureDelta = 0, shadowDelta = 0, entityDelta } = body;

  await updateRunStats(userId, {
    stabilityDelta,
    pressureDelta,
    shadowDelta,
    ...(entityDelta ? { entityDelta } : {}),
  });

  const activated = await checkAndActivateMissions(userId);
  const run = await prisma.userRun.findUnique({ where: { userId } });

  return NextResponse.json({ run, activatedMissions: activated });
}
