import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { UI_THEMES } from '../../../../src/lib/themes';
import { getAccessSnapshot, isEconomyError, purchaseWithMnems } from '../../../../src/server/economy';

const PRICE_MAP = new Map(UI_THEMES.map((t) => [t.id, t.cost]));
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const snapshot = await getAccessSnapshot(
    userId,
    UI_THEMES.map((theme) => ({ contentType: 'cosmetic' as const, contentId: theme.id })),
  );
  const accessById = new Map(snapshot.access.map((access) => [access.contentId, access]));

  const themes = UI_THEMES.map((t) => ({
    ...t,
    unlocked: accessById.get(t.id)?.canAccess ?? false,
    access: accessById.get(t.id),
  }));

  return NextResponse.json({ themes, balance: snapshot.balance, snapshot });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { themeId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  }

  const { themeId } = body;
  if (!themeId || typeof themeId !== 'string') {
    return NextResponse.json({ error: 'Neplatný motiv.' }, { status: 400 });
  }
  const cost = PRICE_MAP.get(themeId);
  if (typeof cost !== 'number' || cost <= 0) {
    return NextResponse.json({ error: 'Neplatný motiv.' }, { status: 400 });
  }

  const idempotencyKey = req.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey) {
    return NextResponse.json({ error: 'Idempotency-Key je povinný.' }, { status: 400 });
  }
  try {
    const result = await purchaseWithMnems({
      userId,
      contentType: 'cosmetic',
      contentId: themeId,
      idempotencyKey,
    });
    return NextResponse.json({ ok: true, themeId, cost, ...result });
  } catch (error) {
    if (isEconomyError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.status },
      );
    }
    throw error;
  }
}
