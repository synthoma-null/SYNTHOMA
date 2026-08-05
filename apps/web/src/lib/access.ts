import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { getPackageById, PACKAGES } from '../content/booksManifest';
import {
  getContentAccess,
  grantEntitlement,
  grantPackage as grantPackageEntitlement,
  purchaseWithMnems,
} from '../server/economy';

export async function canReadChapter(userId: string, chapterId: string): Promise<boolean> {
  try {
    return (await getContentAccess(userId, 'chapter', chapterId)).canAccess;
  } catch {
    return false;
  }
}

export async function getUserEntitlements(userId: string) {
  return prisma.entitlement.findMany({ where: { userId } });
}

export async function grantChapter(
  userId: string,
  chapterId: string,
  source: string,
): Promise<void> {
  if (source === 'mnem') {
    await purchaseWithMnems({
      userId,
      contentType: 'chapter',
      contentId: chapterId,
      idempotencyKey: `legacy:chapter:${userId}:${chapterId}`,
    });
    return;
  }
  await grantEntitlement({
    userId,
    contentType: 'chapter',
    contentId: chapterId,
    source,
  });
}

export async function grantPackage(
  userId: string,
  packageId: string,
  source: string,
  stripeSessionId?: string,
  tx?: Prisma.TransactionClient,
): Promise<void> {
  await grantPackageEntitlement(
    {
      userId,
      packageId,
      source,
      idempotencyKey: stripeSessionId
        ? `stripe:session:${stripeSessionId}`
        : `${source}:package:${userId}:${packageId}`,
      ...(stripeSessionId ? { stripeSessionId, sourceReference: stripeSessionId } : {}),
    },
    tx,
  );
}

export async function isSupporter(userId: string): Promise<boolean> {
  const entitlements = await prisma.entitlement.findMany({
    where: { userId },
    select: { packageId: true },
  });
  for (const e of entitlements) {
    if (!e.packageId) continue;
    const pkg = getPackageById(e.packageId);
    if (pkg?.supporter) return true;
  }
  return false;
}

function computeTone(emotions: Record<string, number>): string {
  const order = ['anger', 'fear', 'sadness', 'disgust', 'joy', 'trust', 'surprise', 'anticipation'];
  let top = '';
  let topValue = -Infinity;
  for (const key of order) {
    const v = emotions[key] ?? 0;
    if (v > topValue) {
      top = key;
      topValue = v;
    }
  }
  if (topValue <= 0) return 'neutrální_sarkastický';
  const map: Record<string, string> = {
    joy: 'radostný',
    trust: 'důvěřivý',
    fear: 'úzkostný',
    surprise: 'překvapený',
    sadness: 'smutný',
    disgust: 'odpudivý',
    anger: 'rozhořčený',
    anticipation: 'očekávající',
  };
  return map[top] ?? 'neutrální_sarkastický';
}

export async function updatePsycheStats(
  userId: string,
  functionDelta: Record<string, number>,
  emotionDelta: Record<string, number>,
): Promise<void> {
  const existing = await prisma.psycheStats.findUnique({ where: { userId } });
  const run = await prisma.userRun.findUnique({ where: { userId } });

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const emotions = {
    joy: clamp((existing?.joy ?? 0) + (emotionDelta['joy'] ?? 0)),
    trust: clamp((existing?.trust ?? 0) + (emotionDelta['trust'] ?? 0)),
    fear: clamp((existing?.fear ?? 0) + (emotionDelta['fear'] ?? 0)),
    surprise: clamp((existing?.surprise ?? 0) + (emotionDelta['surprise'] ?? 0)),
    sadness: clamp((existing?.sadness ?? 0) + (emotionDelta['sadness'] ?? 0)),
    disgust: clamp((existing?.disgust ?? 0) + (emotionDelta['disgust'] ?? 0)),
    anger: clamp((existing?.anger ?? 0) + (emotionDelta['anger'] ?? 0)),
    anticipation: clamp((existing?.anticipation ?? 0) + (emotionDelta['anticipation'] ?? 0)),
  };
  const tone = computeTone(emotions);
  const shadow = run?.shadow ?? existing?.shadow ?? 0;

  if (!existing) {
    await prisma.psycheStats.create({
      data: {
        userId,
        ni: clamp(50 + (functionDelta['Ni'] ?? 0)),
        fe: clamp(50 + (functionDelta['Fe'] ?? 0)),
        ti: clamp(50 + (functionDelta['Ti'] ?? 0)),
        se: clamp(50 + (functionDelta['Se'] ?? 0)),
        ...emotions,
        tone,
        shadow,
      },
    });
    return;
  }

  await prisma.psycheStats.update({
    where: { userId },
    data: {
      ni: clamp(existing.ni + (functionDelta['Ni'] ?? 0)),
      fe: clamp(existing.fe + (functionDelta['Fe'] ?? 0)),
      ti: clamp(existing.ti + (functionDelta['Ti'] ?? 0)),
      se: clamp(existing.se + (functionDelta['Se'] ?? 0)),
      ...emotions,
      tone,
      shadow,
    },
  });
}

export function computeSubjectTitle(psyche: {
  ni: number; fe: number; ti: number; se: number;
  shadow: number; tone: string;
}): string {
  const { ni, fe, ti, se, shadow } = psyche;
  const dominant = Math.max(ni, fe, ti, se);
  const isHighShadow = shadow >= 60;
  const isLowShadow = shadow <= 20;

  if (isHighShadow) {
    if (dominant === ni) return 'Stínový archivář';
    if (dominant === fe) return 'Nosič černého boxu';
    if (dominant === ti) return 'Subjekt s vysokým tlakem paměti';
    return 'Ten, kdo se díval příliš dlouho';
  }

  if (dominant === ni) {
    if (fe >= 55) return 'Nosič cizího ticha';
    if (ti >= 55) return 'Kartograf neviditelných dveří';
    if (isLowShadow) return 'Diagnostický věštec';
    return 'Čtenář absence';
  }

  if (dominant === fe) {
    if (ni >= 55) return 'Empatická ochránkyně';
    if (ti >= 55) return 'Ten, kdo zůstal';
    if (isLowShadow) return 'Strážce bezpečných míst';
    return 'Nosič cizího ticha';
  }

  if (dominant === ti) {
    if (ni >= 55) return 'Rozebírač smyček';
    if (se >= 55) return 'Systémový pitvař';
    if (isLowShadow) return 'Chladný analytik';
    return 'Auditující chyba';
  }

  if (dominant === se) {
    if (ti >= 55) return 'Reaktivní subjekt';
    if (fe >= 55) return 'Dotyk reality';
    if (isLowShadow) return 'Lovec signálu';
    return 'Běžec sektorem';
  }

  return 'Nezmapovaný subjekt';
}

export async function getSupporterPackageIds(): Promise<string[]> {
  return PACKAGES.filter((p) => p.supporter).map((p) => p.id);
}

const clampRun = (v: number) => Math.max(0, Math.min(100, v));

export async function updateRunStats(
  userId: string,
  delta: {
    stabilityDelta: number;
    pressureDelta: number;
    shadowDelta: number;
    entityDelta?: Record<string, Record<string, number>>;
  },
): Promise<void> {
  const existing = await prisma.userRun.findUnique({ where: { userId } });

  if (!existing) {
    await prisma.userRun.create({
      data: {
        userId,
        // Běžná čtenářská rozhodnutí cyklus nemění. Autoritativní číslo
        // zapisuje až /api/me/cyklus/sync-profile ze stavu karetní hry.
        cycleNumber: 1,
        stability: clampRun(50 + delta.stabilityDelta),
        memoryPressure: clampRun(0 + delta.pressureDelta),
        shadow: clampRun(0 + delta.shadowDelta),
      },
    });
  } else {
    // cycleNumber se záměrně nemění; tuto funkci používá čtečka, ne Cyklus.
    await prisma.userRun.update({
      where: { userId },
      data: {
        stability: clampRun(existing.stability + delta.stabilityDelta),
        memoryPressure: clampRun(existing.memoryPressure + delta.pressureDelta),
        shadow: clampRun(existing.shadow + delta.shadowDelta),
      },
    });
  }

  if (delta.entityDelta) {
    for (const [entity, metrics] of Object.entries(delta.entityDelta)) {
      const rel = await prisma.entityRelation.findUnique({
        where: { userId_entity: { userId, entity } },
      });
      if (!rel) {
        await prisma.entityRelation.create({
          data: {
            userId,
            entity,
            trust: clampRun(metrics['trust'] ?? 0),
            suspicion: clampRun(metrics['suspicion'] ?? 0),
            sync: clampRun(metrics['sync'] ?? 0),
            protection: clampRun(metrics['protection'] ?? 0),
          },
        });
      } else {
        await prisma.entityRelation.update({
          where: { userId_entity: { userId, entity } },
          data: {
            trust: clampRun(rel.trust + (metrics['trust'] ?? 0)),
            suspicion: clampRun(rel.suspicion + (metrics['suspicion'] ?? 0)),
            sync: clampRun(rel.sync + (metrics['sync'] ?? 0)),
            protection: clampRun(rel.protection + (metrics['protection'] ?? 0)),
          },
        });
      }
    }
  }
}

export async function grantArtifact(
  userId: string,
  artifactId: string,
  source: string,
): Promise<boolean> {
  const existing = await prisma.userArtifact.findUnique({
    where: { userId_artifactId: { userId, artifactId } },
  });
  if (existing) return false;

  await prisma.userArtifact.create({ data: { userId, artifactId, source } });
  return true;
}

export async function grantNameFragment(
  userId: string,
  fragment: string,
  source: string,
): Promise<boolean> {
  const existing = await prisma.userNameFragment.findUnique({
    where: { userId_fragment: { userId, fragment } },
  });
  if (existing) return false;

  await prisma.userNameFragment.create({ data: { userId, fragment, source } });
  return true;
}

export async function getUserRun(userId: string) {
  return prisma.userRun.findUnique({ where: { userId } });
}

export async function getEntityRelations(userId: string) {
  return prisma.entityRelation.findMany({ where: { userId } });
}

export async function checkAndActivateMissions(userId: string): Promise<string[]> {
  const { MISSIONS } = await import('../content/booksManifest');
  const [run, psyche, readingProgress, artifacts, nameFragments, whisperCount, missions] = await Promise.all([
    prisma.userRun.findUnique({ where: { userId } }),
    prisma.psycheStats.findUnique({ where: { userId } }),
    prisma.readingProgress.findMany({ where: { userId, completed: true }, select: { chapterId: true } }),
    prisma.userArtifact.findMany({ where: { userId }, select: { artifactId: true } }),
    prisma.userNameFragment.findMany({ where: { userId }, select: { fragment: true } }),
    prisma.whisper.count({ where: { userId } }),
    prisma.userMission.findMany({ where: { userId } }),
  ]);

  const missionMap = new Map(missions.map((m: { missionId: string; status: string }) => [m.missionId, m.status]));
  const completedChapters = new Set(
    readingProgress.map((progress: { chapterId: string }) => progress.chapterId),
  );
  const artifactIds = new Set(artifacts.map((a: { artifactId: string }) => a.artifactId));
  const fragmentSet = new Set(nameFragments.map((f: { fragment: string }) => f.fragment));
  const activated: string[] = [];

  for (const mission of MISSIONS) {
    const currentStatus = missionMap.get(mission.id);
    if (currentStatus === 'completed' || currentStatus === 'active') continue;

    let conditionMet = false;
    const parts = mission.condition.split(':');
    const condType = parts[0];
    const condValue = parts[1];

    if (condType === 'chapter') conditionMet = completedChapters.has(condValue ?? '');
    else if (condType === 'whispers') conditionMet = whisperCount >= parseInt(condValue ?? '1', 10);
    else if (condType === 'artifact') conditionMet = artifactIds.has(condValue ?? '');
    else if (condType === 'fragment') conditionMet = fragmentSet.has(condValue ?? '');
    else if (condType === 'shadow' && run) conditionMet = run.shadow >= parseInt(condValue ?? '0', 10);
    else if (condType === 'stability' && run) conditionMet = run.stability >= parseInt(condValue ?? '0', 10);
    else if (condType === 'entity' && run) {
      const entity = condValue ?? '';
      const metric = parts[2] ?? 'sync';
      const threshold = parseInt(parts[3] ?? '0', 10);
      const relation = await prisma.entityRelation.findUnique({
        where: { userId_entity: { userId, entity } },
      });
      const value = relation?.[metric as keyof typeof relation] as number | undefined;
      conditionMet = typeof value === 'number' && value >= threshold;
    }

    if (conditionMet && !missionMap.has(mission.id)) {
      await prisma.userMission.upsert({
        where: { userId_missionId: { userId, missionId: mission.id } },
        create: { userId, missionId: mission.id, status: 'active', unlockedAt: new Date() },
        update: { status: 'active', unlockedAt: new Date() },
      });
      activated.push(mission.id);
    }
  }

  return activated;
}
