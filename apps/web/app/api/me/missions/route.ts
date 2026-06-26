import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { grantArtifact, grantNameFragment, updateRunStats } from '../../../../src/lib/access';
import { getMissionById, MISSIONS } from '../../../../src/content/booksManifest';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const userMissions = await prisma.userMission.findMany({ where: { userId } });
  type UMRow = { missionId: string; status: string; progress: number; completedAt: Date | null };
  const missionMap = new Map<string, UMRow>(
    (userMissions as UMRow[]).map((m) => [m.missionId, m]),
  );

  return NextResponse.json(
    MISSIONS.map((m) => {
      const um = missionMap.get(m.id);
      return {
        ...m,
        status: um?.status ?? 'locked',
        progress: um?.progress ?? 0,
        completedAt: um?.completedAt ?? null,
      };
    }),
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const { missionId, action } = await req.json();
  if (!missionId || !action) return NextResponse.json({ error: 'missionId a action jsou povinné.' }, { status: 400 });

  const mission = getMissionById(missionId);
  if (!mission) return NextResponse.json({ error: 'Mise neexistuje.' }, { status: 404 });

  const userMission = await prisma.userMission.findUnique({
    where: { userId_missionId: { userId, missionId } },
  });

  if (action === 'complete') {
    if (!userMission || userMission.status !== 'active') {
      return NextResponse.json({ error: 'Mise není aktivní.' }, { status: 400 });
    }

    await prisma.userMission.update({
      where: { userId_missionId: { userId, missionId } },
      data: { status: 'completed', completedAt: new Date() },
    });

    const rewards: Record<string, unknown> = {};

    if (mission.runReward) {
      await updateRunStats(userId, {
        stabilityDelta: mission.runReward.stabilityDelta ?? 0,
        pressureDelta: mission.runReward.pressureDelta ?? 0,
        shadowDelta: mission.runReward.shadowDelta ?? 0,
      });
      rewards.runReward = mission.runReward;
    }

    if (mission.artifactReward) {
      const granted = await grantArtifact(userId, mission.artifactReward, `mission:${missionId}`);
      rewards.artifact = { id: mission.artifactReward, granted };
    }

    if (mission.fragmentReward) {
      const granted = await grantNameFragment(userId, mission.fragmentReward, `mission:${missionId}`);
      rewards.fragment = { value: mission.fragmentReward, granted };
    }

    return NextResponse.json({ ok: true, rewards });
  }

  return NextResponse.json({ error: 'Neplatná akce.' }, { status: 400 });
}
