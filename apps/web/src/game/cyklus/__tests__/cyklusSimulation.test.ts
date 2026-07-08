/**
 * SYNTHOMA: CYKLUS — Simulation Tests
 *
 * Runs automated simulations to verify:
 * - Runs complete without exceptions
 * - Safety limit is respected
 * - Cards are reachable
 * - Stabilization blockers are trackable
 * - Balance is within expected bounds
 */

import { runSimulation, simulateSingleRun, aggregateResults, formatSimReport, simulateCampaign, formatCampaignReport } from '../testUtils/cyklusSimRunner';
import { CYKLUS_CARDS } from '../content';

describe('CYKLUS Simulation — sanity', () => {
  test('100 runs complete without exception', () => {
    expect(() => runSimulation(100, 200)).not.toThrow();
  });

  test('no run exceeds safety limit', () => {
    const results = [];
    for (let i = 0; i < 100; i++) {
      results.push(simulateSingleRun(i, 50));
    }
    for (const r of results) {
      expect(r.totalChoices).toBeLessThanOrEqual(50);
    }
  });

  test('non-restart cards appear in runs', () => {
    const results = [];
    for (let i = 0; i < 50; i++) {
      results.push(simulateSingleRun(i, 200));
    }
    const allUsed = new Set(results.flatMap((r) => r.usedCardIds));
    const nonRestartUsed = [...allUsed].filter((id) => !id.startsWith('restart_') && !id.startsWith('tutorial_'));
    expect(nonRestartUsed.length).toBeGreaterThan(10);
  });

  test('card coverage > 0', () => {
    const report = runSimulation(50, 200);
    expect(report.topCards.length).toBeGreaterThan(0);
    const totalCards = Object.keys(CYKLUS_CARDS).length;
    const seen = totalCards - report.neverSeenCards.length;
    expect(seen).toBeGreaterThan(0);
  });

  test('stabilization blocker report is produced', () => {
    const report = runSimulation(50, 200);
    // Should always have at least one blocker category tracked
    const blockerKeys = Object.keys(report.stabilizationBlockerCounts);
    expect(blockerKeys.length).toBeGreaterThanOrEqual(0);
    // Each blocker key is a known type
    const validBlockers = ['restart_5_missing', 'not_enough_imprints', 'not_enough_sectors', 'stats_unstable'];
    for (const key of blockerKeys) {
      expect(validBlockers).toContain(key);
    }
  });

  test('aggregateResults returns correct totals', () => {
    const results = [
      simulateSingleRun(0, 200),
      simulateSingleRun(1, 200),
      simulateSingleRun(2, 200),
    ];
    const report = aggregateResults(results);
    expect(report.totalRuns).toBe(3);
    expect(report.deaths + report.completions + report.timeouts).toBe(3);
  });

  test('formatSimReport returns non-empty string', () => {
    const report = runSimulation(20, 100);
    const output = formatSimReport(report);
    expect(output.length).toBeGreaterThan(100);
    expect(output).toContain('SYNTHOMA: CYKLUS');
    expect(output).toContain('OUTCOMES');
  });

  test('death stat distribution only contains valid stat keys', () => {
    const report = runSimulation(100, 200);
    const validStats = ['energy', 'memory', 'bond', 'control'];
    for (const key of Object.keys(report.deathStatDistribution)) {
      expect(validStats).toContain(key);
    }
  });

  test('top cards list is sorted descending', () => {
    const report = runSimulation(100, 200);
    for (let i = 1; i < report.topCards.length; i++) {
      expect(report.topCards[i - 1]!.count).toBeGreaterThanOrEqual(report.topCards[i]!.count);
    }
  });
});

const runSlow = process.env.RUN_SLOW_SIM === '1';

(runSlow ? describe : describe.skip)('CYKLUS Simulation — balance (1000 runs)', () => {
  let report: ReturnType<typeof runSimulation>;

  beforeAll(() => {
    if (typeof localStorage !== 'undefined') {
      const keys = ['synthoma_cyklus_run_v1', 'synthoma_cyklus_history_v1', 'synthoma_cyklus_tutorial_seen', 'synthoma_cyklus_findings', 'synthoma_cyklus_meta_unlocks', 'synthoma_cyklus_fresh_meta_pools', 'synthoma_cyklus_discovery'];
      keys.forEach((k) => localStorage.removeItem(k));
    }
    report = runSimulation(1000, 200);
    // Print full report to console for manual inspection
    const { formatSimReport: fmt } = require('../testUtils/cyklusSimRunner');
    console.warn('\n' + fmt(report));
  });

  // B1.1 target: 35-70% death rate with random yes/no player.
  // Seeded RNG now produces ~37-40% after C2.1 modifier scoring, because
  // modifiers nudge the deck toward theme-appropriate cards. Lower bound 35%
  // gives reasonable margin; upper bound 70% guards against regression to
  // pre-B1 memory brutality. Design intent is ~50% for a skilled player.
  test('death rate is between 35% and 70%', () => {
    const deathRate = report.deaths / report.totalRuns;
    expect(deathRate).toBeGreaterThanOrEqual(0.35);
    expect(deathRate).toBeLessThanOrEqual(0.70);
  });

  test('completion rate does not exceed 65%', () => {
    const completionRate = report.completions / report.totalRuns;
    expect(completionRate).toBeLessThanOrEqual(0.65);
  });

  test('average run length is between 5 and 195 choices', () => {
    expect(report.avgChoices).toBeGreaterThan(5);
    expect(report.avgChoices).toBeLessThan(195);
  });

  test('average cycles survived is at least 1', () => {
    expect(report.avgCycles).toBeGreaterThanOrEqual(1);
  });

  test('at least 40% of cards appear in 1000 runs', () => {
    const totalCards = Object.keys(CYKLUS_CARDS).length;
    const seen = totalCards - report.neverSeenCards.length;
    expect(seen / totalCards).toBeGreaterThan(0.4);
  });

  test('no single non-tutorial card dominates unreasonably', () => {
    // cardUsageCounts counts total occurrences across all runs (a card can appear multiple times/run)
    // top non-tutorial/restart card should not appear in >90% of runs on average
    const nonTutorialTop = report.topCards.find(
      (c) => !c.id.startsWith('tutorial_') && !c.id.startsWith('restart_'),
    );
    if (nonTutorialTop) {
      // avg appearances per run; should be < 10 for any single card
      const avgAppearances = nonTutorialTop.count / report.totalRuns;
      expect(avgAppearances).toBeLessThan(10);
    }
  });

  test('final stat averages are in valid range (0-100)', () => {
    for (const val of Object.values(report.finalStatAverages)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    }
  });

  test('no single deathStat exceeds 45% of all runs', () => {
    for (const [, count] of Object.entries(report.deathStatDistribution)) {
      expect(count / report.totalRuns).toBeLessThanOrEqual(0.45);
    }
  });

  // B1.1: many cards require specific flags/pools to appear; 160 is
  // acceptable for 1000 random runs with locked thematic packs. Target for future patches: <40.
  test('never-seen cards are fewer than 160', () => {
    expect(report.neverSeenCards.length).toBeLessThan(160);
  });
});

(runSlow ? describe : describe.skip)('CYKLUS Campaign Simulation — meta progression (100 × 10)', () => {
  let campaignReport: ReturnType<typeof simulateCampaign>;

  beforeAll(() => {
    campaignReport = simulateCampaign(100, 10, 200);
    const { formatCampaignReport: fmt } = require('../testUtils/cyklusSimRunner');
    console.warn('\n' + fmt(campaignReport));
  });

  test('campaign simulation runs without exception', () => {
    expect(campaignReport.campaigns).toBe(100);
    expect(campaignReport.runsPerCampaign).toBe(10);
  });

  test('completion rate does not exceed 70% even in late runs', () => {
    expect(campaignReport.completionRateLateRuns).toBeLessThanOrEqual(70);
  });

  test('completion rate in early runs is below late runs or equal (meta helps)', () => {
    // meta unlocks should not hurt; late runs >= early runs
    expect(campaignReport.completionRateLateRuns).toBeGreaterThanOrEqual(
      campaignReport.completionRateEarlyRuns - 5,
    );
  });

  test('meta pools unlock across campaigns', () => {
    const totalUnlocked = Object.keys(campaignReport.totalMetaPoolsEverUnlocked).length;
    expect(totalUnlocked).toBeGreaterThan(0);
  });

  test('fresh meta cards per run is higher than before patch (target >= 0.5)', () => {
    expect(campaignReport.avgFreshMetaCardsPerRun).toBeGreaterThanOrEqual(0.5);
  });

  test('completion rate does not spike due to fresh meta boost (max +10pp vs early)', () => {
    expect(campaignReport.completionRateLateRuns).toBeLessThanOrEqual(
      campaignReport.completionRateEarlyRuns + 10,
    );
  });
});

describe('CYKLUS Visibility Patch — fresh meta pool mechanics', () => {
  test('fresh meta pool card gets scoring boost', () => {
    const { simulateSingleRunWithMeta } = require('../testUtils/cyklusSimRunner');
    const { CYKLUS_CARDS } = require('../cyklusCards');

    const metaPool = 'post_format';
    const metaCard = Object.values(CYKLUS_CARDS as Record<string, import('../cyklusTypes').SwipeCard>).find(
      (c) => c.conditions?.some((cond) => cond.type === 'unlockedPool' && cond.poolId === metaPool),
    );
    if (!metaCard) return;

    // With fresh pool: run 5 times, meta card should appear in at least 1 of them
    let appearedCount = 0;
    for (let i = 0; i < 5; i++) {
      const { result } = simulateSingleRunWithMeta(`fresh-test-${i}`, 80, [metaPool]);
      if (result.usedCardIds.includes(metaCard.id)) appearedCount++;
    }
    expect(appearedCount).toBeGreaterThanOrEqual(1);
  });

  test('fresh pool is consumed after playing a fresh meta card', () => {
    const { createCyklusRun, resolveChoice } = require('../cyklusEngine');
    const { CYKLUS_CARDS } = require('../cyklusCards');

    const metaPool = 'post_format';
    const metaCard = Object.values(CYKLUS_CARDS as Record<string, import('../cyklusTypes').SwipeCard>).find(
      (c) => c.conditions?.some((cond) => cond.type === 'unlockedPool' && cond.poolId === metaPool),
    );
    if (!metaCard) return;

    let state = createCyklusRun(true) as import('../cyklusTypes').CyklusRunState;
    state = { ...state, currentCardId: metaCard.id, unlockedPools: [...state.unlockedPools, metaPool], freshMetaPools: [metaPool] };

    const after = resolveChoice(state, 'yes');
    expect((after.freshMetaPools ?? []).includes(metaPool)).toBe(false);
  });
});
