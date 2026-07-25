export const PWA_VERSION = '1.0.0-pwa.4';
export const PWA_BUILD_ID = process.env.NEXT_PUBLIC_SYNTHOMA_BUILD_ID || 'local';
export const PWA_CACHE_PREFIX = 'synthoma-';
export const PWA_INSTALL_DISMISSED_KEY = 'synthoma_pwa_install_dismissed_at';
export const PWA_VISIT_COUNT_KEY = 'synthoma_pwa_visit_count';
export const PWA_VISIT_SESSION_KEY = 'synthoma_pwa_visit_counted';
export const PWA_INSTALL_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

export const PWA_CRITICAL_PATH_PREFIXES = [
  '/chapter/',
  '/reader',
  '/cyklus',
  '/login',
  '/register',
  '/purchase',
] as const;

export function isPwaCriticalPath(pathname: string): boolean {
  return PWA_CRITICAL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches
    || window.matchMedia?.('(display-mode: fullscreen)').matches
    || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

export function isInstallCooldownActive(now = Date.now()): boolean {
  if (typeof window === 'undefined') return false;
  const dismissedAt = Number(window.localStorage.getItem(PWA_INSTALL_DISMISSED_KEY) ?? 0);
  return Number.isFinite(dismissedAt) && dismissedAt > 0 && now - dismissedAt < PWA_INSTALL_COOLDOWN_MS;
}

export function activateWaitingServiceWorker(worker: Pick<ServiceWorker, 'postMessage'> | null): boolean {
  if (!worker) return false;
  worker.postMessage({ type: 'SKIP_WAITING' });
  return true;
}
