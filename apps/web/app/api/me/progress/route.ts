export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

const ProgressSchema = z.object({
  expectedUserId: z.string().optional(),
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
    if (d.expectedUserId && d.expectedUserId !== userId) return NextResponse.json({ error: 'Account changed' }, { status: 409 });
    const key = { userId, collection: d.collection, chapterId: d.chapterId };
    const record = await prisma.$transaction(async tx => {
      const row = await tx.readingProgress.upsert({
        where: { userId_collection_chapterId: key },
        create: { ...key, chapterTitle: d.chapterTitle ?? null, lastBlockId: d.lastBlockId ?? null,
          progressPercent: d.completed ? 100 : d.progressPercent, readMs: d.readMs,
          completed: d.completed, completedAt: d.completed ? new Date() : null },
        update: {},
      });
      // Conditional database writes cannot regress when requests arrive out of order.
      await tx.readingProgress.updateMany({ where: { ...key, progressPercent: { lt: d.completed ? 100 : d.progressPercent } },
        data: { progressPercent: d.completed ? 100 : d.progressPercent, chapterTitle: d.chapterTitle ?? null,
          ...(d.lastBlockId ? { lastBlockId: d.lastBlockId } : {}) } });
      if (d.completed) await tx.readingProgress.updateMany({ where: { ...key, completed: false }, data: { completed: true, completedAt: new Date(), progressPercent: 100 } });
      await tx.readingProgress.updateMany({ where: { ...key, readMs: { lt: d.readMs } }, data: { readMs: d.readMs } });
      return row;
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
