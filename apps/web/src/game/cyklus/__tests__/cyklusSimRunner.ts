/**
 * SYNTHOMA: CYKLUS — Simulation Runner
 *
 * Runs N automated runs with seeded yes/no choices and collects balance data.
 * Usage: import { runSimulation } from './cyklusSimRunner'
 *        or call runSimulationAndPrint() directly.
 */

import {
  createCyklusRun,
  resolveChoice,
  pickNextCardState,
  computeStabilizationVariant,
  computeStabilizationProgress,
  summarizeRun,
  getTopScoredCards,
} from '../cyklusEngine';
import { CYKLUS_CARDS } from '../cyklusCards';
import { evaluateFindings } from '../cyklusFindings';
import type { CyklusRunState, StatKey } from '../cyklusTypes';

// ── CONFIG ────────────────────────────────────────────────────────────────────

export const SIM_DEFAULTS = {
  runs: 1000,
  safetyLimit: 200,
  seed: 'sim-base',
};

// ── SEEDED RANDOM ─────────────────────────────────────────────────────────────

function simRandom(seed: string, step: number): number {
  let hash = 0;
  const s = `${seed}-${step}`;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) / 2147483647;
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface SimRunResult {
  runIndex: number;
  status: 'dead' | 'completed' | 'timeout';
  totalChoices: number;
  cyclesSurvived: number;
  deathStat?: StatKey | undefined;
  deathExtreme?: 'low' | 'high' | undefined;
  finalStats: Record<StatKey, number>;
  usedCardIds: string[];
  unlockedPools: string[];
  imprints: string[];
  visitedSectors: string[];
  stabilizationVariant?: string | undefined;
  stabilizationBlockers: string[];
  findingsEarned: string[];
  metaUnlocksEarned: string[];
}

export interface SimReport {
  totalRuns: number;
  deaths: number;
  completions: number;
  timeouts: number;
  avgChoices: number;
  avgCycles: number;
  deathStatDistribution: Record<string, number>;
  deathExtremeDistribution: Record<string, number>;
  finalStatAverages: Record<StatKey, number>;
  stabilizationVariantDistribution: Record<string, number>;
  stabilizationBlockerCounts: Record<string, number>;
  cardUsageCounts: Record<string, number>;
  topCards: Array<{ id: string; count: number }>;
  neverSeenCards: string[];
  scheduledOnlyNeverSeen: string[];
  unlockedPoolNeverSeen: string[];
  poolUnlockCounts: Record<string, number>;
  deadPools: string[];
  findingUnlockCounts: Record<string, number>;
  metaUnlockCounts: Record<string, number>;
}

// ── SINGLE RUN SIMULATION ─────────────────────────────────────────────────────

export function simulateSingleRun(runIndex: number, safetyLimit = SIM_DEFAULTS.safetyLimit): SimRunResult {
  let state: CyklusRunState = createCyklusRun(true);
  // Override seed for determinism
  state = { ...state, seed: `sim-${runIndex}`, rngStep: 0 };
  state = pickNextCardState(state);

  let step = 0;

  while (state.status === 'playing' && step < safetyLimit) {
    const roll = simRandom(`sim-${runIndex}`, step);
    const direction: 'yes' | 'no' = roll > 0.5 ? 'yes' : 'no';
    state = resolveChoice(state, direction);
    if (state.status === 'playing') {
      state = pickNextCardState(state);
    }
    step++;
  }

  const timedOut = state.status === 'playing';
  if (timedOut) {
    state = { ...state, status: 'dead' };
  }

  // Compute stabilization blockers
  const progress = computeStabilizationProgress(state);
  const blockers: string[] = [];
  if (!progress.survivedRestart) blockers.push('restart_5_missing');
  if (progress.imprints < progress.imprintsNeeded) blockers.push('not_enough_imprints');
  if (progress.sectors < progress.sectorsNeeded) blockers.push('not_enough_sectors');
  if (!progress.statsStable) blockers.push('stats_unstable');

  // Stabilization variant (only if completed)
  let stabilizationVariant: string | undefined;
  if (state.status === 'completed') {
    stabilizationVariant = computeStabilizationVariant(state).id;
  }

  // Findings
  const findings = evaluateFindings(state);
  const findingsEarned = findings.map((f) => f.id);

  // Detect death stat/extreme from summary
  const summary = summarizeRun(state);
  let deathStat: StatKey | undefined = summary.deathStat;
  let deathExtreme: 'low' | 'high' | undefined;
  if (deathStat) {
    deathExtreme = state.stats[deathStat] <= 0 ? 'low' : 'high';
  }

  return {
    runIndex,
    status: timedOut ? 'timeout' : (state.status as 'dead' | 'completed'),
    totalChoices: step,
    cyclesSurvived: state.cycle,
    deathStat,
    deathExtreme,
    finalStats: { ...state.stats },
    usedCardIds: [...state.usedCardIds],
    unlockedPools: [...state.unlockedPools],
    imprints: [...state.imprints],
    visitedSectors: [...state.visitedSectors],
    stabilizationVariant,
    stabilizationBlockers: blockers,
    findingsEarned,
    metaUnlocksEarned: [],
  };
}

// ── AGGREGATE REPORT ──────────────────────────────────────────────────────────

export function runSimulation(count = SIM_DEFAULTS.runs, safetyLimit = SIM_DEFAULTS.safetyLimit): SimReport {
  const results: SimRunResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(simulateSingleRun(i, safetyLimit));
  }
  return aggregateResults(results);
}

export function aggregateResults(results: SimRunResult[]): SimReport {
  const total = results.length;
  const deaths = results.filter((r) => r.status === 'dead').length;
  const completions = results.filter((r) => r.status === 'completed').length;
  const timeouts = results.filter((r) => r.status === 'timeout').length;

  const avgChoices = results.reduce((s, r) => s + r.totalChoices, 0) / total;
  const avgCycles = results.reduce((s, r) => s + r.cyclesSurvived, 0) / total;

  // Death stat distribution
  const deathStatDistribution: Record<string, number> = {};
  const deathExtremeDistribution: Record<string, number> = {};
  for (const r of results) {
    if (r.deathStat) {
      deathStatDistribution[r.deathStat] = (deathStatDistribution[r.deathStat] ?? 0) + 1;
    }
    if (r.deathExtreme) {
      const key = `${r.deathStat}_${r.deathExtreme}`;
      deathExtremeDistribution[key] = (deathExtremeDistribution[key] ?? 0) + 1;
    }
  }

  // Final stat averages
  const statKeys: StatKey[] = ['energy', 'memory', 'bond', 'control'];
  const finalStatAverages = {} as Record<StatKey, number>;
  for (const key of statKeys) {
    finalStatAverages[key] = results.reduce((s, r) => s + r.finalStats[key], 0) / total;
  }

  // Card usage counts
  const cardUsageCounts: Record<string, number> = {};
  for (const r of results) {
    for (const id of r.usedCardIds) {
      cardUsageCounts[id] = (cardUsageCounts[id] ?? 0) + 1;
    }
  }

  // Top 20 cards
  const topCards = Object.entries(cardUsageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([id, count]) => ({ id, count }));

  // Never seen cards
  const allCardIds = Object.keys(CYKLUS_CARDS);
  const seenCardIds = new Set(Object.keys(cardUsageCounts));
  const neverSeenCards = allCardIds.filter((id) => !seenCardIds.has(id));

  // scheduledOnly cards that never appeared
  const scheduledOnlyNeverSeen = allCardIds.filter(
    (id) => CYKLUS_CARDS[id]?.triggerMode === 'scheduledOnly' && !seenCardIds.has(id),
  );

  // unlockedPool condition cards that never appeared
  const unlockedPoolNeverSeen = allCardIds.filter((id) => {
    const card = CYKLUS_CARDS[id];
    if (!card) return false;
    const hasUnlockedPoolCondition = card.conditions?.some((c) => c.type === 'unlockedPool');
    return hasUnlockedPoolCondition && !seenCardIds.has(id);
  });

  // Pool unlock counts
  const poolUnlockCounts: Record<string, number> = {};
  for (const r of results) {
    for (const poolId of r.unlockedPools) {
      poolUnlockCounts[poolId] = (poolUnlockCounts[poolId] ?? 0) + 1;
    }
  }

  // Dead pools — cards with unlockedPool condition whose pool never unlocked
  const allConditionPools = new Set<string>();
  for (const id of allCardIds) {
    const card = CYKLUS_CARDS[id];
    card?.conditions?.forEach((c) => {
      if (c.type === 'unlockedPool' && c.poolId) allConditionPools.add(c.poolId);
    });
  }
  const deadPools = [...allConditionPools].filter((p) => !poolUnlockCounts[p]);

  // Stabilization blocker counts
  const stabilizationBlockerCounts: Record<string, number> = {};
  for (const r of results) {
    if (r.status !== 'completed') {
      for (const b of r.stabilizationBlockers) {
        stabilizationBlockerCounts[b] = (stabilizationBlockerCounts[b] ?? 0) + 1;
      }
    }
  }

  // Stabilization variant distribution
  const stabilizationVariantDistribution: Record<string, number> = {};
  for (const r of results) {
    if (r.stabilizationVariant) {
      stabilizationVariantDistribution[r.stabilizationVariant] =
        (stabilizationVariantDistribution[r.stabilizationVariant] ?? 0) + 1;
    }
  }

  // Finding unlock counts
  const findingUnlockCounts: Record<string, number> = {};
  for (const r of results) {
    for (const id of r.findingsEarned) {
      findingUnlockCounts[id] = (findingUnlockCounts[id] ?? 0) + 1;
    }
  }

  // Meta unlock counts (placeholder — meta unlocks come from localStorage, skip in headless sim)
  const metaUnlockCounts: Record<string, number> = {};

  return {
    totalRuns: total,
    deaths,
    completions,
    timeouts,
    avgChoices: Math.round(avgChoices * 10) / 10,
    avgCycles: Math.round(avgCycles * 10) / 10,
    deathStatDistribution,
    deathExtremeDistribution,
    finalStatAverages: Object.fromEntries(
      Object.entries(finalStatAverages).map(([k, v]) => [k, Math.round(v * 10) / 10]),
    ) as Record<StatKey, number>,
    stabilizationVariantDistribution,
    stabilizationBlockerCounts,
    cardUsageCounts,
    topCards,
    neverSeenCards,
    scheduledOnlyNeverSeen,
    unlockedPoolNeverSeen,
    poolUnlockCounts,
    deadPools,
    findingUnlockCounts,
    metaUnlockCounts,
  };
}

// ── PRINT REPORT ──────────────────────────────────────────────────────────────

export function formatSimReport(report: SimReport): string {
  const pct = (n: number) => `${Math.round((n / report.totalRuns) * 100)}%`;
  const lines: string[] = [];

  lines.push('════════════════════════════════════════════════════════');
  lines.push('  SYNTHOMA: CYKLUS — SIMULATION REPORT');
  lines.push(`  ${report.totalRuns} runs · safety limit per run applied`);
  lines.push('════════════════════════════════════════════════════════');

  lines.push('');
  lines.push('── OUTCOMES ──');
  lines.push(`  Deaths:        ${report.deaths} (${pct(report.deaths)})`);
  lines.push(`  Completions:   ${report.completions} (${pct(report.completions)})`);
  lines.push(`  Timeouts:      ${report.timeouts} (${pct(report.timeouts)})`);
  lines.push(`  Avg choices:   ${report.avgChoices}`);
  lines.push(`  Avg cycles:    ${report.avgCycles}`);

  lines.push('');
  lines.push('── DEATH STATS ──');
  for (const [key, count] of Object.entries(report.deathStatDistribution).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${key.padEnd(12)} ${count} (${pct(count)})`);
  }

  lines.push('');
  lines.push('── DEATH EXTREMES ──');
  for (const [key, count] of Object.entries(report.deathExtremeDistribution).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${key.padEnd(20)} ${count} (${pct(count)})`);
  }

  lines.push('');
  lines.push('── FINAL STAT AVERAGES ──');
  for (const [key, val] of Object.entries(report.finalStatAverages)) {
    lines.push(`  ${key.padEnd(12)} ${val}`);
  }

  lines.push('');
  lines.push('── STABILIZATION BLOCKERS (non-completed runs) ──');
  const nonCompleted = report.totalRuns - report.completions;
  for (const [key, count] of Object.entries(report.stabilizationBlockerCounts).sort((a, b) => b[1] - a[1])) {
    const pctOfNonCompleted = nonCompleted > 0 ? `${Math.round((count / nonCompleted) * 100)}%` : '—';
    lines.push(`  ${key.padEnd(30)} ${count} (${pctOfNonCompleted} of non-completed)`);
  }

  lines.push('');
  lines.push('── STABILIZATION VARIANTS ──');
  for (const [key, count] of Object.entries(report.stabilizationVariantDistribution).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${key.padEnd(20)} ${count}`);
  }

  lines.push('');
  lines.push('── TOP 20 CARDS ──');
  for (const { id, count } of report.topCards) {
    lines.push(`  ${id.padEnd(40)} ${count}`);
  }

  lines.push('');
  lines.push(`── NEVER SEEN CARDS (${report.neverSeenCards.length}) ──`);
  if (report.neverSeenCards.length === 0) {
    lines.push('  (all cards appeared at least once)');
  } else {
    for (const id of report.neverSeenCards) {
      const card = CYKLUS_CARDS[id];
      const cond = card?.conditions?.map((c) => c.type).join(',') ?? '—';
      lines.push(`  ${id.padEnd(40)} conditions: ${cond}`);
    }
  }

  lines.push('');
  lines.push(`── UNLOCKEDPOOL CARDS NEVER SEEN (${report.unlockedPoolNeverSeen.length}) ──`);
  for (const id of report.unlockedPoolNeverSeen) {
    const card = CYKLUS_CARDS[id];
    const pools = card?.conditions?.filter((c) => c.type === 'unlockedPool').map((c) => c.poolId).join(',') ?? '?';
    lines.push(`  ${id.padEnd(40)} poolId: ${pools}`);
  }

  lines.push('');
  lines.push(`── DEAD POOLS (condition exists but pool never unlocked, ${report.deadPools.length}) ──`);
  for (const p of report.deadPools) {
    lines.push(`  ${p}`);
  }

  lines.push('');
  lines.push('── POOL UNLOCK COUNTS ──');
  for (const [id, count] of Object.entries(report.poolUnlockCounts).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${id.padEnd(35)} ${count} (${pct(count)})`);
  }

  lines.push('');
  lines.push('── DIAGNOSTIC FINDING UNLOCK COUNTS ──');
  if (Object.keys(report.findingUnlockCounts).length === 0) {
    lines.push('  (none earned in simulation)');
  }
  for (const [id, count] of Object.entries(report.findingUnlockCounts).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${id.padEnd(30)} ${count} (${pct(count)})`);
  }

  lines.push('');
  lines.push('════════════════════════════════════════════════════════');

  return lines.join('\n');
}

export function runSimulationAndPrint(count = SIM_DEFAULTS.runs): SimReport {
  const report = runSimulation(count);
  console.log(formatSimReport(report));
  return report;
}
