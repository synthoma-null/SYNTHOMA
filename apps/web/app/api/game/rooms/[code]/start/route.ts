import { verifyGameToken, gameStartSchema, limitGameWrite } from '../../../../../../src/server/security/gameIdentity';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import prisma from '../../../../../../src/lib/prisma';
import { createGameState } from '../../../../../../src/game/setup';
import type { GameState } from '../../../../../../src/game/types';

type PC = import('@prisma/client').PrismaClient;
const pc = prisma as unknown as PC;


// POST /api/game/rooms/[code]/start — host starts the game
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const session = await auth();
  const limited = await limitGameWrite(req.headers, 'start');
  if (limited) return limited;
  const parsed = gameStartSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid player identity' }, { status: 400 });
  const { playerId, clientToken } = parsed.data;

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
    verifyGameToken(clientToken, hostPlayer.clientTokenHash);
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

  const started = await pc.gameRoom.updateMany({
    where: { id: room.id, status: 'lobby', stateVersion: room.stateVersion },
    data: {
      status: 'playing',
      startedAt: new Date(),
      stateJson: state as unknown as import('@prisma/client').Prisma.InputJsonValue,
      stateVersion: { increment: 1 },
    },
  });

  if (started.count !== 1) return NextResponse.json({ error: 'Room changed. Try again.' }, { status: 409 });
  return NextResponse.json({ started: true, stateVersion: room.stateVersion + 1 });
}
