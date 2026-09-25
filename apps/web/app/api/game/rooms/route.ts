import { hashGameToken, createRoomSchema, limitGameWrite, newRoomCode } from '../../../../src/server/security/gameIdentity';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { createGameState } from '../../../../src/game/setup';
import { ROOM_CODE_LENGTH, PLAYER_COLORS } from '../../../../src/game/constants';

async function uniqueRoomCode(): Promise<string> {
  let code = newRoomCode(ROOM_CODE_LENGTH);
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.gameRoom.findUnique({ where: { code } });
    if (!exists) return code;
    code = newRoomCode(ROOM_CODE_LENGTH);
    attempts++;
  }
  return code;
}

// POST /api/game/rooms — create a new room
export async function POST(req: NextRequest) {
  const session = await auth();
  const limited = await limitGameWrite(req.headers, 'create', 5);
  if (limited) return limited;
  const parsed = createRoomSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Neplatná přezdívka, režim nebo identita hráče.' }, { status: 400 });
  const { nickname, mode, clientToken } = parsed.data;
  if (!session?.user?.id && !clientToken) return NextResponse.json({ error: 'Player identity required' }, { status: 401 });

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
          ...(clientToken ? { clientTokenHash: hashGameToken(clientToken) } : {}),
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
