import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role === 'admin' ? session.user.id : null;
}

export async function GET(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'pending';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);

  const whispers = await prisma.whisper.findMany({
    where: { status },
    orderBy: { createdAt: 'asc' },
    take: limit,
    select: {
      id: true,
      userId: true,
      publicMode: true,
      type: true,
      text: true,
      status: true,
      placement: true,
      chapterId: true,
      emotionTags: true,
      functionTags: true,
      resonanceCount: true,
      displayCount: true,
      createdAt: true,
      approvedAt: true,
    },
  });

  return NextResponse.json(whispers);
}

export async function PATCH(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { id, action, chapterId, emotionTags, functionTags } = body;

  if (!id || !action) {
    return NextResponse.json({ error: 'id a action jsou povinné.' }, { status: 400 });
  }

  const VALID_ACTIONS = ['approve', 'reject', 'hide'];
  if (!VALID_ACTIONS.includes(action)) {
    return NextResponse.json({ error: 'Neplatná akce.' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  if (action === 'approve') {
    updateData.status = 'approved';
    updateData.approvedAt = new Date();
    if (chapterId) updateData.chapterId = chapterId;
    if (emotionTags) updateData.emotionTags = JSON.stringify(emotionTags);
    if (functionTags) updateData.functionTags = JSON.stringify(functionTags);
  } else if (action === 'reject') {
    updateData.status = 'rejected';
  } else if (action === 'hide') {
    updateData.status = 'hidden';
  }

  const whisper = await prisma.whisper.update({
    where: { id },
    data: updateData,
    select: { id: true, status: true },
  });

  return NextResponse.json(whisper);
}
