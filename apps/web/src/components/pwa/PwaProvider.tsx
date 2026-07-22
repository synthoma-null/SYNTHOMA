'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import {
  PWA_CACHE_PREFIX,
  PWA_INSTALL_DISMISSED_KEY,
  PWA_VISIT_COUNT_KEY,
  PWA_VISIT_SESSION_KEY,
  activateWaitingServiceWorker,
  isInstallCooldownActive,
  isPwaCriticalPath,
  isStandaloneDisplay,
} from '../../lib/pwa';

type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';
export type PwaCacheStatus = 'unavailable' | 'partial' | 'ready';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type PwaContextValue = {
  installed: boolean;
  online: boolean;
  cacheStatus: PwaCacheStatus;
  canPromptInstall: boolean;
  updateAvailable: boolean;
  install: () => Promise<InstallOutcome>;
  dismissInstall: () => void;
  checkForUpdate: () => Promise<void>;
  applyUpdate: () => void;
  refreshOfflineData: () => Promise<void>;
  clearOfflineCache: () => Promise<void>;
};

const noopAsync = async () => {};
const PwaContext = createContext<PwaContextValue>({
  installed: false,
  online: true,
  cacheStatus: 'unavailable',
  canPromptInstall: false,
  updateAvailable: false,
  install: async () => 'unavailable',
  dismissInstall: () => {},
  checkForUpdate: noopAsync,
  applyUpdate: () => {},
  refreshOfflineData: noopAsync,
  clearOfflineCache: noopAsync,
});

export function usePwa(): PwaContextValue {
  return useContext(PwaContext);
}

export default function PwaProvider({ children }: PropsWithChildren) {
  const pathname = usePathname() ?? '/';
  const [installed, setInstalled] = useState(false);
  const [online, setOnline] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<PwaCacheStatus>('unavailable');
  const [deferredInstall, setDeferredInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [installEligible, setInstallEligible] = useState(false);
  const [installPromptVisible, setInstallPromptVisible] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const reloadingRef = useRef(false);
  const criticalInteraction = isPwaCriticalPath(pathname);

  const refreshCacheStatus = useCallback(async () => {
    if (!('caches' in window)) {
      setCacheStatus('unavailable');
      return;
    }
    const names = (await window.caches.keys()).filter((name) => name.startsWith(PWA_CACHE_PREFIX));
    setCacheStatus(names.length >= 2 ? 'ready' : names.length > 0 ? 'partial' : 'unavailable');
  }, []);

  useEffect(() => {
    setInstalled(isStandaloneDisplay());
    setOnline(navigator.onLine);
    void refreshCacheStatus();

    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onInstalled = () => {
      setInstalled(true);
      setDeferredInstall(null);
      setInstallPromptVisible(false);
      setInstalledNotice(true);
      window.setTimeout(() => setInstalledNotice(false), 4000);
    };
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredInstall(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, [refreshCacheStatus]);

  useEffect(() => {
    try {
      const counted = window.sessionStorage.getItem(PWA_VISIT_SESSION_KEY) === '1';
      const previous = Number(window.localStorage.getItem(PWA_VISIT_COUNT_KEY) ?? 0);
      const visits = counted ? previous : Math.max(0, previous) + 1;
      if (!counted) {
        window.localStorage.setItem(PWA_VISIT_COUNT_KEY, String(visits));
        window.sessionStorage.setItem(PWA_VISIT_SESSION_KEY, '1');
      }
      setInstallEligible(visits >= 2);
    } catch {
      setInstallEligible(false);
    }
  }, []);

  useEffect(() => {
    const shouldShow = Boolean(deferredInstall)
      && installEligible
      && !installed
      && !criticalInteraction
      && !isInstallCooldownActive();
    setInstallPromptVisible(shouldShow);
  }, [criticalInteraction, deferredInstall, installEligible, installed]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    let disposed = false;
    const stateListeners = new Map<ServiceWorker, () => void>();
    let updateFoundListener: (() => void) | null = null;

    const inspectInstallingWorker = (registration: ServiceWorkerRegistration) => {
      const worker = registration.installing;
      if (!worker || stateListeners.has(worker)) return;
      const onStateChange = () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          setUpdateAvailable(true);
          setUpdateDismissed(false);
        }
      };
      worker.addEventListener('statechange', onStateChange);
      stateListeners.set(worker, onStateChange);
    };

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' });
        if (disposed) return;
        registrationRef.current = registration;
        if (registration.waiting && navigator.serviceWorker.controller) setUpdateAvailable(true);
        updateFoundListener = () => inspectInstallingWorker(registration);
        registration.addEventListener('updatefound', updateFoundListener);
        await registration.update();
        void navigator.serviceWorker.ready.then(refreshCacheStatus);
        await refreshCacheStatus();
      } catch (error) {
        console.error('PWA registration failed:', error);
      }
    };

    const onControllerChange = () => {
      if (reloadingRef.current) window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    if (document.readyState === 'complete') void register();
    else window.addEventListener('load', register, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener('load', register);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      if (updateFoundListener && registrationRef.current) registrationRef.current.removeEventListener('updatefound', updateFoundListener);
      for (const [worker, listener] of stateListeners) worker.removeEventListener('statechange', listener);
    };
  }, [refreshCacheStatus]);

  const install = useCallback(async (): Promise<InstallOutcome> => {
    if (!deferredInstall || installed) return 'unavailable';
    const event = deferredInstall;
    setInstallPromptVisible(false);
    await event.prompt();
    const choice = await event.userChoice;
    setDeferredInstall(null);
    if (choice.outcome === 'dismissed') {
      window.localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, String(Date.now()));
    }
    return choice.outcome;
  }, [deferredInstall, installed]);

  const dismissInstall = useCallback(() => {
    window.localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, String(Date.now()));
    setInstallPromptVisible(false);
  }, []);

  const checkForUpdate = useCallback(async () => {
    const registration = registrationRef.current ?? await navigator.serviceWorker?.getRegistration('/');
    if (!registration) return;
    registrationRef.current = registration;
    await registration.update();
    if (registration.waiting && navigator.serviceWorker.controller) {
      setUpdateAvailable(true);
      setUpdateDismissed(false);
    }
  }, []);

  const applyUpdate = useCallback(() => {
    const waiting = registrationRef.current?.waiting;
    if (!waiting || criticalInteraction) return;
    reloadingRef.current = true;
    activateWaitingServiceWorker(waiting);
  }, [criticalInteraction]);

  const refreshOfflineData = useCallback(async () => {
    await checkForUpdate();
    if (navigator.serviceWorker?.controller) {
      await Promise.all(['/offline', '/books'].map((url) => fetch(url, { cache: 'reload' }).catch(() => null)));
    }
    await refreshCacheStatus();
  }, [checkForUpdate, refreshCacheStatus]);

  const clearOfflineCache = useCallback(async () => {
    if (!('caches' in window)) return;
    const names = await window.caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(PWA_CACHE_PREFIX)).map((name) => window.caches.delete(name)));
    await refreshCacheStatus();
  }, [refreshCacheStatus]);

  const value = useMemo<PwaContextValue>(() => ({
    installed,
    online,
    cacheStatus,
    canPromptInstall: Boolean(deferredInstall) && !installed,
    updateAvailable,
    install,
    dismissInstall,
    checkForUpdate,
    applyUpdate,
    refreshOfflineData,
    clearOfflineCache,
  }), [applyUpdate, cacheStatus, checkForUpdate, clearOfflineCache, deferredInstall, dismissInstall, install, installed, online, refreshOfflineData, updateAvailable]);

  return <PwaContext.Provider value={value}>
    {children}
    {installPromptVisible ? <InstallPrompt onInstall={install} onDismiss={dismissInstall} /> : null}
    {updateAvailable && !updateDismissed && !criticalInteraction ? <UpdatePrompt onApply={applyUpdate} onDismiss={() => setUpdateDismissed(true)} /> : null}
    {installedNotice ? <div className="pwa-toast" role="status">SYNTHOMA byla nainstalována.</div> : null}
  </PwaContext.Provider>;
}

function InstallPrompt({ onInstall, onDismiss }: { onInstall: () => Promise<InstallOutcome>; onDismiss: () => void }) {
  return <div className="pwa-dialog-backdrop" role="presentation">
    <section className="pwa-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-install-title">
      <span className="pwa-dialog__code">SYS // INSTALL</span>
      <h2 id="pwa-install-title">NAINSTALOVAT SYNTHOMU</h2>
      <p>Spouštěj SYNTHOMU přes celou obrazovku, vrať se rychleji ke čtení a ponech dříve navštívený obsah dostupný bez spojení.</p>
      <div className="pwa-dialog__actions">
        <button type="button" className="os-command os-command--primary" onClick={() => void onInstall()}>NAINSTALOVAT</button>
        <button type="button" className="os-command" onClick={onDismiss}>TEĎ NE</button>
        <Link className="os-command" href="/install">VÍCE INFORMACÍ</Link>
      </div>
    </section>
  </div>;
}

function UpdatePrompt({ onApply, onDismiss }: { onApply: () => void; onDismiss: () => void }) {
  return <div className="pwa-dialog-backdrop" role="presentation">
    <section className="pwa-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-update-title">
      <span className="pwa-dialog__code">SYS // UPDATE READY</span>
      <h2 id="pwa-update-title">NOVÁ VERZE SYNTHOMY JE PŘIPRAVENA</h2>
      <p>Aktualizace opravuje systémové chyby. Ty emocionální zůstávají součástí produktu.</p>
      <div className="pwa-dialog__actions pwa-dialog__actions--two">
        <button type="button" className="os-command os-command--primary" onClick={onApply}>AKTUALIZOVAT</button>
        <button type="button" className="os-command" onClick={onDismiss}>POZDĚJI</button>
      </div>
    </section>
  </div>;
}
