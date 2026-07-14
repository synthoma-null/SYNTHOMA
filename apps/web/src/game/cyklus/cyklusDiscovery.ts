import type { CyklusRunState } from './cyklusTypes';

const DISCOVERY_KEY = 'synthoma_cyklus_discovery';

export interface CyklusDiscovery {
  cards: string[];
  sectors: string[];
  items: string[];
  imprints: string[];
  endings: string[];
  variants: string[];
  findings: string[];
  cardRecords?: Record<string, { firstSeenAt: number; lastSeenAt: number; seenCount: number }>;
}

export function getEmptyDiscovery(): CyklusDiscovery {
  return { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [], cardRecords: {} };
}

export function loadDiscovery(): CyklusDiscovery {
  if (typeof window === 'undefined') return getEmptyDiscovery();
  try {
    const raw = localStorage.getItem(DISCOVERY_KEY);
    const parsed = raw ? (JSON.parse(raw) as CyklusDiscovery) : getEmptyDiscovery();
    return { ...getEmptyDiscovery(), ...parsed };
  } catch { return getEmptyDiscovery(); }
}

export function saveDiscovery(discovery: CyklusDiscovery): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISCOVERY_KEY, JSON.stringify(discovery));
  } catch { /* ignore */ }
}

export async function saveDiscoveryWithSync(discovery: CyklusDiscovery): Promise<void> {
  saveDiscovery(discovery);
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/me/cyklus', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discovery }),
    });
  } catch { /* ignore */ }
}

export function updateDiscoveryFromRun(
  state: CyklusRunState,
  extras?: { variantId?: string | undefined; findingIds?: string[] | undefined },
): CyklusDiscovery {
  const d = loadDiscovery();
  const add = <T>(arr: T[], values: T[]): T[] => [...new Set([...arr, ...values])];

  d.cards = add(d.cards, state.usedCardIds);
  d.sectors = add(d.sectors, state.visitedSectors);
  d.items = add(d.items, state.inventory);
  d.imprints = add(d.imprints, state.imprints);

  if (state.status === 'completed') {
    d.endings = add(d.endings, ['stabilized']);
  } else if (state.status === 'dead') {
    const ending = computeEndingStat(state);
    if (ending) d.endings = add(d.endings, [`death_${ending}`]);
  }

  if (extras?.variantId) {
    d.variants = add(d.variants, [extras.variantId]);
  }
  if (extras?.findingIds) {
    d.findings = add(d.findings, extras.findingIds);
  }

  saveDiscovery(d);
  return d;
}

function computeEndingStat(state: CyklusRunState): string | null {
  const stats = state.stats;
  let nearest: { key: string; dist: number } | null = null;
  for (const key of Object.keys(stats)) {
    const v = stats[key as keyof typeof stats];
    const dist = Math.min(v, 100 - v);
    if (!nearest || dist < nearest.dist) nearest = { key, dist };
  }
  return nearest?.key ?? null;
}
