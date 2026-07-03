import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import prisma from '../../../../../../src/lib/prisma';
import { createGameState } from '../../../../../../src/game/setup';
import type { GameState } from '../../../../../../src/game/types';

type PC = import('@prisma/client').PrismaClient;
const pc = prisma as unknown as PC;

function hashToken(token: string): string {
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = (Math.imul(31, h) + token.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

// POST /api/game/rooms/[code]/start — host starts the game
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const session = await auth();
  const body = await req.json().catch(() => ({})) as { playerId?: string; clientToken?: string };
  const { playerId, clientToken } = body;

  const room = await pc.gameRoom.findUnique({
    where: { code },
    include: { players: { orderBy: { seatIndex: 'asc' } } },
  });

  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  if (room.status !== 'lobby') return NextResponse.json({ error: 'Already started' }, { status: 400 });

  const hostPlayer = room.players.find((p: { isHost: boolean; userId: string | null; clientTokenHash: string | null; id: string }) => p.isHost);

  const isHostBySession = session?.user?.id && (
    hostPlayer?.userId === session.user.id || room.hostUserId === session.user.id
  );
  const isHostByToken = clientToken && hostPlayer?.clientTokenHash &&
    hostPlayer.clientTokenHash === hashToken(clientToken);
  const isHostByPlayerId = playerId && hostPlayer?.id === playerId && (isHostBySession || isHostByToken);

  const isHost = isHostBySession || isHostByToken || isHostByPlayerId;

  if (!isHost) return NextResponse.json({ error: 'Only host can start' }, { status: 403 });
  if (room.players.length < 2) return NextResponse.json({ error: 'Need at least 2 players' }, { status: 400 });

  const state: GameState = createGameState({
    mode: room.mode as 'party' | 'coop' | 'chaos',
    players: room.players.map((p: { nickname: string; color: string; userId: string | null }) => ({
      name: p.nickname,
      color: p.color,
      ...(p.userId ? { userId: p.userId } : {}),
    })),
  });

  await pc.gameRoom.update({
    where: { id: room.id },
    data: {
      status: 'playing',
      startedAt: new Date(),
      stateJson: state as unknown as import('@prisma/client').Prisma.InputJsonValue,
      stateVersion: { increment: 1 },
    },
  });

  return NextResponse.json({ started: true, stateVersion: room.stateVersion + 1 });
}
