import { FOCUS_RUN_OPTIONS } from '../../../components/cyklus/CyklusVoidHub';
import {
  createCyklusRun,
  explainCardScore,
  getCardById,
  pickNextCard,
  pickNextCardState,
  resolveChoice,
} from '../cyklusEngine';
import { checkCardConditions, cardMatchesRunFocus, getCardPool, getReadyScheduledCards } from '../cyklusCardPicker';
import { CYKLUS_CARDS, CYKLUS_ITEMS } from '../content';
import { getKnownPoolIds } from '../cyklusPoolCatalog';
import { getEmptyStoryProgression, saveStoryProgression } from '../cyklusStory';
import type { CyklusEffect, CyklusRunFocus, CyklusRunState, StatKey, SwipeCard } from '../cyklusTypes';

const AUDIT_RUNS = 16;
const MIXED_TURNS = 10;
const RESTART_IDS = ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'];
const STATS: StatKey[] = ['energy', 'memory', 'bond', 'control'];
const FOCUS_TAG_ALIASES: Record<string, string[]> = {
  archive: ['archive'],
  memory_sandbox: ['memory_sandbox', 'childhood', 'sandbox', 'memory'],
  glitchka_nest: ['glitchka', 'glitch', 'bug'],
  sarkasma_terminal: ['sarkasma', 'terminal'],
  tai_core: ['tai'],
  toll_dvanactnik: ['toll_dvanactnik', 'debt', 'toll'],
  detective_echo_case: ['detective_echo_case', 'detective', 'clue'],
  sarkasma_therapy: ['sarkasma_therapy', 'sarkasma', 'therapy', 'defense', 'humor'],
  glitchka_chat: ['glitchka_chat', 'glitchka', 'question', 'safe'],
};

type FocusAudit = {
  label: string;
  id: string;
  strictness: CyklusRunFocus['strictness'];
  directMatches: number;
  tagMatches: number;
  packMatches: number;
  selected: number;
  matching: number;
  safeExceptions: number;
  bleed: number;
  scheduled: number;
  restart: number;
  tutorial: number;
  fallback: number;
  emptyPool: number;
  mixedMatching: number;
  matchingRate: number;
  mixedRate: number;
};

function setupStoryAsPostPrologue(): void {
  saveStoryProgression({
    ...getEmptyStoryProgression(),
    currentAct: 'act1_sandbox_glitchka',
    completedEpisodes: ['restart_prologue'],
    restartPrologueSeen: true,
  });
}

function withAllKnownPools(state: CyklusRunState, seed: string): CyklusRunState {
  return {
    ...state,
    seed,
    rngStep: 0,
    currentCardId: 'first_boot',
    flags: [...new Set([...state.flags, 'tutorial_v2_done', 'tutorial_min_done'])],
    usedCardIds: RESTART_IDS,
    unlockedPools: getKnownPoolIds(),
    scheduledCards: [],
    stats: { energy: 50, memory: 50, bond: 50, control: 50 },
    totalChoices: 0,
    choiceInCycle: 1,
  };
}

function createAuditState(focus: CyklusRunFocus | undefined, seed: string): CyklusRunState {
  setupStoryAsPostPrologue();
  return withAllKnownPools(createCyklusRun(true, focus), seed);
}

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
    const drift = STATS.reduce((sum, stat) => sum + Math.abs(nextStats[stat] - 50), 0);
    return deathPenalty + edgePenalty * 20 + drift;
  };
  return scoreDirection(card.yes.effects) <= scoreDirection(card.no.effects) ? 'yes' : 'no';
}

function directFocusMatch(card: SwipeCard, focus: CyklusRunFocus): boolean {
  if (focus.type === 'sector') {
    return card.sector === focus.id || Boolean(card.conditions?.some((condition) => condition.type === 'sector' && condition.sector === focus.id));
  }
  return false;
}

function tagFocusMatch(card: SwipeCard, focus: CyklusRunFocus): boolean {
  if (card.category === 'tutorial' || card.category === 'restart') return false;
  const aliases = FOCUS_TAG_ALIASES[focus.id] ?? [];
  return card.tags.some((tag) => tag === focus.id || tag === `${focus.type}:${focus.id}` || aliases.includes(tag));
}

function packFocusMatch(card: SwipeCard, focus: CyklusRunFocus): boolean {
  return card.packId === focus.id;
}

function safeExceptionKind(card: SwipeCard): 'restart' | 'tutorial' | 'crisis' | 'system' | 'item_trigger' | 'followup' | 'universal' | null {
  if (card.category === 'restart') return 'restart';
  if (card.category === 'tutorial') return 'tutorial';
  if (card.category === 'crisis' || card.tags.includes('crisis') || card.tags.includes('danger')) return 'crisis';
  if (card.category === 'system') return 'system';
  if (card.category === 'item_trigger' || card.tags.includes('item_trigger')) return 'item_trigger';
  if (card.category === 'followup' || card.tags.includes('followup')) return 'followup';
  if (!card.sector && card.packId === 'base' && ['system', 'choice', 'memory', 'silent', 'object'].includes(card.category)) return 'universal';
  return null;
}

function focusCoverage(focus: CyklusRunFocus): Pick<FocusAudit, 'directMatches' | 'tagMatches' | 'packMatches'> {
  const cards = Object.values(CYKLUS_CARDS);
  return {
    directMatches: cards.filter((card) => directFocusMatch(card, focus)).length,
    tagMatches: cards.filter((card) => tagFocusMatch(card, focus)).length,
    packMatches: cards.filter((card) => packFocusMatch(card, focus)).length,
  };
}

function measureRun(focus: CyklusRunFocus, runIndex: number): Omit<FocusAudit, 'label' | 'id' | 'strictness' | 'directMatches' | 'tagMatches' | 'packMatches' | 'mixedMatching' | 'mixedRate'> {
  let state = createAuditState(focus, `focus-audit-${focus.id}-${runIndex}`);
  let selected = 0;
  let matching = 0;
  let safeExceptions = 0;
  let bleed = 0;
  let scheduled = 0;
  let restart = 0;
  let tutorial = 0;
  let fallback = 0;
  let emptyPool = 0;

  state = pickNextCardState(state);
  const maxTurns = focus.remainingCards ?? MIXED_TURNS;

  for (let turn = 0; turn < maxTurns && state.status === 'playing'; turn += 1) {
    const card = getCardById(state.currentCardId);
    if (!card) break;
    selected += 1;

    const pool = getCardPool(state);
    if (pool.length === 0) emptyPool += 1;
    const scored = pool.filter((candidate) => explainCardScore(state, candidate).score > 0);
    if (scored.length === 0) fallback += 1;
    if (getReadyScheduledCards(state).includes(card.id)) scheduled += 1;

    if (cardMatchesRunFocus(card, focus)) {
      matching += 1;
    } else {
      const exception = safeExceptionKind(card);
      if (exception) {
        safeExceptions += 1;
        if (exception === 'restart') restart += 1;
        if (exception === 'tutorial') tutorial += 1;
      } else {
        bleed += 1;
      }
    }

    state = resolveChoice(state, chooseStableDirection(state, card));
  }

  return {
    selected,
    matching,
    safeExceptions,
    bleed,
    scheduled,
    restart,
    tutorial,
    fallback,
    emptyPool,
    matchingRate: selected === 0 ? 0 : matching / selected,
  };
}

function measureMixedMatching(focus: CyklusRunFocus, runIndex: number, maxTurns: number): { selected: number; matching: number } {
  let state = createAuditState(undefined, `focus-audit-mixed-${focus.id}-${runIndex}`);
  let selected = 0;
  let matching = 0;

  state = pickNextCardState(state);
  for (let turn = 0; turn < maxTurns && state.status === 'playing'; turn += 1) {
    const card = getCardById(state.currentCardId);
    if (!card) break;
    selected += 1;
    if (cardMatchesRunFocus(card, focus)) matching += 1;
    state = resolveChoice(state, chooseStableDirection(state, card));
  }

  return { selected, matching };
}

function addAuditTotals(total: FocusAudit, run: ReturnType<typeof measureRun>): FocusAudit {
  return {
    ...total,
    selected: total.selected + run.selected,
    matching: total.matching + run.matching,
    safeExceptions: total.safeExceptions + run.safeExceptions,
    bleed: total.bleed + run.bleed,
    scheduled: total.scheduled + run.scheduled,
    restart: total.restart + run.restart,
    tutorial: total.tutorial + run.tutorial,
    fallback: total.fallback + run.fallback,
    emptyPool: total.emptyPool + run.emptyPool,
    matchingRate: 0,
  };
}

function auditFocus(focus: CyklusRunFocus): FocusAudit {
  const coverage = focusCoverage(focus);
  let total: FocusAudit = {
    label: focus.label,
    id: focus.id,
    strictness: focus.strictness,
    ...coverage,
    selected: 0,
    matching: 0,
    safeExceptions: 0,
    bleed: 0,
    scheduled: 0,
    restart: 0,
    tutorial: 0,
    fallback: 0,
    emptyPool: 0,
    mixedMatching: 0,
    matchingRate: 0,
    mixedRate: 0,
  };
  let mixedSelected = 0;

  for (let run = 0; run < AUDIT_RUNS; run += 1) {
    total = addAuditTotals(total, measureRun(focus, run));
    const mixed = measureMixedMatching(focus, run, focus.remainingCards ?? MIXED_TURNS);
    total.mixedMatching += mixed.matching;
    mixedSelected += mixed.selected;
  }

  return {
    ...total,
    matchingRate: total.selected === 0 ? 0 : total.matching / total.selected,
    mixedRate: mixedSelected === 0 ? 0 : total.mixedMatching / mixedSelected,
  };
}

let cachedAudits: FocusAudit[] | null = null;

function getAudits(): FocusAudit[] {
  if (!cachedAudits) cachedAudits = FOCUS_RUN_OPTIONS.map(auditFocus);
  return cachedAudits;
}

function roundedPercent(value: number): number {
  return Math.round(value * 1000) / 10;
}

describe('Cyklus focus distribution audit', () => {
  beforeEach(() => {
    localStorage.clear();
    setupStoryAsPostPrologue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('every VoidHub focus has matching card coverage', () => {
    const audits = getAudits();

    for (const audit of audits) {
      expect(audit.directMatches + audit.tagMatches + audit.packMatches).toBeGreaterThan(0);
      expect(audit.selected).toBeGreaterThan(0);
      expect(audit.emptyPool).toBe(0);
      expect(audit.fallback).toBe(0);
    }
  });

  it('focused runs produce more matching cards than mixed runs', () => {
    const audits = getAudits();

    for (const audit of audits) {
      expect(audit.matchingRate).toBeGreaterThan(audit.mixedRate);
      if (audit.strictness === 'strong') {
        expect(audit.matchingRate).toBeGreaterThanOrEqual(0.70);
      } else {
        expect(audit.matchingRate).toBeGreaterThanOrEqual(0.55);
      }
    }
  });

  it('soft focus keeps some bleed and strong focus remains safely bounded', () => {
    const audits = getAudits();
    const softAudits = audits.filter((audit) => audit.strictness === 'soft');
    const strongAudits = audits.filter((audit) => audit.strictness === 'strong');

    expect(softAudits.some((audit) => audit.bleed > 0 || audit.safeExceptions > 0)).toBe(true);
    for (const audit of strongAudits) {
      expect(audit.bleed + audit.safeExceptions).toBeGreaterThan(0);
    }
  });

  it('strong focus does not block scheduled, tutorial, restart, crisis, system, or item trigger cards', () => {
    const focus: CyklusRunFocus = { type: 'appendix', id: 'sarkasma_therapy', label: 'Sarkasmina terapie', strictness: 'strong', remainingCards: 8 };
    const base = createAuditState(focus, 'focus-audit-safety');
    const itemState = { ...base, inventory: Object.keys(CYKLUS_ITEMS) };
    const cards = Object.values(CYKLUS_CARDS);
    const pickBy = (predicate: (card: SwipeCard) => boolean) => cards.find((card) => predicate(card) && checkCardConditions(base, card));

    const scheduled = pickBy((card) => !cardMatchesRunFocus(card, focus) && card.category !== 'restart' && card.category !== 'tutorial');
    expect(scheduled).toBeDefined();
    if (scheduled) {
      expect(pickNextCard({ ...base, scheduledCards: [{ cardId: scheduled.id, turnsRemaining: 0, ifInvalid: 'force' }] }).id).toBe(scheduled.id);
    }

    const tutorial = getCardById('tutorial_00_welcome');
    expect(tutorial).toBeDefined();
    if (tutorial) {
      expect(cardMatchesRunFocus(tutorial, focus)).toBe(false);
      expect(safeExceptionKind(tutorial)).toBe('tutorial');
    }

    const restart = getCardById('restart_0');
    expect(restart).toBeDefined();
    if (restart) {
      expect(cardMatchesRunFocus(restart, focus)).toBe(false);
      expect(safeExceptionKind(restart)).toBe('restart');
    }

    const crisis = pickBy((card) => !cardMatchesRunFocus(card, focus) && (card.category === 'crisis' || card.tags.includes('crisis') || card.tags.includes('danger')));
    const system = pickBy((card) => !cardMatchesRunFocus(card, focus) && card.category === 'system');
    const itemTrigger = cards.find((card) =>
      !cardMatchesRunFocus(card, focus) &&
      (card.category === 'item_trigger' || card.tags.includes('item_trigger')) &&
      checkCardConditions(itemState, card),
    );
    expect(crisis).toBeDefined();
    expect(system).toBeDefined();
    expect(itemTrigger).toBeDefined();
  });

  it('focus expires after the expected number of regular cards and ignores technical cards', () => {
    const focus: CyklusRunFocus = { type: 'sector', id: 'archive', label: 'Archiv', strictness: 'strong', remainingCards: 2 };
    let state = createAuditState(focus, 'focus-audit-expiry');

    state = { ...state, currentCardId: 'tutorial_00_welcome' };
    state = resolveChoice(state, 'yes');
    expect(state.runFocus?.remainingCards).toBe(2);

    state = { ...state, currentCardId: 'restart_0' };
    state = resolveChoice(state, 'yes');
    expect(state.runFocus?.remainingCards).toBe(2);

    state = { ...state, currentCardId: 'first_boot' };
    state = resolveChoice(state, chooseStableDirection(state, getCardById('first_boot')!));
    expect(state.runFocus?.remainingCards).toBe(1);

    const nextCard = getCardById(state.currentCardId)!;
    state = resolveChoice(state, chooseStableDirection(state, nextCard));
    expect(state.runFocus).toBeUndefined();
  });

  it('prints a focus distribution report when requested', () => {
    const audits = getAudits();
    if (process.env.CYKLUS_FOCUS_AUDIT === '1') {
      // eslint-disable-next-line no-console
      console.table(audits.map((audit) => ({
        focus: audit.label,
        strictness: audit.strictness,
        selected: audit.selected,
        matching: audit.matching,
        matchingRate: `${roundedPercent(audit.matchingRate)}%`,
        mixedRate: `${roundedPercent(audit.mixedRate)}%`,
        safeExceptions: audit.safeExceptions,
        bleed: audit.bleed,
        fallback: audit.fallback,
        emptyPool: audit.emptyPool,
        directMatches: audit.directMatches,
        tagMatches: audit.tagMatches,
        packMatches: audit.packMatches,
      })));
    }
    expect(audits).toHaveLength(FOCUS_RUN_OPTIONS.length);
  });
});
