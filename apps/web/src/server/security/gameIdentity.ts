import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { consumeRateLimit, requestAddress } from './rateLimit';

export const gameTokenSchema = z.string().regex(/^v2_[a-f0-9]{64}$/);
export const gameIdentitySchema = z.object({ nickname: z.string().trim().min(1).max(32), clientToken: gameTokenSchema.optional() });
export const createRoomSchema = gameIdentitySchema.extend({ mode: z.enum(['party', 'coop', 'chaos']).default('party') });
export const gameActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ROLL_DICE') }), z.object({ type: z.literal('END_TURN') }),
  z.object({ type: z.literal('SELECT_PIECE'), pieceId: z.string().min(1).max(100) }),
  z.object({ type: z.literal('MOVE_STEP'), directionNodeId: z.string().min(1).max(100) }),
  z.object({ type: z.literal('RESOLVE_EVENT'), choiceId: z.string().min(1).max(100).optional() }),
  z.object({ type: z.literal('PLAY_CARD'), cardId: z.string().min(1).max(100), targetPlayerId: z.string().min(1).max(100).optional() }),
]);
export const gameMoveSchema = z.object({ playerId: z.string().min(1).max(100), clientToken: gameTokenSchema.optional(), action: gameActionSchema, stateVersion: z.number().int().nonnegative() });
export const gameStartSchema = z.object({ playerId: z.string().min(1).max(100).optional(), clientToken: gameTokenSchema.optional() });
export function hashGameToken(token: string): string { return `sha256:${createHash('sha256').update(token).digest('hex')}`; }
export function verifyGameToken(token: unknown, stored: string | null | undefined): boolean {
  if (!gameTokenSchema.safeParse(token).success || !stored?.startsWith('sha256:')) return false;
  const candidate = Buffer.from(hashGameToken(token as string));
  const expected = Buffer.from(stored);
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
export function newRoomCode(length: number) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => alphabet[randomInt(alphabet.length)]).join('');
}
export async function limitGameWrite(headers: Headers, scope: string, maximum = 30) {
  try {
    const limit = await consumeRateLimit(`game:${scope}`, requestAddress(headers), maximum, 60000);
    return limit.allowed ? null : NextResponse.json({ error: 'Příliš mnoho požadavků. Zkus to za chvíli.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  } catch { return NextResponse.json({ error: 'Hra je dočasně nedostupná.' }, { status: 503 }); }
}
