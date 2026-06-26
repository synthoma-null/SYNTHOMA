export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

const ProgressSchema = z.object({
  collection: z.string().min(1),
  chapterId: z.string().min(1),
  chapterTitle: z.string().optional(),
  lastBlockId: z.string().optional(),
  progressPercent: z.number().int().min(0).max(100).default(0),
  readMs: z.number().int().min(0).default(0),
  completed: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = ProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const d = parsed.data;
    const record = await prisma.readingProgress.upsert({
      where: {
        userId_collection_chapterId: {
          userId,
          collection: d.collection,
          chapterId: d.chapterId,
        },
      },
      create: {
        userId,
        collection: d.collection,
        chapterId: d.chapterId,
        chapterTitle: d.chapterTitle ?? null,
        lastBlockId: d.lastBlockId ?? null,
        progressPercent: d.progressPercent,
        readMs: d.readMs,
        completed: d.completed,
        completedAt: d.completed ? new Date() : null,
      },
      update: {
        chapterTitle: d.chapterTitle ?? null,
        lastBlockId: d.lastBlockId ?? null,
        progressPercent: d.progressPercent,
        readMs: d.readMs,
        completed: d.completed,
        completedAt: d.completed ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error('[progress POST]', err);
    return NextResponse.json({ error: 'Interní chyba.' }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const progress = await prisma.readingProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ progress });
}
