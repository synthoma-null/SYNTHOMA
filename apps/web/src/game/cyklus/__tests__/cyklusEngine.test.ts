import {
  createCyklusRun,
  resolveChoice,
  applyEffects,
  computeEnding,
  computeProfile,
  getCardById,
  hasItem,
  hasFlag,
  clampStat,
  summarizeRun,
  analyzeDeath,
  computeStabilizationProgress,
  updateTension,
  pickNextCard,
  getNearestExtreme,
  generateRunCodename,
  activateItem,
  getStabilizationBuildProgress,
  pickRunModifier,
  generateRunGoals,
  updateRunGoals,
  checkItemCombos,
  getComboHint,
  getActiveContracts,
  generatePreRunWarning,
  scoreCard,
} from '../cyklusEngine';
import type { CyklusRunState, SectorId } from '../cyklusTypes';
import { CYKLUS_CARDS } from '../cyklusCards';
import { CYKLUS_ITEMS } from '../cyklusItems';
import { CYKLUS_IMPRINTS } from '../cyklusImprints';
import { CYKLUS_UNLOCKS } from '../cyklusUnlocks';
import { getDeathUnlocks, saveMetaUnlocks, loadMetaUnlocks, loadMetaUnlockPools } from '../cyklusFindings';
import { updateDiscoveryFromRun } from '../cyklusDiscovery';
import { loadCyklusRun } from '../cyklusStorage';

describe('Cyklus engine', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createCyklusRun', () => {
    it('starts with balanced stats and restart_0 when tutorial seen', () => {
      const state = createCyklusRun(true);
      expect(state.status).toBe('playing');
      expect(state.stats).toEqual({ energy: 50, memory: 50, bond: 50, control: 50 });
      expect(state.currentCardId).toBe('restart_0');
      expect(state.sector).toBe('void');
      expect(state.visitedSectors).toContain('void');
    });
    it('starts with tutorial_stats when tutorial not seen', () => {
      const state = createCyklusRun(false);
      expect(state.currentCardId).toBe('tutorial_stats');
    });

    it('migrates old partial save to include new state fields', () => {
      const old = {
        id: 'old-run',
        status: 'playing',
        stats: { energy: 50, memory: 50, bond: 50, control: 50 },
      };
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(old));
      const migrated = loadCyklusRun();
      expect(migrated).not.toBeNull();
      expect(migrated?.modifier).toBeDefined();
      expect(migrated?.goals).toEqual([]);
      expect(migrated?.activeContracts).toEqual([]);
      expect(migrated?.preRunWarning).toBeNull();
      spy.mockRestore();
    });
  });

  describe('resolveChoice', () => {
    it('runs the first six restart cards in order', () => {
      let state = createCyklusRun(true);
      const restartCards = ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'];
      for (let i = 0; i < restartCards.length; i++) {
        expect(state.currentCardId).toBe(restartCards[i]);
        state = resolveChoice(state, 'yes');
        if (state.status !== 'playing') break;
      }
      expect(state.usedCardIds.filter((id) => id.startsWith('restart_')).length).toBe(restartCards.length);
    });

    it('kills on stat zero', () => {
      let state = createCyklusRun();
      state = { ...state, currentCardId: 'first_boot', usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'] };
      state = applyEffects(state, [
        { type: 'stat', key: 'bond', amount: -100 },
      ]);
      expect(state.stats.bond).toBe(0);
      const ending = computeEnding(state);
      expect(ending).not.toBeNull();
      expect(ending?.type).toBe('death');
      if (ending?.type === 'death') {
        expect(ending.stat).toBe('bond');
        expect(ending.extreme).toBe('low');
      }
    });

    it('kills on stat 100', () => {
      let state = createCyklusRun();
      state = { ...state, currentCardId: 'first_boot', usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'] };
      state = applyEffects(state, [
        { type: 'stat', key: 'energy', amount: 100 },
      ]);
      expect(state.stats.energy).toBe(100);
      const ending = computeEnding(state);
      expect(ending?.type).toBe('death');
      if (ending?.type === 'death') {
        expect(ending.stat).toBe('energy');
        expect(ending.extreme).toBe('high');
      }
    });
  });

  describe('crisis items', () => {
    it('rubber_seal_ready saves from bond 0', () => {
      let state = createCyklusRun();
      state = { ...state, flags: ['rubber_seal_ready'], currentCardId: 'first_boot', usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'] };
      state = applyEffects(state, [{ type: 'stat', key: 'bond', amount: -60 }]);
      expect(state.stats.bond).toBe(0);
      // Trigger crisis via a real choice on a neutral card would not help, so we simulate the intervention by applying effects again? No.
      // Instead resolve a choice on a card that does not push bond further. The crisis check is inside resolveChoice.
      state = { ...state, currentCardId: 'first_boot', usedCardIds: [...state.usedCardIds, 'first_boot'] };
      state = resolveChoice(state, 'yes');
      expect(state.status).toBe('playing');
      expect(state.stats.bond).toBe(15);
      expect(state.flags).not.toContain('rubber_seal_ready');
      expect(state.lastOutcomeText).toContain('SEAL_INTERVENTION');
    });

    it('acid_filter saves from energy 100', () => {
      let state = createCyklusRun();
      state = { ...state, inventory: ['acid_filter'], currentCardId: 'first_boot', usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'] };
      state = applyEffects(state, [{ type: 'stat', key: 'energy', amount: 60 }]);
      expect(state.stats.energy).toBe(100);
      state = { ...state, currentCardId: 'first_boot', usedCardIds: [...state.usedCardIds, 'first_boot'] };
      state = resolveChoice(state, 'yes');
      expect(state.status).toBe('playing');
      expect(state.stats.energy).toBe(85);
      expect(state.inventory).not.toContain('acid_filter');
      expect(state.flags).toContain('acid_filter_burned');
      expect(state.lastOutcomeText).toContain('ACID_FILTER_BURNED');
    });

    it('archive_key saves from memory 0 and moves to archive', () => {
      let state = createCyklusRun();
      state = { ...state, inventory: ['archive_key'], currentCardId: 'first_boot', usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'] };
      state = applyEffects(state, [{ type: 'stat', key: 'memory', amount: -60 }]);
      expect(state.stats.memory).toBe(0);
      state = { ...state, currentCardId: 'first_boot', usedCardIds: [...state.usedCardIds, 'first_boot'] };
      state = resolveChoice(state, 'yes');
      expect(state.status).toBe('playing');
      expect(state.stats.memory).toBe(15);
      expect(state.sector).toBe('archive');
      expect(state.inventory).not.toContain('archive_key');
      expect(state.flags).toContain('archive_key_used');
      expect(state.lastOutcomeText).toContain('ARCHIVE_KEY');
    });

    it('archive_key saves from memory 100', () => {
      let state = createCyklusRun();
      state = { ...state, inventory: ['archive_key'], currentCardId: 'first_boot', usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'] };
      state = applyEffects(state, [{ type: 'stat', key: 'memory', amount: 60 }]);
      expect(state.stats.memory).toBe(100);
      state = { ...state, currentCardId: 'first_boot', usedCardIds: [...state.usedCardIds, 'first_boot'] };
      state = resolveChoice(state, 'yes');
      expect(state.status).toBe('playing');
      expect(state.stats.memory).toBe(85);
      expect(state.sector).toBe('archive');
      expect(state.inventory).not.toContain('archive_key');
      expect(state.flags).toContain('archive_key_used');
    });
  });

  describe('rubber_stamp', () => {
    it('cancels negative stat effects on form/office cards', () => {
      let state = createCyklusRun();
      state = { ...state, flags: ['rubber_stamp_ready'], currentCardId: 'choose_form_office', usedCardIds: [] };
      const card = getCardById('choose_form_office');
      expect(card).toBeDefined();
      expect(card?.tags).toContain('form');
      state = resolveChoice(state, 'yes');
      // choose_form_office yes gives +10 control, -5 bond, -5 energy normally; with stamp bond and energy should stay
      expect(state.flags).not.toContain('rubber_stamp_ready');
      expect(state.stats.control).toBeGreaterThan(50);
      // bond and energy should not have decreased from the stamp-targeted negatives
      expect(state.stats.bond).toBe(50);
      expect(state.stats.energy).toBe(50);
    });
  });

  describe('completed ending', () => {
    it('returns stabilized ending when all conditions are met', () => {
      let state = createCyklusRun();
      state = {
        ...state,
        usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'],
        imprints: ['unfinished_conversation', 'rubber_stamp', 'mirror_crack'],
        visitedSectors: ['void', 'archive', 'form_office', 'memory_sandbox'],
        stats: { energy: 45, memory: 55, bond: 50, control: 50 },
        currentCardId: 'first_boot',
      };
      const ending = computeEnding(state);
      expect(ending).not.toBeNull();
      expect(ending?.type).toBe('stabilized');
      expect(ending?.title).toBe('Stabilizovaný subjekt');
    });

    it('does not stabilize without enough imprints', () => {
      let state = createCyklusRun();
      state = {
        ...state,
        usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'],
        imprints: ['unfinished_conversation'],
        visitedSectors: ['void', 'archive', 'form_office', 'memory_sandbox'],
        stats: { energy: 45, memory: 55, bond: 50, control: 50 },
      };
      const ending = computeEnding(state);
      expect(ending).toBeNull();
    });

    it('sets status to completed via resolveChoice', () => {
      let state = createCyklusRun();
      state = {
        ...state,
        currentCardId: 'first_boot',
        usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'],
        imprints: ['unfinished_conversation', 'rubber_stamp', 'mirror_crack'],
        visitedSectors: ['void', 'archive', 'form_office', 'memory_sandbox'],
        stats: { energy: 45, memory: 55, bond: 50, control: 50 },
      };
      state = resolveChoice(state, 'yes');
      expect(state.status).toBe('completed');
      const ending = computeEnding(state);
      expect(ending?.type).toBe('stabilized');
    });
  });

  describe('computeProfile', () => {
    it('returns a stable profile for balanced choices', () => {
      const state = createCyklusRun();
      const profile = computeProfile(state);
      expect(profile.dominantLabel).toBeTruthy();
      expect(profile.dominantLabel.length).toBeGreaterThanOrEqual(4);
      expect(profile.stability).toBeGreaterThanOrEqual(0);
      expect(profile.stability).toBeLessThanOrEqual(100);
      expect(profile.profileConfidence).toBeGreaterThanOrEqual(0);
      expect(profile.archetype).toBeTruthy();
    });
    it('returns 4-char label when profile is decisive', () => {
      let state = createCyklusRun();
      state = { ...state, profile: { E: 10, I: 0, S: 0, N: 10, T: 10, F: 0, J: 10, P: 0 } };
      const profile = computeProfile(state);
      expect(profile.dominantLabel).toHaveLength(4);
      expect(profile.uncertainAxis).toBeUndefined();
    });
  });

  describe('profile across runs', () => {
    it('new run inherits weighted baseline profile from run history', () => {
      const history = [
        { id: 'run-1', endedAt: 1, status: 'completed' as const, endingTitle: 'Konec', cyclesSurvived: 1, totalChoices: 10, dominantProfile: 'Ni', archetype: 'test', profile: { Ni: 4 }, imprints: [], visitedSectors: ['void'] as SectorId[] },
        { id: 'run-2', endedAt: 2, status: 'completed' as const, endingTitle: 'Konec', cyclesSurvived: 2, totalChoices: 12, dominantProfile: 'Ne', archetype: 'test', profile: { Ne: 6 }, imprints: [], visitedSectors: ['void'] as SectorId[] },
      ];
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === 'synthoma_cyklus_history_v1') return JSON.stringify(history);
        return null;
      });
      const state = createCyklusRun(true);
      expect(state.profile.Ni).toBeCloseTo(4 / 3, 1); // weight 1/3
      expect(state.profile.Ne).toBeCloseTo(12 / 3, 1); // weight 2/3
      spy.mockRestore();
    });
  });

  describe('applyEffects', () => {
    it('grants items and flags', () => {
      let state = createCyklusRun();
      state = applyEffects(state, [
        { type: 'item', itemId: 'cult_badge' },
        { type: 'flag', flag: 'cult_badge_active' },
      ]);
      expect(hasItem(state, 'cult_badge')).toBe(true);
      expect(hasFlag(state, 'cult_badge_active')).toBe(true);
    });

    it('grants imprints', () => {
      let state = createCyklusRun();
      state = applyEffects(state, [{ type: 'imprint', imprintId: 'mirror_crack' }]);
      expect(state.imprints).toContain('mirror_crack');
    });

    it('updates entity relations', () => {
      let state = createCyklusRun();
      state = applyEffects(state, [{ type: 'entityRelation', entity: 'glitchka', delta: 2 }]);
      expect(state.entityRelations.glitchka).toBe(2);
    });

    it('clamps stats to [0, 100]', () => {
      expect(clampStat(150)).toBe(100);
      expect(clampStat(-10)).toBe(0);
      expect(clampStat(42)).toBe(42);
    });
  });

  describe('run summary and death analysis', () => {
    it('summarizes a completed run', () => {
      let state = createCyklusRun();
      state = {
        ...state,
        status: 'completed',
        usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'],
        imprints: ['unfinished_conversation', 'rubber_stamp', 'mirror_crack'],
        visitedSectors: ['void', 'archive', 'form_office', 'memory_sandbox'],
        stats: { energy: 45, memory: 55, bond: 50, control: 50 },
      };
      const summary = summarizeRun(state);
      expect(summary.status).toBe('completed');
      expect(summary.endingTitle).toBe('Stabilizovaný subjekt');
      expect(summary.dominantProfile).toBeTruthy();
      expect(summary.archetype).toBeTruthy();
      expect(summary.imprints.length).toBe(3);
      expect(summary.deathStat).toBeUndefined();
    });

    it('analyzes death by stat', () => {
      let state = createCyklusRun();
      state = {
        ...state,
        status: 'dead',
        currentCardId: 'first_boot',
        usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'],
        stats: { energy: 100, memory: 50, bond: 50, control: 50 },
        history: [
          { turn: 1, cycle: 1, cardId: 'overclock', direction: 'yes', statDelta: { energy: 12 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, statsAfter: { energy: 62, memory: 50, bond: 50, control: 50 }, sectorBefore: 'void', sectorAfter: 'void', ts: 1 },
          { turn: 2, cycle: 1, cardId: 'first_boot', direction: 'yes', statDelta: { energy: 38 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, statsAfter: { energy: 100, memory: 50, bond: 50, control: 50 }, sectorBefore: 'void', sectorAfter: 'void', ts: 2 },
        ],
      };
      const analysis = analyzeDeath(state);
      expect(analysis).not.toBeNull();
      expect(analysis?.stat).toBe('energy');
      expect(analysis?.topContributors.length).toBeGreaterThan(0);
    });

    it('computes stabilization progress', () => {
      let state = createCyklusRun();
      const progress = computeStabilizationProgress(state);
      expect(progress.survivedRestart).toBe(false);
      expect(progress.imprints).toBe(0);
      expect(progress.sectors).toBe(1);
      expect(progress.statsStable).toBe(true);
    });
  });

  describe('tension director', () => {
    it('updates calm and crisis streaks', () => {
      let state = createCyklusRun();
      const card = getCardById('first_boot')!;
      state = { ...state, tension: updateTension(state, card) };
      expect(state.tension.calmStreak).toBeGreaterThan(0);
      expect(state.tension.crisisStreak).toBe(0);
    });
  });

  describe('card repetition', () => {
    it('does not allow the same card as the immediately previous one', () => {
      let state = createCyklusRun();
      state = { ...state, currentCardId: 'first_boot', usedCardIds: ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'] };
      state = resolveChoice(state, 'yes');
      expect(state.currentCardId).not.toBe('first_boot');
      const next = pickNextCard(state);
      expect(next.id).not.toBe(state.usedCardIds[state.usedCardIds.length - 1]);
    });
  });

  describe('content reachability and consistency', () => {
    const allCards = Object.values(CYKLUS_CARDS);
    const allEffects = allCards.flatMap((card) => [...card.yes.effects, ...card.no.effects]);
    const allItemEffects = allEffects.filter((e) => e.type === 'item');
    const allImprintEffects = allEffects.filter((e) => e.type === 'imprint');
    const allSchedules = allEffects.filter((e) => e.type === 'schedule' || e.type === 'scheduleNextCycle');
    const allUnlockCards = allEffects.filter((e) => e.type === 'unlockCard');
    const allFlagEffects = allEffects.filter((e) => e.type === 'flag' || e.type === 'removeFlag');
    const allPoolEffects = allEffects.filter((e) => e.type === 'unlockPool');
    const itemIds = new Set(Object.keys(CYKLUS_ITEMS));
    const imprintIds = new Set(Object.keys(CYKLUS_IMPRINTS));
    const poolIds = new Set(CYKLUS_UNLOCKS.map((u) => u.poolId));

    it('every item referenced by cards or unlocks exists', () => {
      const referencedItemIds = new Set<string>();
      allItemEffects.forEach((e) => referencedItemIds.add(e.itemId));
      CYKLUS_UNLOCKS.forEach((u) => {
        if (u.condition.type === 'hasItem') referencedItemIds.add(u.condition.itemId ?? '');
      });
      referencedItemIds.forEach((id) => expect(itemIds.has(id)).toBe(true));
    });

    it('every imprint referenced by cards or unlocks exists', () => {
      const referencedImprintIds = new Set<string>();
      allImprintEffects.forEach((e) => referencedImprintIds.add(e.imprintId));
      CYKLUS_UNLOCKS.forEach((u) => {
        if (u.condition.type === 'hasFlag') {
          const imprint = Object.values(CYKLUS_IMPRINTS).find((i) => i.passiveEffects?.some((pe) => pe.type === 'flag' && pe.flag === u.condition.flag));
          if (imprint) referencedImprintIds.add(imprint.id);
        }
      });
      referencedImprintIds.forEach((id) => expect(imprintIds.has(id)).toBe(true));
    });

    it('every pool referenced by cards or unlocks exists', () => {
      const referencedPoolIds = new Set<string>(poolIds);
      allPoolEffects.forEach((e) => referencedPoolIds.add(e.poolId));
      CYKLUS_UNLOCKS.forEach((u) => referencedPoolIds.add(u.poolId));
      referencedPoolIds.forEach((id) => expect(poolIds.has(id)).toBe(true));
    });

    it('every card referenced by schedules, unlockCards, triggers, or conditions exists', () => {
      const referencedCardIds = new Set<string>();
      allSchedules.forEach((e) => referencedCardIds.add(e.cardId));
      allUnlockCards.forEach((e) => referencedCardIds.add(e.cardId));
      allCards.forEach((card) => {
        card.conditions?.forEach((cond) => {
          if (cond.type === 'hasFlag') {
            const triggeredByItem = Object.values(CYKLUS_ITEMS).find((i) => i.triggerCards?.some((tc) => card.id === tc));
            const triggeredByImprint = Object.values(CYKLUS_IMPRINTS).find((i) => i.triggerCards?.some((tc) => card.id === tc));
            if (!triggeredByItem && !triggeredByImprint) return;
          }
        });
      });
      Object.values(CYKLUS_ITEMS).forEach((item) => item.triggerCards?.forEach((id) => referencedCardIds.add(id)));
      Object.values(CYKLUS_IMPRINTS).forEach((imprint) => imprint.triggerCards?.forEach((id) => referencedCardIds.add(id)));
      referencedCardIds.forEach((id) => expect(CYKLUS_CARDS[id]).toBeDefined());
    });

    it('every flag referenced by cards or unlocks exists in some effect', () => {
      const definedFlagIds = new Set<string>(allFlagEffects.map((e) => e.flag));
      Object.values(CYKLUS_ITEMS).forEach((item) => {
        item.passiveEffects?.forEach((e) => {
          if (e.type === 'flag') definedFlagIds.add(e.flag);
        });
      });
      Object.values(CYKLUS_IMPRINTS).forEach((imprint) => {
        imprint.passiveEffects?.forEach((e) => {
          if (e.type === 'flag') definedFlagIds.add(e.flag);
        });
      });
      CYKLUS_UNLOCKS.forEach((u) => {
        if (u.condition.type === 'hasFlag' || u.condition.type === 'missingFlag') {
          expect(definedFlagIds.has(u.condition.flag ?? '')).toBe(true);
        }
      });
    });

    it('every goal rewardPool has at least one reachable card', () => {
      const allGoalPools = new Set(
        [
          'explorer', 'collector', 'archive', 'pocket', 'lone', 'clean',
        ].filter((p): p is string => Boolean(p)),
      );
      allGoalPools.forEach((poolId) => {
        const hasReachableCard = allCards.some(
          (card) =>
            card.tags.includes(poolId) ||
            card.conditions?.some((c) => c.type === 'unlockedPool' && c.poolId === poolId),
        );
        expect(hasReachableCard).toBe(true);
      });
    });

    it('starting cards and basic items are reachable from cards', () => {
      const grantedItemIds = new Set(allItemEffects.map((e) => e.itemId));
      expect(grantedItemIds.has('rusty_token')).toBe(true);
      const grantedImprintIds = new Set(allImprintEffects.map((e) => e.imprintId));
      expect(grantedImprintIds.has('unfinished_conversation')).toBe(true);
      expect(CYKLUS_CARDS['restart_0']).toBeDefined();
      expect(CYKLUS_CARDS['first_boot']).toBeDefined();
    });
  });

  describe('meta unlock flow', () => {
    const LS_KEY = 'synthoma_cyklus_meta_unlocks';

    beforeEach(() => {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(LS_KEY);
    });

    afterEach(() => {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(LS_KEY);
    });

    it('getDeathUnlocks returns unlocks for memory_high death', () => {
      const unlocks = getDeathUnlocks('memory', 'high');
      expect(unlocks.length).toBeGreaterThan(0);
      expect(unlocks[0]).toHaveProperty('unlockPool');
    });

    it('saveMetaUnlocks persists and deduplicates', () => {
      const unlocks = getDeathUnlocks('energy', 'low');
      const saved1 = saveMetaUnlocks(unlocks);
      expect(saved1.length).toBe(unlocks.length);
      const saved2 = saveMetaUnlocks(unlocks);
      expect(saved2.length).toBe(0);
      const all = loadMetaUnlocks();
      expect(all.length).toBe(unlocks.length);
    });

    it('loadMetaUnlockPools maps saved unlock IDs to poolIds', () => {
      const unlocks = getDeathUnlocks('control', 'high');
      saveMetaUnlocks(unlocks);
      const { pools } = loadMetaUnlockPools();
      expect(pools.length).toBeGreaterThan(0);
      expect(typeof pools[0]).toBe('string');
    });

    it('createCyklusRun includes previously unlocked pools from localStorage', () => {
      const unlocks = getDeathUnlocks('bond', 'low');
      saveMetaUnlocks(unlocks);
      const { pools: expectedPools } = loadMetaUnlockPools();
      const run = createCyklusRun(true);
      for (const pool of expectedPools) {
        expect(run.unlockedPools).toContain(pool);
      }
    });
  });

  describe('getNearestExtreme', () => {
    it('returns the stat closest to 0 or 100', () => {
      const near = getNearestExtreme({ energy: 50, memory: 5, bond: 60, control: 40 });
      expect(near?.stat).toBe('memory');
      expect(near?.direction).toBe('low');
      expect(near?.distance).toBe(5);
    });

    it('handles balanced stats', () => {
      const near = getNearestExtreme({ energy: 50, memory: 50, bond: 50, control: 50 });
      expect(near?.distance).toBe(50);
    });
  });

  describe('generateRunCodename', () => {
    it('returns a non-empty string', () => {
      const state = createCyklusRun(true);
      const name = generateRunCodename(state);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    it('produces different names for different dominant stats', () => {
      const s1 = createCyklusRun(true);
      s1.stats.energy = 90;
      s1.stats.memory = 50;
      const s2 = createCyklusRun(true);
      s2.stats.memory = 90;
      s2.stats.energy = 50;
      const n1 = generateRunCodename(s1);
      const n2 = generateRunCodename(s2);
      expect(n1).not.toBe(n2);
    });
  });

  describe('new mechanics', () => {
    it('activateItem works only once per cycle', () => {
      const state = createCyklusRun(true);
      state.inventory = ['rubber_seal'];
      const first = activateItem(state, 'rubber_seal');
      expect(first).not.toBeNull();
      expect(first!.state.lastItemActivationCycle).toBe(1);
      const second = activateItem(first!.state, 'rubber_seal');
      expect(second).toBeNull();
    });

    it('activateItem increments itemActivationCount', () => {
      const state = createCyklusRun(true);
      state.inventory = ['archive_key'];
      const result = activateItem(state, 'archive_key');
      expect(result!.state.itemActivationCount).toBe(1);
    });

    it('getStabilizationBuildProgress returns 0-100 values', () => {
      const state = createCyklusRun(true);
      const progress = getStabilizationBuildProgress(state);
      expect(progress.length).toBeGreaterThan(0);
      for (const p of progress) {
        expect(p.progress).toBeGreaterThanOrEqual(0);
        expect(p.progress).toBeLessThanOrEqual(100);
        expect(p.requirements.length).toBeGreaterThan(0);
      }
    });

    it('pickRunModifier is deterministic for same seed', () => {
      const m1 = pickRunModifier('same-seed');
      const m2 = pickRunModifier('same-seed');
      expect(m1.id).toBe(m2.id);
    });

    it('generateRunGoals returns 3 goals', () => {
      const goals = generateRunGoals('seed');
      expect(goals.length).toBe(3);
      expect(goals.every((g) => g.progress === 0 && !g.completed)).toBe(true);
    });

    it('updateRunGoals updates visit_3_sectors progress and returns log', () => {
      const state = createCyklusRun(true);
      state.visitedSectors = ['void', 'acid_yellow', 'archive'];
      state.goals = [
        { id: 'visit_3_sectors', title: 'Navštiv 3 sektory', description: 'test', target: 3, progress: 0, completed: false, rewardPool: 'explorer', rewardTitle: 'Průzkumník' },
      ];
      const card = getCardById('restart_0')!;
      const result = updateRunGoals(state, state, card);
      const g = result.goals.find((x) => x.id === 'visit_3_sectors');
      expect(g?.progress).toBe(3);
      expect(g?.completed).toBe(true);
      expect(result.log).toContain('CÍL DOKONČEN');
      expect(result.newlyCompleted.length).toBe(1);
    });

    it('checkItemCombos schedules combo card when both items present', () => {
      const state = createCyklusRun(true);
      state.inventory = ['mirror_shard', 'sarkasma_receipt'];
      const result = checkItemCombos(state);
      const scheduled = result.state.scheduledCards.map((e) => e.cardId);
      expect(scheduled).toContain('mirror_shadow');
      expect(result.state.flags).toContain('combo_mirror_shadow_scheduled');
      expect(result.log).toContain('KOMBINACE AKTIVOVÁNA');
    });

    it('checkItemCombos does not duplicate schedule', () => {
      const state = createCyklusRun(true);
      state.inventory = ['mirror_shard', 'sarkasma_receipt'];
      state.flags = ['combo_mirror_shadow_scheduled'];
      const result = checkItemCombos(state);
      expect(result.state.scheduledCards.map((e) => e.cardId)).not.toContain('mirror_shadow');
    });

    it('getComboHint returns text when one combo item present', () => {
      const state = createCyklusRun(true);
      state.inventory = ['mirror_shard'];
      const hint = getComboHint(state);
      expect(hint).toBeTruthy();
      expect(hint).toContain('Zrcadlový střep');
    });

    it('getActiveContracts returns visible contract data', () => {
      const state = createCyklusRun(true);
      state.activeContracts = ['contract_tai'];
      state.scheduledCards = [{ cardId: 'tai_collects', turnsRemaining: 2, ifInvalid: 'delay' }];
      const contracts = getActiveContracts(state);
      expect(contracts.length).toBe(1);
      expect(contracts[0]?.id).toBe('contract_tai');
      expect(contracts[0]?.collectPending).toBe(true);
    });

    it('modifier affects card scoring based on tags', () => {
      let state = createCyklusRun(true);
      const card = getCardById('archive_scent_path')!;
      state.modifier = { id: 'archive_rain', title: 'Archive rain', description: 'test', tags: [] };
      const modified = scoreCard(state, card);
      state.modifier = { id: 'none', title: 'None', description: 'test', tags: [] };
      const base = scoreCard(state, card);
      expect(modified).toBeGreaterThan(base);
    });

    it('no_crisis_item goal completes only when run is completed', () => {
      const state = createCyklusRun(true);
      state.goals = [{ id: 'no_crisis_item', title: 'No crisis', description: 'test', target: 1, progress: 0, completed: false, rewardPool: 'clean', rewardTitle: 'Clean' }];
      state.status = 'playing';
      const playing = updateRunGoals(state, state, getCardById('restart_0')!);
      expect(playing.goals[0]?.completed).toBe(false);
      state.status = 'completed';
      const completed = updateRunGoals(state, state, getCardById('restart_0')!);
      expect(completed.goals[0]?.completed).toBe(true);
    });

    it('memory_high_5 counts turns with memory above 75', () => {
      const state = createCyklusRun(true);
      state.goals = [{ id: 'memory_high_5', title: 'Memory', description: 'test', target: 5, progress: 0, completed: false, rewardPool: 'archive', rewardTitle: 'Archiv' }];
      state.history = Array.from({ length: 5 }, (_, i) => ({
        turn: i + 1, cycle: 1, cardId: 'first_boot', direction: 'yes' as const,
        statDelta: {}, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [],
        imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {},
        statsAfter: { energy: 50, memory: 80, bond: 50, control: 50 },
        sectorBefore: 'void', sectorAfter: 'void', ts: i + 1,
      }));
      const result = updateRunGoals(state, state, getCardById('restart_0')!);
      expect(result.goals[0]?.progress).toBe(5);
      expect(result.goals[0]?.completed).toBe(true);
    });

    it('resolveChoice applies goal reward pool upon completion', () => {
      let state = createCyklusRun(true);
      state = { ...state, visitedSectors: ['void', 'acid_yellow', 'archive'] };
      state.goals = [
        { id: 'visit_3_sectors', title: 'Nech Prázdnotu třikrát změnit názor', description: 'test', target: 3, progress: 0, completed: false, rewardPool: 'explorer', rewardTitle: 'Průzkumník' },
      ];
      const initialPools = state.unlockedPools.length;
      state = { ...state, currentCardId: 'restart_0' };
      state = resolveChoice(state, 'yes');
      expect(state.unlockedPools.length).toBeGreaterThan(initialPools);
      expect(state.lastOutcomeText).toContain('CÍL DOKONČEN');
    });

    it('overload cards are tagged as high risk', () => {
      const overloadIds = Object.keys(CYKLUS_CARDS).filter((id) => CYKLUS_CARDS[id]?.tags.includes('overload'));
      expect(overloadIds.length).toBeGreaterThan(0);
      for (const id of overloadIds) {
        const card = CYKLUS_CARDS[id]!;
        expect(card.yes.preview?.risk).toBe('high');
      }
    });

    it('generatePreRunWarning returns warning only when history contains death', () => {
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
      const warn = generatePreRunWarning('seed');
      expect(warn).toBeNull();
      spy.mockRestore();
    });

    it('generatePreRunWarning uses actual deathStat from history', () => {
      const history = [{ id: 'run-1', endedAt: 1, status: 'dead' as const, endingTitle: 'Konec', cyclesSurvived: 1, totalChoices: 1, dominantProfile: 'Ni', archetype: 'test', profile: { Ni: 5 }, imprints: [], visitedSectors: ['void'], deathStat: 'memory' as const }];
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(history));
      const warn = generatePreRunWarning('seed');
      expect(warn).toContain('Paměť');
      spy.mockRestore();
    });

    it('updateDiscoveryFromRun saves variants and findings', () => {
      const state = createCyklusRun(true);
      state.status = 'completed';
      state.usedCardIds = ['first_boot', 'restart_0'];
      state.visitedSectors = ['void', 'archive'];
      state.inventory = ['rusty_token'];
      state.imprints = ['unfinished_conversation'];
      const d = updateDiscoveryFromRun(state, { variantId: 'variant_a', findingIds: ['finding_x'] });
      expect(d.cards).toContain('first_boot');
      expect(d.variants).toContain('variant_a');
      expect(d.findings).toContain('finding_x');
    });
  });
});
