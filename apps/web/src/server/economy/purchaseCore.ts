import type { ContentType } from '../../content/catalog';
import { EconomyError } from './errors';

export interface CorePurchase {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  mnemCost: number;
  status: string;
  completedAt: Date | null;
}

export interface PurchaseCoreRepository {
  lockAccount(userId: string): Promise<void>;
  findPurchaseByIdempotencyKey(idempotencyKey: string): Promise<CorePurchase | null>;
  hasAccess(userId: string, contentType: ContentType, contentId: string): Promise<boolean>;
  createPendingPurchase(input: {
    userId: string;
    contentType: ContentType;
    contentId: string;
    mnemCost: number;
    idempotencyKey: string;
  }): Promise<CorePurchase>;
  spend(input: {
    userId: string;
    contentType: ContentType;
    contentId: string;
    amount: number;
    idempotencyKey: string;
    purchaseId: string;
    title: string;
  }): Promise<{ id: string }>;
  grant(input: {
    userId: string;
    contentType: ContentType;
    contentId: string;
    purchaseId: string;
  }): Promise<{ id: string }>;
  completePurchase(input: {
    purchaseId: string;
    ledgerEntryId: string;
    entitlementId: string;
  }): Promise<CorePurchase>;
}

export interface ExecutePurchaseCoreInput {
  userId: string;
  contentType: ContentType;
  contentId: string;
  title: string;
  mnemCost: number;
  idempotencyKey: string;
}

export async function executePurchaseCore(
  repository: PurchaseCoreRepository,
  input: ExecutePurchaseCoreInput,
): Promise<{ purchase: CorePurchase; replayed: boolean }> {
  await repository.lockAccount(input.userId);
  const existing = await repository.findPurchaseByIdempotencyKey(input.idempotencyKey);
  if (existing) {
    if (
      existing.userId !== input.userId ||
      existing.contentType !== input.contentType ||
      existing.contentId !== input.contentId
    ) {
      throw new EconomyError(
        'IDEMPOTENCY_CONFLICT',
        'Tento idempotency klíč už patří jinému nákupu.',
        409,
      );
    }
    return { purchase: existing, replayed: true };
  }

  if (await repository.hasAccess(input.userId, input.contentType, input.contentId)) {
    throw new EconomyError('ALREADY_OWNED', 'Tento obsah už vlastníš.', 409);
  }

  const purchase = await repository.createPendingPurchase(input);
  const ledger = await repository.spend({
    ...input,
    amount: input.mnemCost,
    purchaseId: purchase.id,
  });
  const entitlement = await repository.grant({
    userId: input.userId,
    contentType: input.contentType,
    contentId: input.contentId,
    purchaseId: purchase.id,
  });
  const completed = await repository.completePurchase({
    purchaseId: purchase.id,
    ledgerEntryId: ledger.id,
    entitlementId: entitlement.id,
  });
  return { purchase: completed, replayed: false };
}
