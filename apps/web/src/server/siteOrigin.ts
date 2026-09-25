export function siteOrigin(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://www.synthoma.cz';
  const url = new URL(value);
  if (url.username || url.password || (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)))) {
    throw new Error('INVALID_SITE_ORIGIN');
  }
  return url.origin;
}
