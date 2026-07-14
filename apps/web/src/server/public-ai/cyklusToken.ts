import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import type { CyklusRunState } from '../../game/cyklus/cyklusTypes';
import { PUBLIC_CYKLUS_ENGINE_VERSION, type PublicLocale } from './config';

const TOKEN_VERSION = '1';
const TOKEN_TTL_SECONDS = 60 * 60;
const developmentSecret = randomBytes(32).toString('base64url');

export type PublicCyklusTokenPayload = {
  tokenVersion: string;
  engineVersion: string;
  locale: PublicLocale;
  state: CyklusRunState;
};

type StoredTokenPayload = PublicCyklusTokenPayload & { issuedAt: number; expiresAt: number };
export type PublicTokenErrorCode = 'INVALID_STATE_TOKEN' | 'RUN_EXPIRED' | 'VERSION_EXPIRED';

export class PublicTokenError extends Error {
  constructor(public readonly code: PublicTokenErrorCode) { super(code); }
}

function tokenKey(): Buffer {
  const configured = process.env.AI_STATE_TOKEN_SECRET;
  if (configured && configured.length < 32) {
    throw new Error('AI_STATE_TOKEN_SECRET must be at least 32 characters.');
  }
  if (!configured && process.env.NODE_ENV === 'production') {
    throw new Error('AI_STATE_TOKEN_SECRET is required for public Cyklus tokens.');
  }
  return createHash('sha256').update(configured || developmentSecret).digest();
}

export async function sealPublicCyklusState(payload: Omit<PublicCyklusTokenPayload, 'tokenVersion' | 'engineVersion'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const stored: StoredTokenPayload = {
    ...payload,
    tokenVersion: TOKEN_VERSION,
    engineVersion: PUBLIC_CYKLUS_ENGINE_VERSION,
    issuedAt: now,
    expiresAt: now + TOKEN_TTL_SECONDS,
  };
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', tokenKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(stored), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [TOKEN_VERSION, iv.toString('base64url'), ciphertext.toString('base64url'), tag.toString('base64url')].join('.');
}

export async function openPublicCyklusState(token: string): Promise<PublicCyklusTokenPayload> {
  const parts = token.split('.');
  if (parts.length !== 4) throw new PublicTokenError('INVALID_STATE_TOKEN');
  const [version, ivValue, ciphertextValue, tagValue] = parts;
  if (version !== TOKEN_VERSION) throw new PublicTokenError('VERSION_EXPIRED');
  try {
    const decipher = createDecipheriv('aes-256-gcm', tokenKey(), Buffer.from(ivValue!, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagValue!, 'base64url'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertextValue!, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
    const payload = JSON.parse(plaintext) as StoredTokenPayload;
    if (payload.tokenVersion !== TOKEN_VERSION || payload.engineVersion !== PUBLIC_CYKLUS_ENGINE_VERSION) {
      throw new PublicTokenError('VERSION_EXPIRED');
    }
    if (payload.expiresAt <= Math.floor(Date.now() / 1000)) throw new PublicTokenError('RUN_EXPIRED');
    if ((payload.locale !== 'cs' && payload.locale !== 'en') || !payload.state || typeof payload.state !== 'object') {
      throw new PublicTokenError('INVALID_STATE_TOKEN');
    }
    return payload;
  } catch (error) {
    if (error instanceof PublicTokenError) throw error;
    throw new PublicTokenError('INVALID_STATE_TOKEN');
  }
}
