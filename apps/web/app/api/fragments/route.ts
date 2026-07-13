import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { FRAGMENTS, COSMETICS, PROFILE_REPORTS } from '../../../src/content/booksManifest';
import { getAccessSnapshot, isEconomyError, purchaseWithMnems } from '../../../src/server/economy';

export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const entity = searchParams.get('entity');
  const chapterId = searchParams.get('chapterId');

  let products = [...FRAGMENTS, ...PROFILE_REPORTS];

  if (category) products = products.filter((p) => p.category === category);
  if (entity) products = products.filter((p) => p.entity === entity);
  if (chapterId) products = products.filter((p) => p.requiredChapterId === chapterId);

  const profileReportIds = new Set(PROFILE_REPORTS.map((product) => product.id));
  const snapshot = await getAccessSnapshot(
    session?.user?.id ?? null,
    products.map((product) => ({
      contentType: profileReportIds.has(product.id) ? 'profile_report' as const : 'fragment' as const,
      contentId: product.id,
    })),
  );
  const accessById = new Map(snapshot.access.map((access) => [access.contentId, access]));

  return NextResponse.json(
    products.map((product) => ({
      ...product,
      unlocked: accessById.get(product.id)?.canAccess ?? false,
      access: accessById.get(product.id),
    })),
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Přihlášení je povinné.' }, { status: 401 });
  }
  const idempotencyKey = req.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey) {
    return NextResponse.json({ error: 'Idempotency-Key je povinný.' }, { status: 400 });
  }
  const body = await req.json() as { fragmentId?: string };
  if (!body.fragmentId) return NextResponse.json({ error: 'fragmentId je povinné.' }, { status: 400 });
  const isProfileReport = PROFILE_REPORTS.some((product) => product.id === body.fragmentId);
  const exists = isProfileReport || FRAGMENTS.some((product) => product.id === body.fragmentId);
  if (!exists) return NextResponse.json({ error: 'Fragment neexistuje.' }, { status: 404 });
  try {
    const result = await purchaseWithMnems({
      userId: session.user.id,
      contentType: isProfileReport ? 'profile_report' : 'fragment',
      contentId: body.fragmentId,
      idempotencyKey,
    });
    return NextResponse.json({ ok: true, ...result });
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
