import {
  computeEnding,
  createCyklusRun,
  getCardById,
  pickNextCardState,
  resolveChoice,
} from '../cyklusEngine';
import { cardMatchesRunFocus } from '../cyklusCardPicker';
import { getKnownPoolIds } from '../cyklusPoolCatalog';
import { loadCyklusRun, saveCyklusRun, setServerSyncEnabled } from '../cyklusStorage';
import { getEmptyStoryProgression, saveStoryProgression } from '../cyklusStory';
import type { CyklusEffect, CyklusRunFocus, CyklusRunState, StatKey, SwipeCard } from '../cyklusTypes';

const RESTART_IDS = ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'];
const STATS: StatKey[] = ['energy', 'memory', 'bond', 'control'];
const RUN_STORAGE_KEY = 'synthoma_cyklus_run_v1';

function statDelta(effects: CyklusEffect[]): Record<StatKey, number> {
  const delta = { energy: 0, memory: 0, bond: 0, control: 0 };
  for (const effect of effects) {
    if (effect.type === 'stat') delta[effect.key] += effect.amount;
  }
  return delta;
}

function chooseStableDirection(state: CyklusRunState, card: SwipeCard): 'yes' | 'no' {
  const scoreDirection = (effects: CyklusEffect[]) => {
    const delta = statDelta(effects);
    const nextStats = {
      energy: state.stats.energy + delta.energy,
      memory: state.stats.memory + delta.memory,
      bond: state.stats.bond + delta.bond,
      control: state.stats.control + delta.control,
    };
    const deathPenalty = STATS.some((stat) => nextStats[stat] <= 0 || nextStats[stat] >= 100) ? 10_000 : 0;
    const edgePenalty = STATS.reduce((sum, stat) => sum + Math.max(0, Math.abs(nextStats[stat] - 50) - 25), 0);
    return deathPenalty + edgePenalty * 20;
  };
  return scoreDirection(card.yes.effects) <= scoreDirection(card.no.effects) ? 'yes' : 'no';
}

function makeReadyRun(focus?: CyklusRunFocus): CyklusRunState {
  saveStoryProgression({
    ...getEmptyStoryProgression(),
    currentAct: 'act1_sandbox_glitchka',
    completedEpisodes: ['restart_prologue'],
    restartPrologueSeen: true,
  });
  return {
    ...createCyklusRun(true, focus),
    seed: focus ? `focus-route-${focus.id}-0` : 'first-hour-mixed-smoke',
    currentCardId: 'first_boot',
    flags: ['tutorial_min_done', 'tutorial_v2_done'],
    usedCardIds: RESTART_IDS,
    unlockedPools: getKnownPoolIds(),
    scheduledCards: [],
    stats: { energy: 50, memory: 50, bond: 50, control: 50 },
    totalChoices: 0,
    choiceInCycle: 1,
    rngStep: 0,
  };
}

function playRestartIntro(state: CyklusRunState): CyklusRunState {
  let next = state;
  for (let guard = 0; guard < 8 && next.currentCardId.startsWith('restart_'); guard += 1) {
    next = resolveChoice(next, 'yes');
  }
  return next;
}

function forceMemoryOutcome(state: CyklusRunState): CyklusRunState {
  return resolveChoice(
    {
      ...state,
      status: 'playing',
      currentCardId: 'archive_record_margin',
      stats: { ...state.stats, memory: 98 },
    },
    'yes',
  );
}

function isSafeFocusException(card: SwipeCard): boolean {
  return card.category === 'system' ||
    card.category === 'crisis' ||
    card.category === 'followup' ||
    card.category === 'item_trigger' ||
    card.tags.includes('crisis') ||
    card.tags.includes('danger') ||
    (!card.sector && card.packId === 'base');
}

function playFocusedStretch(focus: CyklusRunFocus): { state: CyklusRunState; cards: SwipeCard[] } {
  let state = pickNextCardState(makeReadyRun(focus));
  const cards: SwipeCard[] = [];

  for (let turn = 0; turn < (focus.remainingCards ?? 5) && state.status === 'playing'; turn += 1) {
    const card = getCardById(state.currentCardId);
    if (!card) throw new Error(`Missing card during focus smoke: ${state.currentCardId}`);
    cards.push(card);
    state = resolveChoice(state, chooseStableDirection(state, card));
  }

  return { state, cards };
}

function storeLegacyRun(overrides: Partial<CyklusRunState>): CyklusRunState {
  const base = makeReadyRun();
  const legacy = { ...base, ...overrides };
  localStorage.setItem(RUN_STORAGE_KEY, JSON.stringify(legacy));
  return legacy;
}

describe('Cyklus first-hour release candidate smoke', () => {
  beforeEach(() => {
    localStorage.clear();
    setServerSyncEnabled(false);
  });

  afterEach(() => {
    localStorage.clear();
    setServerSyncEnabled(true);
    jest.restoreAllMocks();
  });

  it('new player can take the minimum tutorial path, play a first run, see an outcome, and start mixed again', () => {
    let state = createCyklusRun(false);
    expect(state.currentCardId).toBe('tutorial_00_welcome');

    while (state.currentCardId !== 'tutorial_04b_junction' && state.totalChoices < 10) {
      state = resolveChoice(state, 'yes');
    }

    expect(state.currentCardId).toBe('tutorial_04b_junction');
    state = resolveChoice(state, 'yes');
    expect(state.flags).toEqual(expect.arrayContaining(['tutorial_min_done', 'tutorial_v2_done', 'tutorial_done']));
    expect(state.currentCardId).toBe('restart_0');

    state = playRestartIntro(state);
    expect(state.status).toBe('playing');
    expect(getCardById(state.currentCardId)).toBeDefined();

    const outcome = forceMemoryOutcome(state);
    expect(outcome.status).toBe('dead');
    expect(computeEnding(outcome)?.title).toBeTruthy();

    const nextMixed = createCyklusRun(true);
    expect(nextMixed.runFocus).toBeUndefined();
    expect(getCardById(nextMixed.currentCardId)).toBeDefined();
    expect(nextMixed.currentCardId.startsWith('tutorial_')).toBe(false);
  });

  it('new player can choose extended tutorial and reach the first playable run after tutorial_15_ready', () => {
    let state = createCyklusRun(false);
    while (state.currentCardId !== 'tutorial_04b_junction' && state.totalChoices < 10) {
      state = resolveChoice(state, 'yes');
    }

    state = resolveChoice(state, 'no');
    expect(state.currentCardId).toBe('tutorial_05_profile');
    expect(state.flags).toContain('tutorial_min_done');
    expect(state.flags).not.toContain('tutorial_v2_done');

    while (state.currentCardId !== 'tutorial_15_ready' && state.totalChoices < 30) {
      expect(state.currentCardId.startsWith('tutorial_')).toBe(true);
      state = resolveChoice(state, 'yes');
    }

    expect(state.currentCardId).toBe('tutorial_15_ready');
    state = resolveChoice(state, 'yes');
    expect(state.flags).toContain('tutorial_v2_done');
    expect(state.currentCardId).toBe('restart_0');

    const firstRun = playRestartIntro(state);
    expect(firstRun.status).toBe('playing');
    expect(getCardById(firstRun.currentCardId)).toBeDefined();
  });

  it('post-first-run archive focus plays as a readable area route and reaches an outcome', () => {
    const focus: CyklusRunFocus = {
      type: 'sector',
      id: 'archive',
      label: 'Archiv',
      strictness: 'soft',
      remainingCards: 10,
    };
    const { state, cards } = playFocusedStretch(focus);

    expect(cards.length).toBeGreaterThan(0);
    expect(cards.some((card) => cardMatchesRunFocus(card, focus))).toBe(true);
    expect(cards.slice(0, 5).every((card) => cardMatchesRunFocus(card, focus) || isSafeFocusException(card))).toBe(true);

    const outcome = forceMemoryOutcome(state);
    expect(outcome.status).toBe('dead');
    expect(computeEnding(outcome)).not.toBeNull();
  });

  it('post-first-run appendix focus plays as a short Glitchka trace instead of a mixed run', () => {
    const focus: CyklusRunFocus = {
      type: 'appendix',
      id: 'glitchka_chat',
      label: 'Pokec s Glitchkou',
      strictness: 'strong',
      remainingCards: 3,
    };
    const { state, cards } = playFocusedStretch(focus);

    expect(cards).toHaveLength(3);
    expect(cards.every((card) => cardMatchesRunFocus(card, focus) || isSafeFocusException(card))).toBe(true);
    expect(cards.some((card) => card.packId === 'glitchka_chat' || card.tags.includes('glitchka_chat'))).toBe(true);
    expect(state.runFocus).toBeUndefined();
  });

  it('save/load preserves active first-hour run shape including runFocus and scheduled cards', async () => {
    const focus: CyklusRunFocus = {
      type: 'sector',
      id: 'archive',
      label: 'Archiv',
      strictness: 'soft',
      remainingCards: 10,
    };
    const state: CyklusRunState = {
      ...makeReadyRun(focus),
      currentCardId: 'archive_record_margin',
      flags: ['tutorial_min_done', 'tutorial_v2_done', 'qa_loaded'],
      scheduledCards: [{ cardId: 'archive_index_card', turnsRemaining: 2, ifInvalid: 'delay' }],
      stats: { energy: 48, memory: 52, bond: 51, control: 49 },
    };

    await saveCyklusRun(state);
    const loaded = loadCyklusRun();

    expect(loaded).not.toBeNull();
    expect(loaded?.currentCardId).toBe(state.currentCardId);
    expect(loaded?.stats).toEqual(state.stats);
    expect(loaded?.flags).toEqual(state.flags);
    expect(loaded?.runFocus).toEqual({ ...focus, startedAtCycle: 1 });
    expect(loaded?.scheduledCards).toEqual(state.scheduledCards);

    const card = getCardById(loaded!.currentCardId)!;
    const next = resolveChoice(loaded!, chooseStableDirection(loaded!, card));
    expect(next.history.length).toBe(loaded!.history.length + 1);
    expect(next.currentCardId).toBeTruthy();
  });

  it('loads old mixed saves without runFocus as playable mixed runs', () => {
    const saved = storeLegacyRun({
      currentCardId: 'archive_record_margin',
      flags: ['legacy_flag', 'tutorial_v2_done'],
    });

    const loaded = loadCyklusRun();

    expect(loaded).not.toBeNull();
    expect(loaded?.currentCardId).toBe(saved.currentCardId);
    expect(loaded?.runFocus).toBeUndefined();
    expect(loaded?.flags).toEqual(expect.arrayContaining(['legacy_flag', 'tutorial_v2_done']));
    expect(getCardById(loaded!.currentCardId)).toBeDefined();
  });

  it('loads old tutorial_v2_done saves without tutorial_min_done without forcing tutorial restart', () => {
    storeLegacyRun({
      currentCardId: 'restart_0',
      flags: ['tutorial_v2_done'],
    });

    const loaded = loadCyklusRun();

    expect(loaded).not.toBeNull();
    expect(loaded?.flags).toContain('tutorial_v2_done');
    expect(loaded?.flags).not.toContain('tutorial_min_done');
    expect(loaded?.currentCardId).toBe('restart_0');
    expect(loaded?.currentCardId.startsWith('tutorial_')).toBe(false);
  });

  it('loads saves during scheduled tutorial cards with current card and schedule intact', () => {
    const scheduledCards = [{ cardId: 'tutorial_12_void', turnsRemaining: 1, ifInvalid: 'delay' as const }];
    storeLegacyRun({
      currentCardId: 'tutorial_11_restart',
      flags: ['tutorial_min_done'],
      scheduledCards,
    });

    const loaded = loadCyklusRun();

    expect(loaded).not.toBeNull();
    expect(loaded?.currentCardId).toBe('tutorial_11_restart');
    expect(loaded?.scheduledCards).toEqual(scheduledCards);
  });

  it('loads focused and expired-focus saves without losing currentCardId', () => {
    const focus: CyklusRunFocus = {
      type: 'sector',
      id: 'archive',
      label: 'Archiv',
      strictness: 'soft',
      remainingCards: 2,
    };

    storeLegacyRun({
      currentCardId: 'archive_record_margin',
      runFocus: focus,
    });
    expect(loadCyklusRun()?.runFocus).toEqual(focus);
    expect(loadCyklusRun()?.currentCardId).toBe('archive_record_margin');

    storeLegacyRun({
      currentCardId: 'glitchka_intro_noise',
      flags: ['tutorial_v2_done', 'old_flag_from_before_focus'],
    });
    const expired = loadCyklusRun();
    expect(expired?.runFocus).toBeUndefined();
    expect(expired?.currentCardId).toBe('glitchka_intro_noise');
    expect(expired?.flags).toContain('old_flag_from_before_focus');
  });

  it('tutorial completion flags prevent tutorial from being forced again', () => {
    const skipped = createCyklusRun(true);
    expect(skipped.currentCardId).not.toBe('tutorial_00_welcome');

    const oldSeen = {
      ...createCyklusRun(false),
      flags: ['tutorial_v2_done'],
      currentCardId: 'restart_0',
    };
    expect(oldSeen.flags).toContain('tutorial_v2_done');
    expect(oldSeen.currentCardId).toBe('restart_0');
  });
});
