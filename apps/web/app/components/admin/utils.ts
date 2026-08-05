export function formatAdminDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('cs-CZ', { dateStyle: 'short', timeStyle: 'short' });
}

export async function readAdminResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null) as (T & { error?: string }) | null;
  if (!response.ok) {
    throw new Error(data?.error ?? `Požadavek selhal (${response.status}).`);
  }
  if (data === null) throw new Error('Server vrátil nečitelnou odpověď.');
  return data;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : 'Chyba sítě.';
}
