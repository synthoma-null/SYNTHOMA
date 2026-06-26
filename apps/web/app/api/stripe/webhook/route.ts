export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '../../../../src/lib/prisma';
import { grantPackage, grantChapter } from '../../../../src/lib/access';
import { getPackageById } from '../../../../src/content/booksManifest';
import { hash } from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-06-24.dahlia',
  });
  const sig = req.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  let event: Stripe.Event;
  try {
    const rawBody = await req.arrayBuffer();
    event = stripe.webhooks.constructEvent(Buffer.from(rawBody), sig, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const stripeSessionId = session.id;
  const meta = session.metadata ?? {};
  const packageId: string = meta.packageId ?? 'single-fragment';
  const chapterId: string | null = meta.chapterId ?? null;
  const userId: string | null = meta.userId ?? null;
  const customerEmail: string | null = session.customer_details?.email ?? null;

  const existing = await prisma.mnemLedger.findFirst({
    where: { stripeSessionId },
  });
  if (existing) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  let resolvedUserId: string | null = userId;

  if (!resolvedUserId && customerEmail) {
    const user = await prisma.user.findFirst({
      where: { emailLower: customerEmail.toLowerCase().trim() },
      select: { id: true },
    });
    resolvedUserId = user?.id ?? null;
  }

  if (resolvedUserId) {
    const pkg = getPackageById(packageId);
    if (pkg) {
      await grantPackage(resolvedUserId, packageId, 'stripe', stripeSessionId);
    } else if (chapterId) {
      await grantChapter(resolvedUserId, chapterId, 'stripe');
    }
  } else {
    const rawCode = `MNEM-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const codeHash = await hash(rawCode, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

    await prisma.accessCode.create({
      data: {
        codeHash,
        packageId,
        stripeSessionId,
        expiresAt,
      },
    });

    console.warn(`[stripe/webhook] access code created for anonymous purchase: ${rawCode}`);
  }

  return NextResponse.json({ ok: true });
}
