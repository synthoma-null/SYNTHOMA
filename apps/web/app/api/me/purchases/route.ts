export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { isContentType } from '../../../../src/content/catalog';
import { isEconomyError, purchaseWithMnems } from '../../../../src/server/economy';

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: 'Pro nákup se musíš přihlásit.', code: 'AUTHENTICATION_REQUIRED' },
      { status: 401 },
    );
  }

  const idempotencyKey = req.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey) {
    return NextResponse.json(
      { error: 'Idempotency-Key je povinný.', code: 'INVALID_REQUEST' },
      { status: 400 },
    );
  }

  let body: { contentType?: unknown; contentId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatný JSON.', code: 'INVALID_REQUEST' }, { status: 400 });
  }
  if (
    typeof body.contentType !== 'string' ||
    !isContentType(body.contentType) ||
    typeof body.contentId !== 'string' ||
    !body.contentId.trim()
  ) {
    return NextResponse.json(
      { error: 'Neplatný typ nebo ID obsahu.', code: 'INVALID_REQUEST' },
      { status: 400 },
    );
  }

  try {
    const result = await purchaseWithMnems({
      userId,
      contentType: body.contentType,
      contentId: body.contentId.trim(),
      idempotencyKey,
    });
    return NextResponse.json(
      { ok: true, ...result },
      {
        status: result.replayed ? 200 : 201,
        headers: { 'Cache-Control': 'private, no-store, max-age=0' },
      },
    );
  } catch (error) {
    if (isEconomyError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.status },
      );
    }
    console.error('[purchases]', error);
    return NextResponse.json(
      { error: 'Nákup se nepodařilo bezpečně dokončit.', code: 'PURCHASE_FAILED' },
      { status: 500 },
    );
  }
}
