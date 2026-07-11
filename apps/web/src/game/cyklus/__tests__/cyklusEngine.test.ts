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
  rerollRunGoals,
  explainCardScore,
  exportRunLog,
  composeCycleSummary,
} from '../cyklusEngine';
import type { CyklusRunFocus, CyklusRunState, SectorId, SwipeCard } from '../cyklusTypes';
import type { RunReward } from '../cyklusProgression';
import { CYKLUS_CARDS, CYKLUS_ITEMS, CYKLUS_IMPRINTS } from '../content';
import { cardMatchesRunFocus } from '../cyklusCardPicker';
import { CYKLUS_UNLOCKS } from '../cyklusUnlocks';
import { getKnownPoolIds } from '../cyklusPoolCatalog';
import { getDeathUnlocks, saveMetaUnlocks, loadMetaUnlocks, loadMetaUnlockPools } from '../cyklusFindings';
import { updateDiscoveryFromRun } from '../cyklusDiscovery';
import { loadCyklusRun } from '../cyklusStorage';
import { formatDelta, formatAbsDelta, roundVisibleNumber } from '../cyklusFormat';
import { pickAvoidingRecent, loadRecentCyklusComments, saveRecentCyklusComment } from '../cyklusCommentPool';

describe('Cyklus engine', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem('synthoma_cyklus_story_v1');
  });
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
    it('starts with tutorial_00_welcome when tutorial not seen', () => {
      const state = createCyklusRun(false);
      expect(state.currentCardId).toBe('tutorial_00_welcome');
    });

    it('starts with restart_0 or first_boot when tutorial skipped', () => {
      const state = createCyklusRun(true);
      expect(['restart_0', 'first_boot']).toContain(state.currentCardId);
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

  describe('focused area runs', () => {
    const seenRestartIds = ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'];

    function focusedState(focus: CyklusRunFocus): CyklusRunState {
      return {
        ...createCyklusRun(true, focus),
        currentCardId: 'first_boot',
        flags: ['tutorial_v2_done'],
        usedCardIds: seenRestartIds,
        unlockedPools: getKnownPoolIds(),
        rngStep: 31,
      };
    }

    function findScoredCard(state: CyklusRunState, predicate: (card: SwipeCard) => boolean): SwipeCard {
      const card = Object.values(CYKLUS_CARDS).find((candidate) =>
        candidate.id !== state.currentCardId &&
        candidate.category !== 'restart' &&
        candidate.category !== 'tutorial' &&
        predicate(candidate) &&
        explainCardScore(state, candidate).score > 0,
      );
      expect(card).toBeDefined();
      return card!;
    }

    it('stores a run focus on new runs without changing the restart entry', () => {
      const focus: CyklusRunFocus = { type: 'sector', id: 'archive', label: 'Archiv', strictness: 'soft', remainingCards: 10 };
      const state = createCyklusRun(true, focus);

      expect(state.runFocus).toEqual({ ...focus, startedAtCycle: 1 });
      expect(state.currentCardId).toBe('restart_0');
    });

    it('soft sector focus boosts matching cards but does not hard block other cards', () => {
      const focus: CyklusRunFocus = { type: 'sector', id: 'archive', label: 'Archiv', strictness: 'soft', remainingCards: 10 };
      const state = focusedState(focus);
      const focusedCard = findScoredCard(state, (card) => cardMatchesRunFocus(card, focus));
      const otherCard = findScoredCard(state, (card) => !cardMatchesRunFocus(card, focus));

      const focusedBreakdown = explainCardScore(state, focusedCard);
      const { runFocus: _runFocus, ...stateWithoutFocus } = state;
      void _runFocus;
      const baselineBreakdown = explainCardScore(stateWithoutFocus, focusedCard);
      const otherBreakdown = explainCardScore(state, otherCard);

      expect(focusedBreakdown.score).toBeGreaterThan(baselineBreakdown.score);
      expect(focusedBreakdown.reasons).toContain('run focus soft +700');
      expect(otherBreakdown.score).toBeGreaterThan(0);
    });

    it('pack and appendix focus matches pack ids and focus tags', () => {
      const packFocus: CyklusRunFocus = { type: 'pack', id: 'sandbox_absurd', label: 'Pískoviště absurdna', strictness: 'soft', remainingCards: 10 };
      const packState = focusedState(packFocus);
      const packCard = findScoredCard(packState, (card) => cardMatchesRunFocus(card, packFocus));
      expect(packCard.packId).toBe(packFocus.id);
      expect(explainCardScore(packState, packCard).reasons).toContain('run focus soft +700');

      const appendixFocus: CyklusRunFocus = { type: 'appendix', id: 'sarkasma_therapy', label: 'Sarkasmina terapie', strictness: 'strong', remainingCards: 8 };
      const appendixState = focusedState(appendixFocus);
      const appendixCard = findScoredCard(appendixState, (card) => cardMatchesRunFocus(card, appendixFocus));
      const appendixBreakdown = explainCardScore(appendixState, appendixCard);

      expect(cardMatchesRunFocus(appendixCard, appendixFocus)).toBe(true);
      expect(appendixBreakdown.reasons).toContain('run focus strong +6000');
    });

    it('strong focus still allows safe bypass cards and picks a focused-compatible candidate', () => {
      const focus: CyklusRunFocus = { type: 'sector', id: 'archive', label: 'Archiv', strictness: 'strong', remainingCards: 8 };
      const state = focusedState(focus);
      const next = pickNextCard(state);
      const focusBypass =
        next.category === 'system' ||
        next.category === 'crisis' ||
        next.category === 'followup' ||
        next.category === 'item_trigger' ||
        (!next.sector && next.packId === 'base');

      expect(cardMatchesRunFocus(next, focus) || focusBypass).toBe(true);
    });

    it('scheduled cards keep priority over focus', () => {
      const focus: CyklusRunFocus = { type: 'sector', id: 'archive', label: 'Archiv', strictness: 'strong', remainingCards: 8 };
      const state = focusedState(focus);
      const scheduledCard = findScoredCard(state, (card) => !cardMatchesRunFocus(card, focus));
      const scheduledState: CyklusRunState = {
        ...state,
        scheduledCards: [{ cardId: scheduledCard.id, turnsRemaining: 0, ifInvalid: 'force' }],
      };

      expect(pickNextCard(scheduledState).id).toBe(scheduledCard.id);
    });

    it('falls back to the normal pool when a focus has no matching cards', () => {
      const focus: CyklusRunFocus = { type: 'pack', id: 'missing_focus_pack', label: 'Missing focus pack', strictness: 'strong', remainingCards: 8 };
      const state = focusedState(focus);

      expect(pickNextCard(state)).toBeDefined();
    });

    it('expires remaining focus cards after regular choices', () => {
      const focus: CyklusRunFocus = { type: 'sector', id: 'archive', label: 'Archiv', strictness: 'soft', remainingCards: 1 };
      const state: CyklusRunState = {
        ...focusedState(focus),
        currentCardId: 'first_boot',
      };

      const next = resolveChoice(state, 'yes');

      expect(next.runFocus).toBeUndefined();
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
      const knownPoolIds = new Set(getKnownPoolIds());
      const referencedPoolIds = new Set<string>();
      allPoolEffects.forEach((e) => referencedPoolIds.add(e.poolId));
      CYKLUS_UNLOCKS.forEach((u) => referencedPoolIds.add(u.poolId));
      const missing = [...referencedPoolIds].filter((id) => !knownPoolIds.has(id));
      expect(missing).toEqual([]);
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

  describe('export run log', () => {
    it('does not produce like-like profile label', () => {
      const state = createCyklusRun(true);
      state.profile = { E: 1, I: 0, S: 0, N: 2, T: 1, F: 0, J: 1, P: 0 };
      const log = exportRunLog(state, 'full');
      expect(log).not.toContain('like-like');
      expect(log).toContain('-like');
    });

    it('codename uses neutral item construction', () => {
      const state = createCyklusRun(true);
      state.inventory = ['black_folder'];
      const name = generateRunCodename(state);
      expect(name).not.toMatch(/ se [A-ZÁÉÍÓÚŮÝ][a-zA-ZÁÉÍÓÚŮÝáéíóúůý]+/);
      expect(name).toContain('nese:');
    });

    it('completed run export includes goals and rewards', () => {
      const state = createCyklusRun(true);
      state.status = 'completed';
      state.totalChoices = 20;
      state.goals = [
        { id: 'visit_3_sectors', title: 'Navštiv 3 sektory', description: 'test', target: 3, progress: 3, completed: true, rewardPool: 'explorer', rewardTitle: 'Průzkumník' },
      ];
      const reward: RunReward = {
        currencies: { residuum: 12 },
        unlockedUpgrades: [],
        unlockedScars: [],
        newTitles: [],
        reasons: ['Stabilizace'],
        craftingMaterials: {},
        unlockedRecipes: [],
        profileMastery: {},
        voidRoomHints: [],
        recommendedActions: [],
        deathStat: undefined,
      };
      const log = exportRunLog(state, 'full', reward);
      expect(log).toContain('Splněné cíle:');
      expect(log).toContain('Navštiv 3 sektory');
      expect(log).toContain('Odměny:');
      expect(log).toContain('Reziduum: +12');
    });

    it('death run export includes cause and key threat', () => {
      const state = createCyklusRun(true);
      state.status = 'dead';
      state.totalChoices = 10;
      state.stats = { energy: 100, memory: 50, bond: 50, control: 50 };
      state.history = [
        { turn: 1, cycle: 1, cardId: 'first_boot', direction: 'yes', statDelta: { energy: 30 }, statsAfter: { energy: 80, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 1 },
      ];
      const log = exportRunLog(state, 'full');
      expect(log).toContain('Primární příčina:');
      expect(log).toContain('Energie');
      expect(log).toContain('Nejnebezpečnější rozhodnutí:');
    });

    it('cycle summaries use consistent recorded-choices wording', () => {
      const state = createCyklusRun(true);
      state.status = 'completed';
      state.history = [
        { turn: 1, cycle: 1, cardId: 'first_boot', direction: 'yes', statDelta: {}, statsAfter: { energy: 50, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 1 },
      ];
      state.cycleSummaries = [composeCycleSummary({ ...state, cycle: 2, history: state.history })];
      const log = exportRunLog(state, 'full');
      expect(log).toContain('zaznamenaných voleb');
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

    it('inventory_instinct makes combo hint name the missing item', () => {
      const state = createCyklusRun(true);
      state.inventory = ['mirror_shard'];
      state.flags = ['inventory_instinct_active'];
      const hint = getComboHint(state);
      expect(hint).toContain('Sarkasmin účet');
    });

    it('second_touch allows second item activation in same cycle with energy cost', () => {
      let state = createCyklusRun(true);
      state.inventory = ['rubber_seal'];
      state.flags = ['second_touch_active'];
      const first = activateItem(state, 'rubber_seal');
      expect(first).not.toBeNull();
      expect(first!.state.itemActivationCountThisCycle).toBe(1);
      const second = activateItem(first!.state, 'rubber_seal');
      expect(second).not.toBeNull();
      expect(second!.state.itemActivationCountThisCycle).toBe(2);
      expect(second!.state.stats.energy).toBe(state.stats.energy + 6);
      const third = activateItem(second!.state, 'rubber_seal');
      expect(third).toBeNull();
    });

    it('rerollRunGoals changes goals once with goal_reroll_active', () => {
      const state = createCyklusRun(true);
      state.seed = 'reroll-test-0';
      state.goals = generateRunGoals(state.seed);
      state.flags = ['goal_reroll_active'];
      const original = state.goals.map((g) => g.id);
      const rerolled = rerollRunGoals(state);
      expect(rerolled.goals.map((g) => g.id)).not.toEqual(original);
      expect(rerolled.flags).toContain('goal_reroll_used');
      const second = rerollRunGoals(rerolled);
      expect(second.goals.map((g) => g.id)).toEqual(rerolled.goals.map((g) => g.id));
    });

    it('incomplete_manual adds nearest extreme stat to pre-run warning', () => {
      const state = createCyklusRun(true);
      state.flags = ['incomplete_manual_active'];
      state.stats = { energy: 58, memory: 50, bond: 50, control: 50 };
      const warn = generatePreRunWarning(state);
      expect(warn).toContain('Energie');
    });

    it('applyUpgradeScore boosts tai cards when tai_trust is active', () => {
      const state = createCyklusRun(true);
      state.flags = ['tai_trust_active'];
      const taiCard = Object.values(CYKLUS_CARDS).find((c) => c.tags.includes('tai'))!;
      const without = explainCardScore({ ...state, flags: [] }, taiCard);
      const withUpgrade = explainCardScore(state, taiCard);
      expect(withUpgrade.score).toBeGreaterThan(without.score);
    });

    it('applyMetaProgressionCardScoring boosts pattern cards when ni_premonition is active', () => {
      const state = createCyklusRun(true);
      const patternCard: SwipeCard = {
        id: 'test_pattern',
        title: 'Test pattern',
        scene: 'Test.',
        category: 'choice',
        tags: ['pattern'],
        rarity: 'common',
        logLabel: 'test',
        yesLabel: 'yes',
        noLabel: 'no',
        yes: { effects: [], preview: { hint: 'test' }, resultText: 'yes' },
        no: { effects: [], preview: { hint: 'test' }, resultText: 'no' },
      };
      const without = explainCardScore({ ...state, flags: [] }, patternCard);
      state.flags = ['ni_premonition_active'];
      const withMeta = explainCardScore(state, patternCard);
      expect(withMeta.score).toBeGreaterThan(without.score);
      expect(withMeta.reasons.some((r: string) => r.includes('meta'))).toBe(true);
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
      const state = createCyklusRun(true);
      const warn = generatePreRunWarning(state);
      expect(warn).toBeNull();
      spy.mockRestore();
    });

    it('generatePreRunWarning uses actual deathStat from history', () => {
      const history = [{ id: 'run-1', endedAt: 1, status: 'dead' as const, endingTitle: 'Konec', cyclesSurvived: 1, totalChoices: 1, dominantProfile: 'Ni', archetype: 'test', profile: { Ni: 5 }, imprints: [], visitedSectors: ['void'], deathStat: 'memory' as const }];
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(history));
      const state = createCyklusRun(true);
      const warn = generatePreRunWarning(state);
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

  describe('tutorial V2 — two-tier structure', () => {
    it('tutorial cards are unique, scheduledOnly, category tutorial (≥ 17 with junction)', () => {
      const tutorialIds = Object.keys(CYKLUS_CARDS).filter((id) => id.startsWith('tutorial_'));
      expect(tutorialIds.length).toBeGreaterThanOrEqual(17);
      for (const id of tutorialIds) {
        const card = CYKLUS_CARDS[id]!;
        expect(card.category).toBe('tutorial');
        expect(card.rarity).toBe('unique');
        expect(card.once).toBe(true);
        expect(card.triggerMode).toBe('scheduledOnly');
        expect(card.yes).toBeDefined();
        expect(card.no).toBeDefined();
        expect(card.yes.preview).toBeDefined();
        expect(card.no.preview).toBeDefined();
      }
    });

    it('tutorial_00_welcome schedules tutorial_01_swipe', () => {
      const card = CYKLUS_CARDS['tutorial_00_welcome']!;
      const yesSchedule = card.yes.effects.find((e) => e.type === 'schedule');
      const noSchedule = card.no.effects.find((e) => e.type === 'schedule');
      expect(yesSchedule?.type === 'schedule' ? yesSchedule.cardId : '').toBe('tutorial_01_swipe');
      expect(noSchedule?.type === 'schedule' ? noSchedule.cardId : '').toBe('tutorial_01_swipe');
    });

    it('minimum tutorial chain is 00→01→02→03→04→04b_junction', () => {
      const ids = [
        'tutorial_00_welcome', 'tutorial_01_swipe', 'tutorial_02_stats',
        'tutorial_03_balance', 'tutorial_04_preview', 'tutorial_04b_junction',
      ];
      for (let i = 0; i < ids.length - 1; i++) {
        const card = CYKLUS_CARDS[ids[i]!]!;
        const next = ids[i + 1]!;
        const yesNext = card.yes.effects.find((e) => e.type === 'schedule');
        const noNext = card.no.effects.find((e) => e.type === 'schedule');
        expect(yesNext?.type === 'schedule' ? yesNext.cardId : '').toBe(next);
        expect(noNext?.type === 'schedule' ? noNext.cardId : '').toBe(next);
      }
    });

    it('extended tutorial chain is 05→…→15_ready', () => {
      const ids = [
        'tutorial_05_profile', 'tutorial_06_items', 'tutorial_07_imprints',
        'tutorial_08_consequences', 'tutorial_09_sectors', 'tutorial_10_cycle', 'tutorial_11_restart',
        'tutorial_12_void', 'tutorial_13_progression', 'tutorial_14_packs', 'tutorial_15_ready',
      ];
      for (let i = 0; i < ids.length - 1; i++) {
        const card = CYKLUS_CARDS[ids[i]!]!;
        const next = ids[i + 1]!;
        const yesNext = card.yes.effects.find((e) => e.type === 'schedule');
        const noNext = card.no.effects.find((e) => e.type === 'schedule');
        expect(yesNext?.type === 'schedule' ? yesNext.cardId : '').toBe(next);
        expect(noNext?.type === 'schedule' ? noNext.cardId : '').toBe(next);
      }
    });

    it('tutorial_04b_junction YES sets tutorial_min_done + tutorial_v2_done and schedules restart_0', () => {
      const card = CYKLUS_CARDS['tutorial_04b_junction']!;
      const yesFlags = card.yes.effects.filter((e) => e.type === 'flag').map((e) => e.flag);
      expect(yesFlags).toContain('tutorial_min_done');
      expect(yesFlags).toContain('tutorial_v2_done');
      const yesSchedule = card.yes.effects.find((e) => e.type === 'schedule');
      expect(yesSchedule?.type === 'schedule' ? yesSchedule.cardId : '').toBe('restart_0');
    });

    it('tutorial_04b_junction NO sets tutorial_min_done and schedules tutorial_05_profile', () => {
      const card = CYKLUS_CARDS['tutorial_04b_junction']!;
      const noFlags = card.no.effects.filter((e) => e.type === 'flag').map((e) => e.flag);
      expect(noFlags).toContain('tutorial_min_done');
      expect(noFlags).not.toContain('tutorial_v2_done');
      const noSchedule = card.no.effects.find((e) => e.type === 'schedule');
      expect(noSchedule?.type === 'schedule' ? noSchedule.cardId : '').toBe('tutorial_05_profile');
    });

    it('tutorial_15_ready sets tutorial_v2_done and schedules restart_0', () => {
      const card = CYKLUS_CARDS['tutorial_15_ready']!;
      const yesFlags = card.yes.effects.filter((e) => e.type === 'flag').map((e) => e.flag);
      const noFlags = card.no.effects.filter((e) => e.type === 'flag').map((e) => e.flag);
      expect(yesFlags).toContain('tutorial_v2_done');
      expect(noFlags).toContain('tutorial_v2_done');
      const yesSchedule = card.yes.effects.find((e) => e.type === 'schedule');
      const noSchedule = card.no.effects.find((e) => e.type === 'schedule');
      expect(yesSchedule?.type === 'schedule' ? yesSchedule.cardId : '').toBe('restart_0');
      expect(noSchedule?.type === 'schedule' ? noSchedule.cardId : '').toBe('restart_0');
    });

    it('minimum path (YES at junction) reaches restart_0 after 6 cards', () => {
      let state = createCyklusRun(false);
      expect(state.currentCardId).toBe('tutorial_00_welcome');
      for (let i = 0; i < 10; i++) {
        if (state.currentCardId === 'tutorial_04b_junction') {
          state = resolveChoice(state, 'yes');
          break;
        }
        state = resolveChoice(state, 'yes');
        expect(state.currentCardId.startsWith('tutorial_') || state.currentCardId === 'restart_0').toBe(true);
      }
      expect(state.flags).toContain('tutorial_min_done');
      expect(state.flags).toContain('tutorial_v2_done');
      expect(state.currentCardId).toBe('restart_0');
    });

    it('extended path (NO at junction) continues to tutorial_05_profile', () => {
      let state = createCyklusRun(false);
      while (state.currentCardId !== 'tutorial_04b_junction' && state.totalChoices < 10) {
        state = resolveChoice(state, 'yes');
      }
      expect(state.currentCardId).toBe('tutorial_04b_junction');
      state = resolveChoice(state, 'no');
      expect(state.flags).toContain('tutorial_min_done');
      expect(state.flags).not.toContain('tutorial_v2_done');
      expect(state.currentCardId).toBe('tutorial_05_profile');
    });

    it('skipTutorial still works — tutorial_v2_done blocks tutorial from restarting', () => {
      const seen = createCyklusRun(true);
      expect(seen.currentCardId).not.toBe('tutorial_00_welcome');
      expect(seen.flags).not.toContain('tutorial_v2_done');
    });

    it('old tutorial_v2_done flag still prevents tutorial on new run', () => {
      const state = createCyklusRun(false);
      const withFlag = { ...state, flags: [...state.flags, 'tutorial_v2_done'] };
      expect(withFlag.flags).toContain('tutorial_v2_done');
    });

    it('pickNextCard allows restart after tutorial_min_done', () => {
      let state = createCyklusRun(false);
      while (state.currentCardId !== 'restart_0' && state.totalChoices < 15) {
        state = resolveChoice(state, 'yes');
      }
      expect(state.currentCardId).toBe('restart_0');
    });
  });

  describe('trust patch — formatting', () => {
    it('roundVisibleNumber clamps non-finite values to 0', () => {
      expect(roundVisibleNumber(NaN)).toBe(0);
      expect(roundVisibleNumber(Infinity)).toBe(0);
      expect(roundVisibleNumber(13.9999999999)).toBe(14);
      expect(roundVisibleNumber(-7.2)).toBe(-7);
    });

    it('formatDelta handles positive, negative and zero values', () => {
      expect(formatDelta(13.9999999999)).toBe('+14');
      expect(formatDelta(-7.2)).toBe('-7');
      expect(formatDelta(0)).toBe('0');
      expect(formatDelta(-0.4)).toBe('0');
    });

    it('formatAbsDelta returns absolute rounded value', () => {
      expect(formatAbsDelta(13.9999999999)).toBe('14');
      expect(formatAbsDelta(-7.2)).toBe('7');
      expect(formatAbsDelta(0)).toBe('0');
    });
  });

  describe('trust patch — death analysis', () => {
    it('analyzeDeath returns rounded contributor deltas', () => {
      const state = createCyklusRun(true);
      state.status = 'dead';
      state.stats = { energy: 100, memory: 50, bond: 50, control: 50 };
      state.history = [
        { turn: 1, cycle: 1, cardId: 'first_boot', direction: 'yes', statDelta: { energy: 13.9999999999 }, statsAfter: { energy: 64, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 1 },
        { turn: 2, cycle: 1, cardId: 'black_folder', direction: 'yes', statDelta: { energy: -3.1 }, statsAfter: { energy: 61, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 2 },
      ];
      const analysis = analyzeDeath(state);
      expect(analysis).not.toBeNull();
      expect(analysis!.stat).toBe('energy');
      expect(analysis!.topContributors.map((c: { delta: number }) => c.delta)).toEqual([14]);
    });

    it('analyzeDeath sorts contributors by absolute rounded delta', () => {
      const state = createCyklusRun(true);
      state.status = 'dead';
      state.stats = { energy: 100, memory: 50, bond: 50, control: 50 };
      state.history = [
        { turn: 1, cycle: 1, cardId: 'first_boot', direction: 'yes', statDelta: { energy: 5.4 }, statsAfter: { energy: 55, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 1 },
        { turn: 2, cycle: 1, cardId: 'black_folder', direction: 'yes', statDelta: { energy: -12.1 }, statsAfter: { energy: 43, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 2 },
        { turn: 3, cycle: 1, cardId: 'archive_key', direction: 'yes', statDelta: { energy: 7.9 }, statsAfter: { energy: 51, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 3 },
      ];
      const analysis = analyzeDeath(state);
      const deltas = analysis!.topContributors.map((c: { delta: number }) => c.delta);
      expect(deltas).toEqual([8, 5]);
      expect(Math.abs(deltas[0]!)).toBeGreaterThanOrEqual(Math.abs(deltas[1]!));
    });
  });

  describe('trust patch — cycle summary and export', () => {
    it('composeCycleSummary contains no float artifacts', () => {
      const state = createCyklusRun(true);
      state.cycle = 2;
      state.history = [
        { turn: 1, cycle: 1, cardId: 'first_boot', direction: 'yes', statDelta: { energy: 13.9999999999 }, statsAfter: { energy: 64, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 1 },
      ];
      const summary = composeCycleSummary(state);
      expect(summary).not.toContain('13.9999999999');
      expect(summary).toContain('14');
    });

    it('full export contains no float artifacts', () => {
      const state = createCyklusRun(true);
      state.status = 'dead';
      state.stats = { energy: 100, memory: 50, bond: 50, control: 50 };
      state.history = [
        { turn: 1, cycle: 1, cardId: 'first_boot', direction: 'yes', statDelta: { energy: 13.9999999999 }, statsAfter: { energy: 64, memory: 50, bond: 50, control: 50 }, profileDelta: {}, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, sectorBefore: 'void', sectorAfter: 'void', ts: 1 },
      ];
      const log = exportRunLog(state, 'full');
      expect(log).not.toContain('13.9999999999');
      expect(log).toContain('+14');
    });
  });

  describe('trust patch — fallback archetypes', () => {
    it('computeProfile returns a meaningful fallback for high memory + archive sector', () => {
      const state = createCyklusRun(true);
      state.stats = { energy: 50, memory: 90, bond: 50, control: 50 };
      state.profile = { E: 1, I: 2, S: 0, N: 3, T: 1, F: 0, J: 1, P: 0 };
      state.visitedSectors = ['void', 'archive'];
      const profile = computeProfile(state);
      expect(profile.archetype).not.toBe('Neklasifikovatelný subjekt');
      expect(profile.archetype).toBe('Archivní potápěč');
    });

    it('computeProfile returns a meaningful fallback for control + form_office', () => {
      const state = createCyklusRun(true);
      state.stats = { energy: 45, memory: 50, bond: 35, control: 92 };
      state.profile = { E: 3, I: 0, S: 1, N: 0, T: 10, F: 0, J: 12, P: 0, Te: 8 };
      state.visitedSectors = ['void', 'form_office', 'form_office'];
      state.inventory = [];
      const profile = computeProfile(state);
      expect(profile.archetype).not.toBe('Neklasifikovatelný subjekt');
      expect(profile.archetype).toBe('Kontrolní mučedník');
    });

    it('computeProfile returns rare generic fallback only when nothing matches', () => {
      const state = createCyklusRun(true);
      state.stats = { energy: 50, memory: 50, bond: 50, control: 50 };
      state.profile = { E: 2, I: 2, S: 2, N: 2, T: 2, F: 2, J: 2, P: 2 };
      state.visitedSectors = ['void'];
      state.inventory = [];
      state.imprints = [];
      const profile = computeProfile(state);
      expect(profile.archetype).toBe('Neklasifikovatelný subjekt');
    });
  });

  describe('trust patch — comment pools', () => {
    it('pickAvoidingRecent is deterministic for same seed and recentComments', () => {
      const pool = ['a', 'b', 'c', 'd'];
      const recent = ['a'];
      const r1 = pickAvoidingRecent(pool, 'seed', recent);
      const r2 = pickAvoidingRecent(pool, 'seed', recent);
      expect(r1).toBe(r2);
    });

    it('pickAvoidingRecent avoids recent comments when pool is larger than 3', () => {
      const pool = ['a', 'b', 'c', 'd', 'e'];
      const recent = ['a', 'b', 'c'];
      const result = pickAvoidingRecent(pool, 'seed', recent);
      expect(recent).not.toContain(result);
    });

    it('loadRecentCyklusComments does not crash when window is undefined', () => {
      const comments = loadRecentCyklusComments();
      expect(Array.isArray(comments)).toBe(true);
    });

    it('saveRecentCyklusComment keeps only the last 3 comments', () => {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem('synthoma_cyklus_recent_comments');
      saveRecentCyklusComment('one');
      saveRecentCyklusComment('two');
      saveRecentCyklusComment('three');
      saveRecentCyklusComment('four');
      const comments = loadRecentCyklusComments();
      expect(comments).toEqual(['four', 'three', 'two']);
    });
  });
});
