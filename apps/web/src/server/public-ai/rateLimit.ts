import { publicError } from './response';
import { consumeRateLimit, requestAddress } from '../security/rateLimit';
type PublicRateLimitKind = 'read' | 'run' | 'choice';
const settings: Record<PublicRateLimitKind, { max: number; windowMs: number; env: string }> = {
 read: { max: 300, windowMs: 10 * 60_000, env: 'PUBLIC_AI_READ_LIMIT' },
 run: { max: 30, windowMs: 60 * 60_000, env: 'PUBLIC_AI_RUN_LIMIT' },
 choice: { max: 500, windowMs: 60 * 60_000, env: 'PUBLIC_AI_CHOICE_LIMIT' },
};
export async function enforcePublicRateLimit(request: Request, kind: PublicRateLimitKind): Promise<Response | null> {
 const setting = settings[kind];
 const configured = Number(process.env[setting.env] ?? setting.max);
 const max = Number.isFinite(configured) && configured >= 1 ? Math.floor(configured) : setting.max;
 try {
  const limit = await consumeRateLimit('public-ai-' + kind, requestAddress(request.headers), max, setting.windowMs);
  if (limit.allowed) return null;
  const response = publicError(request, 429, 'RATE_LIMITED', 'Public AI request limit exceeded.');
  response.headers.set('Retry-After', String(limit.retryAfter));
  response.headers.set('Cache-Control', 'no-store');
  return response;
 } catch {
  // A database outage must not disable abuse protection.
  const response = publicError(request, 503, 'SERVICE_UNAVAILABLE', 'Public API temporarily unavailable.');
  response.headers.set('Retry-After', '30');
  response.headers.set('Cache-Control', 'no-store');
  return response;
 }
}
