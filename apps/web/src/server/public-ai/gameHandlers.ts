import { z } from 'zod';
import { absolutePublicUrl, resolvePublicLocale } from './config';
import {
  applyPublicCyklusChoice,
  createPublicCyklusState,
  publicCardView,
  publicCyklusVersions,
  publicRunSummary,
  publicRunView,
} from './cyklusSandbox';
import { openPublicCyklusState, PublicTokenError, sealPublicCyklusState } from './cyklusToken';
import { enforcePublicRateLimit } from './rateLimit';
import { publicEnvelope, publicError, publicJson } from './response';

const MAX_BODY_BYTES = 65_536;
const startSchema = z.object({ locale: z.enum(['cs', 'en']).default('cs'), seed: z.string().trim().min(1).max(128).optional() }).strict();
const choiceSchema = z.object({ stateToken: z.string().min(32).max(60_000), choiceId: z.string().max(16) }).strict();

async function parseBody(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE');
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE');
  try { return JSON.parse(body); } catch { throw new Error('INVALID_JSON'); }
}

function bodyError(request: Request, error: unknown): Response {
  const code = error instanceof Error ? error.message : 'INVALID_REQUEST';
  if (code === 'BODY_TOO_LARGE') return publicError(request, 413, code, 'Request body exceeds 64 KiB.');
  if (code === 'INVALID_JSON') return publicError(request, 400, code, 'Request body must be valid JSON.');
  return publicError(request, 400, 'INVALID_REQUEST', 'Request does not match the public Cyklus schema.');
}

export function cyklusRules(request: Request): Response {
  const limited = enforcePublicRateLimit(request, 'read');
  if (limited) return limited;
  const locale = resolvePublicLocale(new URL(request.url).searchParams.get('locale'));
  if (!locale) return publicError(request, 400, 'UNSUPPORTED_LOCALE', 'Supported locales are cs and en.');
  return publicJson(request, publicEnvelope({
    id: 'cyklus-rules', locale, title: 'Cyklus public AI rules', canonicalUrl: absolutePublicUrl('/cyklus'), visibility: 'publicFull',
    data: {
      ...publicCyklusVersions,
      maxTurns: 12,
      stats: ['energy', 'memory', 'bond', 'control'],
      objective: locale === 'cs' ? 'Udrz vsechny staty nad 0 a pod 100.' : 'Keep every stat above 0 and below 100.',
      choices: ['yes', 'no'],
      isolation: 'No account, MNEM, entitlements, collection, progression or database writes.',
      stateTokenTtlMinutes: 60,
    },
    links: { start: absolutePublicUrl('/api/public/v1/cyklus/run'), choose: absolutePublicUrl('/api/public/v1/cyklus/choice'), cards: absolutePublicUrl('/cards') },
  }));
}

export async function startCyklusRun(request: Request): Promise<Response> {
  const limited = enforcePublicRateLimit(request, 'run');
  if (limited) return limited;
  try {
    const parsed = startSchema.safeParse(await parseBody(request));
    if (!parsed.success) return bodyError(request, parsed.error);
    const state = createPublicCyklusState(parsed.data.seed);
    const card = publicCardView(state, parsed.data.locale);
    if (!card) return publicError(request, 500, 'PUBLIC_CARD_UNAVAILABLE', 'No public starting card is available.');
    const stateToken = await sealPublicCyklusState({ state, locale: parsed.data.locale });
    return publicJson(request, {
      schemaVersion: '1', ...publicCyklusVersions, stateToken, run: publicRunView(state), card,
      links: { choose: '/api/public/v1/cyklus/choice', rules: '/api/public/v1/cyklus/rules' },
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'BODY_TOO_LARGE' || error.message === 'INVALID_JSON')) return bodyError(request, error);
    throw error;
  }
}

function tokenError(request: Request, error: PublicTokenError): Response {
  const status = error.code === 'INVALID_STATE_TOKEN' ? 400 : 410;
  return publicError(request, status, error.code, {
    INVALID_STATE_TOKEN: 'The state token is invalid or has been modified.',
    RUN_EXPIRED: 'The public Cyklus run has expired.',
    VERSION_EXPIRED: 'The token belongs to an incompatible engine version.',
  }[error.code]);
}

export async function chooseCyklus(request: Request): Promise<Response> {
  const limited = enforcePublicRateLimit(request, 'choice');
  if (limited) return limited;
  try {
    const parsed = choiceSchema.safeParse(await parseBody(request));
    if (!parsed.success) return bodyError(request, parsed.error);
    if (parsed.data.choiceId !== 'yes' && parsed.data.choiceId !== 'no') {
      return publicError(request, 400, 'INVALID_CHOICE', 'choiceId must be yes or no.');
    }
    let payload;
    try { payload = await openPublicCyklusState(parsed.data.stateToken); }
    catch (error) { return tokenError(request, error as PublicTokenError); }
    if (payload.state.status !== 'playing') return publicError(request, 409, 'RUN_COMPLETE', 'This public Cyklus run has ended.');
    const applied = applyPublicCyklusChoice(payload.state, parsed.data.choiceId);
    if (!applied) return publicError(request, 400, 'INVALID_CHOICE', 'The choice is not valid for this run.');
    const active = applied.state.status === 'playing';
    const stateToken = active ? await sealPublicCyklusState({ state: applied.state, locale: payload.locale }) : null;
    return publicJson(request, {
      schemaVersion: '1', ...publicCyklusVersions, stateToken, result: applied.result,
      run: publicRunView(applied.state),
      card: active ? publicCardView(applied.state, payload.locale) : null,
      summary: active ? null : publicRunSummary(applied.state),
      links: { choose: active ? '/api/public/v1/cyklus/choice' : null, restart: '/api/public/v1/cyklus/run', rules: '/api/public/v1/cyklus/rules' },
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'BODY_TOO_LARGE' || error.message === 'INVALID_JSON')) return bodyError(request, error);
    throw error;
  }
}
