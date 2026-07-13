export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';
import prisma from '../../../../src/lib/prisma';
import { getCatalogEntry, isContentType, type ContentType } from '../../../../src/content/catalog';
import { getPackageById } from '../../../../src/content/booksManifest';
import {
  grantEntitlement,
  grantPackage,
  lockMnemAccount,
  runSerializableTransaction,
} from '../../../../src/server/economy';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-06-24.dahlia',
  });
  const signature = req.headers.get('stripe-signature') ?? '';
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(await req.arrayBuffer()),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    );
  } catch (error) {
    console.error('[stripe/webhook] signature verification failed', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const checkout = event.data.object as Stripe.Checkout.Session;
  if (checkout.payment_status !== 'paid') {
    return NextResponse.json({ ok: true, pending: true });
  }

  const metadata = checkout.metadata ?? {};
  const grantType = metadata.grantType;
  const packageId = metadata.packageId ?? null;
  const rawContentType = metadata.contentType ?? null;
  const contentType: ContentType | null = rawContentType && isContentType(rawContentType)
    ? rawContentType
    : null;
  const contentId = metadata.contentId ?? null;
  const requestedUserId = metadata.userId ?? null;
  const customerEmail = checkout.customer_details?.email?.toLowerCase().trim() ?? null;

  let userId = requestedUserId;
  if (!userId && customerEmail) {
    userId = (await prisma.user.findFirst({
      where: { emailLower: customerEmail },
      select: { id: true },
    }))?.id ?? null;
  }

  const validPackage = grantType === 'package' && packageId && getPackageById(packageId);
  const validContent =
    grantType === 'content' &&
    contentType &&
    contentId &&
    getCatalogEntry(contentType, contentId)?.availability === 'published';

  if (!userId || (!validPackage && !validContent)) {
    try {
      await prisma.externalGrantEvent.create({
        data: {
          provider: 'stripe',
          eventId: event.id,
          eventType: event.type,
          externalReference: checkout.id,
          ...(userId ? { userId } : {}),
          ...(contentType ? { contentType } : {}),
          ...(contentId ? { contentId } : {}),
          ...(packageId ? { packageId } : {}),
          status: userId ? 'rejected' : 'unresolved',
          errorCode: userId ? 'INVALID_GRANT_METADATA' : 'USER_NOT_RESOLVED',
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
    }
    return NextResponse.json({ ok: true, unresolved: !userId, rejected: Boolean(userId) });
  }

  try {
    const result = await runSerializableTransaction(
      async (tx) => {
        await lockMnemAccount(tx, userId);
        const existing = await tx.externalGrantEvent.findFirst({
          where: {
            provider: 'stripe',
            OR: [{ eventId: event.id }, { externalReference: checkout.id }],
          },
        });
        if (existing) return { duplicate: true, status: existing.status };

        const externalEvent = await tx.externalGrantEvent.create({
          data: {
            provider: 'stripe',
            eventId: event.id,
            eventType: event.type,
            externalReference: checkout.id,
            userId,
            ...(contentType ? { contentType } : {}),
            ...(contentId ? { contentId } : {}),
            ...(packageId ? { packageId } : {}),
            status: 'processing',
          },
        });

        if (validPackage && packageId) {
          await grantPackage({
            userId,
            packageId,
            source: 'stripe',
            sourceReference: checkout.id,
            stripeSessionId: checkout.id,
            idempotencyKey: `stripe:event:${event.id}`,
          }, tx);
        } else if (validContent && contentType && contentId) {
          await grantEntitlement({
            userId,
            contentType,
            contentId,
            source: 'stripe',
            sourceReference: checkout.id,
            metadata: { stripeEventId: event.id },
          }, tx);
        }

        await tx.externalGrantEvent.update({
          where: { id: externalEvent.id },
          data: { status: 'completed', processedAt: new Date() },
        });
        return { duplicate: false, status: 'completed' };
      },
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error('[stripe/webhook] grant failed', { eventId: event.id, sessionId: checkout.id, error });
    return NextResponse.json({ error: 'Grant failed' }, { status: 500 });
  }
}
