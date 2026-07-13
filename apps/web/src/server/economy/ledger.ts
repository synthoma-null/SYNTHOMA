import { Prisma, type MnemLedger } from '@prisma/client';
import prisma from '../../lib/prisma';
import type { ContentType } from '../../content/catalog';
import { EconomyError } from './errors';

export type EconomyClient = Prisma.TransactionClient | typeof prisma;

export interface LedgerMutation {
  userId: string;
  amount: number;
  transactionType: 'grant' | 'spend' | 'adjustment';
  reason: string;
  idempotencyKey: string;
  contentType?: ContentType;
  contentId?: string;
  packageId?: string;
  stripeSessionId?: string;
  externalReference?: string;
  actorUserId?: string;
}

export async function lockMnemAccount(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<void> {
  const rows = await tx.$queryRaw<Array<{ id: string }>>(
    Prisma.sql`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`,
  );
  if (!rows.length) {
    throw new EconomyError('ACCOUNT_NOT_FOUND', 'MNEM účet nebyl nalezen.', 404);
  }
}

export async function getMnemBalance(
  userId: string,
  client: EconomyClient = prisma,
): Promise<number> {
  const aggregate = await client.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return aggregate._sum.amount ?? 0;
}

function assertIdempotencyMatch(existing: MnemLedger, mutation: LedgerMutation): void {
  if (
    existing.userId !== mutation.userId ||
    existing.amount !== mutation.amount ||
    existing.transactionType !== mutation.transactionType ||
    existing.contentType !== (mutation.contentType ?? null) ||
    existing.contentId !== (mutation.contentId ?? null)
  ) {
    throw new EconomyError(
      'IDEMPOTENCY_CONFLICT',
      'Stejný idempotency klíč už patří jiné MNEM operaci.',
      409,
    );
  }
}

export async function recordMnemDeltaLocked(
  tx: Prisma.TransactionClient,
  mutation: LedgerMutation,
): Promise<MnemLedger> {
  if (!Number.isInteger(mutation.amount)) {
    throw new EconomyError('INVALID_AMOUNT', 'MNEM částka musí být celé číslo.', 400);
  }
  if (!mutation.idempotencyKey.trim()) {
    throw new EconomyError('INVALID_AMOUNT', 'MNEM operace vyžaduje idempotency klíč.', 400);
  }

  const existing = await tx.mnemLedger.findUnique({
    where: { idempotencyKey: mutation.idempotencyKey },
  });
  if (existing) {
    assertIdempotencyMatch(existing, mutation);
    return existing;
  }

  const balance = await getMnemBalance(mutation.userId, tx);
  const balanceAfter = balance + mutation.amount;
  if (balanceAfter < 0) {
    throw new EconomyError(
      'INSUFFICIENT_MNEMS',
      'Nedostatek MNEM. Paměť odmítla jít do záporných hodnot.',
      409,
      { balance, required: Math.abs(mutation.amount) },
    );
  }

  return tx.mnemLedger.create({
    data: {
      userId: mutation.userId,
      amount: mutation.amount,
      balanceAfter,
      transactionType: mutation.transactionType,
      reason: mutation.reason,
      idempotencyKey: mutation.idempotencyKey,
      ...(mutation.contentType ? { contentType: mutation.contentType } : {}),
      ...(mutation.contentId ? { contentId: mutation.contentId } : {}),
      ...(mutation.packageId ? { packageId: mutation.packageId } : {}),
      ...(mutation.stripeSessionId ? { stripeSessionId: mutation.stripeSessionId } : {}),
      ...(mutation.externalReference ? { externalReference: mutation.externalReference } : {}),
      ...(mutation.actorUserId ? { actorUserId: mutation.actorUserId } : {}),
    },
  });
}

export async function grantMnems(
  input: Omit<LedgerMutation, 'transactionType'>,
  tx?: Prisma.TransactionClient,
): Promise<MnemLedger> {
  if (input.amount < 0) {
    throw new EconomyError('INVALID_AMOUNT', 'MNEM grant nemůže být záporný.', 400);
  }
  if (tx) {
    return recordMnemDeltaLocked(tx, { ...input, transactionType: 'grant' });
  }
  return prisma.$transaction(
    async (transaction) => {
      await lockMnemAccount(transaction, input.userId);
      return recordMnemDeltaLocked(transaction, { ...input, transactionType: 'grant' });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

export async function spendMnemsAtomic(
  input: Omit<LedgerMutation, 'amount' | 'transactionType'> & { amount: number },
  tx?: Prisma.TransactionClient,
): Promise<MnemLedger> {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new EconomyError('INVALID_AMOUNT', 'MNEM útrata musí být kladné celé číslo.', 400);
  }
  const mutation: LedgerMutation = {
    ...input,
    amount: -input.amount,
    transactionType: 'spend',
  };
  if (tx) return recordMnemDeltaLocked(tx, mutation);
  return prisma.$transaction(
    async (transaction) => {
      await lockMnemAccount(transaction, input.userId);
      return recordMnemDeltaLocked(transaction, mutation);
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

export async function adjustMnems(
  input: Omit<LedgerMutation, 'transactionType'>,
  tx?: Prisma.TransactionClient,
): Promise<MnemLedger> {
  if (!Number.isInteger(input.amount) || input.amount === 0) {
    throw new EconomyError('INVALID_AMOUNT', 'MNEM úprava musí být nenulové celé číslo.', 400);
  }
  const mutation: LedgerMutation = { ...input, transactionType: 'adjustment' };
  if (tx) return recordMnemDeltaLocked(tx, mutation);
  return prisma.$transaction(
    async (transaction) => {
      await lockMnemAccount(transaction, input.userId);
      return recordMnemDeltaLocked(transaction, mutation);
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
