import { EconomyError } from '../errors';
import {
  executePurchaseCore,
  type CorePurchase,
  type ExecutePurchaseCoreInput,
  type PurchaseCoreRepository,
} from '../purchaseCore';

class TransactionalMemoryStore {
  balance = 128;
  entitlements = new Set<string>();
  purchases = new Map<string, CorePurchase>();
  ledger: Array<{ id: string; amount: number; balanceAfter: number }> = [];
  failGrant = false;
  private queue: Promise<void> = Promise.resolve();
  private sequence = 0;

  async purchase(input: ExecutePurchaseCoreInput) {
    const previous = this.queue;
    let release = () => {};
    this.queue = new Promise<void>((resolve) => { release = resolve; });
    await previous;
    const before = {
      balance: this.balance,
      entitlements: new Set(this.entitlements),
      purchases: new Map(this.purchases),
      ledger: this.ledger.map((entry) => ({ ...entry })),
      sequence: this.sequence,
    };
    try {
      return await executePurchaseCore(this.repository(), input);
    } catch (error) {
      this.balance = before.balance;
      this.entitlements = before.entitlements;
      this.purchases = before.purchases;
      this.ledger = before.ledger;
      this.sequence = before.sequence;
      throw error;
    } finally {
      release();
    }
  }

  private repository(): PurchaseCoreRepository {
    return {
      lockAccount: async () => {},
      findPurchaseByIdempotencyKey: async (key) => this.purchases.get(key) ?? null,
      hasAccess: async (_userId, type, id) => this.entitlements.has(`${type}:${id}`),
      createPendingPurchase: async (input) => {
        const purchase: CorePurchase = {
          id: `purchase-${++this.sequence}`,
          userId: input.userId,
          contentType: input.contentType,
          contentId: input.contentId,
          mnemCost: input.mnemCost,
          status: 'pending',
          completedAt: null,
        };
        this.purchases.set(input.idempotencyKey, purchase);
        return purchase;
      },
      spend: async (input) => {
        if (this.balance < input.amount) {
          throw new EconomyError('INSUFFICIENT_MNEMS', 'Nedostatek MNEM.', 409);
        }
        this.balance -= input.amount;
        const entry = { id: `ledger-${++this.sequence}`, amount: -input.amount, balanceAfter: this.balance };
        this.ledger.push(entry);
        return entry;
      },
      grant: async (input) => {
        if (this.failGrant) throw new Error('simulated grant failure');
        this.entitlements.add(`${input.contentType}:${input.contentId}`);
        return { id: `entitlement-${++this.sequence}` };
      },
      completePurchase: async ({ purchaseId }) => {
        const match = [...this.purchases.entries()].find(([, purchase]) => purchase.id === purchaseId);
        if (!match) throw new Error('purchase missing');
        const completed = { ...match[1], status: 'completed', completedAt: new Date() };
        this.purchases.set(match[0], completed);
        return completed;
      },
    };
  }
}

const baseInput: ExecutePurchaseCoreInput = {
  userId: 'user-1',
  contentType: 'chapter',
  contentId: '0-4-defragmentation',
  title: '0-4 [DEFRAGMENTATION]',
  mnemCost: 64,
  idempotencyKey: 'purchase:attempt:0001',
};

describe('transactional MNEM purchase core', () => {
  it('replays an idempotent request without a second debit or entitlement', async () => {
    const store = new TransactionalMemoryStore();
    const first = await store.purchase(baseInput);
    const replay = await store.purchase(baseInput);
    expect(first.replayed).toBe(false);
    expect(replay.replayed).toBe(true);
    expect(store.balance).toBe(64);
    expect(store.ledger).toHaveLength(1);
    expect(store.entitlements.size).toBe(1);
  });

  it('serializes concurrent attempts so the same content is charged once', async () => {
    const store = new TransactionalMemoryStore();
    const results = await Promise.allSettled([
      store.purchase({ ...baseInput, idempotencyKey: 'purchase:race:0001' }),
      store.purchase({ ...baseInput, idempotencyKey: 'purchase:race:0002' }),
    ]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    const rejection = results.find((result) => result.status === 'rejected');
    expect(rejection).toMatchObject({ reason: { code: 'ALREADY_OWNED' } });
    expect(store.balance).toBe(64);
    expect(store.ledger).toHaveLength(1);
    expect(store.entitlements.size).toBe(1);
  });

  it('never writes a negative balance', async () => {
    const store = new TransactionalMemoryStore();
    store.balance = 32;
    await expect(store.purchase(baseInput)).rejects.toMatchObject({ code: 'INSUFFICIENT_MNEMS' });
    expect(store.balance).toBe(32);
    expect(store.ledger).toHaveLength(0);
    expect(store.entitlements.size).toBe(0);
    expect(store.purchases.size).toBe(0);
  });

  it('rolls back debit and pending purchase when entitlement creation fails', async () => {
    const store = new TransactionalMemoryStore();
    store.failGrant = true;
    await expect(store.purchase(baseInput)).rejects.toThrow('simulated grant failure');
    expect(store.balance).toBe(128);
    expect(store.ledger).toHaveLength(0);
    expect(store.entitlements.size).toBe(0);
    expect(store.purchases.size).toBe(0);
  });
});
