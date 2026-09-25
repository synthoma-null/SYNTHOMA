import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { consumeRateLimit, requestAddress } from '../../../../src/server/security/rateLimit';
import { mailConfigured, requestPasswordReset, resetPassword } from '../../../../src/server/security/passwordReset';

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('request'), email: z.string().trim().max(254).email(), locale: z.enum(['cs', 'en']).default('cs') }),
  z.object({ action: z.literal('reset'), token: z.string().regex(/^[a-f0-9]{64}$/), password: z.string().min(8).refine((s) => new TextEncoder().encode(s).length <= 72) }),
]);
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  try {
    const limit = await consumeRateLimit('password-reset-ip', requestAddress(req.headers), 20, 3_600_000);
    if (!limit.allowed) return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
    const data = parsed.data;
    if (data.action === 'request') {
      if (!mailConfigured()) return NextResponse.json({ error: 'MAIL_UNAVAILABLE' }, { status: 503 });
      const account = await consumeRateLimit('password-reset-account', data.email.toLowerCase(), 3, 3_600_000);
      if (account.allowed) await requestPasswordReset(data.email, data.locale);
      return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (!await resetPassword(data.token, data.password)) return NextResponse.json({ error: 'INVALID_TOKEN' }, { status: 400 });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('[password-reset] service unavailable');
    return NextResponse.json({ error: 'UNAVAILABLE' }, { status: 503 });
  }
}
