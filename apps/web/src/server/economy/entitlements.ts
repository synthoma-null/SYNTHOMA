import { Prisma, type Entitlement } from '@prisma/client';
import { getPackageById } from '../../content/booksManifest';
import type { ContentType } from '../../content/catalog';
import prisma from '../../lib/prisma';
import { EconomyError } from './errors';
import { grantMnems, lockMnemAccount } from './ledger';

export interface GrantEntitlementInput {
  userId: string;
  contentType: ContentType;
  contentId: string;
  source: string;
  sourceReference?: string;
  metadata?: Prisma.InputJsonValue;
  expiresAt?: Date;
}

export async function grantEntitlement(
  input: GrantEntitlementInput,
  tx?: Prisma.TransactionClient,
): Promise<Entitlement> {
  const client = tx ?? prisma;
  return client.entitlement.upsert({
    where: {
      userId_contentType_contentId: {
        userId: input.userId,
        contentType: input.contentType,
        contentId: input.contentId,
      },
    },
    create: {
      userId: input.userId,
      contentType: input.contentType,
      contentId: input.contentId,
      source: input.source,
      ...(input.contentType === 'chapter' ? { chapterId: input.contentId } : {}),
      ...(input.contentType === 'package' ? { packageId: input.contentId } : {}),
      ...(input.sourceReference ? { sourceReference: input.sourceReference } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
      ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
    },
    update: {
      source: input.source,
      grantedAt: new Date(),
      ...(input.sourceReference ? { sourceReference: input.sourceReference } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
      ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
    },
  });
}

export interface GrantPackageInput {
  userId: string;
  packageId: string;
  source: string;
  idempotencyKey: string;
  sourceReference?: string;
  stripeSessionId?: string;
}

export async function grantPackage(
  input: GrantPackageInput,
  existingTransaction?: Prisma.TransactionClient,
): Promise<Entitlement> {
  const pkg = getPackageById(input.packageId);
  if (!pkg) {
    throw new EconomyError('CONTENT_NOT_FOUND', `Balíček ${input.packageId} neexistuje.`, 404);
  }

  const execute = async (tx: Prisma.TransactionClient) => {
    const entitlement = await grantEntitlement(
      {
        userId: input.userId,
        contentType: 'package',
        contentId: input.packageId,
        source: input.source,
        ...(input.sourceReference ? { sourceReference: input.sourceReference } : {}),
      },
      tx,
    );

    await grantMnems(
      {
        userId: input.userId,
        amount: pkg.mnems,
        reason: `Balíček: ${pkg.name} (${input.source})`,
        idempotencyKey: `${input.idempotencyKey}:mnems`,
        packageId: input.packageId,
        contentType: 'package',
        contentId: input.packageId,
        ...(input.stripeSessionId ? { stripeSessionId: input.stripeSessionId } : {}),
        ...(input.sourceReference ? { externalReference: input.sourceReference } : {}),
      },
      tx,
    );
    return entitlement;
  };

  if (existingTransaction) return execute(existingTransaction);
  return prisma.$transaction(
    async (tx) => {
      await lockMnemAccount(tx, input.userId);
      return execute(tx);
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
