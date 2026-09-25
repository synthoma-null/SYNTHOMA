/** @jest-environment node */
import { createRoomSchema, gameActionSchema, hashGameToken, verifyGameToken } from '../gameIdentity';
jest.mock('../rateLimit', () => ({ consumeRateLimit: jest.fn(), requestAddress: jest.fn() }));

it('authenticates only the exact high-entropy token and rejects legacy hashes', () => {
  const token = `v2_${'ab'.repeat(32)}`;
  const hash = hashGameToken(token);
  expect(verifyGameToken(token, hash)).toBe(true);
  expect(verifyGameToken(`v2_${'cd'.repeat(32)}`, hash)).toBe(false);
  expect(verifyGameToken(token, '1234abcd')).toBe(false);
  expect(verifyGameToken({ token }, hash)).toBe(false);
});

it('does not accept replacement game state from the client', () => {
  expect(gameActionSchema.safeParse({ type: 'LOAD_STATE', state: { status: 'finished' } }).success).toBe(false);
  expect(gameActionSchema.safeParse({ type: 'ROLL_DICE' }).success).toBe(true);
  expect(gameActionSchema.safeParse({ type: 'SELECT_PIECE' }).success).toBe(false);
});

it('validates room mode and bounds player names', () => {
  expect(createRoomSchema.safeParse({ nickname: 'Alice', mode: 'admin' }).success).toBe(false);
  expect(createRoomSchema.safeParse({ nickname: 'x'.repeat(33) }).success).toBe(false);
  expect(createRoomSchema.parse({ nickname: ' Alice ' }).nickname).toBe('Alice');
});
