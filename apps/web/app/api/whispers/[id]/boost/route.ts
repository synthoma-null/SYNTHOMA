import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';

const BOOST_COSTS: Record<string, { mnemCost: number; days: number; label: string }> = {
  boost:              { mnemCost: 16, days: 7,  label: 'Stabilizace na 7 dní' },
  pin:                { mnemCost: 32, days: 0,  label: 'Připnutí ke kapitole' },
  transform:          { mnemCost: 64, days: 0,  label: 'T-AI transformace' },
  archive_highlight:  { mnemCost: 128, days: 30, label: 'Archivní zvýraznění' },
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;
  const body = await req.json();
  const boostType: string = body.type;

  const config = BOOST_COSTS[boostType];
  if (!config) {
    return NextResponse.json({ error: 'Neplatný typ boostu.' }, { status: 400 });
  }

  const whisper = await prisma.whisper.findUnique({
    where: { id },
    select: { id: true, userId: true, status: true, chapterId: true },
  });
  if (!whisper || whisper.status !== 'approved') {
    return NextResponse.json({ error: 'Šepot neexistuje nebo není schválený.' }, { status: 404 });
  }
  if (whisper.userId !== userId) {
    return NextResponse.json({ error: 'Nelze boostovat cizí šepot.' }, { status: 403 });
  }

  const mnemBalance = await prisma.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const balance = mnemBalance._sum.amount ?? 0;

  if (balance < config.mnemCost) {
    return NextResponse.json(
      { error: `Nedostatek mnemů. Potřebuješ ${config.mnemCost}, máš ${balance}.` },
      { status: 402 },
    );
  }

  const updateData: Record<string, unknown> = {};
  if (boostType === 'boost' || boostType === 'archive_highlight') {
    const until = new Date();
    until.setDate(until.getDate() + config.days);
    updateData.boostedUntil = until;
  }
  if (boostType === 'transform') {
    updateData.type = 'log';
  }

  await prisma.$transaction([
    prisma.mnemLedger.create({
      data: {
        userId,
        amount: -config.mnemCost,
        reason: `Šepot boost: ${config.label} (${id})`,
      },
    }),
    prisma.whisperPurchase.create({
      data: { userId, whisperId: id, type: boostType, mnemCost: config.mnemCost },
    }),
    prisma.whisper.update({ where: { id }, data: updateData }),
  ]);

  return NextResponse.json({ ok: true, type: boostType, cost: config.mnemCost });
}
