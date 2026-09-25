/** @jest-environment node */
import { consumeRateLimit, requestAddress } from './rateLimit';
import prisma from '../../lib/prisma';
jest.mock('../../lib/prisma', () => ({ __esModule: true, default: { securityRateLimit: { upsert: jest.fn(), deleteMany: jest.fn() } } }));
const upsert = prisma.securityRateLimit.upsert as jest.Mock;
const previousSecret = process.env.AUTH_SECRET;
beforeEach(() => { process.env.AUTH_SECRET = 'test-secret'; jest.clearAllMocks(); });
afterAll(() => { if (previousSecret === undefined) delete process.env.AUTH_SECRET; else process.env.AUTH_SECRET = previousSecret; });
it('atomically increments a shared bucket without storing the identifier', async () => {
  upsert.mockResolvedValue({ count: 11 });
  const result = await consumeRateLimit('login', 'person@example.com', 10, 60_000);
  expect(result.allowed).toBe(false);
  const call = upsert.mock.calls[0][0];
  expect(call.update).toEqual({ count: { increment: 1 } });
  expect(JSON.stringify(call)).not.toContain('person@example.com');
});
it('does not silently accept requests when the shared store fails', async () => {
  upsert.mockRejectedValue(new Error('offline'));
  await expect(consumeRateLimit('login', 'test', 10, 60_000)).rejects.toThrow('offline');
});
it('does not trust an arbitrary forwarded header without a configured ingress', () => {
  const vercel = process.env.VERCEL; const header = process.env.TRUSTED_CLIENT_IP_HEADER;
  delete process.env.VERCEL; delete process.env.TRUSTED_CLIENT_IP_HEADER;
  expect(requestAddress(new Headers({ 'x-forwarded-for': '1.2.3.4' }))).toBe('unverified');
  if (vercel !== undefined) process.env.VERCEL = vercel;
  if (header !== undefined) process.env.TRUSTED_CLIENT_IP_HEADER = header;
});
