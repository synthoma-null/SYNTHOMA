import { randomUUID } from 'node:crypto';

type ErrorWithPrismaMetadata = Error & {
  code?: string;
  meta?: {
    modelName?: string;
    column?: string;
    driverAdapterError?: {
      cause?: {
        originalCode?: string;
        originalMessage?: string;
      };
    };
  };
};

export interface RuntimeDatabaseErrorReport {
  correlationId: string;
  code: string | null;
  model: string | null;
  column: string | null;
}

function asDatabaseError(error: unknown): ErrorWithPrismaMetadata | null {
  return error instanceof Error ? error as ErrorWithPrismaMetadata : null;
}

export function isPrismaSchemaCompatibilityError(error: unknown): boolean {
  const candidate = asDatabaseError(error);
  return candidate?.code === 'P2021' || candidate?.code === 'P2022';
}

export function reportRuntimeDatabaseError(
  scope: string,
  error: unknown,
): RuntimeDatabaseErrorReport {
  const candidate = asDatabaseError(error);
  const cause = candidate?.meta?.driverAdapterError?.cause;
  const report = {
    correlationId: randomUUID(),
    code: candidate?.code ?? cause?.originalCode ?? null,
    model: candidate?.meta?.modelName ?? null,
    column: candidate?.meta?.column ?? null,
  };
  const stack = candidate?.stack
    ?.split('\n')
    .slice(1)
    .slice(0, 8)
    .join('\n');

  console.error(`[runtime-db/${scope}]`, {
    ...report,
    errorName: candidate?.name ?? 'UnknownError',
    stack,
  });
  return report;
}
