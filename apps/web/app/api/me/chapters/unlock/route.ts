import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import {
  getContentAccess,
  getMnemBalance,
  isEconomyError,
  purchaseWithMnems,
} from '../../../../../src/server/economy';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nepřihlášen.' }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { chapterId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 });
  }

  const { chapterId } = body;
  if (!chapterId || typeof chapterId !== 'string') {
    return NextResponse.json({ error: 'Chybí chapterId.' }, { status: 400 });
  }

  const idempotencyKey = req.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey) {
    return NextResponse.json({ error: 'Idempotency-Key je povinný.' }, { status: 400 });
  }
  try {
    const current = await getContentAccess(userId, 'chapter', chapterId);
    if (current.canAccess) {
      return NextResponse.json({ ok: true, alreadyOwned: true, access: current }, {
        headers: { Deprecation: 'true', Link: '</api/me/purchases>; rel="successor-version"' },
      });
    }
    const result = await purchaseWithMnems({
      userId,
      contentType: 'chapter',
      contentId: chapterId,
      idempotencyKey,
    });
    return NextResponse.json({ ok: true, ...result }, {
      headers: { Deprecation: 'true', Link: '</api/me/purchases>; rel="successor-version"' },
    });
  } catch (error) {
    if (isEconomyError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.status },
      );
    }
    return NextResponse.json({ error: 'Odemčení selhalo.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nepřihlášen.' }, { status: 401 });
  }
  const userId = session.user.id;

  const balance = await getMnemBalance(userId);

  return NextResponse.json({ balance }, {
    headers: { Deprecation: 'true', Link: '</api/me/access/resolve>; rel="successor-version"' },
  });
}
