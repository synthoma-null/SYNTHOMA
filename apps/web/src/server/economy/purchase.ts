import { Prisma } from '@prisma/client';
import { getCatalogEntry, type ContentType } from '../../content/catalog';
import prisma from '../../lib/prisma';
import { getAccessSnapshot, getAccessSnapshotWithClient, type AccessSnapshot } from './access';
import { grantEntitlement } from './entitlements';
import { EconomyError } from './errors';
import { lockMnemAccount, spendMnemsAtomic } from './ledger';
import { executePurchaseCore } from './purchaseCore';

export interface PurchaseWithMnemsInput {
  userId: string;
  contentType: ContentType;
  contentId: string;
  idempotencyKey: string;
  metadata?: Prisma.InputJsonValue;
}

export interface PurchaseResult {
  purchase: {
    id: string;
    contentType: string;
    contentId: string;
    mnemCost: number;
    status: string;
    completedAt: Date | null;
  };
  replayed: boolean;
  snapshot: AccessSnapshot;
}

function validateIdempotencyKey(value: string): void {
  if (!/^[A-Za-z0-9:_-]{12,128}$/.test(value)) {
    throw new EconomyError(
      'IDEMPOTENCY_CONFLICT',
      'Idempotency klíč nákupu má neplatný formát.',
      400,
    );
  }
}

export async function purchaseWithMnems(
  input: PurchaseWithMnemsInput,
): Promise<PurchaseResult> {
  validateIdempotencyKey(input.idempotencyKey);
  const entry = getCatalogEntry(input.contentType, input.contentId);
  if (!entry) {
    throw new EconomyError('CONTENT_NOT_FOUND', 'Požadovaný obsah v katalogu neexistuje.', 404);
  }
  if (entry.availability !== 'published') {
    throw new EconomyError('CONTENT_UNAVAILABLE', 'Tento obsah zatím není dostupný.', 409);
  }
  const mnemCost = entry.mnemCost;
  if (!mnemCost || mnemCost <= 0 || entry.type === 'package') {
    throw new EconomyError(
      'PURCHASE_NOT_SUPPORTED',
      'Tento obsah nelze koupit za MNEM.',
      409,
    );
  }

  const transactionResult = await prisma.$transaction(
    async (tx) => executePurchaseCore({
      lockAccount: (userId) => lockMnemAccount(tx, userId),
      findPurchaseByIdempotencyKey: (idempotencyKey) =>
        tx.purchase.findUnique({ where: { idempotencyKey } }),
      hasAccess: async (userId, contentType, contentId) => {
        const snapshot = await getAccessSnapshotWithClient(tx, userId, [{ contentType, contentId }]);
        return snapshot.access[0]?.canAccess ?? false;
      },
      createPendingPurchase: (purchaseInput) => tx.purchase.create({
        data: {
          ...purchaseInput,
          ...(input.metadata ? { metadata: input.metadata } : {}),
        },
      }),
      spend: async (spendInput) => spendMnemsAtomic({
        userId: spendInput.userId,
        amount: spendInput.amount,
        reason: `Nákup: ${spendInput.title}`,
        idempotencyKey: `purchase:${spendInput.idempotencyKey}`,
        contentType: spendInput.contentType,
        contentId: spendInput.contentId,
        externalReference: spendInput.purchaseId,
      }, tx),
      grant: (grantInput) => grantEntitlement({
        userId: grantInput.userId,
        contentType: grantInput.contentType,
        contentId: grantInput.contentId,
        source: 'mnem_purchase',
        sourceReference: grantInput.purchaseId,
      }, tx),
      completePurchase: ({ purchaseId, ledgerEntryId, entitlementId }) => tx.purchase.update({
        where: { id: purchaseId },
        data: { status: 'completed', entitlementId, ledgerEntryId, completedAt: new Date() },
      }),
    }, {
      userId: input.userId,
      contentType: entry.type,
      contentId: entry.id,
      title: entry.title,
      mnemCost,
      idempotencyKey: input.idempotencyKey,
    }),
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  const snapshot = await getAccessSnapshot(input.userId, [
    { contentType: entry.type, contentId: entry.id },
  ]);
  return { ...transactionResult, snapshot };
}
