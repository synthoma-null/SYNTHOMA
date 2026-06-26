export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '../../../../auth';
import { getPackageById, getChapterById } from '../../../../src/content/booksManifest';

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
  let finalPackageId: string;

  if (packageId) {
    const pkg = getPackageById(packageId);
    if (!pkg) return NextResponse.json({ error: 'Balíček nenalezen' }, { status: 404 });
    name = pkg.name;
    priceCents = pkg.priceCzk * 100;
    finalPackageId = pkg.id;
  } else {
    const ch = getChapterById(chapterId!);
    if (!ch) return NextResponse.json({ error: 'Fragment nenalezen' }, { status: 404 });
    finalPackageId = 'single-fragment';
    name = `PAMĚŤOVÝ FRAGMENT: ${ch.title}`;
    priceCents = 2900;
  }

  const metadata: Record<string, string> = {
    packageId: finalPackageId,
  };
  if (chapterId) metadata.chapterId = chapterId;
  if (userId) metadata.userId = userId;

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
  });

  return NextResponse.json({ url: checkoutSession.url });
}
