import { createHmac } from 'node:crypto';
import prisma from '../../lib/prisma';

/** Only trust IP headers explicitly set/overwritten by our ingress. */
export function requestAddress(headers: Headers): string {
  const header = process.env.VERCEL ? 'x-vercel-forwarded-for' : process.env.TRUSTED_CLIENT_IP_HEADER;
  return header ? (headers.get(header)?.split(',')[0]?.trim().slice(0, 128) || 'unknown') : 'unverified';
}

export async function consumeRateLimit(scope: string, identifier: string, max: number, windowMs: number) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET_REQUIRED');
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const key = createHmac('sha256', secret).update(`${scope}:${identifier}:${window}`).digest('hex');
  const expiresAt = new Date((window + 1) * windowMs);
  const bucket = await prisma.securityRateLimit.upsert({
    where: { key }, create: { key, count: 1, expiresAt }, update: { count: { increment: 1 } },
  });
  // Bounded retention without storing submitted email addresses or IPs.
  await prisma.securityRateLimit.deleteMany({ where: { expiresAt: { lt: new Date(now - 86_400_000) } } });
  return { allowed: bucket.count <= max, retryAfter: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)) };
}
