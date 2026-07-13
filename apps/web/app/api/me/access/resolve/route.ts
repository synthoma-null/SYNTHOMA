export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { isContentType } from '../../../../../src/content/catalog';
import { getAccessSnapshot, isEconomyError } from '../../../../../src/server/economy';

type RawRequest = { contentType?: unknown; contentId?: unknown };

export async function POST(req: NextRequest) {
  const session = await auth();
  let body: { requests?: RawRequest[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatný JSON.', code: 'INVALID_REQUEST' }, { status: 400 });
  }

  if (!Array.isArray(body.requests) || body.requests.length < 1 || body.requests.length > 200) {
    return NextResponse.json(
      { error: 'Požadavek musí obsahovat 1 až 200 položek.', code: 'INVALID_REQUEST' },
      { status: 400 },
    );
  }
  const requests = [];
  for (const item of body.requests) {
    if (
      typeof item.contentType !== 'string' ||
      !isContentType(item.contentType) ||
      typeof item.contentId !== 'string' ||
      !item.contentId.trim()
    ) {
      return NextResponse.json(
        { error: 'Neplatný typ nebo ID obsahu.', code: 'INVALID_REQUEST' },
        { status: 400 },
      );
    }
    requests.push({ contentType: item.contentType, contentId: item.contentId.trim() });
  }

  try {
    const snapshot = await getAccessSnapshot(session?.user?.id ?? null, requests);
    return NextResponse.json(snapshot, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' },
    });
  } catch (error) {
    if (isEconomyError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.status },
      );
    }
    console.error('[access/resolve]', error);
    return NextResponse.json(
      { error: 'Resolver přístupu selhal uzavřeně.', code: 'ACCESS_RESOLUTION_FAILED' },
      { status: 503 },
    );
  }
}
