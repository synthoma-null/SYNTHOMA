import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { createGameState } from '../../../../src/game/setup';
import { ROOM_CODE_LENGTH, PLAYER_COLORS } from '../../../../src/game/constants';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: ROOM_CODE_LENGTH }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function uniqueRoomCode(): Promise<string> {
  let code = generateRoomCode();
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.gameRoom.findUnique({ where: { code } });
    if (!exists) return code;
    code = generateRoomCode();
    attempts++;
  }
  return code;
}

// POST /api/game/rooms — create a new room
export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json() as { nickname: string; mode?: string; clientToken?: string };
  const { nickname, mode = 'party', clientToken } = body;

  if (!nickname?.trim()) {
    return NextResponse.json({ error: 'Nickname required' }, { status: 400 });
  }

  const code = await uniqueRoomCode();
  const color = PLAYER_COLORS[0];

  const initialState = createGameState({
    mode: mode as 'party' | 'coop' | 'chaos',
    players: [{ name: nickname, color }],
  });

  const room = await prisma.gameRoom.create({
    data: {
      code,
      hostUserId: session?.user?.id ?? null,
      status: 'lobby',
      mode,
      stateJson: initialState as unknown as import('@prisma/client').Prisma.InputJsonValue,
      stateVersion: 1,
      players: {
        create: {
          ...(session?.user?.id ? { userId: session.user.id } : {}),
          ...(clientToken ? { clientTokenHash: hashToken(clientToken) } : {}),
          nickname,
          seatIndex: 0,
          color,
          isHost: true,
        },
      },
    },
    });

  const roomWithPlayers = await (prisma as unknown as import('@prisma/client').PrismaClient).gameRoom.findUnique({
    where: { id: room.id },
    include: { players: true },
  });

  const hostPlayer = roomWithPlayers?.players[0];
  if (hostPlayer) {
    await prisma.gameRoom.update({
      where: { id: room.id },
      data: { hostPlayerId: hostPlayer.id },
    });
  }

  return NextResponse.json({ code: room.code, roomId: room.id, playerId: hostPlayer?.id });
}

// GET /api/game/rooms — list active rooms (for lobby browser, optional)
export async function GET() {
  const rooms = await prisma.gameRoom.findMany({
    where: { status: 'lobby' },
    select: { code: true, mode: true, createdAt: true, _count: { select: { players: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json({ rooms });
}

function hashToken(token: string): string {
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = (Math.imul(31, h) + token.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}
