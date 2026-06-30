import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { grantChapter, canReadChapter } from '../../../../../src/lib/access';
import { getChapterById } from '../../../../../src/content/booksManifest';
import prisma from '../../../../../src/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nepřihlášen.' }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { chapterId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 });
  }

  const { chapterId } = body;
  if (!chapterId || typeof chapterId !== 'string') {
    return NextResponse.json({ error: 'Chybí chapterId.' }, { status: 400 });
  }

  const chapter = getChapterById(chapterId);
  if (!chapter) {
    return NextResponse.json({ error: 'Kapitola nenalezena.' }, { status: 404 });
  }

  const alreadyOwned = await canReadChapter(userId, chapterId);
  if (alreadyOwned) {
    return NextResponse.json({ ok: true, alreadyOwned: true });
  }

  const balanceAgg = await prisma.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const balance = balanceAgg._sum.amount ?? 0;

  if (balance < chapter.mnemCost) {
    return NextResponse.json(
      { error: `Nedostatek mnemů. Potřebuješ ${chapter.mnemCost}, máš ${balance}.`, balance, required: chapter.mnemCost },
      { status: 402 },
    );
  }

  try {
    await grantChapter(userId, chapterId, 'mnem');
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Odemčení selhalo.' }, { status: 500 });
  }

  const newBalanceAgg = await prisma.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const newBalance = newBalanceAgg._sum.amount ?? 0;

  return NextResponse.json({ ok: true, balance: newBalance });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nepřihlášen.' }, { status: 401 });
  }
  const userId = session.user.id;

  const balanceAgg = await prisma.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const balance = balanceAgg._sum.amount ?? 0;

  return NextResponse.json({ balance });
}
