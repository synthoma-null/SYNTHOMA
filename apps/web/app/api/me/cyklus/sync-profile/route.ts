import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';
import { computeSubjectTitle } from '../../../../../src/lib/access';

const clamp = (v: number) => Math.max(0, Math.min(100, v));

/**
 * POST /api/me/cyklus/sync-profile
 *
 * Called after a Cyklus run ends. Syncs game profile data into the web identity:
 * - PsycheStats (cognitive functions + emotions)
 * - EntityRelation (entity trust/suspicion/sync/protection)
 * - UserProfile.title (based on stabilization)
 * - UserRun (cycle, stability, memoryPressure, shadow)
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const {
    profile,
    entityRelations,
    stats,
    status,
    cycle,
    deathStat,
    profileMastery,
  } = body as {
    profile: Record<string, number>;
    entityRelations: Record<string, number>;
    stats: Record<string, number>;
    status: 'completed' | 'dead';
    cycle: number;
    deathStat?: string;
    profileMastery?: Record<string, number>;
  };

  const results: string[] = [];

  // ── 1. Psyche sync: map Cyklus MBTI profile to PsycheStats ──────────────
  if (profile) {
    const functionDelta: Record<string, number> = {};
    // Cyklus tracks E/I/S/N/T/F/J/P + cognitive functions Ni/Ne/Si/Se/Ti/Te/Fi/Fe
    // Web PsycheStats has: ni, fe, ti, se (cognitive functions)
    // Map mastery and profile into cognitive function deltas
    const masteryWeight = 0.3;
    const profileWeight = 0.5;

    const cogFunctions = ['Ni', 'Ne', 'Si', 'Se', 'Ti', 'Te', 'Fi', 'Fe'] as const;
    for (const fn of cogFunctions) {
      const mastery = (profileMastery?.[fn] ?? 0) * masteryWeight;
      const prof = (profile[fn] ?? 0) * profileWeight;
      if (mastery + prof > 0) {
        functionDelta[fn] = Math.round(mastery + prof);
      }
    }

    // Map to web's 4-function model: aggregate into Ni, Fe, Ti, Se
    const niDelta = (functionDelta['Ni'] ?? 0) + Math.round((functionDelta['Ne'] ?? 0) * 0.5);
    const feDelta = (functionDelta['Fe'] ?? 0) + Math.round((functionDelta['Fi'] ?? 0) * 0.5);
    const tiDelta = (functionDelta['Ti'] ?? 0) + Math.round((functionDelta['Te'] ?? 0) * 0.5);
    const seDelta = (functionDelta['Se'] ?? 0) + Math.round((functionDelta['Si'] ?? 0) * 0.5);

    // Emotion deltas based on run outcome
    const emotionDelta: Record<string, number> = {};
    if (status === 'completed') {
      emotionDelta['joy'] = 3;
      emotionDelta['trust'] = 2;
      emotionDelta['anticipation'] = 1;
    } else if (status === 'dead') {
      emotionDelta['fear'] = 2;
      emotionDelta['sadness'] = 1;
      if (deathStat === 'energy') { emotionDelta['fear'] = 4; emotionDelta['surprise'] = 2; }
      if (deathStat === 'memory') { emotionDelta['sadness'] = 4; emotionDelta['disgust'] = 1; }
      if (deathStat === 'bond') { emotionDelta['sadness'] = 3; emotionDelta['anger'] = 2; }
      if (deathStat === 'control') { emotionDelta['anger'] = 3; emotionDelta['fear'] = 3; }
    }

    const existing = await prisma.psycheStats.findUnique({ where: { userId } });

    if (!existing) {
      const emotions = {
        joy: clamp(emotionDelta['joy'] ?? 0),
        trust: clamp(emotionDelta['trust'] ?? 0),
        fear: clamp(emotionDelta['fear'] ?? 0),
        surprise: clamp(emotionDelta['surprise'] ?? 0),
        sadness: clamp(emotionDelta['sadness'] ?? 0),
        disgust: clamp(emotionDelta['disgust'] ?? 0),
        anger: clamp(emotionDelta['anger'] ?? 0),
        anticipation: clamp(emotionDelta['anticipation'] ?? 0),
      };
      await prisma.psycheStats.create({
        data: {
          userId,
          ni: clamp(50 + niDelta),
          fe: clamp(50 + feDelta),
          ti: clamp(50 + tiDelta),
          se: clamp(50 + seDelta),
          ...emotions,
          shadow: status === 'dead' ? 10 : 0,
        },
      });
    } else {
      const emotions = {
        joy: clamp(existing.joy + (emotionDelta['joy'] ?? 0)),
        trust: clamp(existing.trust + (emotionDelta['trust'] ?? 0)),
        fear: clamp(existing.fear + (emotionDelta['fear'] ?? 0)),
        surprise: clamp(existing.surprise + (emotionDelta['surprise'] ?? 0)),
        sadness: clamp(existing.sadness + (emotionDelta['sadness'] ?? 0)),
        disgust: clamp(existing.disgust + (emotionDelta['disgust'] ?? 0)),
        anger: clamp(existing.anger + (emotionDelta['anger'] ?? 0)),
        anticipation: clamp(existing.anticipation + (emotionDelta['anticipation'] ?? 0)),
      };
      const shadowDelta = status === 'dead' ? 5 : -2;
      await prisma.psycheStats.update({
        where: { userId },
        data: {
          ni: clamp(existing.ni + niDelta),
          fe: clamp(existing.fe + feDelta),
          ti: clamp(existing.ti + tiDelta),
          se: clamp(existing.se + seDelta),
          ...emotions,
          shadow: clamp(existing.shadow + shadowDelta),
        },
      });
    }
    results.push('psyche_synced');
  }

  // ── 2. Entity relations sync ────────────────────────────────────────────
  if (entityRelations && typeof entityRelations === 'object') {
    for (const [entity, value] of Object.entries(entityRelations)) {
      if (typeof value !== 'number') continue;
      const trust = Math.max(0, value);
      const suspicion = Math.max(0, -value);

      const rel = await prisma.entityRelation.findUnique({
        where: { userId_entity: { userId, entity } },
      });

      if (!rel) {
        await prisma.entityRelation.create({
          data: { userId, entity, trust: clamp(trust), suspicion: clamp(suspicion), sync: 0, protection: 0 },
        });
      } else {
        await prisma.entityRelation.update({
          where: { userId_entity: { userId, entity } },
          data: {
            trust: clamp(rel.trust + Math.round(trust * 0.3)),
            suspicion: clamp(rel.suspicion + Math.round(suspicion * 0.3)),
          },
        });
      }
    }
    results.push('entities_synced');
  }

  // ── 3. UserRun stats mapping ────────────────────────────────────────────
  if (stats) {
    const energy = stats['energy'] ?? 50;
    const memory = stats['memory'] ?? 50;
    const bond = stats['bond'] ?? 50;
    const control = stats['control'] ?? 50;

    // stability = average distance from extremes (higher = more stable)
    const stability = Math.round(
      [energy, memory, bond, control].reduce((sum, v) => sum + Math.min(v, 100 - v), 0) / 4 * 2,
    );
    const memoryPressure = clamp(100 - memory);
    const shadowVal = status === 'dead' ? 10 : -5;

    const existingRun = await prisma.userRun.findUnique({ where: { userId } });

    if (!existingRun) {
      await prisma.userRun.create({
        data: {
          userId,
          cycleNumber: cycle ?? 1,
          stability: clamp(stability),
          memoryPressure: clamp(memoryPressure),
          shadow: clamp(shadowVal),
        },
      });
    } else {
      await prisma.userRun.update({
        where: { userId },
        data: {
          cycleNumber: Math.max(existingRun.cycleNumber, cycle ?? 1),
          stability: clamp(stability),
          memoryPressure: clamp(memoryPressure),
          shadow: clamp(existingRun.shadow + shadowVal),
        },
      });
    }
    results.push('run_synced');
  }

  // ── 4. Title update on stabilization ────────────────────────────────────
  if (status === 'completed') {
    const psyche = await prisma.psycheStats.findUnique({ where: { userId } });
    if (psyche) {
      const title = computeSubjectTitle(psyche);
      await prisma.userProfile.upsert({
        where: { userId },
        create: { userId, title },
        update: { title },
      });
      results.push(`title_set:${title}`);
    }
  }

  return NextResponse.json({ ok: true, results });
}
