export function seededRandom(seed: string, step: number): number {
  return hashSeed(`${seed}:${step}`);
}

export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1_000_000) / 1_000_000;
}

export function weightedPickBase<T>(candidates: { item: T; weight: number }[], roll: number): T | null {
  const total = candidates.reduce((sum, c) => sum + c.weight, 0);
  if (total <= 0) return candidates[0]?.item ?? null;
  let remaining = roll * total;
  for (const c of candidates) {
    remaining -= c.weight;
    if (remaining <= 0) return c.item;
  }
  return candidates[candidates.length - 1]?.item ?? null;
}

export function pickFromPool<T>(pool: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index]!;
}
