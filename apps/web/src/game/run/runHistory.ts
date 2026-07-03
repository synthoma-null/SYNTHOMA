import type { RunState, RunStatus, RunType } from './runTypes';

const STORAGE_KEY = 'synthoma_run_history_v1';

export interface RunHistoryEntry {
  runId: string;
  runType: RunType;
  status: RunStatus;
  playerName: string;
  nodesVisited: number;
  totalNodes: number;
  voidPressure: number;
  relics: string[];
  createdAt: string;
  endedAt: string;
}

export interface RunHistory {
  entries: RunHistoryEntry[];
  stats: {
    runsStarted: number;
    runsWon: number;
    runsLost: number;
    winsByType: Partial<Record<RunType, number>>;
    bestRunType: RunType | null;
  };
}

function emptyHistory(): RunHistory {
  return {
    entries: [],
    stats: {
      runsStarted: 0,
      runsWon: 0,
      runsLost: 0,
      winsByType: {},
      bestRunType: null,
    },
  };
}

export function loadRunHistory(): RunHistory {
  if (typeof window === 'undefined') return emptyHistory();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyHistory();
    const parsed = JSON.parse(raw) as RunHistory;
    if (!parsed || !Array.isArray(parsed.entries)) return emptyHistory();
    return parsed;
  } catch {
    return emptyHistory();
  }
}

export function saveRunHistory(history: RunHistory): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore storage errors
  }
}

export function recordRunStarted(run: RunState): RunHistory {
  const history = loadRunHistory();
  history.stats.runsStarted += 1;
  saveRunHistory(history);
  return history;
}

export function recordRunCompleted(run: RunState): RunHistory {
  const history = loadRunHistory();
  const player = run.players[0];
  const nodesVisited = run.map.nodes.filter((n) => n.visited).length;

  const entry: RunHistoryEntry = {
    runId: run.id,
    runType: run.runType,
    status: run.status,
    playerName: player?.name ?? 'Neznámý',
    nodesVisited,
    totalNodes: run.map.nodes.length,
    voidPressure: run.voidPressure,
    relics: [...run.relics],
    createdAt: run.createdAt,
    endedAt: new Date().toISOString(),
  };

  history.entries.unshift(entry);
  if (history.entries.length > 20) {
    history.entries = history.entries.slice(0, 20);
  }

  if (run.status === 'won') {
    history.stats.runsWon += 1;
    history.stats.winsByType[run.runType] = (history.stats.winsByType[run.runType] ?? 0) + 1;
  } else if (run.status === 'lost' || run.status === 'abandoned') {
    history.stats.runsLost += 1;
  }

  // Best run type = type with most wins, ties prefer latest entry
  const wins = history.stats.winsByType;
  let best: RunType | null = null;
  let bestCount = -1;
  for (const [type, count] of Object.entries(wins)) {
    if ((count ?? 0) > bestCount) {
      bestCount = count ?? 0;
      best = type as RunType;
    }
  }
  history.stats.bestRunType = bestCount > 0 ? best : null;

  saveRunHistory(history);
  return history;
}

export function clearRunHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
