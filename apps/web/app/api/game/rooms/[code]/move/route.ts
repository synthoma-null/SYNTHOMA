import { verifyGameToken, gameMoveSchema, limitGameWrite } from '../../../../../../src/server/security/gameIdentity';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import prisma from '../../../../../../src/lib/prisma';
import { gameReducer } from '../../../../../../src/game/reducer';
import type { GameState } from '../../../../../../src/game/types';

type PC = import('@prisma/client').PrismaClient;
const pc = prisma as unknown as PC;


// POST /api/game/rooms/[code]/move — submit a game action
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const session = await auth();
  const limited = await limitGameWrite(req.headers, 'move', 120);
  if (limited) return limited;
  const parsed = gameMoveSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid game action' }, { status: 400 });
  const { playerId, clientToken, action, stateVersion } = parsed.data;

  const room = await pc.gameRoom.findUnique({
    where: { code },
    include: { players: true },
  });

  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  if (room.status !== 'playing') return NextResponse.json({ error: 'Game not active' }, { status: 400 });

  // Verify player identity
  const roomPlayer = room.players.find((p: { id: string }) => p.id === playerId);
  if (!roomPlayer) return NextResponse.json({ error: 'Player not in room' }, { status: 403 });

  const isAuthenticatedUser = session?.user?.id && roomPlayer.userId === session.user.id;
  const isGuestWithToken =
    clientToken &&
    roomPlayer.clientTokenHash &&
    verifyGameToken(clientToken, roomPlayer.clientTokenHash);

  if (!isAuthenticatedUser && !isGuestWithToken) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 403 });
  }

  // Optimistic concurrency check
  if (room.stateVersion !== stateVersion) {
    return NextResponse.json(
      { error: 'State version mismatch', currentVersion: room.stateVersion },
      { status: 409 },
    );
  }

  const currentState = room.stateJson as unknown as GameState;

  const gamePlayer = currentState.players.find(player => player.seatIndex === roomPlayer.seatIndex);
  if (!gamePlayer || currentState.activePlayerId !== gamePlayer.id) {
    return NextResponse.json({ error: 'Not your turn' }, { status: 403 });
  }

  // Apply action
  const newState = gameReducer(currentState, action);
  const newVersion = room.stateVersion + 1;

  const committed = await pc.$transaction(async tx => {
    const updated = await tx.gameRoom.updateMany({
      where: { id: room.id, stateVersion, status: 'playing' },
      data: { stateJson: newState as unknown as import('@prisma/client').Prisma.InputJsonValue, stateVersion: newVersion,
        ...(newState.status === 'finished' ? { status: 'finished', finishedAt: new Date() } : {}) },
    });
    if (updated.count !== 1) return false;
    await tx.gameMove.create({ data: { roomId: room.id, playerId, turnNumber: currentState.turnNumber,
      actionType: action.type, payload: action as unknown as import('@prisma/client').Prisma.InputJsonValue,
      stateAfter: newState as unknown as import('@prisma/client').Prisma.InputJsonValue } });
    await tx.gameRoomPlayer.updateMany({ where: { id: playerId }, data: { lastSeenAt: new Date() } });
    return true;
  });
  if (!committed) return NextResponse.json({ error: 'State version mismatch' }, { status: 409 });
  return NextResponse.json({ ok: true, stateVersion: newVersion });
}
