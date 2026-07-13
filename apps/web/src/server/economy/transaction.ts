import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

const DEFAULT_MAX_ATTEMPTS = 4;

function nestedCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const candidate = error as { code?: unknown; cause?: unknown; meta?: { code?: unknown } };
  if (typeof candidate.code === 'string') return candidate.code;
  if (typeof candidate.meta?.code === 'string') return candidate.meta.code;
  return nestedCode(candidate.cause);
}

export function isRetryableSerializableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') return true;
  return nestedCode(error) === '40001';
}

export async function runSerializableTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      lastError = error;
      if (!isRetryableSerializableError(error) || attempt === maxAttempts) throw error;
    }
  }
  throw lastError;
}
