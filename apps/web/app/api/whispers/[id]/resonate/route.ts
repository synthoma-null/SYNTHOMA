import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  const whisper = await prisma.whisper.findUnique({
    where: { id },
    select: { id: true, status: true, userId: true },
  });

  if (!whisper || whisper.status !== 'approved') {
    return NextResponse.json({ error: 'Šepot neexistuje.' }, { status: 404 });
  }
  if (whisper.userId === userId) {
    return NextResponse.json({ error: 'Nelze rezonovat s vlastním šepotem.' }, { status: 400 });
  }

  const existing = await prisma.whisperResonance.findUnique({
    where: { whisperId_userId: { whisperId: id, userId } },
  });

  if (existing) {
    await prisma.whisperResonance.delete({ where: { whisperId_userId: { whisperId: id, userId } } });
    await prisma.whisper.update({ where: { id }, data: { resonanceCount: { decrement: 1 } } });
    return NextResponse.json({ resonated: false });
  }

  await prisma.whisperResonance.create({ data: { whisperId: id, userId } });
  await prisma.whisper.update({ where: { id }, data: { resonanceCount: { increment: 1 } } });

  return NextResponse.json({ resonated: true });
}
