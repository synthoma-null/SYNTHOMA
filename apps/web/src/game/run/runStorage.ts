import type { RunState } from './runTypes';

const STORAGE_KEY = 'synthoma_run_v1';
const STORAGE_VERSION = 1;

interface StoredRun {
  version: number;
  state: RunState;
  savedAt: string;
}

// ── Save ──────────────────────────────────────────────────────────────────────

export function saveRunLocal(state: RunState): void {
  if (typeof window === 'undefined') return;
  try {
    const data: StoredRun = {
      version: STORAGE_VERSION,
      state,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('[runStorage] Failed to save run to localStorage');
  }
}

// ── Load ──────────────────────────────────────────────────────────────────────

export function loadRunLocal(): RunState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data: StoredRun = JSON.parse(raw) as StoredRun;
    if (data.version !== STORAGE_VERSION) {
      clearRunLocal();
      return null;
    }

    return data.state;
  } catch {
    console.warn('[runStorage] Failed to load run from localStorage');
    return null;
  }
}

// ── Clear ─────────────────────────────────────────────────────────────────────

export function clearRunLocal(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('[runStorage] Failed to clear run from localStorage');
  }
}

// ── Has active run ────────────────────────────────────────────────────────────

export function hasActiveRun(): boolean {
  const run = loadRunLocal();
  return run !== null && run.status === 'playing';
}
