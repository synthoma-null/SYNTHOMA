import type { GameState } from './types';
import { GAME_STORAGE_KEY, GAME_VERSION } from './constants';

interface StoredGame {
  version: number;
  state: GameState;
  savedAt: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function saveLocalGame(state: GameState): void {
  if (!isBrowser()) return;
  try {
    const stored: StoredGame = { version: GAME_VERSION, state, savedAt: Date.now() };
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function loadLocalGame(): GameState | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredGame;
    if (stored.version !== GAME_VERSION) {
      clearLocalGame();
      return null;
    }
    return stored.state;
  } catch {
    return null;
  }
}

export function clearLocalGame(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(GAME_STORAGE_KEY);
  } catch {
    // ignore
  }
}
