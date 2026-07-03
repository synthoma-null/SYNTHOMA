import type { CyklusRunState, CyklusRunSummary, CyklusTension } from './cyklusTypes';

const STORAGE_KEY = 'synthoma_cyklus_run_v1';
const HISTORY_KEY = 'synthoma_cyklus_history_v1';
const MAX_HISTORY = 50;

const DEFAULT_TENSION: CyklusTension = {
  calmStreak: 0,
  crisisStreak: 0,
  itemTriggerStreak: 0,
  sameSectorStreak: 0,
  rewardStreak: 0,
  entityStreak: 0,
  lastRewardAt: 0,
  lastEntityAt: 0,
};

export function saveCyklusRun(state: CyklusRunState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function loadCyklusRun(): CyklusRunState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CyklusRunState>;
    if (!parsed.tension) {
      parsed.tension = { ...DEFAULT_TENSION };
    } else {
      parsed.tension = { ...DEFAULT_TENSION, ...parsed.tension };
    }
    // Migration: new fields added in refactor
    if (!parsed.seed) parsed.seed = `migrated-${Date.now().toString(36)}`;
    if (parsed.rngStep === undefined) parsed.rngStep = 0;
    if (!parsed.unlockedCards) parsed.unlockedCards = [];
    if (!parsed.cycleSummaries) parsed.cycleSummaries = [];
    // Migration: history records missing new diff fields
    if (parsed.history) {
      parsed.history = parsed.history.map((r) => ({
        ...r,
        itemsLost: r.itemsLost ?? [],
        imprintsGained: r.imprintsGained ?? [],
        poolsUnlocked: r.poolsUnlocked ?? [],
        scheduledAdded: r.scheduledAdded ?? [],
        entityDelta: r.entityDelta ?? {},
      }));
    }
    return parsed as CyklusRunState;
  } catch {
    return null;
  }
}

export function clearCyklusRun(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasActiveCyklusRun(): boolean {
  const run = loadCyklusRun();
  return !!run && run.status === 'playing';
}

export function loadCyklusRunHistory(): CyklusRunSummary[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CyklusRunSummary[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCyklusRunHistory(history: CyklusRunSummary[]): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = history.slice(-MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore storage errors
  }
}

export function appendCyklusRunSummary(summary: CyklusRunSummary): void {
  if (typeof window === 'undefined') return;
  const history = loadCyklusRunHistory();
  history.push(summary);
  saveCyklusRunHistory(history);
}

export function clearCyklusRunHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}
