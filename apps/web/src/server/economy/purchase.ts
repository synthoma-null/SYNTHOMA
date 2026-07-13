import { Prisma } from '@prisma/client';
import { getCatalogEntry, type ContentType } from '../../content/catalog';
import prisma from '../../lib/prisma';
import { getAccessSnapshot, getAccessSnapshotWithClient, type AccessSnapshot } from './access';
import { grantEntitlement } from './entitlements';
import { EconomyError } from './errors';
import { lockMnemAccount, spendMnemsAtomic } from './ledger';

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
    async (tx) => {
      await lockMnemAccount(tx, input.userId);

      const existing = await tx.purchase.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) {
        if (
          existing.userId !== input.userId ||
          existing.contentType !== entry.type ||
          existing.contentId !== entry.id
        ) {
          throw new EconomyError(
            'IDEMPOTENCY_CONFLICT',
            'Tento idempotency klíč už patří jinému nákupu.',
            409,
          );
        }
        return { purchase: existing, replayed: true };
      }

      const before = await getAccessSnapshotWithClient(tx, input.userId, [
        { contentType: entry.type, contentId: entry.id },
      ]);
      if (before.access[0]?.canAccess) {
        throw new EconomyError('ALREADY_OWNED', 'Tento obsah už vlastníš.', 409, {
          access: before.access[0],
        });
      }

      const purchase = await tx.purchase.create({
        data: {
          userId: input.userId,
          contentType: entry.type,
          contentId: entry.id,
          mnemCost,
          idempotencyKey: input.idempotencyKey,
          ...(input.metadata ? { metadata: input.metadata } : {}),
        },
      });
      const ledger = await spendMnemsAtomic(
        {
          userId: input.userId,
          amount: mnemCost,
          reason: `Nákup: ${entry.title}`,
          idempotencyKey: `purchase:${input.idempotencyKey}`,
          contentType: entry.type,
          contentId: entry.id,
          externalReference: purchase.id,
        },
        tx,
      );
      const entitlement = await grantEntitlement(
        {
          userId: input.userId,
          contentType: entry.type,
          contentId: entry.id,
          source: 'mnem_purchase',
          sourceReference: purchase.id,
        },
        tx,
      );
      const completed = await tx.purchase.update({
        where: { id: purchase.id },
        data: {
          status: 'completed',
          entitlementId: entitlement.id,
          ledgerEntryId: ledger.id,
          completedAt: new Date(),
        },
      });
      return { purchase: completed, replayed: false };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  const snapshot = await getAccessSnapshot(input.userId, [
    { contentType: entry.type, contentId: entry.id },
  ]);
  return { ...transactionResult, snapshot };
}
