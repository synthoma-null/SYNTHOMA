'use client';

import { useSession } from 'next-auth/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { ContentAccess, ContentType } from '../../content/catalog';

export const ACCESS_CHANGED_EVENT = 'synthoma:access-changed';
const ACCESS_STORAGE_KEY = 'synthoma:access-version';
const ACCESS_CHANNEL = 'synthoma-access';

export interface ClientAccessRequest {
  contentType: ContentType;
  contentId: string;
}

export interface ClientAccessSnapshot {
  version: string;
  userId: string | null;
  balance: number;
  access: ContentAccess[];
}

export class PurchaseRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'PurchaseRequestError';
  }
}

type AccessContextValue = {
  authenticated: boolean;
  sessionStatus: 'loading' | 'authenticated' | 'unauthenticated';
  balance: number;
  version: string | null;
  resolving: boolean;
  getCachedAccess: (contentType: ContentType, contentId: string) => ContentAccess | undefined;
  resolve: (requests: readonly ClientAccessRequest[], force?: boolean) => Promise<ContentAccess[]>;
  refresh: () => Promise<void>;
  purchase: (
    contentType: ContentType,
    contentId: string,
    idempotencyKey?: string,
  ) => Promise<ClientAccessSnapshot>;
  applySnapshot: (snapshot: ClientAccessSnapshot, publish?: boolean) => void;
};

const AccessContext = createContext<AccessContextValue | null>(null);

function keyOf(contentType: ContentType, contentId: string): string {
  return `${contentType}:${contentId}`;
}

function makeIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `purchase:${crypto.randomUUID()}`;
  }
  return `purchase:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}

export function AccessProvider({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  const sessionUserId = session?.user?.id ?? null;
  const [cache, setCache] = useState<Map<string, ContentAccess>>(() => new Map());
  const cacheRef = useRef(cache);
  const requestedRef = useRef<Map<string, ClientAccessRequest>>(new Map());
  const [balance, setBalance] = useState(0);
  const [version, setVersion] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const requestSerial = useRef(0);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  const applySnapshot = useCallback((snapshot: ClientAccessSnapshot, publish = false) => {
    setCache((current) => {
      const next = new Map(current);
      for (const access of snapshot.access) next.set(keyOf(access.contentType, access.contentId), access);
      cacheRef.current = next;
      return next;
    });
    setBalance(snapshot.balance);
    setVersion(snapshot.version);

    if (publish && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(ACCESS_CHANGED_EVENT, { detail: snapshot }));
      try {
        window.localStorage.setItem(ACCESS_STORAGE_KEY, `${snapshot.version}:${Math.random()}`);
      } catch {
        // Storage can be disabled; the in-page event still keeps this app synchronized.
      }
      broadcastRef.current?.postMessage({ version: snapshot.version, userId: snapshot.userId });
    }
  }, []);

  const resolve = useCallback(async (
    requests: readonly ClientAccessRequest[],
    force = false,
  ): Promise<ContentAccess[]> => {
    const unique = new Map<string, ClientAccessRequest>();
    for (const request of requests) {
      const key = keyOf(request.contentType, request.contentId);
      unique.set(key, request);
      requestedRef.current.set(key, request);
    }
    if (status !== 'authenticated') {
      return [...unique.keys()]
        .map((key) => cacheRef.current.get(key))
        .filter((access): access is ContentAccess => Boolean(access));
    }
    const toFetch = [...unique.entries()]
      .filter(([key]) => force || !cacheRef.current.has(key))
      .map(([, request]) => request);
    if (!toFetch.length) {
      return [...unique.keys()]
        .map((key) => cacheRef.current.get(key))
        .filter((access): access is ContentAccess => Boolean(access));
    }

    const serial = ++requestSerial.current;
    setResolving(true);
    try {
      const response = await fetch('/api/me/access/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: toFetch }),
        cache: 'no-store',
      });
      const payload = await response.json() as ClientAccessSnapshot & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Přístup se nepodařilo ověřit.');
      if (serial === requestSerial.current) applySnapshot(payload);
      return [...unique.keys()]
        .map((key) => payload.access.find((item) => keyOf(item.contentType, item.contentId) === key)
          ?? cacheRef.current.get(key))
        .filter((access): access is ContentAccess => Boolean(access));
    } finally {
      if (serial === requestSerial.current) setResolving(false);
    }
  }, [applySnapshot, status]);

  const refresh = useCallback(async () => {
    const requests = [...requestedRef.current.values()];
    if (requests.length) await resolve(requests, true);
  }, [resolve]);

  const purchase = useCallback(async (
    contentType: ContentType,
    contentId: string,
    idempotencyKey = makeIdempotencyKey(),
  ): Promise<ClientAccessSnapshot> => {
    if (status !== 'authenticated') {
      throw new PurchaseRequestError('Před nákupem se přihlas.', 401, 'AUTH_REQUIRED');
    }
    const response = await fetch('/api/me/purchases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ contentType, contentId }),
      cache: 'no-store',
    });
    const payload = await response.json() as {
      error?: string;
      code?: string;
      details?: Record<string, unknown>;
      snapshot?: ClientAccessSnapshot;
    };
    if (!response.ok || !payload.snapshot) {
      throw new PurchaseRequestError(
        payload.error || 'Nákup se nepodařilo dokončit.',
        response.status,
        payload.code,
        payload.details,
      );
    }
    applySnapshot(payload.snapshot, true);
    return payload.snapshot;
  }, [applySnapshot, status]);

  useEffect(() => {
    cacheRef.current = new Map();
    setCache(new Map());
    setBalance(0);
    setVersion(null);
    if (status === 'authenticated' && requestedRef.current.size) void refresh();
  }, [sessionUserId, status, refresh]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const invalidate = () => {
      if (status === 'authenticated') void refresh();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === ACCESS_STORAGE_KEY) invalidate();
    };
    const onChanged = (event: Event) => {
      const snapshot = (event as CustomEvent<ClientAccessSnapshot>).detail;
      if (snapshot?.userId === sessionUserId) applySnapshot(snapshot);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(ACCESS_CHANGED_EVENT, onChanged);
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(ACCESS_CHANNEL);
      channel.onmessage = invalidate;
      broadcastRef.current = channel;
    }
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(ACCESS_CHANGED_EVENT, onChanged);
      broadcastRef.current?.close();
      broadcastRef.current = null;
    };
  }, [applySnapshot, refresh, sessionUserId, status]);

  const getCachedAccess = useCallback(
    (contentType: ContentType, contentId: string) => cache.get(keyOf(contentType, contentId)),
    [cache],
  );
  const value = useMemo<AccessContextValue>(() => ({
    authenticated: status === 'authenticated',
    sessionStatus: status,
    balance,
    version,
    resolving,
    getCachedAccess,
    resolve,
    refresh,
    purchase,
    applySnapshot,
  }), [balance, version, resolving, getCachedAccess, resolve, refresh, purchase, applySnapshot, status]);

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess(): AccessContextValue {
  const context = useContext(AccessContext);
  if (!context) throw new Error('useAccess musí být použit uvnitř AccessProvider.');
  return context;
}

export function useContentAccess(contentType: ContentType, contentId: string) {
  const accessContext = useAccess();
  const access = accessContext.getCachedAccess(contentType, contentId);
  const { authenticated, sessionStatus, resolve, purchase, refresh, balance } = accessContext;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contentId || access || sessionStatus !== 'authenticated') return;
    let active = true;
    void resolve([{ contentType, contentId }]).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : 'Přístup se nepodařilo ověřit.');
    });
    return () => { active = false; };
  }, [access, contentId, contentType, resolve, sessionStatus]);

  return {
    access,
    balance,
    loading: sessionStatus === 'loading' || (authenticated && !access && !error),
    error,
    purchase: (idempotencyKey?: string) =>
      purchase(contentType, contentId, idempotencyKey),
    refresh,
  };
}
