/** @jest-environment node */
import { enforcePublicRateLimit } from '../rateLimit';
import { consumeRateLimit } from '../../security/rateLimit';
jest.mock('../../security/rateLimit', () => ({ ...jest.requireActual('../../security/rateLimit'), consumeRateLimit: jest.fn() }));
const consume = consumeRateLimit as jest.Mock;
beforeEach(() => { jest.clearAllMocks(); jest.replaceProperty(process, 'env', { ...process.env, VERCEL: '', TRUSTED_CLIENT_IP_HEADER: '' }); });
afterEach(() => jest.restoreAllMocks());
it('shares persistent counters and ignores untrusted client IP headers', async () => {
  consume.mockResolvedValue({ allowed: true, retryAfter: 12 });
  for (const ip of ['1.2.3.4', '9.8.7.6']) {
    expect(await enforcePublicRateLimit(new Request('https://www.synthoma.cz/api/public/v1/site', { headers: { 'x-forwarded-for': ip } }), 'read')).toBeNull();
  }
  expect(consume).toHaveBeenNthCalledWith(1, 'public-ai-read', 'unverified', 300, 600000);
  expect(consume).toHaveBeenNthCalledWith(2, 'public-ai-read', 'unverified', 300, 600000);
});
it('returns an uncacheable 429 with the shared retry window', async () => {
  consume.mockResolvedValue({ allowed: false, retryAfter: 42 });
  const response = await enforcePublicRateLimit(new Request('https://www.synthoma.cz'), 'run');
  expect(response?.status).toBe(429);
  expect(response?.headers.get('Retry-After')).toBe('42');
  expect(response?.headers.get('Cache-Control')).toBe('no-store');
});
it('fails closed when shared persistence is unavailable', async () => {
  consume.mockRejectedValue(new Error('unavailable'));
  const response = await enforcePublicRateLimit(new Request('https://www.synthoma.cz'), 'choice');
  expect(response?.status).toBe(503);
  expect(response?.headers.get('Retry-After')).toBe('30');
});
