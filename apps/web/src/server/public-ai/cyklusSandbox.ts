import { createHash, randomUUID } from 'crypto';
import { CYKLUS_CARDS } from '../../game/cyklus/content';
import { getCardPool, scoreCard } from '../../game/cyklus/cyklusCardPicker';
import { computeEnding, createCyklusRun, pickRunModifier, resolveChoice } from '../../game/cyklus/cyklusEngine';
import { seededRandom, weightedPickBase } from '../../game/cyklus/cyklusRandom';
import type { CyklusChoiceRecord, CyklusRunState, StatDelta, SwipeCard } from '../../game/cyklus/cyklusTypes';
import { resolveCardPublicVisibility } from './visibility';
import { PUBLIC_CONTENT_VERSION, PUBLIC_CYKLUS_ENGINE_VERSION, type PublicLocale } from './config';

export const PUBLIC_CYKLUS_MAX_TURNS = 12;

function stableRunId(seed: string): string {
  return `ai_${createHash('sha256').update(seed).digest('hex').slice(0, 16)}`;
}

export function createPublicCyklusState(seedValue?: string): CyklusRunState {
  const seed = seedValue?.trim() || randomUUID();
  const base = createCyklusRun(true);
  return {
    ...base,
    id: stableRunId(seed),
    status: 'playing',
    cycle: 1,
    choiceInCycle: 1,
    totalChoices: 0,
    difficulty: 1,
    sector: 'void',
    visitedSectors: ['void'],
    stats: { energy: 50, memory: 50, bond: 50, control: 50 },
    profile: {},
    inventory: [],
    flags: ['tutorial_v2_done', 'tutorial_done'],
    imprints: [],
    scheduledCards: [],
    entityRelations: {},
    unlockedPools: [],
    unlockedCards: [],
    usedCardIds: [],
    currentCardId: 'restart_0',
    cycleSummaries: [],
    history: [],
    startedAt: 0,
    updatedAt: 0,
    seed,
    rngStep: 0,
    freshMetaPools: [],
    modifier: pickRunModifier(seed),
    goals: [],
    lastItemActivationCycle: 0,
    itemActivationCount: 0,
    itemActivationCountThisCycle: 0,
    activeContracts: [],
    preRunWarning: null,
    preRunChoice: null,
  };
}

function publicFallbackCard(state: CyklusRunState): SwipeCard {
  const candidates = getCardPool(state)
    .filter((card) => resolveCardPublicVisibility(card) === 'publicFull')
    .map((card) => ({ item: card, weight: scoreCard(state, card) }))
    .filter((entry) => entry.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 12);
  return weightedPickBase(candidates, seededRandom(state.seed, state.rngStep + 1701))
    ?? CYKLUS_CARDS.restart_0!;
}

function enforcePublicCard(state: CyklusRunState): CyklusRunState {
  if (state.status !== 'playing') return state;
  const current = CYKLUS_CARDS[state.currentCardId];
  if (current && resolveCardPublicVisibility(current) === 'publicFull') return state;
  const sanitized = {
    ...state,
    scheduledCards: state.scheduledCards.filter((entry) => entry.cardId !== state.currentCardId),
  };
  const fallback = publicFallbackCard(sanitized);
  return { ...sanitized, currentCardId: fallback.id, rngStep: sanitized.rngStep + 1 };
}

export function publicCardView(state: CyklusRunState, locale: PublicLocale) {
  const card = CYKLUS_CARDS[state.currentCardId];
  if (!card || resolveCardPublicVisibility(card) !== 'publicFull') return null;
  return {
    id: card.id,
    locale,
    sourceLocale: 'cs' as const,
    title: card.title,
    scene: card.scene,
    choices: [{ id: 'yes' as const, label: card.yesLabel }, { id: 'no' as const, label: card.noLabel }],
  };
}

export function publicRunView(state: CyklusRunState) {
  return {
    turn: Math.min(state.totalChoices + 1, PUBLIC_CYKLUS_MAX_TURNS),
    maxTurns: PUBLIC_CYKLUS_MAX_TURNS,
    stats: state.stats,
    status: state.status === 'dead' ? 'collapsed' : state.status === 'completed' ? 'completed' : 'active',
  };
}

function recordEvents(record: CyklusChoiceRecord | undefined): Array<{ type: string; id: string; delta?: number }> {
  if (!record) return [];
  return [
    ...record.itemsGained.map((id) => ({ type: 'item', id })),
    ...record.itemsLost.map((id) => ({ type: 'itemRemoved', id })),
    ...record.imprintsGained.map((id) => ({ type: 'imprint', id })),
    ...Object.entries(record.entityDelta).map(([id, delta]) => ({ type: 'entityRelation', id, delta })),
  ];
}

export function applyPublicCyklusChoice(state: CyklusRunState, choiceId: 'yes' | 'no') {
  if (state.status !== 'playing' || state.totalChoices >= PUBLIC_CYKLUS_MAX_TURNS) return null;
  const previousCardId = state.currentCardId;
  let next = resolveChoice(state, choiceId);
  const record = next.history.at(-1);
  const reachedHorizon = next.totalChoices >= PUBLIC_CYKLUS_MAX_TURNS;
  if (reachedHorizon && next.status === 'playing') next = { ...next, status: 'completed' };
  next = enforcePublicCard(next);
  return {
    state: next,
    result: {
      cardId: previousCardId,
      choiceId,
      consequence: next.lastOutcomeText ?? '',
      statChanges: (record?.statDelta ?? {}) as StatDelta,
      events: recordEvents(record),
    },
  };
}

export function publicRunSummary(state: CyklusRunState) {
  const ending = computeEnding(state);
  return {
    finalStats: state.stats,
    decisions: state.history.map((record) => ({ turn: record.turn, cardId: record.cardId, choiceId: record.direction })),
    encounteredCards: [...new Set(state.history.map((record) => record.cardId))],
    endingClassification: ending?.title ?? (state.status === 'completed' ? 'sandbox_horizon' : 'active'),
    restartAvailable: true,
  };
}

export const publicCyklusVersions = {
  engineVersion: PUBLIC_CYKLUS_ENGINE_VERSION,
  contentVersion: PUBLIC_CONTENT_VERSION,
};
