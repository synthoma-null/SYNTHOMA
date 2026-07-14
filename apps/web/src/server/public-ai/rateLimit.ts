import { publicError } from './response';

type PublicRateLimitKind = 'read' | 'run' | 'choice';
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const settings: Record<PublicRateLimitKind, { max: number; windowMs: number; env: string }> = {
  read: { max: 300, windowMs: 10 * 60_000, env: 'PUBLIC_AI_READ_LIMIT' },
  run: { max: 30, windowMs: 60 * 60_000, env: 'PUBLIC_AI_RUN_LIMIT' },
  choice: { max: 500, windowMs: 60 * 60_000, env: 'PUBLIC_AI_CHOICE_LIMIT' },
};

function requestAddress(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'local';
}

export function enforcePublicRateLimit(request: Request, kind: PublicRateLimitKind): Response | null {
  const now = Date.now();
  const setting = settings[kind];
  const configured = Number(process.env[setting.env] ?? setting.max);
  const max = Number.isFinite(configured) && configured > 0 ? Math.floor(configured) : setting.max;
  const key = `${kind}:${requestAddress(request)}`;
  const existing = buckets.get(key);
  const bucket = !existing || existing.resetAt <= now ? { count: 0, resetAt: now + setting.windowMs } : existing;
  bucket.count += 1;
  buckets.set(key, bucket);
  if (bucket.count <= max) return null;
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  const response = publicError(request, 429, 'RATE_LIMITED', 'Public AI request limit exceeded.');
  response.headers.set('Retry-After', String(retryAfter));
  return response;
}

export function resetPublicRateLimitsForTests(): void {
  buckets.clear();
}
