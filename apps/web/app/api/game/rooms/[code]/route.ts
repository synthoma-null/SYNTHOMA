import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';
import { PLAYER_COLORS } from '../../../../../src/game/constants';
import type { GameState } from '../../../../../src/game/types';

function hashToken(token: string): string {
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = (Math.imul(31, h) + token.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

// GET /api/game/rooms/[code] — poll state
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const session = await auth();
  const clientToken = req.nextUrl.searchParams.get('ct') ?? undefined;

  const room = await (prisma as unknown as import('@prisma/client').PrismaClient).gameRoom.findUnique({
    where: { code },
    include: { players: { orderBy: { seatIndex: 'asc' } } },
  });

  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  // Identify the calling player
  let mySeatIndex: number | null = null;
  for (const p of room.players) {
    if (session?.user?.id && p.userId === session.user.id) {
      mySeatIndex = p.seatIndex; break;
    }
    if (clientToken && p.clientTokenHash && p.clientTokenHash === hashToken(clientToken)) {
      mySeatIndex = p.seatIndex; break;
    }
  }

  // Derive myGamePlayerId from stateJson
  type GS = { players: Array<{ id: string }> };
  const stateJson = room.stateJson as unknown as GS | null;
  const myGamePlayerId = (mySeatIndex !== null && stateJson?.players)
    ? (stateJson.players[mySeatIndex]?.id ?? null)
    : null;

  return NextResponse.json({
    code: room.code,
    status: room.status,
    mode: room.mode,
    stateVersion: room.stateVersion,
    stateJson: room.stateJson,
    mySeatIndex,
    myGamePlayerId,
    players: room.players.map((p: { id: string; nickname: string; seatIndex: number; color: string; isHost: boolean; status: string }) => ({
      id: p.id,
      nickname: p.nickname,
      seatIndex: p.seatIndex,
      color: p.color,
      isHost: p.isHost,
      status: p.status,
    })),
  });
}

// POST /api/game/rooms/[code] — join room
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const session = await auth();
  const body = await req.json() as { nickname: string; clientToken?: string };
  const { nickname, clientToken } = body;

  if (!nickname?.trim()) {
    return NextResponse.json({ error: 'Nickname required' }, { status: 400 });
  }

  const pc = prisma as unknown as import('@prisma/client').PrismaClient;

  const room = await pc.gameRoom.findUnique({
    where: { code },
    include: { players: true },
  });

  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  if (room.status !== 'lobby') return NextResponse.json({ error: 'Game already started' }, { status: 400 });
  if (room.players.length >= room.maxPlayers) return NextResponse.json({ error: 'Room full' }, { status: 400 });

  const seatIndex = room.players.length;
  const color = PLAYER_COLORS[seatIndex % PLAYER_COLORS.length] ?? '#00ffe0';

  const currentState = room.stateJson as unknown as GameState;
  const updatedState: GameState = {
    ...currentState,
    players: [
      ...currentState.players,
      {
        id: `p${seatIndex}`,
        name: nickname,
        color,
        seatIndex,
        resources: { noise: 0, laugh: 0, fragments: 0 },
        hand: [],
        profile: { dominance: 0, caution: 0, courage: 0, tenderness: 0, sarcasm: 0, chaos: 0, cooperation: 0 },
        status: 'active',
        sabotageCount: 0,
        auditsSurvived: 0,
      },
    ],
  };

  const player = await pc.gameRoomPlayer.create({
    data: {
      roomId: room.id,
      userId: session?.user?.id ?? null,
      clientTokenHash: clientToken ? hashToken(clientToken) : null,
      nickname,
      seatIndex,
      color,
      isHost: false,
    },
  });

  await pc.gameRoom.update({
    where: { id: room.id },
    data: {
      stateJson: updatedState as unknown as import('@prisma/client').Prisma.InputJsonValue,
      stateVersion: { increment: 1 },
    },
  });

  return NextResponse.json({ playerId: player.id, seatIndex, color });
}
