export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '../../../../auth';
import { getPackageById } from '../../../../src/content/booksManifest';
import { getManagedChapter } from '../../../../src/server/content/managedContent';
import prisma from '../../../../src/lib/prisma';
import { createHash } from 'node:crypto';
import { siteOrigin } from '../../../../src/server/siteOrigin';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-06-24.dahlia',
  });
  const ORIGIN = siteOrigin();
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
  let packageMnems: number | null = null;

  if (packageId && !(packageId === 'single-fragment' && chapterId)) {
    const pkg = getPackageById(packageId);
    if (!pkg) return NextResponse.json({ error: 'Balíček nenalezen' }, { status: 404 });
    name = pkg.name;
    packageMnems = pkg.mnems;
    priceCents = pkg.priceCzk * 100;
    finalPackageId = pkg.id;
    grantType = 'package';
  } else {
    const managed = chapterId ? await getManagedChapter(chapterId) : undefined;
    const ch = managed?.chapter;
    if (!ch) return NextResponse.json({ error: 'Fragment nenalezen' }, { status: 404 });
    if (managed?.visibility !== 'published' || ch.availability !== 'published' || ch.accessPolicy === 'free') {
      return NextResponse.json({ error: 'Tento fragment nelze koupit.' }, { status: 409 });
    }
    const single = getPackageById('single-fragment');
    if (!single) return NextResponse.json({ error: 'Produkt není nakonfigurován.' }, { status: 503 });
    name = `PAMĚŤOVÝ FRAGMENT: ${ch.title}`;
    priceCents = single.priceCzk * 100;
    finalChapterId = ch.id;
    grantType = 'content';
  }

  const orderId = createHash('sha256').update(`${userId}:${idempotencyKey}`).digest('hex');
  const order = await prisma.checkoutOrder.upsert({
    where: { id: orderId },
    create: { id: orderId, userId, packageId: finalPackageId, chapterId: finalChapterId, name, priceCents, packageMnems },
    update: {},
  });
  if (order.userId !== userId || order.packageId !== finalPackageId || order.chapterId !== finalChapterId) {
    return NextResponse.json({ error: 'Tento požadavek již patří jinému nákupu.' }, { status: 409 });
  }
  const metadata: Record<string, string> = {
    orderId: order.id,
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
          product_data: { name: order.name },
          unit_amount: order.priceCents,
        },
        quantity: 1,
      },
    ],
    metadata,
    success_url: `${ORIGIN}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ORIGIN}/books`,
  }, { idempotencyKey: `checkout:${userId}:${idempotencyKey}` });

  await prisma.checkoutOrder.update({ where: { id: order.id }, data: { stripeSessionId: checkoutSession.id } });
  return NextResponse.json({ url: checkoutSession.url });
}
