/**
 * Formatting helpers for Cyklus visible numeric outputs.
 * Keeps floats like 13.999999999999998 out of UI and export logs.
 */

export function roundVisibleNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

export function formatDelta(value: number): string {
  const rounded = roundVisibleNumber(value);
  if (rounded > 0) return `+${rounded}`;
  return `${rounded}`;
}

export function formatAbsDelta(value: number): string {
  return `${Math.abs(roundVisibleNumber(value))}`;
}

export function formatStatValue(value: number): string {
  return `${roundVisibleNumber(value)}`;
}
