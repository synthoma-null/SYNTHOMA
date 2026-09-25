/** @jest-environment node */
import { resetPassword, hashResetToken } from './passwordReset';
import prisma from '../../lib/prisma';

jest.mock('../../lib/prisma', () => ({ __esModule: true, default: {
  passwordResetToken: { findUnique: jest.fn(), deleteMany: jest.fn() },
  user: { update: jest.fn() }, $transaction: jest.fn(),
} }));
jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('new-password-hash') }));
const db = prisma as unknown as { passwordResetToken: { findUnique: jest.Mock; deleteMany: jest.Mock }; user: { update: jest.Mock }; $transaction: jest.Mock };

beforeEach(() => { jest.clearAllMocks(); db.$transaction.mockImplementation((fn) => fn(db)); });
it('rejects an expired token without changing a password', async () => {
  db.passwordResetToken.findUnique.mockResolvedValue({ userId: 'user', expiresAt: new Date(0) });
  expect(await resetPassword('a'.repeat(64), 'new-password')).toBe(false);
  expect(db.user.update).not.toHaveBeenCalled();
});
it('consumes a valid token and revokes existing sessions in one transaction', async () => {
  db.passwordResetToken.findUnique.mockResolvedValue({ userId: 'user', expiresAt: new Date(Date.now() + 60_000) });
  db.passwordResetToken.deleteMany.mockResolvedValue({ count: 1 });
  expect(await resetPassword('b'.repeat(64), 'new-password')).toBe(true);
  expect(db.user.update).toHaveBeenCalledWith({ where: { id: 'user' }, data: { passwordHash: 'new-password-hash', sessionVersion: { increment: 1 } } });
  expect(db.passwordResetToken.findUnique).toHaveBeenCalledWith({ where: { tokenHash: hashResetToken('b'.repeat(64)) } });
  expect(db.passwordResetToken.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user' } });
});
it('rejects a concurrent replay that lost the atomic consume', async () => {
  db.passwordResetToken.findUnique.mockResolvedValue({ userId: 'user', expiresAt: new Date(Date.now() + 60_000) });
  db.passwordResetToken.deleteMany.mockResolvedValue({ count: 0 });
  expect(await resetPassword('c'.repeat(64), 'new-password')).toBe(false);
  expect(db.user.update).not.toHaveBeenCalled();
});
