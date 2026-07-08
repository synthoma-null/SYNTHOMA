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
  getCardById,
} from '../cyklusEngine';
import { CYKLUS_CARDS } from '../content';
import { evaluateFindings, getDeathUnlocks, CYKLUS_FINDINGS } from '../cyklusFindings';
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
  modifierId: string;
  activeContracts: string[];
  itemActivationCount: number;
  goalsCompleted: number;
  goalCompletionIds: string[];
  overloadCards: string[];
  overloadAccepted: string[];
  overloadRefused: string[];
  comboCards: string[];
  comboTriggers: string[];
  contractAccepted: string[];
  contractCollectSeen: string[];
  deathAfterOverload: boolean;
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
  modifierDistribution: Record<string, number>;
  avgContracts: number;
  avgActivations: number;
  avgGoalsCompleted: number;
  overloadCardCounts: Record<string, number>;
  comboCardCounts: Record<string, number>;
  goalCompletionCounts: Record<string, number>;
  contractAcceptanceCounts: Record<string, number>;
  contractCollectCounts: Record<string, number>;
  comboTriggerCounts: Record<string, number>;
  overloadAcceptCounts: Record<string, number>;
  overloadRefuseCounts: Record<string, number>;
  deathAfterOverloadCount: number;
  overloadAcceptDeathRate: number;
}

// ── SINGLE RUN SIMULATION ─────────────────────────────────────────────────────

export function simulateSingleRun(runIndex: number, safetyLimit = SIM_DEFAULTS.safetyLimit): SimRunResult {
  let state: CyklusRunState = createCyklusRun(true);
  // Override seed for determinism
  state = { ...state, seed: `sim-${runIndex}`, rngStep: 0 };
  state = pickNextCardState(state);

  let step = 0;
  const overloadAccepted: string[] = [];
  const overloadRefused: string[] = [];
  const contractAccepted: string[] = [];
  const contractCollectSeen: string[] = [];
  const comboTriggers: string[] = [];

  while (state.status === 'playing' && step < safetyLimit) {
    const card = getCardById(state.currentCardId);
    const roll = simRandom(`sim-${runIndex}`, step);
    const direction: 'yes' | 'no' = roll > 0.5 ? 'yes' : 'no';
    const wasOverload = card?.tags.includes('overload') ?? false;
    const wasContract = card?.tags.includes('contract') ?? false;
    const wasCollect = card?.tags.includes('collect') ?? false;
    const previousComboCards = state.usedCardIds.filter((id) => CYKLUS_CARDS[id]?.tags.includes('combo'));
    state = resolveChoice(state, direction);
    if (wasOverload) {
      (direction === 'yes' ? overloadAccepted : overloadRefused).push(card!.id);
    }
    if (wasContract && direction === 'yes') {
      contractAccepted.push(card!.id);
    }
    if (wasCollect) {
      contractCollectSeen.push(card!.id);
    }
    const newComboCards = state.usedCardIds.filter((id) => CYKLUS_CARDS[id]?.tags.includes('combo') && !previousComboCards.includes(id));
    for (const id of newComboCards) {
      if (!comboTriggers.includes(id)) comboTriggers.push(id);
    }
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

  const overloadCards = state.usedCardIds.filter((id) => CYKLUS_CARDS[id]?.tags.includes('overload'));
  const comboCards = state.usedCardIds.filter((id) => CYKLUS_CARDS[id]?.tags.includes('combo'));
  const goalCompletionIds = state.goals.filter((g) => g.completed).map((g) => g.id);
  const deathAfterOverload = state.status === 'dead' && overloadCards.length > 0;

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
    modifierId: state.modifier.id,
    activeContracts: [...state.activeContracts],
    itemActivationCount: state.itemActivationCount,
    goalsCompleted: goalCompletionIds.length,
    goalCompletionIds,
    overloadCards,
    overloadAccepted,
    overloadRefused,
    comboCards,
    comboTriggers,
    contractAccepted,
    contractCollectSeen,
    deathAfterOverload,
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

  // New mechanics
  const modifierDistribution: Record<string, number> = {};
  const overloadCardCounts: Record<string, number> = {};
  const comboCardCounts: Record<string, number> = {};
  const goalCompletionCounts: Record<string, number> = {};
  const contractAcceptanceCounts: Record<string, number> = {};
  const contractCollectCounts: Record<string, number> = {};
  const comboTriggerCounts: Record<string, number> = {};
  const overloadAcceptCounts: Record<string, number> = {};
  const overloadRefuseCounts: Record<string, number> = {};
  let totalContracts = 0;
  let totalActivations = 0;
  let totalGoalsCompleted = 0;
  let deathAfterOverloadCount = 0;
  let overloadAcceptWithDeath = 0;
  for (const r of results) {
    modifierDistribution[r.modifierId] = (modifierDistribution[r.modifierId] ?? 0) + 1;
    totalContracts += r.activeContracts.length;
    totalActivations += r.itemActivationCount;
    totalGoalsCompleted += r.goalsCompleted;
    for (const id of r.overloadCards) {
      overloadCardCounts[id] = (overloadCardCounts[id] ?? 0) + 1;
    }
    for (const id of r.comboCards) {
      comboCardCounts[id] = (comboCardCounts[id] ?? 0) + 1;
    }
    for (const id of r.goalCompletionIds) {
      goalCompletionCounts[id] = (goalCompletionCounts[id] ?? 0) + 1;
    }
    for (const id of r.contractAccepted) {
      contractAcceptanceCounts[id] = (contractAcceptanceCounts[id] ?? 0) + 1;
    }
    for (const id of r.contractCollectSeen) {
      contractCollectCounts[id] = (contractCollectCounts[id] ?? 0) + 1;
    }
    for (const id of r.comboTriggers) {
      comboTriggerCounts[id] = (comboTriggerCounts[id] ?? 0) + 1;
    }
    for (const id of r.overloadAccepted) {
      overloadAcceptCounts[id] = (overloadAcceptCounts[id] ?? 0) + 1;
    }
    for (const id of r.overloadRefused) {
      overloadRefuseCounts[id] = (overloadRefuseCounts[id] ?? 0) + 1;
    }
    if (r.deathAfterOverload) deathAfterOverloadCount++;
    if (r.overloadAccepted.length > 0 && r.status === 'dead') overloadAcceptWithDeath++;
  }

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
    modifierDistribution,
    avgContracts: Math.round((totalContracts / total) * 10) / 10,
    avgActivations: Math.round((totalActivations / total) * 10) / 10,
    avgGoalsCompleted: Math.round((totalGoalsCompleted / total) * 10) / 10,
    overloadCardCounts,
    comboCardCounts,
    goalCompletionCounts,
    contractAcceptanceCounts,
    contractCollectCounts,
    comboTriggerCounts,
    overloadAcceptCounts,
    overloadRefuseCounts,
    deathAfterOverloadCount,
    overloadAcceptDeathRate: Math.round((overloadAcceptWithDeath / Math.max(1, results.reduce((s, r) => s + r.overloadAccepted.length, 0))) * 100),
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
  lines.push('── NEW MECHANICS ──');
  lines.push(`  Avg contracts per run:       ${report.avgContracts}`);
  lines.push(`  Avg item activations:        ${report.avgActivations}`);
  lines.push(`  Avg goals completed:         ${report.avgGoalsCompleted}`);
  lines.push('');
  lines.push('  Modifier distribution:');
  for (const [id, count] of Object.entries(report.modifierDistribution).sort((a, b) => b[1] - a[1])) {
    lines.push(`    ${id.padEnd(20)} ${count} (${pct(count)})`);
  }
  if (Object.keys(report.goalCompletionCounts).length > 0) {
    lines.push('');
    lines.push('  Goal completion rate:');
    for (const [id, count] of Object.entries(report.goalCompletionCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`    ${id.padEnd(25)} ${count} (${pct(count)})`);
    }
  }
  if (Object.keys(report.contractAcceptanceCounts).length > 0) {
    lines.push('');
    lines.push('  Contract acceptance rate:');
    for (const [id, count] of Object.entries(report.contractAcceptanceCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`    ${id.padEnd(25)} ${count} (${pct(count)})`);
    }
  }
  if (Object.keys(report.contractCollectCounts).length > 0) {
    lines.push('');
    lines.push('  Contract collect appearance:');
    for (const [id, count] of Object.entries(report.contractCollectCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`    ${id.padEnd(25)} ${count} (${pct(count)})`);
    }
  }
  if (Object.keys(report.comboTriggerCounts).length > 0) {
    lines.push('');
    lines.push('  Combo trigger rate:');
    for (const [id, count] of Object.entries(report.comboTriggerCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`    ${id.padEnd(25)} ${count} (${pct(count)})`);
    }
  }
  if (Object.keys(report.overloadAcceptCounts).length > 0 || Object.keys(report.overloadRefuseCounts).length > 0) {
    lines.push('');
    lines.push('  Overload accept / refuse rate:');
    for (const [id, count] of Object.entries(report.overloadAcceptCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`    ${(id + ' accept').padEnd(25)} ${count} (${pct(count)})`);
    }
    for (const [id, count] of Object.entries(report.overloadRefuseCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`    ${(id + ' refuse').padEnd(25)} ${count} (${pct(count)})`);
    }
    lines.push(`    ${'Death after overload'.padEnd(25)} ${report.deathAfterOverloadCount} (${pct(report.deathAfterOverloadCount)})`);
    lines.push(`    ${'Death after overload accept'.padEnd(25)} ${report.overloadAcceptDeathRate}%`);
  }
  if (Object.keys(report.overloadCardCounts).length > 0) {
    lines.push('');
    lines.push('  Overload cards seen:');
    for (const [id, count] of Object.entries(report.overloadCardCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`    ${id.padEnd(25)} ${count} (${pct(count)})`);
    }
  }
  if (Object.keys(report.comboCardCounts).length > 0) {
    lines.push('');
    lines.push('  Combo cards seen:');
    for (const [id, count] of Object.entries(report.comboCardCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`    ${id.padEnd(25)} ${count} (${pct(count)})`);
    }
  }

  lines.push('');
  lines.push('════════════════════════════════════════════════════════');

  return lines.join('\n');
}

export function runSimulationAndPrint(count = SIM_DEFAULTS.runs): SimReport {
  const report = runSimulation(count);
  console.warn(formatSimReport(report));
  return report;
}

// ── CAMPAIGN SIMULATION ───────────────────────────────────────────────────────

export interface CampaignRunSlot {
  runIndexInCampaign: number;
  status: 'dead' | 'completed' | 'timeout';
  totalChoices: number;
  deathStat?: StatKey | undefined;
  deathExtreme?: 'low' | 'high' | undefined;
  metaPoolsActive: string[];
  metaCardsAppeared: string[];
  newMetaPoolsUnlocked: string[];
}

export interface CampaignReport {
  campaigns: number;
  runsPerCampaign: number;
  completionByRunIndex: number[];
  deathByRunIndex: number[];
  metaCardAppearancesByRunIndex: number[];
  totalMetaPoolsEverUnlocked: Record<string, number>;
  deadMetaPoolsByEndOfCampaign: number;
  avgMetaCardsAppearedPerRun: number;
  avgFreshMetaCardsPerRun: number;
  freshPoolsUnseenAfterRun1: number;
  completionRateEarlyRuns: number;
  completionRateLateRuns: number;
}

function collectMetaPools(state: CyklusRunState): string[] {
  const pools: string[] = [];
  const summary = summarizeRun(state);
  const deathStat = summary.deathStat;
  if (deathStat) {
    const extreme = state.stats[deathStat] <= 0 ? 'low' : 'high';
    const unlocks = getDeathUnlocks(deathStat, extreme);
    for (const u of unlocks) {
      if (u.unlockPool) pools.push(u.unlockPool);
    }
  }
  const findings = evaluateFindings(state);
  for (const f of findings) {
    if (f.reward?.unlockPool) pools.push(f.reward.unlockPool);
  }
  return pools;
}

export function simulateSingleRunWithMeta(
  seed: string,
  safetyLimit: number,
  metaPools: string[],
): { result: SimRunResult; newMetaPools: string[] } {
  let state: CyklusRunState = createCyklusRun(true);
  state = { ...state, seed, rngStep: 0, unlockedPools: [...state.unlockedPools, ...metaPools], freshMetaPools: [...metaPools] };
  state = pickNextCardState(state);

  let step = 0;
  while (state.status === 'playing' && step < safetyLimit) {
    const roll = simRandom(seed, step);
    const direction: 'yes' | 'no' = roll > 0.5 ? 'yes' : 'no';
    state = resolveChoice(state, direction);
    if (state.status === 'playing') state = pickNextCardState(state);
    step++;
  }

  const timedOut = state.status === 'playing';
  if (timedOut) state = { ...state, status: 'dead' };

  const progress = computeStabilizationProgress(state);
  const blockers: string[] = [];
  if (!progress.survivedRestart) blockers.push('restart_5_missing');
  if (progress.imprints < progress.imprintsNeeded) blockers.push('not_enough_imprints');
  if (progress.sectors < progress.sectorsNeeded) blockers.push('not_enough_sectors');
  if (!progress.statsStable) blockers.push('stats_unstable');

  let stabilizationVariant: string | undefined;
  if (state.status === 'completed') stabilizationVariant = computeStabilizationVariant(state).id;

  const findings = evaluateFindings(state);
  const summary = summarizeRun(state);
  const deathStat: StatKey | undefined = summary.deathStat;
  const deathExtreme: 'low' | 'high' | undefined = deathStat
    ? (state.stats[deathStat] <= 0 ? 'low' : 'high')
    : undefined;

  const newMetaPools = collectMetaPools(state);

  const overloadCards = state.usedCardIds.filter((id) => CYKLUS_CARDS[id]?.tags.includes('overload'));
  const comboCards = state.usedCardIds.filter((id) => CYKLUS_CARDS[id]?.tags.includes('combo'));

  const goalCompletionIds = state.goals.filter((g) => g.completed).map((g) => g.id);
  const result: SimRunResult = {
    runIndex: 0,
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
    findingsEarned: findings.map((f) => f.id),
    metaUnlocksEarned: newMetaPools,
    modifierId: state.modifier.id,
    activeContracts: [...state.activeContracts],
    itemActivationCount: state.itemActivationCount,
    goalsCompleted: goalCompletionIds.length,
    goalCompletionIds,
    overloadCards,
    overloadAccepted: [],
    overloadRefused: [],
    comboCards,
    comboTriggers: [],
    contractAccepted: [],
    contractCollectSeen: [],
    deathAfterOverload: state.status === 'dead' && overloadCards.length > 0,
  };

  return { result, newMetaPools };
}

export function simulateCampaign(
  campaigns = 100,
  runsPerCampaign = 10,
  safetyLimit = SIM_DEFAULTS.safetyLimit,
): CampaignReport {
  const completionByRunIndex = Array(runsPerCampaign).fill(0);
  const deathByRunIndex = Array(runsPerCampaign).fill(0);
  const metaCardAppearancesByRunIndex = Array(runsPerCampaign).fill(0);
  const totalMetaPoolsEverUnlocked: Record<string, number> = {};
  let totalMetaCardsAppeared = 0;
  let deadMetaPoolsByEnd = 0;

  const allMetaPoolIds = new Set<string>();
  for (const stat of ['memory', 'energy', 'bond', 'control'] as StatKey[]) {
    for (const ext of ['low', 'high'] as const) {
      for (const u of (getDeathUnlocks(stat, ext))) {
        if (u.unlockPool) allMetaPoolIds.add(u.unlockPool);
      }
    }
  }
  for (const f of CYKLUS_FINDINGS) {
    if (f.reward?.unlockPool) allMetaPoolIds.add(f.reward.unlockPool);
  }

  let totalFreshMetaCardsAppeared = 0;
  let freshPoolsUnseenAfterRun1Total = 0;

  for (let c = 0; c < campaigns; c++) {
    let accumulatedMetaPools: string[] = [];

    for (let r = 0; r < runsPerCampaign; r++) {
      const seed = `campaign-${c}-run-${r}`;
      const freshAtStartOfRun = [...accumulatedMetaPools];
      const { result, newMetaPools } = simulateSingleRunWithMeta(seed, safetyLimit, accumulatedMetaPools);

      if (result.status === 'completed') completionByRunIndex[r]++;
      else if (result.status === 'dead') deathByRunIndex[r]++;

      const allMetaCardIds = new Set<string>();
      for (const id of Object.keys(CYKLUS_CARDS)) {
        const card = CYKLUS_CARDS[id];
        if (card?.conditions?.some((cond) => cond.type === 'unlockedPool' && accumulatedMetaPools.includes(cond.poolId ?? ''))) {
          allMetaCardIds.add(id);
        }
      }
      const appearedMetaCards = result.usedCardIds.filter((id) => allMetaCardIds.has(id));
      metaCardAppearancesByRunIndex[r] += appearedMetaCards.length;
      totalMetaCardsAppeared += appearedMetaCards.length;

      // Fresh meta: cards from pools that were fresh at start of this run
      const freshMetaCardIds = new Set<string>();
      for (const id of Object.keys(CYKLUS_CARDS)) {
        const card = CYKLUS_CARDS[id];
        if (card?.conditions?.some((cond) => cond.type === 'unlockedPool' && freshAtStartOfRun.includes(cond.poolId ?? ''))) {
          freshMetaCardIds.add(id);
        }
      }
      const appearedFreshMetaCards = result.usedCardIds.filter((id) => freshMetaCardIds.has(id));
      totalFreshMetaCardsAppeared += appearedFreshMetaCards.length;

      // After run 1 (r===1): count fresh pools from run 0 that were never seen
      if (r === 1) {
        const unseenFresh = freshAtStartOfRun.filter((p) => {
          const cardsInPool = Object.keys(CYKLUS_CARDS).filter((id) => {
            const card = CYKLUS_CARDS[id];
            return card?.conditions?.some((cond) => cond.type === 'unlockedPool' && cond.poolId === p);
          });
          return !cardsInPool.some((id) => result.usedCardIds.includes(id));
        });
        freshPoolsUnseenAfterRun1Total += unseenFresh.length;
      }

      for (const p of newMetaPools) {
        totalMetaPoolsEverUnlocked[p] = (totalMetaPoolsEverUnlocked[p] ?? 0) + 1;
        if (!accumulatedMetaPools.includes(p)) accumulatedMetaPools.push(p);
      }
    }

    const unlockedByEnd = new Set(accumulatedMetaPools);
    deadMetaPoolsByEnd += [...allMetaPoolIds].filter((p) => !unlockedByEnd.has(p)).length;
  }

  const earlyRuns = 3;
  const completionRateEarlyRuns =
    completionByRunIndex.slice(0, earlyRuns).reduce((s, n) => s + n, 0) / (campaigns * earlyRuns);
  const completionRateLateRuns =
    completionByRunIndex.slice(-3).reduce((s, n) => s + n, 0) / (campaigns * 3);

  return {
    campaigns,
    runsPerCampaign,
    completionByRunIndex: completionByRunIndex.map((n) => Math.round((n / campaigns) * 100)),
    deathByRunIndex: deathByRunIndex.map((n) => Math.round((n / campaigns) * 100)),
    metaCardAppearancesByRunIndex: metaCardAppearancesByRunIndex.map((n) =>
      Math.round((n / campaigns) * 10) / 10,
    ),
    totalMetaPoolsEverUnlocked,
    deadMetaPoolsByEndOfCampaign: Math.round(deadMetaPoolsByEnd / campaigns),
    avgMetaCardsAppearedPerRun: Math.round((totalMetaCardsAppeared / (campaigns * runsPerCampaign)) * 10) / 10,
    avgFreshMetaCardsPerRun: Math.round((totalFreshMetaCardsAppeared / (campaigns * runsPerCampaign)) * 10) / 10,
    freshPoolsUnseenAfterRun1: Math.round(freshPoolsUnseenAfterRun1Total / campaigns * 10) / 10,
    completionRateEarlyRuns: Math.round(completionRateEarlyRuns * 100),
    completionRateLateRuns: Math.round(completionRateLateRuns * 100),
  };
}

export function formatCampaignReport(report: CampaignReport): string {
  const lines: string[] = [];
  lines.push('════════════════════════════════════════════════════════');
  lines.push('  SYNTHOMA: CYKLUS — CAMPAIGN SIMULATION REPORT');
  lines.push(`  ${report.campaigns} campaigns × ${report.runsPerCampaign} runs`);
  lines.push('════════════════════════════════════════════════════════');

  lines.push('');
  lines.push('── COMPLETION % BY RUN INDEX ──');
  report.completionByRunIndex.forEach((pct, i) => {
    const bar = '█'.repeat(Math.round(pct / 5));
    lines.push(`  Run ${String(i + 1).padStart(2)}  ${String(pct).padStart(3)}%  ${bar}`);
  });

  lines.push('');
  lines.push('── DEATH % BY RUN INDEX ──');
  report.deathByRunIndex.forEach((pct, i) => {
    lines.push(`  Run ${String(i + 1).padStart(2)}  ${String(pct).padStart(3)}%`);
  });

  lines.push('');
  lines.push('── META CARD APPEARANCES (avg per campaign per run) ──');
  report.metaCardAppearancesByRunIndex.forEach((n, i) => {
    lines.push(`  Run ${String(i + 1).padStart(2)}  ${n}`);
  });

  lines.push('');
  lines.push(`── META UNLOCKED POOLS (across all campaigns) ──`);
  for (const [p, n] of Object.entries(report.totalMetaPoolsEverUnlocked).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${p.padEnd(35)} ${n}x`);
  }

  lines.push('');
  lines.push(`  Avg dead meta pools per campaign end: ${report.deadMetaPoolsByEndOfCampaign}`);
  lines.push(`  Avg meta cards appeared / run:        ${report.avgMetaCardsAppearedPerRun}`);
  lines.push(`  Avg FRESH meta cards appeared / run:  ${report.avgFreshMetaCardsPerRun}`);
  lines.push(`  Fresh pools unseen after run 1 (avg): ${report.freshPoolsUnseenAfterRun1}`);
  lines.push(`  Completion rate runs 1-3:              ${report.completionRateEarlyRuns}%`);
  lines.push(`  Completion rate runs 8-10:             ${report.completionRateLateRuns}%`);

  lines.push('');
  lines.push('════════════════════════════════════════════════════════');
  return lines.join('\n');
}
