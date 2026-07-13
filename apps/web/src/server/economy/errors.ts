export type EconomyErrorCode =
  | 'CONTENT_NOT_FOUND'
  | 'CONTENT_UNAVAILABLE'
  | 'AUTHENTICATION_REQUIRED'
  | 'PURCHASE_NOT_SUPPORTED'
  | 'INSUFFICIENT_MNEMS'
  | 'ALREADY_OWNED'
  | 'IDEMPOTENCY_CONFLICT'
  | 'ACCOUNT_NOT_FOUND'
  | 'INVALID_AMOUNT';

export class EconomyError extends Error {
  constructor(
    public readonly code: EconomyErrorCode,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'EconomyError';
  }
}

export function isEconomyError(error: unknown): error is EconomyError {
  return error instanceof EconomyError;
}
