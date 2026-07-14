export const PUBLIC_SITE_URL = 'https://www.synthoma.cz';
export const PUBLIC_SCHEMA_VERSION = '1';
export const PUBLIC_CONTENT_VERSION = '2026-07-14';
export const PUBLIC_CONTENT_UPDATED_AT = '2026-07-14T00:00:00.000Z';
export const PUBLIC_CYKLUS_ENGINE_VERSION = '1.0.0';

export type PublicLocale = 'cs' | 'en';

export function resolvePublicLocale(value: string | null | undefined): PublicLocale | null {
  if (!value || value === 'cs') return 'cs';
  if (value === 'en') return 'en';
  return null;
}

export function absolutePublicUrl(pathname: string): string {
  return new URL(pathname, PUBLIC_SITE_URL).toString();
}
