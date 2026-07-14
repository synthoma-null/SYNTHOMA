import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { PUBLIC_CONTENT_UPDATED_AT, PUBLIC_SCHEMA_VERSION, type PublicLocale } from './config';

const PUBLIC_CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';

export interface PublicEnvelope<T> {
  schemaVersion: string;
  id: string;
  locale: PublicLocale;
  title: string;
  canonicalUrl: string;
  visibility: string;
  updatedAt: string;
  data: T;
  links: Record<string, string | null>;
}

export function publicEnvelope<T>(input: Omit<PublicEnvelope<T>, 'schemaVersion' | 'updatedAt'> & { updatedAt?: string }): PublicEnvelope<T> {
  return {
    schemaVersion: PUBLIC_SCHEMA_VERSION,
    updatedAt: input.updatedAt ?? PUBLIC_CONTENT_UPDATED_AT,
    ...input,
  };
}

function etagFor(body: string): string {
  return `\"${createHash('sha256').update(body).digest('base64url')}\"`;
}

export function publicJson(request: Request, payload: unknown, init: ResponseInit = {}): NextResponse {
  const body = JSON.stringify(payload);
  const etag = etagFor(body);
  const headers = new Headers(init.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('ETag', etag);
  headers.set('Last-Modified', new Date(PUBLIC_CONTENT_UPDATED_AT).toUTCString());
  headers.set('Vary', 'Accept-Encoding');
  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304, headers });
  }
  return new NextResponse(body, { ...init, headers });
}

export function publicMarkdown(body: string, status = 200): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': PUBLIC_CACHE_CONTROL,
      'Content-Type': 'text/markdown; charset=utf-8',
      'Last-Modified': new Date(PUBLIC_CONTENT_UPDATED_AT).toUTCString(),
    },
  });
}

export function publicError(request: Request, status: number, code: string, message: string): NextResponse {
  return publicJson(request, { error: { code, message, status } }, { status });
}

export function localeFromRequest(request: Request): PublicLocale | null {
  const value = new URL(request.url).searchParams.get('locale');
  return value === null || value === 'cs' ? 'cs' : value === 'en' ? 'en' : null;
}

function encodeCursor(offset: number): string {
  return Buffer.from(`offset:${offset}`, 'utf8').toString('base64url');
}

function decodeCursor(cursor: string | null): number | null {
  if (!cursor) return 0;
  try {
    const match = /^offset:(\d+)$/.exec(Buffer.from(cursor, 'base64url').toString('utf8'));
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}

export function paginate<T>(request: Request, items: readonly T[]) {
  const url = new URL(request.url);
  const rawLimit = Number(url.searchParams.get('limit') ?? 50);
  const limit = Number.isInteger(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 50;
  const offset = decodeCursor(url.searchParams.get('cursor'));
  if (offset === null || offset > items.length) return null;
  const data = items.slice(offset, offset + limit);
  const nextOffset = offset + data.length;
  return {
    items: data,
    limit,
    nextCursor: nextOffset < items.length ? encodeCursor(nextOffset) : null,
    total: items.length,
  };
}
