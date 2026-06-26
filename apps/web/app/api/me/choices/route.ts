export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { updatePsycheStats, updateRunStats, checkAndActivateMissions } from '../../../../src/lib/access';

const ChoiceSchema = z.object({
  collection: z.string().min(1),
  chapterId: z.string().min(1),
  blockId: z.string().optional(),
  choiceId: z.string().optional(),
  choiceText: z.string().min(1),
  nextBlockId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  functionDelta: z.record(z.string(), z.number()).optional(),
  emotionDelta: z.record(z.string(), z.number()).optional(),
  tone: z.string().optional(),
  stabilityDelta: z.number().optional(),
  pressureDelta: z.number().optional(),
  shadowDelta: z.number().optional(),
  entityDelta: z.record(z.string(), z.record(z.string(), z.number())).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = ChoiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const d = parsed.data;

    const event = await prisma.choiceEvent.create({
      data: {
        userId,
        collection: d.collection,
        chapterId: d.chapterId,
        blockId: d.blockId ?? null,
        choiceId: d.choiceId ?? null,
        choiceText: d.choiceText,
        nextBlockId: d.nextBlockId ?? null,
        tags: d.tags !== undefined ? d.tags : Prisma.JsonNull,
        functionDelta: d.functionDelta !== undefined ? d.functionDelta : Prisma.JsonNull,
        emotionDelta: d.emotionDelta !== undefined ? d.emotionDelta : Prisma.JsonNull,
        tone: d.tone ?? null,
      },
    });

    if (d.functionDelta || d.emotionDelta) {
      await updatePsycheStats(userId, d.functionDelta ?? {}, d.emotionDelta ?? {});
    }

    let activatedMissions: string[] = [];
    if (d.stabilityDelta !== undefined || d.pressureDelta !== undefined || d.shadowDelta !== undefined) {
      await updateRunStats(userId, {
        stabilityDelta: d.stabilityDelta ?? 0,
        pressureDelta: d.pressureDelta ?? 0,
        shadowDelta: d.shadowDelta ?? 0,
        ...(d.entityDelta ? { entityDelta: d.entityDelta } : {}),
      });
      activatedMissions = await checkAndActivateMissions(userId);
    }

    return NextResponse.json({ ok: true, id: event.id, activatedMissions });
  } catch (err) {
    console.error('[choices POST]', err);
    return NextResponse.json({ error: 'Interní chyba.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const chapterId = url.searchParams.get('chapterId');

  const choices = await prisma.choiceEvent.findMany({
    where: { userId, ...(chapterId ? { chapterId } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({ choices });
}
