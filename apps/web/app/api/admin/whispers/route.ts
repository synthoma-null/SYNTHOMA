import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

const moderationSchema = z.object({
  id: z.string().min(1),
  action: z.enum(['approve', 'reject', 'hide']),
  chapterId: z.string().min(1).max(120).optional(),
  emotionTags: z.array(z.string().max(40)).max(20).optional(),
  functionTags: z.array(z.string().max(40)).max(20).optional(),
});

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
  const requestedStatus = searchParams.get('status') ?? 'pending';
  const status = ['pending', 'approved', 'rejected', 'hidden'].includes(requestedStatus)
    ? requestedStatus
    : 'pending';
  const requestedLimit = Number.parseInt(searchParams.get('limit') ?? '50', 10);
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 200)) : 50;

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

  const parsed = moderationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Neplatná data moderace.' }, { status: 400 });
  }
  const { id, action, chapterId, emotionTags, functionTags } = parsed.data;

  const updateData: Record<string, unknown> = {};
  if (action === 'approve') {
    updateData.status = 'approved';
    updateData.approvedAt = new Date();
    if (chapterId) updateData.chapterId = chapterId;
    if (emotionTags) updateData.emotionTags = JSON.stringify(emotionTags);
    if (functionTags) updateData.functionTags = JSON.stringify(functionTags);
  } else if (action === 'reject') {
    updateData.status = 'rejected';
  } else {
    updateData.status = 'hidden';
  }

  const whisper = await prisma.$transaction(async (tx) => {
    const updated = await tx.whisper.update({
      where: { id },
      data: updateData,
      select: { id: true, status: true, userId: true },
    });
    await tx.adminAuditLog.create({
      data: {
        actorUserId: adminId,
        targetUserId: updated.userId,
        action: `whisper_${action}`,
        metadata: { whisperId: updated.id, status: updated.status },
      },
    });
    return updated;
  });

  return NextResponse.json({ id: whisper.id, status: whisper.status });
}
