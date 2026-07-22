import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '../../../auth';
import prisma from '../../../src/lib/prisma';
import { reportRuntimeDatabaseError } from '../../../src/server/runtimeDatabase';

const FILTER_PATTERNS = [
  /\b\d{9,}\b/,
  /[\w.+-]+@[\w-]+\.[a-z]{2,}/i,
  /(https?:\/\/|www\.)\S+/i,
];

function containsForbidden(text: string): boolean {
  return FILTER_PATTERNS.some((p) => p.test(text));
}

const VALID_TYPES = ['unsent', 'memory', 'fear', 'regret', 'wish', 'warning', 'log'] as const;
const VALID_PLACEMENTS = ['random', 'chapter', 'archive', 'similar_subjects'] as const;
const VALID_MODES = ['anonymous', 'subject_type', 'title'] as const;

type PublicWhisper = {
  id: string;
  publicMode: string;
  type: string;
  text: string;
  placement: string;
  chapterId: string | null;
  resonanceCount: number;
  displayCount: number;
  boostedUntil: Date | null;
  approvedAt: Date | null;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement') ?? 'random';
  const chapterId = searchParams.get('chapterId');
  const type = searchParams.get('type');
  const sort = searchParams.get('sort') ?? 'random';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50);

  const where: Record<string, unknown> = { status: 'approved' };
  if (placement !== 'all') where.placement = placement;
  if (chapterId) where.chapterId = chapterId;
  if (type) where.type = type;

  const orderBy: Record<string, string> =
    sort === 'resonance'
      ? { resonanceCount: 'desc' }
      : sort === 'new'
      ? { approvedAt: 'desc' }
      : { createdAt: 'asc' };

  try {
    let whispers: PublicWhisper[] = await prisma.whisper.findMany({
      where,
      orderBy,
      take: sort === 'random' ? 200 : limit,
      select: {
        id: true,
        publicMode: true,
        type: true,
        text: true,
        placement: true,
        chapterId: true,
        resonanceCount: true,
        displayCount: true,
        boostedUntil: true,
        approvedAt: true,
      },
    });

    if (sort === 'random') {
      whispers = whispers.sort(() => Math.random() - 0.5).slice(0, limit);
    }

    if (whispers.length > 0) {
      await prisma.whisper.updateMany({
        where: { id: { in: whispers.map((w: PublicWhisper) => w.id) } },
        data: { displayCount: { increment: 1 } },
      });
    }

    let resonatedIds = new Set<string>();

    if (whispers.length > 0) {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return NextResponse.json(
          whispers.map((w: PublicWhisper) => ({ ...w, resonated: false })),
        );
      }
      const resonances = await prisma.whisperResonance.findMany({
        where: { userId, whisperId: { in: whispers.map((w: PublicWhisper) => w.id) } },
        select: { whisperId: true },
      });
      resonatedIds = new Set(resonances.map((r: { whisperId: string }) => r.whisperId));
    }

    return NextResponse.json(
      whispers.map((w: PublicWhisper) => ({ ...w, resonated: resonatedIds.has(w.id) })),
    );
  } catch (error) {
    const report = reportRuntimeDatabaseError('whispers-get', error);
    return NextResponse.json(
      {
        error: 'WHISPERS_DATABASE_UNAVAILABLE',
        message: 'Kanál šepotů teď není dostupný.',
        correlationId: report.correlationId,
        retryable: true,
      },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { text, type, placement, chapterId, publicMode, emotionTags, functionTags } = body;

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Text je povinný.' }, { status: 400 });
  }
  if (text.length > 500) {
    return NextResponse.json({ error: 'Text je příliš dlouhý (max 500 znaků).' }, { status: 400 });
  }
  if (containsForbidden(text)) {
    return NextResponse.json(
      { error: 'Text obsahuje zakázaný obsah (URL, e-mail, telefonní číslo).' },
      { status: 400 },
    );
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Neplatný typ šepotu.' }, { status: 400 });
  }
  if (placement && !VALID_PLACEMENTS.includes(placement)) {
    return NextResponse.json({ error: 'Neplatné umístění.' }, { status: 400 });
  }
  if (publicMode && !VALID_MODES.includes(publicMode)) {
    return NextResponse.json({ error: 'Neplatný režim zobrazení.' }, { status: 400 });
  }

  const whisper = await prisma.whisper.create({
    data: {
      userId: session.user.id,
      text: text.trim(),
      type,
      placement: placement ?? 'random',
      publicMode: publicMode ?? 'anonymous',
      chapterId: chapterId ?? null,
      emotionTags: JSON.stringify(emotionTags ?? []),
      functionTags: JSON.stringify(functionTags ?? []),
      status: 'pending',
    },
  });

  return NextResponse.json({ id: whisper.id, status: 'pending' }, { status: 201 });
}
