/** @jest-environment node */

import type StripeConstructor from 'stripe';

const connectionString = process.env.SYNTHOMA_POSTGRES_TEST_URL;
const describePostgres = connectionString ? describe : describe.skip;

describePostgres('MNEM transactions on real PostgreSQL', () => {
  let prisma: typeof import('../../../lib/prisma').default;
  let disconnectPrisma: typeof import('../../../lib/prisma').disconnectPrisma;
  let grantMnems: typeof import('../ledger').grantMnems;
  let lockMnemAccount: typeof import('../ledger').lockMnemAccount;
  let spendMnemsAtomic: typeof import('../ledger').spendMnemsAtomic;
  let grantPackage: typeof import('../entitlements').grantPackage;
  let purchaseWithMnems: typeof import('../purchase').purchaseWithMnems;
  let postStripeWebhook: typeof import('../../../../app/api/stripe/webhook/route').POST;
  let NextRequest: typeof import('next/server').NextRequest;
  let Stripe: typeof StripeConstructor;
  let sequence = 0;
  const userIds = new Set<string>();

  beforeAll(async () => {
    process.env.DATABASE_URL = connectionString;
    process.env.STRIPE_SECRET_KEY = 'sk_test_synthoma_postgres_integration';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_synthoma_postgres_integration';
    ({ default: prisma, disconnectPrisma } = await import('../../../lib/prisma'));
    ({ grantMnems, lockMnemAccount, spendMnemsAtomic } = await import('../ledger'));
    ({ grantPackage } = await import('../entitlements'));
    ({ purchaseWithMnems } = await import('../purchase'));
    ({ POST: postStripeWebhook } = await import('../../../../app/api/stripe/webhook/route'));
    ({ NextRequest } = await import('next/server'));
    ({ default: Stripe } = await import('stripe'));
  });

  afterEach(async () => {
    const ids = [...userIds];
    if (!ids.length) return;
    await prisma.externalGrantEvent.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    userIds.clear();
  });

  afterAll(async () => {
    await disconnectPrisma?.();
  });

  async function createUser(initialBalance: number) {
    sequence += 1;
    const id = `pg-economy-${process.pid}-${sequence}`;
    userIds.add(id);
    await prisma.user.create({
      data: {
        id,
        email: `${id}@synthoma.invalid`,
        emailLower: `${id}@synthoma.invalid`,
        nickname: id,
        nicknameLower: id,
        passwordHash: 'synthetic-not-a-login',
      },
    });
    if (initialBalance > 0) {
      await grantMnems({
        userId: id,
        amount: initialBalance,
        reason: 'PostgreSQL integration seed',
        idempotencyKey: `pg:seed:${id}`,
      });
    }
    return id;
  }

  async function aggregate(userId: string) {
    const [ledger, entitlements, purchases] = await Promise.all([
      prisma.mnemLedger.findMany({ where: { userId } }),
      prisma.entitlement.findMany({ where: { userId } }),
      prisma.purchase.findMany({ where: { userId } }),
    ]);
    return {
      ledger,
      entitlements,
      purchases,
      balance: ledger.reduce((sum, item) => sum + item.amount, 0),
    };
  }

  it('A: replays the same idempotency key with one debit, entitlement and purchase', async () => {
    const userId = await createUser(128);
    const input = {
      userId,
      contentType: 'chapter' as const,
      contentId: '0-4-defragmentation',
      idempotencyKey: `pg:purchase:same:${userId}`,
    };
    const results = await Promise.all([purchaseWithMnems(input), purchaseWithMnems(input)]);
    expect(results.map((item) => item.replayed).sort()).toEqual([false, true]);
    const state = await aggregate(userId);
    expect(state.ledger.filter((item) => item.amount === -64)).toHaveLength(1);
    expect(state.entitlements).toHaveLength(1);
    expect(state.purchases).toHaveLength(1);
    expect(state.balance).toBe(64);
  });

  it('B: returns ALREADY_OWNED for different keys racing on the same content', async () => {
    const userId = await createUser(128);
    const results = await Promise.allSettled([
      purchaseWithMnems({
        userId,
        contentType: 'chapter',
        contentId: '0-4-defragmentation',
        idempotencyKey: `pg:purchase:owned:a:${userId}`,
      }),
      purchaseWithMnems({
        userId,
        contentType: 'chapter',
        contentId: '0-4-defragmentation',
        idempotencyKey: `pg:purchase:owned:b:${userId}`,
      }),
    ]);
    expect(results.filter((item) => item.status === 'fulfilled')).toHaveLength(1);
    expect(results.find((item) => item.status === 'rejected')).toMatchObject({
      reason: { code: 'ALREADY_OWNED' },
    });
    const state = await aggregate(userId);
    expect(state.ledger.filter((item) => item.amount === -64)).toHaveLength(1);
    expect(state.entitlements).toHaveLength(1);
    expect(state.purchases).toHaveLength(1);
  });

  it('C: permits at most one purchase when two items share insufficient balance', async () => {
    const userId = await createUser(64);
    const results = await Promise.allSettled([
      purchaseWithMnems({
        userId,
        contentType: 'chapter',
        contentId: '0-4-defragmentation',
        idempotencyKey: `pg:purchase:balance:a:${userId}`,
      }),
      purchaseWithMnems({
        userId,
        contentType: 'chapter',
        contentId: '0-5-pause',
        idempotencyKey: `pg:purchase:balance:b:${userId}`,
      }),
    ]);
    expect(results.filter((item) => item.status === 'fulfilled')).toHaveLength(1);
    expect(results.find((item) => item.status === 'rejected')).toMatchObject({
      reason: { code: 'INSUFFICIENT_MNEMS' },
    });
    const state = await aggregate(userId);
    expect(state.balance).toBe(0);
    expect(state.ledger.every((item) => item.balanceAfter >= 0)).toBe(true);
    expect(state.entitlements).toHaveLength(1);
    expect(state.purchases).toHaveLength(1);
  });

  it('D: rolls back debit and purchase when execution fails before entitlement', async () => {
    const userId = await createUser(128);
    await expect(prisma.$transaction(async (tx) => {
      await lockMnemAccount(tx, userId);
      await tx.purchase.create({
        data: {
          userId,
          contentType: 'chapter',
          contentId: '0-4-defragmentation',
          mnemCost: 64,
          idempotencyKey: `pg:rollback:purchase:${userId}`,
        },
      });
      await spendMnemsAtomic({
        userId,
        amount: 64,
        reason: 'Synthetic rollback test',
        idempotencyKey: `pg:rollback:ledger:${userId}`,
        contentType: 'chapter',
        contentId: '0-4-defragmentation',
      }, tx);
      throw new Error('simulated failure before entitlement');
    })).rejects.toThrow('simulated failure before entitlement');
    const state = await aggregate(userId);
    expect(state.balance).toBe(128);
    expect(state.ledger.filter((item) => item.amount < 0)).toHaveLength(0);
    expect(state.purchases).toHaveLength(0);
    expect(state.entitlements).toHaveLength(0);
  });

  it('E: replays package grants without child entitlement materialization', async () => {
    const userId = await createUser(0);
    const input = {
      userId,
      packageId: 'act-1',
      source: 'postgres_integration',
      sourceReference: `pg-package-${userId}`,
      idempotencyKey: `pg:package:${userId}`,
    };
    await Promise.all([grantPackage(input), grantPackage(input)]);
    const state = await aggregate(userId);
    expect(state.entitlements.filter((item) => item.contentType === 'package')).toHaveLength(1);
    expect(state.entitlements.filter((item) => item.contentType === 'chapter')).toHaveLength(0);
    expect(state.ledger).toHaveLength(1);
  });

  it('F: replays a signed Stripe event with one event and one grant', async () => {
    const userId = await createUser(0);
    const eventId = `evt_pg_${process.pid}_${sequence}`;
    const sessionId = `cs_pg_${process.pid}_${sequence}`;
    const payload = JSON.stringify({
      id: eventId,
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: sessionId,
          object: 'checkout.session',
          payment_status: 'paid',
          metadata: { grantType: 'package', packageId: 'act-1', userId },
        },
      },
    });
    const signature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: process.env.STRIPE_WEBHOOK_SECRET!,
    });
    const request = () => new NextRequest('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: payload,
      headers: { 'stripe-signature': signature, 'content-type': 'application/json' },
    });
    const responses = await Promise.all([
      postStripeWebhook(request()),
      postStripeWebhook(request()),
    ]);
    expect(responses.map((item) => item.status)).toEqual([200, 200]);
    expect(await prisma.externalGrantEvent.count({ where: { userId } })).toBe(1);
    const state = await aggregate(userId);
    expect(state.entitlements.filter((item) => item.contentType === 'package')).toHaveLength(1);
    expect(state.ledger).toHaveLength(1);
  });
});
