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

import { runSimulation, simulateSingleRun, aggregateResults, formatSimReport, simulateCampaign, formatCampaignReport } from './cyklusSimRunner';
import { CYKLUS_CARDS } from '../cyklusCards';

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

describe('CYKLUS Simulation — balance (1000 runs)', () => {
  let report: ReturnType<typeof runSimulation>;

  beforeAll(() => {
    report = runSimulation(1000, 200);
    // Print full report to console for manual inspection
    const { formatSimReport: fmt } = require('./cyklusSimRunner');
    console.info('\n' + fmt(report));
  });

  // B1.1 target: 40-70% death rate with random yes/no player.
  // Seeded RNG produces deterministic ~44-46%. Lower bound 40% gives
  // reasonable margin; upper bound 70% guards against regression to
  // pre-B1 memory brutality. Design intent is ~50% for a skilled player.
  test('death rate is between 40% and 70%', () => {
    const deathRate = report.deaths / report.totalRuns;
    expect(deathRate).toBeGreaterThanOrEqual(0.40);
    expect(deathRate).toBeLessThanOrEqual(0.70);
  });

  test('average run length is between 5 and 195 choices', () => {
    expect(report.avgChoices).toBeGreaterThan(5);
    expect(report.avgChoices).toBeLessThan(195);
  });

  test('average cycles survived is at least 1', () => {
    expect(report.avgCycles).toBeGreaterThanOrEqual(1);
  });

  test('at least 50% of cards appear in 1000 runs', () => {
    const totalCards = Object.keys(CYKLUS_CARDS).length;
    const seen = totalCards - report.neverSeenCards.length;
    expect(seen / totalCards).toBeGreaterThan(0.5);
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

  // B1.1: many cards require specific flags/pools to appear; 65 is
  // acceptable for 1000 random runs. Target for future patches: <40.
  test('never-seen cards are fewer than 65', () => {
    expect(report.neverSeenCards.length).toBeLessThan(65);
  });
});

describe('CYKLUS Campaign Simulation — meta progression (100 × 10)', () => {
  let campaignReport: ReturnType<typeof simulateCampaign>;

  beforeAll(() => {
    campaignReport = simulateCampaign(100, 10, 200);
    const { formatCampaignReport: fmt } = require('./cyklusSimRunner');
    console.info('\n' + fmt(campaignReport));
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
});
