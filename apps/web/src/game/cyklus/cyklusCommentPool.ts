import { seededRandom } from './cyklusRandom';

const RECENT_STORAGE_KEY = 'synthoma_cyklus_recent_comments';
const DEFAULT_RECENT_LIMIT = 3;

export function loadRecentCyklusComments(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentCyklusComment(comment: string, limit = DEFAULT_RECENT_LIMIT): void {
  if (typeof window === 'undefined' || !comment) return;
  try {
    const recent = loadRecentCyklusComments();
    const next = [comment, ...recent.filter((c) => c !== comment)].slice(0, limit);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Local storage may be disabled or full; failing silently is acceptable here.
  }
}

export function pickAvoidingRecent(
  pool: string[],
  seed: string,
  recentComments: string[],
  limit = DEFAULT_RECENT_LIMIT,
): string {
  if (pool.length === 0) return '';
  const recent = recentComments.slice(0, limit);
  const candidates = pool.filter((c) => !recent.includes(c));
  const effectivePool = candidates.length > 0 ? candidates : pool;
  const first = effectivePool[0];
  if (!first) return '';
  // Deterministic selection based on seed; try up to pool length offsets to avoid repeats.
  for (let i = 0; i < effectivePool.length; i++) {
    const idx = Math.floor(seededRandom(seed, i) * effectivePool.length);
    const picked = effectivePool[idx];
    if (picked) return picked;
  }
  return first;
}
