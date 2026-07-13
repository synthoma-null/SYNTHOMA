import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';
import { isEconomyError, lockMnemAccount, spendMnemsAtomic } from '../../../../../src/server/economy';

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
  const idempotencyKey = req.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey || !/^[A-Za-z0-9:_-]{12,128}$/.test(idempotencyKey)) {
    return NextResponse.json({ error: 'Platný Idempotency-Key je povinný.' }, { status: 400 });
  }

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

  const updateData: Record<string, unknown> = {};
  if (boostType === 'boost' || boostType === 'archive_highlight') {
    const until = new Date();
    until.setDate(until.getDate() + config.days);
    updateData.boostedUntil = until;
  }
  if (boostType === 'transform') {
    updateData.type = 'log';
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      await lockMnemAccount(tx, userId);
      const existing = await tx.whisperPurchase.findUnique({ where: { idempotencyKey } });
      if (existing) {
        if (existing.userId !== userId || existing.whisperId !== id || existing.type !== boostType) {
          throw new Error('IDEMPOTENCY_CONFLICT');
        }
        return { replayed: true };
      }
      await spendMnemsAtomic({
        userId,
        amount: config.mnemCost,
        reason: `Šepot boost: ${config.label} (${id})`,
        idempotencyKey: `whisper:${idempotencyKey}`,
        externalReference: id,
      }, tx);
      await tx.whisperPurchase.create({
        data: {
          userId,
          whisperId: id,
          type: boostType,
          mnemCost: config.mnemCost,
          idempotencyKey,
        },
      });
      await tx.whisper.update({ where: { id }, data: updateData });
      return { replayed: false };
    });
    return NextResponse.json({ ok: true, type: boostType, cost: config.mnemCost, ...result });
  } catch (error) {
    if (error instanceof Error && error.message === 'IDEMPOTENCY_CONFLICT') {
      return NextResponse.json({ error: 'Idempotency klíč patří jiné operaci.' }, { status: 409 });
    }
    if (isEconomyError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.status },
      );
    }
    throw error;
  }
}
