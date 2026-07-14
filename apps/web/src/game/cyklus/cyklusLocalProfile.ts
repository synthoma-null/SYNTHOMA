import { getCardById } from './cyklusEngine';
import { computeProfile } from './cyklusProfile';
import { loadDiscovery } from './cyklusDiscovery';
import { loadCyklusRun, loadCyklusRunHistory } from './cyklusStorage';
import type { CardChoice, CyklusChoiceRecord, CyklusRunState, StatKey } from './cyklusTypes';

export const LOCAL_SUBJECT_PROFILE_KEY = 'synthoma_cyklus_local_profile_v1';
export const LOCAL_SUBJECT_PROFILE_VERSION = 1;
export const LOCAL_DECISION_LIMIT = 200;

const STAT_KEYS: StatKey[] = ['energy', 'memory', 'bond', 'control'];

export interface LocalDecisionRecord {
  cardId: string;
  direction: CardChoice;
  timestamp: number;
  runId: string;
  cycle: number;
  resultingStats: Record<StatKey, number>;
  outcomeId?: string;
}

export interface LocalSubjectProfileStore {
  version: typeof LOCAL_SUBJECT_PROFILE_VERSION;
  decisions: LocalDecisionRecord[];
}

export interface LocalSubjectProfileSnapshot {
  state: 'local-empty' | 'local-active';
  decisions: LocalDecisionRecord[];
  latestDecisions: Array<LocalDecisionRecord & { cardTitle: string; choiceLabel: string }>;
  stats: Record<StatKey, number> | null;
  completedRuns: number;
  lastCycle: number;
  discoveredCards: number;
  discoveredFragments: number;
  lastActivityAt: number | null;
  psyche: { dominantLabel: string; archetype: string; stability: number } | null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parseStats(value: unknown): Record<StatKey, number> | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as Record<string, unknown>;
  if (!STAT_KEYS.every((key) => isFiniteNumber(source[key]))) return null;
  return Object.fromEntries(STAT_KEYS.map((key) => [key, Math.max(0, Math.min(100, source[key] as number))])) as Record<StatKey, number>;
}

function parseDecision(value: unknown): LocalDecisionRecord | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as Record<string, unknown>;
  const direction = source.direction ?? source.choiceId;
  const timestamp = source.timestamp ?? source.ts;
  const runId = source.runId ?? source.runIdentifier;
  const resultingStats = parseStats(source.resultingStats ?? source.statsAfter);
  if (
    typeof source.cardId !== 'string'
    || (direction !== 'yes' && direction !== 'no')
    || !isFiniteNumber(timestamp)
    || typeof runId !== 'string'
    || !isFiniteNumber(source.cycle)
    || !resultingStats
  ) return null;
  return {
    cardId: source.cardId,
    direction,
    timestamp,
    runId,
    cycle: Math.max(0, Math.floor(source.cycle)),
    resultingStats,
    ...(typeof source.outcomeId === 'string' ? { outcomeId: source.outcomeId } : {}),
  };
}

function fromChoiceRecord(record: CyklusChoiceRecord, runId: string): LocalDecisionRecord | null {
  return parseDecision({
    cardId: record.cardId,
    direction: record.direction,
    timestamp: record.ts,
    runId,
    cycle: record.cycle,
    resultingStats: record.statsAfter,
    outcomeId: `${record.cardId}:${record.direction}`,
  });
}

function saveStore(store: LocalSubjectProfileStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_SUBJECT_PROFILE_KEY, JSON.stringify(store));
  } catch {
    // The local profile is a convenience layer; gameplay must survive storage denial.
  }
}

function migrateLegacyRun(): LocalDecisionRecord[] {
  const run = loadCyklusRun();
  if (!run || !Array.isArray(run.history)) return [];
  return run.history
    .map((record) => fromChoiceRecord(record, run.id))
    .filter((record): record is LocalDecisionRecord => record !== null)
    .slice(-LOCAL_DECISION_LIMIT);
}

export function loadLocalSubjectProfileStore(): LocalSubjectProfileStore {
  const empty: LocalSubjectProfileStore = { version: LOCAL_SUBJECT_PROFILE_VERSION, decisions: [] };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = localStorage.getItem(LOCAL_SUBJECT_PROFILE_KEY);
    if (!raw) {
      const decisions = migrateLegacyRun();
      const migrated = { ...empty, decisions };
      if (decisions.length > 0) saveStore(migrated);
      return migrated;
    }
    const parsed = JSON.parse(raw) as { version?: unknown; decisions?: unknown } | unknown[];
    const candidates = Array.isArray(parsed)
      ? parsed
      : (parsed && typeof parsed === 'object' && Array.isArray(parsed.decisions) ? parsed.decisions : []);
    const decisions = candidates
      .map(parseDecision)
      .filter((record): record is LocalDecisionRecord => record !== null)
      .slice(-LOCAL_DECISION_LIMIT);
    const normalized = { ...empty, decisions };
    if (!Array.isArray(parsed) && parsed.version === LOCAL_SUBJECT_PROFILE_VERSION && decisions.length === candidates.length) return normalized;
    saveStore(normalized);
    return normalized;
  } catch {
    return empty;
  }
}

export function recordLocalCyklusDecision(previous: CyklusRunState, next: CyklusRunState, direction: CardChoice): LocalDecisionRecord | null {
  const choice = next.history[next.history.length - 1];
  if (!choice || choice.cardId !== previous.currentCardId || choice.direction !== direction) return null;
  const decision = fromChoiceRecord(choice, next.id);
  if (!decision) return null;
  const store = loadLocalSubjectProfileStore();
  const duplicate = store.decisions.some((entry) => entry.runId === decision.runId && entry.timestamp === decision.timestamp && entry.cardId === decision.cardId);
  if (!duplicate) saveStore({ ...store, decisions: [...store.decisions, decision].slice(-LOCAL_DECISION_LIMIT) });
  return decision;
}

export function loadLocalSubjectProfile(): LocalSubjectProfileSnapshot {
  const store = loadLocalSubjectProfileStore();
  const run = loadCyklusRun();
  const summaries = loadCyklusRunHistory();
  const discovery = loadDiscovery();
  const latest = store.decisions[store.decisions.length - 1];
  const stats = run?.stats ?? latest?.resultingStats ?? null;
  const fragmentIds = new Set([...discovery.items, ...discovery.imprints, ...discovery.findings]);
  const lastSummary = summaries[summaries.length - 1];
  const lastActivityAt = Math.max(latest?.timestamp ?? 0, run?.updatedAt ?? 0, lastSummary?.endedAt ?? 0) || null;
  const psyche = run && run.totalChoices > 0 ? computeProfile(run) : null;
  const latestDecisions = store.decisions.slice(-10).reverse().map((decision) => {
    const card = getCardById(decision.cardId);
    return {
      ...decision,
      cardTitle: card?.title ?? `Záznam ${decision.cardId}`,
      choiceLabel: decision.direction === 'yes' ? (card?.yesLabel ?? 'ANO') : (card?.noLabel ?? 'NE'),
    };
  });
  const hasData = Boolean(run || summaries.length || store.decisions.length || discovery.cards.length || fragmentIds.size);
  return {
    state: hasData ? 'local-active' : 'local-empty',
    decisions: store.decisions,
    latestDecisions,
    stats,
    completedRuns: summaries.length,
    lastCycle: Math.max(run?.cycle ?? 0, lastSummary?.cyclesSurvived ?? 0),
    discoveredCards: new Set(discovery.cards).size,
    discoveredFragments: fragmentIds.size,
    lastActivityAt,
    psyche: psyche ? { dominantLabel: psyche.dominantLabel, archetype: psyche.archetype, stability: psyche.stability } : null,
  };
}
