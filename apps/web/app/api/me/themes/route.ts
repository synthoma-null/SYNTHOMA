import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { UI_THEMES } from '../../../../src/lib/themes';

const PRICE_MAP = new Map(UI_THEMES.map((t) => [t.id, t.cost]));
const THEME_LABELS = new Map(UI_THEMES.map((t) => [t.id, t.label]));

function cosmeticId(themeId: string) {
  return `theme-${themeId}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const unlocked = await prisma.userCosmeticUnlock.findMany({
    where: { userId },
    select: { cosmeticId: true },
  });
  const unlockedIds = new Set(unlocked.map((u) => u.cosmeticId));

  const balanceAgg = await prisma.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const balance = balanceAgg._sum.amount ?? 0;

  const themes = UI_THEMES.map((t) => ({
    ...t,
    unlocked: t.cost === 0 || unlockedIds.has(cosmeticId(t.id)),
  }));

  return NextResponse.json({ themes, balance });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { themeId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  }

  const { themeId } = body;
  if (!themeId || typeof themeId !== 'string') {
    return NextResponse.json({ error: 'Neplatný motiv.' }, { status: 400 });
  }
  const cost = PRICE_MAP.get(themeId);
  if (typeof cost !== 'number' || cost <= 0) {
    return NextResponse.json({ error: 'Neplatný motiv.' }, { status: 400 });
  }

  const cid = cosmeticId(themeId);

  const existing = await prisma.userCosmeticUnlock.findUnique({
    where: { userId_cosmeticId: { userId, cosmeticId: cid } },
  });
  if (existing) {
    return NextResponse.json({ error: 'Tento motiv již vlastníš.' }, { status: 409 });
  }

  const balanceAgg = await prisma.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const balance = balanceAgg._sum.amount ?? 0;

  if (balance < cost) {
    return NextResponse.json(
      { error: `Nedostatek mnemů. Potřebuješ ${cost}, máš ${balance}.` },
      { status: 402 },
    );
  }

  await prisma.$transaction([
    prisma.userCosmeticUnlock.create({
      data: { userId, cosmeticId: cid, source: 'mnem' },
    }),
    prisma.mnemLedger.create({
      data: {
        userId,
        amount: -cost,
        reason: `Motiv: ${THEME_LABELS.get(themeId) ?? themeId}`,
      },
    }),
  ]);

  return NextResponse.json({ ok: true, themeId, cost });
}
