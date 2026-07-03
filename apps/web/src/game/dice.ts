import { DICE_CRITICAL_FAIL, DICE_FAIL_MAX, DICE_SUCCESS_MIN, DICE_BONUS } from './constants';

export function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h += h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

export function advanceSeed(currentSeed: string): { nextSeed: string; value: number } {
  const rng = seededRandom(currentSeed);
  const value = rng();
  const nextSeed = `${currentSeed}:${Math.floor(value * 1e9)}`;
  return { nextSeed, value };
}

export function rollD6FromSeed(currentSeed: string): { result: number; nextSeed: string } {
  const { nextSeed, value } = advanceSeed(currentSeed);
  const result = Math.floor(value * 6) + 1;
  return { result, nextSeed };
}

export function isCriticalFail(result: number): boolean {
  return result === DICE_CRITICAL_FAIL;
}

export function isFail(result: number): boolean {
  return result <= DICE_FAIL_MAX;
}

export function isSuccess(result: number): boolean {
  return result >= DICE_SUCCESS_MIN;
}

export function isBonus(result: number): boolean {
  return result === DICE_BONUS;
}

export function shuffleArray<T>(arr: T[], seed: string): { shuffled: T[]; nextSeed: string } {
  const copy = [...arr];
  let currentSeed = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    const { nextSeed, value } = advanceSeed(currentSeed);
    currentSeed = nextSeed;
    const j = Math.floor(value * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return { shuffled: copy, nextSeed: currentSeed };
}

export function pickRandom<T>(arr: T[], seed: string): { item: T; nextSeed: string } {
  const { nextSeed, value } = advanceSeed(seed);
  const index = Math.floor(value * arr.length);
  return { item: arr[index] as T, nextSeed };
}
