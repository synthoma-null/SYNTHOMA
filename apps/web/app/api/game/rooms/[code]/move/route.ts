import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import prisma from '../../../../../../src/lib/prisma';
import { gameReducer, type GameAction } from '../../../../../../src/game/reducer';
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

// POST /api/game/rooms/[code]/move — submit a game action
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const session = await auth();
  const body = await req.json() as {
    playerId: string;
    clientToken?: string;
    action: GameAction;
    stateVersion: number;
  };

  const { playerId, clientToken, action, stateVersion } = body;

  if (!playerId || !action) {
    return NextResponse.json({ error: 'playerId and action required' }, { status: 400 });
  }

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
    roomPlayer.clientTokenHash === hashToken(clientToken);

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

  // Validate it's this player's turn
  if (currentState.activePlayerId !== playerId && action.type !== 'LOAD_STATE') {
    const activePlayer = currentState.players.find((p) => p.id === currentState.activePlayerId);
    if (activePlayer?.id !== roomPlayer.id) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 403 });
    }
  }

  // Apply action
  const newState = gameReducer(currentState, action);
  const newVersion = room.stateVersion + 1;

  // Persist with transaction
  await pc.$transaction([
    pc.gameRoom.updateMany({
      where: { id: room.id, stateVersion: stateVersion },
      data: {
        stateJson: newState as unknown as import('@prisma/client').Prisma.InputJsonValue,
        stateVersion: newVersion,
        ...(newState.status === 'finished' ? { status: 'finished', finishedAt: new Date() } : {}),
      },
    }),
    pc.gameMove.create({
      data: {
        roomId: room.id,
        playerId,
        turnNumber: currentState.turnNumber,
        actionType: action.type,
        payload: action as unknown as import('@prisma/client').Prisma.InputJsonValue,
        stateAfter: newState as unknown as import('@prisma/client').Prisma.InputJsonValue,
      },
    }),
    pc.gameRoomPlayer.updateMany({
      where: { id: playerId },
      data: { lastSeenAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true, stateVersion: newVersion });
}
