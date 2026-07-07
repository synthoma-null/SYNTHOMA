/**
 * Pure math helpers for Cyklus. No imports from higher engine modules.
 */

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function clampRelation(value: number): number {
  return Math.max(-10, Math.min(10, value));
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function countBy<T extends string | number>(items: T[]): Record<T, number> {
  const counts = {} as Record<T, number>;
  for (const item of items) {
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return counts;
}
