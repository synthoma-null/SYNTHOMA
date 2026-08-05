export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const action = (searchParams.get('action') ?? '').trim();
  const requestedLimit = Number.parseInt(searchParams.get('limit') ?? '50', 10);
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 100)) : 50;

  const entries = await prisma.adminAuditLog.findMany({
    ...(action ? { where: { action } } : {}),
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit,
  });

  const userIds = [...new Set(entries.flatMap((entry) => [entry.actorUserId, entry.targetUserId]))];
  const users = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, nickname: true, email: true },
      })
    : [];
  const userById = new Map(users.map((user) => [user.id, user]));

  return NextResponse.json({
    entries: entries.map((entry) => ({
      ...entry,
      actor: userById.get(entry.actorUserId) ?? null,
      target: userById.get(entry.targetUserId) ?? null,
    })),
    count: entries.length,
  });
}
