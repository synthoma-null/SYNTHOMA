import { FOCUS_RUN_OPTIONS } from '../../../components/cyklus/CyklusVoidHub';
import {
  createCyklusRun,
  explainCardScore,
  getCardById,
  pickNextCardState,
  resolveChoice,
} from '../cyklusEngine';
import { cardMatchesRunFocus, getReadyScheduledCards } from '../cyklusCardPicker';
import { CYKLUS_CARDS } from '../content';
import { getKnownPoolIds } from '../cyklusPoolCatalog';
import { getEmptyStoryProgression, saveStoryProgression } from '../cyklusStory';
import type { CyklusEffect, CyklusRunFocus, CyklusRunState, StatKey, SwipeCard } from '../cyklusTypes';

const ROUTE_RUNS_PER_FOCUS = 2;
const RESTART_IDS = ['restart_0', 'restart_1', 'restart_2', 'restart_3', 'restart_4', 'restart_5'];
const STATS: StatKey[] = ['energy', 'memory', 'bond', 'control'];
const STRONG_OPENING_TAGS: Record<string, string[]> = {
  archive: ['archive'],
  memory_sandbox: ['memory_sandbox', 'childhood', 'sandbox', 'memory'],
  glitchka_nest: ['glitchka', 'glitch', 'bug', 'sandbox'],
  sarkasma_terminal: ['sarkasma', 'terminal', 'therapy', 'blackbox'],
  tai_core: ['tai', 'system', 'diagnostic', 'control'],
  toll_dvanactnik: ['toll_dvanactnik', 'debt', 'toll', 'market'],
  detective_echo_case: ['detective_echo_case', 'detective', 'clue', 'echo', 'archive', 'mirror'],
  sarkasma_therapy: ['sarkasma_therapy', 'sarkasma', 'therapy', 'defense', 'humor'],
  glitchka_chat: ['glitchka_chat', 'glitchka', 'question', 'safe'],
};

type RouteCardLog = {
  turn: number;
  cardId: string;
  title: string;
  sector: string;
  packId: string;
  category: string;
  tags: string[];
  matchesFocus: boolean;
  safetyException: string;
  admitReason: string;
  scoreReasons: string[];
  remainingBefore: number | null;
  remainingAfter: number | null;
};

type RouteLog = {
  seed: string;
  focusLabel: string;
  focusType: CyklusRunFocus['type'];
  strictness: CyklusRunFocus['strictness'];
  remainingStart: number | null;
  remainingEnd: number | null;
  cards: RouteCardLog[];
  opening: 'yes' | 'partial' | 'no';
  atmosphere: 'yes' | 'partial' | 'no';
  bleed: Array<{ cardId: string; title: string; verdict: 'meaningful leak' | 'neutral system exception' | 'disruptive card' }>;
};

function setupStoryAsPostPrologue(): void {
  saveStoryProgression({
    ...getEmptyStoryProgression(),
    currentAct: 'act1_sandbox_glitchka',
    completedEpisodes: ['restart_prologue'],
    restartPrologueSeen: true,
  });
}

function createRouteState(focus: CyklusRunFocus, seed: string): CyklusRunState {
  setupStoryAsPostPrologue();
  return {
    ...createCyklusRun(true, focus),
    seed,
    rngStep: 0,
    currentCardId: 'first_boot',
    flags: ['tutorial_v2_done', 'tutorial_min_done'],
    usedCardIds: RESTART_IDS,
    unlockedPools: getKnownPoolIds(),
    scheduledCards: [],
    modifier: { id: 'none', title: 'Bez modifikátoru', description: 'Audit baseline bez náhodného modifikátoru.', tags: [] },
    stats: { energy: 50, memory: 50, bond: 50, control: 50 },
    totalChoices: 0,
    choiceInCycle: 1,
  };
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

function safetyException(card: SwipeCard): string {
  if (card.category === 'restart') return 'restart';
  if (card.category === 'tutorial') return 'tutorial';
  if (card.category === 'system') return 'system';
  if (card.category === 'crisis' || card.tags.includes('crisis') || card.tags.includes('danger')) return 'crisis';
  if (card.category === 'item_trigger' || card.tags.includes('item_trigger')) return 'item_trigger';
  if (card.category === 'followup' || card.tags.includes('followup')) return 'followup';
  if (!card.sector && card.packId === 'base' && ['system', 'choice', 'memory', 'silent', 'object'].includes(card.category)) return 'universal';
  return '';
}

function cardHasOpeningSignal(card: SwipeCard, focus: CyklusRunFocus): boolean {
  if (cardMatchesRunFocus(card, focus)) return true;
  const tags = STRONG_OPENING_TAGS[focus.id] ?? [];
  return tags.some((tag) => card.tags.includes(tag)) || card.sector === focus.id || card.packId === focus.id;
}

function classifyBleed(card: SwipeCard, focus: CyklusRunFocus): 'meaningful leak' | 'neutral system exception' | 'disruptive card' {
  const safety = safetyException(card);
  if (safety === 'system' || safety === 'universal' || safety === 'crisis' || safety === 'followup' || safety === 'item_trigger') {
    return 'neutral system exception';
  }
  if ((focus.id === 'glitchka_nest' || focus.id === 'glitchka_chat') && (card.sector === 'memory_sandbox' || card.tags.includes('sandbox_absurd'))) {
    return 'meaningful leak';
  }
  if (cardHasOpeningSignal(card, focus)) return 'meaningful leak';
  return 'disruptive card';
}

function analyzeRoute(cards: RouteCardLog[], focus: CyklusRunFocus): Pick<RouteLog, 'opening' | 'atmosphere' | 'bleed'> {
  const firstTwo = cards.slice(0, 2);
  const firstFive = cards.slice(0, 5);
  const firstTwoSignals = firstTwo.filter((entry) => entry.matchesFocus || (STRONG_OPENING_TAGS[focus.id] ?? []).some((tag) => entry.tags.includes(tag))).length;
  const firstFiveSignals = firstFive.filter((entry) => entry.matchesFocus || entry.safetyException).length;
  const bleed = cards
    .filter((entry) => !entry.matchesFocus)
    .map((entry) => {
      const card = CYKLUS_CARDS[entry.cardId]!;
      return { cardId: entry.cardId, title: entry.title, verdict: classifyBleed(card, focus) };
    });
  return {
    opening: firstTwoSignals > 0 ? 'yes' : firstTwo.some((entry) => entry.safetyException) ? 'partial' : 'no',
    atmosphere: firstFiveSignals >= Math.min(4, firstFive.length) ? 'yes' : firstFiveSignals >= Math.ceil(firstFive.length / 2) ? 'partial' : 'no',
    bleed,
  };
}

function playRoute(focus: CyklusRunFocus, runIndex: number): RouteLog {
  const seed = `focus-route-${focus.id}-${runIndex}`;
  let state = createRouteState(focus, seed);
  const remainingStart = state.runFocus?.remainingCards ?? null;
  const cards: RouteCardLog[] = [];

  state = pickNextCardState(state);
  const maxTurns = focus.remainingCards ?? 5;
  for (let turn = 0; turn < maxTurns && state.status === 'playing'; turn += 1) {
    const card = getCardById(state.currentCardId);
    if (!card) break;
    const remainingBefore = state.runFocus?.remainingCards ?? null;
    const matchesFocus = cardMatchesRunFocus(card, focus);
    const safety = safetyException(card);
    const scheduled = getReadyScheduledCards(state).includes(card.id);
    const scoreReasons = explainCardScore(state, card).reasons;
    const direction = chooseStableDirection(state, card);
    const next = resolveChoice(state, direction);
    const remainingAfter = next.runFocus?.remainingCards ?? null;

    cards.push({
      turn: turn + 1,
      cardId: card.id,
      title: card.title,
      sector: card.sector ?? '',
      packId: card.packId ?? '',
      category: card.category,
      tags: card.tags,
      matchesFocus,
      safetyException: safety,
      admitReason: matchesFocus ? 'focus match' : scheduled ? 'scheduled ready' : safety ? `safety: ${safety}` : 'bleed',
      scoreReasons,
      remainingBefore,
      remainingAfter,
    });

    state = next;
  }

  const analysis = analyzeRoute(cards, focus);
  return {
    seed,
    focusLabel: focus.label,
    focusType: focus.type,
    strictness: focus.strictness,
    remainingStart,
    remainingEnd: state.runFocus?.remainingCards ?? null,
    cards,
    ...analysis,
  };
}

let cachedRoutes: RouteLog[] | null = null;

function getRoutes(): RouteLog[] {
  if (!cachedRoutes) {
    cachedRoutes = FOCUS_RUN_OPTIONS.flatMap((focus) =>
      Array.from({ length: ROUTE_RUNS_PER_FOCUS }, (_, runIndex) => playRoute(focus, runIndex)),
    );
  }
  return cachedRoutes;
}

function routeSummary(route: RouteLog) {
  return {
    seed: route.seed,
    focus: route.focusLabel,
    type: route.focusType,
    strictness: route.strictness,
    remaining: `${route.remainingStart ?? '-'} -> ${route.remainingEnd ?? '-'}`,
    opening: route.opening,
    atmosphere: route.atmosphere,
    order: route.cards.map((card) => `${card.turn}. ${card.cardId}${card.matchesFocus ? ' [match]' : card.safetyException ? ` [${card.safetyException}]` : ' [bleed]'}`).join(' | '),
  };
}

describe('Cyklus focus route playtest audit', () => {
  beforeEach(() => {
    localStorage.clear();
    setupStoryAsPostPrologue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps focus route reports available only behind an env flag', () => {
    const routes = getRoutes();
    if (process.env.CYKLUS_FOCUS_ROUTE_REPORT === '1') {
      // eslint-disable-next-line no-console
      console.table(routes.map(routeSummary));
      // eslint-disable-next-line no-console
      console.dir(routes, { depth: 5 });
    }
    expect(routes).toHaveLength(FOCUS_RUN_OPTIONS.length * ROUTE_RUNS_PER_FOCUS);
  });

  it('gives each focus a readable matching opening within the first two cards', () => {
    for (const route of getRoutes()) {
      expect(route.cards.slice(0, 2).some((card) => card.matchesFocus)).toBe(true);
    }
  });

  it('keeps the first route stretch coherent without disruptive bleed', () => {
    for (const route of getRoutes()) {
      expect(route.opening).not.toBe('no');
      expect(route.atmosphere).not.toBe('no');
      const firstFiveCardIds = new Set(route.cards.slice(0, 5).map((card) => card.cardId));
      expect(route.bleed.filter((entry) => firstFiveCardIds.has(entry.cardId)).every((entry) => entry.verdict !== 'disruptive card')).toBe(true);
    }
  });

  it('maps content gaps without changing content', () => {
    const coverage = FOCUS_RUN_OPTIONS.map((focus) => {
      const cards = Object.values(CYKLUS_CARDS).filter((card) => cardMatchesRunFocus(card, focus));
      return {
        focus: focus.label,
        entry: cards.some((card) => card.role === 'entry'),
        middle: cards.some((card) => ['object', 'escalation', 'memory', 'entity'].includes(card.role ?? card.category)),
        followup: cards.some((card) => ['followup', 'resolution'].includes(card.role ?? card.category) || card.category === 'followup'),
      };
    });

    expect(coverage.every((row) => row.entry || row.middle)).toBe(true);
    if (process.env.CYKLUS_FOCUS_ROUTE_REPORT === '1') {
      // eslint-disable-next-line no-console
      console.table(coverage);
    }
  });
});
