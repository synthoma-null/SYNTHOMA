import type { CyklusRunState } from './cyklusTypes';
import { hasCyklusCardArt } from './cyklusCardPresentation';

const DISCOVERY_KEY = 'synthoma_cyklus_discovery';
const recordedViewKeys = new Set<string>();

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

export function normalizeDiscovery(value: Partial<CyklusDiscovery> | null | undefined): CyklusDiscovery {
  const strings = (input: unknown) => Array.isArray(input) ? [...new Set(input.filter((item): item is string => typeof item === 'string'))] : [];
  const cardRecords: NonNullable<CyklusDiscovery['cardRecords']> = {};
  if (value?.cardRecords && typeof value.cardRecords === 'object') {
    for (const [cardId, rawRecord] of Object.entries(value.cardRecords)) {
      if (!hasCyklusCardArt(cardId) || !rawRecord || typeof rawRecord !== 'object') continue;
      const record = rawRecord as Record<string, unknown>;
      if (![record.firstSeenAt, record.lastSeenAt, record.seenCount].every((entry) => typeof entry === 'number' && Number.isFinite(entry) && entry >= 0)) continue;
      cardRecords[cardId] = {
        firstSeenAt: record.firstSeenAt as number,
        lastSeenAt: record.lastSeenAt as number,
        seenCount: Math.max(1, Math.floor(record.seenCount as number)),
      };
    }
  }
  return {
    cards: strings(value?.cards),
    sectors: strings(value?.sectors),
    items: strings(value?.items),
    imprints: strings(value?.imprints),
    endings: strings(value?.endings),
    variants: strings(value?.variants),
    findings: strings(value?.findings),
    cardRecords,
  };
}

export function loadDiscovery(): CyklusDiscovery {
  if (typeof window === 'undefined') return getEmptyDiscovery();
  try {
    const raw = localStorage.getItem(DISCOVERY_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<CyklusDiscovery>) : getEmptyDiscovery();
    return normalizeDiscovery(parsed);
  } catch { return getEmptyDiscovery(); }
}

export function saveDiscovery(discovery: CyklusDiscovery): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISCOVERY_KEY, JSON.stringify(discovery));
  } catch { /* ignore */ }
}

export function mergeDiscovery(primary: CyklusDiscovery, secondary: CyklusDiscovery): CyklusDiscovery {
  const left = normalizeDiscovery(primary);
  const right = normalizeDiscovery(secondary);
  const add = (left: string[], right: string[]) => [...new Set([...left, ...right])];
  const cardRecords: NonNullable<CyklusDiscovery['cardRecords']> = { ...(left.cardRecords ?? {}) };
  for (const [cardId, incoming] of Object.entries(right.cardRecords ?? {})) {
    const current = cardRecords[cardId];
    cardRecords[cardId] = current ? {
      firstSeenAt: Math.min(current.firstSeenAt, incoming.firstSeenAt),
      lastSeenAt: Math.max(current.lastSeenAt, incoming.lastSeenAt),
      seenCount: Math.max(current.seenCount, incoming.seenCount),
    } : incoming;
  }
  return {
    cards: add(left.cards, right.cards),
    sectors: add(left.sectors, right.sectors),
    items: add(left.items, right.items),
    imprints: add(left.imprints, right.imprints),
    endings: add(left.endings, right.endings),
    variants: add(left.variants, right.variants),
    findings: add(left.findings, right.findings),
    cardRecords,
  };
}

export function recordCardDiscovery(
  cardId: string,
  options: { seenAt?: number; viewKey?: string; sync?: boolean } = {},
): CyklusDiscovery | null {
  if (!hasCyklusCardArt(cardId)) return null;
  const seenAt = options.seenAt ?? Date.now();
  const viewKey = options.viewKey ?? `${cardId}:${seenAt}`;
  if (recordedViewKeys.has(viewKey)) return loadDiscovery();
  recordedViewKeys.add(viewKey);
  const discovery = loadDiscovery();
  const existing = discovery.cardRecords?.[cardId];
  const next: CyklusDiscovery = {
    ...discovery,
    cards: discovery.cards.includes(cardId) ? discovery.cards : [...discovery.cards, cardId],
    cardRecords: {
      ...(discovery.cardRecords ?? {}),
      [cardId]: existing ? {
        firstSeenAt: existing.firstSeenAt,
        lastSeenAt: Math.max(existing.lastSeenAt, seenAt),
        seenCount: existing.seenCount + 1,
      } : { firstSeenAt: seenAt, lastSeenAt: seenAt, seenCount: 1 },
    },
  };
  saveDiscovery(next);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('synthoma:cyklus-card-discovery', { detail: { cardId } }));
  if (options.sync) void saveDiscoveryWithSync(next);
  return next;
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
