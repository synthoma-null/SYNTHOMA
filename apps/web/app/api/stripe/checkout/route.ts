export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '../../../../auth';
import { getPackageById } from '../../../../src/content/booksManifest';
import { getChapterCatalogEntry } from '../../../../src/content/catalog';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-06-24.dahlia',
  });
  const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (!userId) {
    return NextResponse.json({ error: 'Pro zakoupení mnemů je nutné přihlášení.' }, { status: 401 });
  }
  const idempotencyKey = req.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey || !/^[A-Za-z0-9:_-]{12,200}$/.test(idempotencyKey)) {
    return NextResponse.json({ error: 'Platný Idempotency-Key je povinný.' }, { status: 400 });
  }

  let packageId: string | null = null;
  let chapterId: string | null = null;

  try {
    const body = await req.json();
    packageId = (body.packageId as string | undefined) ?? null;
    chapterId = (body.chapterId as string | undefined) ?? null;
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!packageId && !chapterId) {
    return NextResponse.json({ error: 'packageId nebo chapterId je povinný' }, { status: 400 });
  }

  let name: string;
  let priceCents: number;
  let grantType: 'package' | 'content';
  let finalPackageId: string | null = null;
  let finalChapterId: string | null = null;

  if (packageId && !(packageId === 'single-fragment' && chapterId)) {
    const pkg = getPackageById(packageId);
    if (!pkg) return NextResponse.json({ error: 'Balíček nenalezen' }, { status: 404 });
    name = pkg.name;
    priceCents = pkg.priceCzk * 100;
    finalPackageId = pkg.id;
    grantType = 'package';
  } else {
    const ch = chapterId ? getChapterCatalogEntry(chapterId) : undefined;
    if (!ch) return NextResponse.json({ error: 'Fragment nenalezen' }, { status: 404 });
    if (ch.availability !== 'published' || ch.accessPolicy === 'free') {
      return NextResponse.json({ error: 'Tento fragment nelze koupit.' }, { status: 409 });
    }
    const single = getPackageById('single-fragment');
    if (!single) return NextResponse.json({ error: 'Produkt není nakonfigurován.' }, { status: 503 });
    name = `PAMĚŤOVÝ FRAGMENT: ${ch.title}`;
    priceCents = single.priceCzk * 100;
    finalChapterId = ch.id;
    grantType = 'content';
  }

  const metadata: Record<string, string> = {
    grantType,
    userId,
  };
  if (finalPackageId) metadata.packageId = finalPackageId;
  if (finalChapterId) {
    metadata.contentType = 'chapter';
    metadata.contentId = finalChapterId;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'czk',
          product_data: { name },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
    metadata,
    success_url: `${ORIGIN}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ORIGIN}/books`,
  }, { idempotencyKey: `checkout:${userId}:${idempotencyKey}` });

  return NextResponse.json({ url: checkoutSession.url });
}
