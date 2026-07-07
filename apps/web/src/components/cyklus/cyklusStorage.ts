import type { CyklusRunState, CyklusRunSummary, CyklusTension } from '../../game/cyklus/cyklusTypes';
import type { CyklusDiscovery } from '../../game/cyklus/cyklusDiscovery';
import { loadDiscovery, saveDiscovery } from '../../game/cyklus/cyklusDiscovery';

const STORAGE_KEY = 'synthoma_cyklus_run_v1';
const HISTORY_KEY = 'synthoma_cyklus_history_v1';
const MAX_HISTORY = 50;

let serverSyncEnabled = true;

export function setServerSyncEnabled(enabled: boolean): void {
  serverSyncEnabled = enabled;
}

function migrateState(parsed: Partial<CyklusRunState>): CyklusRunState {
  if (!parsed.tension) {
    parsed.tension = { ...DEFAULT_TENSION };
  } else {
    parsed.tension = { ...DEFAULT_TENSION, ...parsed.tension };
  }
  if (!parsed.seed) parsed.seed = `migrated-${Date.now().toString(36)}`;
  if (parsed.rngStep === undefined) parsed.rngStep = 0;
  if (!parsed.unlockedCards) parsed.unlockedCards = [];
  if (!parsed.cycleSummaries) parsed.cycleSummaries = [];
  if (!parsed.freshMetaPools) parsed.freshMetaPools = [];
  if (!parsed.modifier) {
    parsed.modifier = {
      id: 'none',
      title: 'Standardní cyklus',
      description: 'Žádná anomálie nebyla zaznamenána.',
      tags: [],
    };
  }
  if (!parsed.goals) parsed.goals = [];
  if (parsed.lastItemActivationCycle === undefined) parsed.lastItemActivationCycle = 0;
  if (parsed.itemActivationCount === undefined) parsed.itemActivationCount = 0;
  if (parsed.itemActivationCountThisCycle === undefined) parsed.itemActivationCountThisCycle = 0;
  if (!parsed.activeContracts) parsed.activeContracts = [];
  if (parsed.preRunWarning === undefined) parsed.preRunWarning = null;
  if (parsed.preRunChoice === undefined) parsed.preRunChoice = null;
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
}

async function serverSave(
  state: CyklusRunState | null,
  history: CyklusRunSummary[],
  discovery: CyklusDiscovery,
  progression?: unknown,
): Promise<void> {
  if (!serverSyncEnabled || typeof window === 'undefined') return;
  try {
    const payload: Record<string, unknown> = { state, history, discovery };
    if (progression !== undefined) {
      payload.progression = progression;
    }
    await fetch('/api/me/cyklus', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // ignore network errors; localStorage remains as fallback
  }
}

export async function serverSaveProgression(progression: unknown): Promise<void> {
  if (!serverSyncEnabled || typeof window === 'undefined') return;
  try {
    await fetch('/api/me/cyklus', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progression }),
    });
  } catch {
    // ignore
  }
}

export async function loadServerCyklusRun(): Promise<{
  state: CyklusRunState | null;
  history: CyklusRunSummary[];
  discovery: CyklusDiscovery | null;
  progression: unknown;
} | null> {
  if (!serverSyncEnabled || typeof window === 'undefined') return null;
  try {
    const res = await fetch('/api/me/cyklus', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      state: data.state ? migrateState(data.state as Partial<CyklusRunState>) : null,
      history: Array.isArray(data.history) ? data.history : [],
      discovery: data.discovery ?? null,
      progression: data.progression ?? null,
    };
  } catch {
    return null;
  }
}

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

export async function saveCyklusRun(state: CyklusRunState): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
  const history = loadCyklusRunHistory();
  const discovery = loadDiscovery();
  await serverSave(state, history, discovery);
}

export function loadCyklusRun(): CyklusRunState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CyklusRunState>;
    return migrateState(parsed);
  } catch {
    return null;
  }
}

export async function clearCyklusRun(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  if (serverSyncEnabled) {
    try {
      await fetch('/api/me/cyklus', { method: 'DELETE' });
    } catch {
      // ignore
    }
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

export async function saveCyklusRunHistory(history: CyklusRunSummary[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = history.slice(-MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore storage errors
  }
  const state = loadCyklusRun();
  const discovery = loadDiscovery();
  await serverSave(state, history, discovery);
}

export async function appendCyklusRunSummary(summary: CyklusRunSummary): Promise<void> {
  if (typeof window === 'undefined') return;
  const history = loadCyklusRunHistory();
  history.push(summary);
  await saveCyklusRunHistory(history);
}

const TUTORIAL_KEY = 'synthoma_cyklus_tutorial_seen';
const TUTORIAL_V2_KEY = 'synthoma_cyklus_tutorial_v2_seen';

export function isTutorialSeen(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(TUTORIAL_KEY) === 'true' || localStorage.getItem(TUTORIAL_V2_KEY) === '1';
  } catch {
    return false;
  }
}

export function isTutorialV2Seen(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(TUTORIAL_V2_KEY) === '1';
  } catch {
    return false;
  }
}

export function setTutorialSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TUTORIAL_KEY, 'true');
  } catch {
    // ignore
  }
}

export function setTutorialV2Seen(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TUTORIAL_V2_KEY, '1');
  } catch {
    // ignore
  }
}

export function clearTutorialSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TUTORIAL_KEY);
    localStorage.removeItem(TUTORIAL_V2_KEY);
  } catch {
    // ignore
  }
}

export function clearCyklusRunHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}
