/** @jest-environment node */
import NextAuth from 'next-auth';
import prisma from './src/lib/prisma';
import './auth';
jest.mock('next-auth', () => ({ __esModule: true, default: jest.fn(() => ({})) }));
jest.mock('next-auth/providers/credentials', () => ({ __esModule: true, default: (options: unknown) => options }));
jest.mock('./src/lib/prisma', () => ({ __esModule: true, default: { user: { findUnique: jest.fn() } } }));
const config = (NextAuth as jest.Mock).mock.calls[0][0];
it('refreshes revoked admin privileges from the current database role', async () => {
  (prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'user', sessionVersion: 0 });
  expect(await config.callbacks.jwt({ token: { id: 'old-admin', role: 'admin', sessionVersion: 0 } })).toMatchObject({ role: 'user' });
});
it('rejects sessions issued before the latest password reset', async () => {
  (prisma.user.findUnique as jest.Mock).mockResolvedValue({ role: 'user', sessionVersion: 1 });
  expect(await config.callbacks.jwt({ token: { id: 'user', role: 'user', sessionVersion: 0 } })).toBeNull();
});
it('rejects sessions belonging to deleted accounts', async () => {
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
  expect(await config.callbacks.jwt({ token: { id: 'deleted', role: 'admin' } })).toBeNull();
});
