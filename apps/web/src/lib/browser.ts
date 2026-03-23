export type StorageKind = "local" | "session";

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getStorage(kind: StorageKind = "local"): Storage | null {
  if (!isBrowser()) return null;
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readStorage(key: string, fallback: string | null = null, kind: StorageKind = "local"): string | null {
  const storage = getStorage(kind);
  if (!storage) return fallback;
  try {
    const value = storage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: string, kind: StorageKind = "local"): boolean {
  const storage = getStorage(kind);
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string, kind: StorageKind = "local"): boolean {
  const storage = getStorage(kind);
  if (!storage) return false;
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readStorageJSON<T>(key: string, fallback: T, kind: StorageKind = "local"): T {
  const raw = readStorage(key, null, kind);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorageJSON(key: string, value: unknown, kind: StorageKind = "local"): boolean {
  try {
    return writeStorage(key, JSON.stringify(value), kind);
  } catch {
    return false;
  }
}

export function readBooleanStorage(key: string, fallback = false, kind: StorageKind = "local"): boolean {
  const raw = readStorage(key, null, kind);
  if (raw == null) return fallback;
  return raw === "true" || raw === "1";
}

export function readNumberStorage(key: string, fallback: number, kind: StorageKind = "local"): number {
  const raw = readStorage(key, null, kind);
  if (raw == null) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}
