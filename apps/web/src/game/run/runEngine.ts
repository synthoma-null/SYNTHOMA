import type { RunState, RunPlayer, RunLogEntry, RunMode, RunType, RunModifiers } from './runTypes';
import type { PendingPlayerAction } from '../encounter/encounterTypes';
import { generateRunMap, getAvailableNodes, markAvailable, markVisited } from './runMapGenerator';
import { startEncounter, resolvePlayerAction, resolveChoice, claimReward, skipIntro } from '../encounter/encounterEngine';
import { STARTER_DECKS, DEFAULT_STARTER_DECK_ID } from './starterDecks';

// ── Action types ──────────────────────────────────────────────────────────────

export type RunAction =
  | { type: 'CHOOSE_NEXT_NODE'; nodeId: string }
  | { type: 'SKIP_INTRO' }
  | { type: 'SELECT_ACTION'; actionId: PendingPlayerAction['actionId']; cardId?: string; targetEnemyId?: string }
  | { type: 'PLAY_CARD'; cardId: string; targetEnemyId?: string }
  | { type: 'RESOLVE_CHOICE'; choiceId: string }
  | { type: 'CLAIM_REWARD'; rewardId: string }
  | { type: 'ABANDON_RUN' };

// ── Create new run ────────────────────────────────────────────────────────────

export interface CreateRunConfig {
  playerName: string;
  playerColor?: string;
  userId?: string;
  mode?: RunMode;
  runType?: RunType;
  seed?: string;
  starterDeckId?: string;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function generateSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getRunModifiers(runType: RunType): RunModifiers {
  switch (runType) {
    case 'sarcastic':
      return {
        startingHpMultiplier: 0.9,
        startingNoise: 1,
        startingLaugh: 2,
        voidPressureGain: 1.1,
        cardDrawBonus: 0,
        description: 'Vyšší tlak, ale start se Smíchem. Sarkasmus je zbraň i štít.',
      };
    case 'calm':
      return {
        startingHpMultiplier: 1.15,
        startingNoise: 0,
        startingLaugh: 0,
        voidPressureGain: 0.85,
        cardDrawBonus: 0,
        description: 'Pomalejší Prázdnota, více stability. Pro methodické subjekty.',
      };
    case 'void_rush':
      return {
        startingHpMultiplier: 0.85,
        startingNoise: 2,
        startingLaugh: 0,
        voidPressureGain: 1.35,
        cardDrawBonus: 1,
        description: 'Prázdnota přichází rychleji. Větší odměny, ale méně času.',
      };
    case 'standard':
    default:
      return {
        startingHpMultiplier: 1,
        startingNoise: 0,
        startingLaugh: 0,
        voidPressureGain: 1,
        cardDrawBonus: 0,
        description: 'Vyvážený průchod. Žádné extra bonusy ani postihy.',
      };
  }
}

export function createRun(config: CreateRunConfig): RunState {
  const seed = config.seed ?? generateSeed();
  const deckId = config.starterDeckId ?? DEFAULT_STARTER_DECK_ID;
  const deckDef = STARTER_DECKS[deckId];
  const cardIds = deckDef?.cardIds ?? [];

  const runType = config.runType ?? 'standard';
  const modifiers = getRunModifiers(runType);
  const baseMaxHp = 50;
  const maxHp = Math.round(baseMaxHp * modifiers.startingHpMultiplier);

  const player: RunPlayer = {
    id: makeId(),
    name: config.playerName,
    color: config.playerColor ?? '#00ffcc',
    userId: config.userId,
    seatIndex: 0,
    hp: maxHp,
    maxHp,
    block: 0,
    noise: modifiers.startingNoise,
    laugh: modifiers.startingLaugh,
    hand: [],
    statuses: [],
    profile: {
      courage: 0,
      caution: 0,
      dominance: 0,
      tenderness: 0,
      chaos: 0,
      cooperation: 0,
      sarcasm: 0,
    },
    sabotageCount: 0,
    relicsTriggered: [],
  };

  const map = generateRunMap(seed, runType);
  const startNodeId = map.nodes.find((n) => n.type === 'start')?.id ?? 'node-start';

  const now = new Date().toISOString();

  const state: RunState = {
    id: makeId(),
    seed,
    mode: config.mode ?? 'solo',
    runType,
    modifiers,
    status: 'playing',
    act: 1,
    currentNodeId: startNodeId,
    map,
    players: [player],
    activePlayerId: player.id,
    deck: [...cardIds],
    discard: [],
    relics: [],
    currentEncounter: undefined,
    voidPressure: 0,
    log: [],
    createdAt: now,
    updatedAt: now,
  };

  // Draw opening hand (4 cards)
  return drawInitialHand(state, player.id, 4);
}

// ── Draw initial hand ─────────────────────────────────────────────────────────

function drawInitialHand(state: RunState, playerId: string, count: number): RunState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return state;

  const deck = [...state.deck];
  const hand = deck.splice(0, count);

  return {
    ...state,
    deck,
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, hand } : p,
    ),
  };
}

// ── Dispatch ──────────────────────────────────────────────────────────────────

export function dispatchRunAction(state: RunState, action: RunAction): RunState {
  if (state.status !== 'playing') return state;

  switch (action.type) {
    case 'CHOOSE_NEXT_NODE':
      return handleChooseNode(state, action.nodeId);

    case 'SKIP_INTRO':
      return skipIntro(state);

    case 'SELECT_ACTION': {
      const player = state.players.find((p) => p.id === state.activePlayerId) ?? state.players[0];
      if (!player) return state;
      const pendingAction: PendingPlayerAction = {
        playerId: player.id,
        actionId: action.actionId,
        cardId: action.cardId,
        targetEnemyId: action.targetEnemyId ?? state.currentEncounter?.enemies[0]?.id,
      };
      return resolvePlayerAction(state, pendingAction);
    }

    case 'PLAY_CARD': {
      const player = state.players.find((p) => p.id === state.activePlayerId) ?? state.players[0];
      if (!player) return state;
      const pendingAction: PendingPlayerAction = {
        playerId: player.id,
        actionId: 'attack',
        cardId: action.cardId,
        targetEnemyId: action.targetEnemyId ?? state.currentEncounter?.enemies[0]?.id,
      };
      return resolvePlayerAction(state, pendingAction);
    }

    case 'RESOLVE_CHOICE':
      return resolveChoice(state, action.choiceId);

    case 'CLAIM_REWARD': {
      const s = claimReward(state, action.rewardId);
      // After reward, check if encounter finished → back to map
      if (s.currentEncounter?.phase === 'finished') {
        return finalizeEncounter(s);
      }
      return s;
    }

    case 'ABANDON_RUN':
      return { ...state, status: 'abandoned', updatedAt: new Date().toISOString() };

    default:
      return state;
  }
}

// ── Node navigation ───────────────────────────────────────────────────────────

function handleChooseNode(state: RunState, nodeId: string): RunState {
  const current = state.map.nodes.find((n) => n.id === state.currentNodeId);
  const isCurrentNode = state.currentNodeId === nodeId;

  // Allow clicking the current node if it hasn't been visited yet (start node)
  const target = isCurrentNode && current && !current.visited
    ? current
    : getAvailableNodes(state.map, state.currentNodeId).find((n) => n.id === nodeId);

  if (!target) return state;

  let s: RunState = {
    ...state,
    currentNodeId: nodeId,
    map: markVisited(markAvailable(state.map, [nodeId]), state.currentNodeId),
    updatedAt: new Date().toISOString(),
  };

  s = addRunLog(s, `Vstoupil jsi do sektoru: ${target.type.toUpperCase()}`, 'map');

  // Auto-start encounter for the new node
  return startEncounter(s, target.encounterId);
}

// ── Encounter cleanup → draw cards for next encounter ────────────────────────

function finalizeEncounter(state: RunState): RunState {
  let s = state;

  // Draw up to 4 cards (+ run type bonus) for next encounter
  const handSize = 4 + (s.modifiers?.cardDrawBonus ?? 0);
  const player = s.players.find((p) => p.id === s.activePlayerId) ?? s.players[0];
  if (player && player.hand.length < handSize) {
    const toDraw = handSize - player.hand.length;
    let deck = [...s.deck];
    let discard = [...s.discard];

    if (deck.length < toDraw && discard.length > 0) {
      deck = [...deck, ...discard];
      discard = [];
    }

    const drawn = deck.splice(0, toDraw);
    const newHand = [...player.hand, ...drawn];

    s = {
      ...s,
      deck,
      discard,
      players: s.players.map((p) =>
        p.id === player.id ? { ...p, hand: newHand, block: 0 } : p,
      ),
    };
  }

  // Check win (boss defeated)
  const node = s.map.nodes.find((n) => n.id === s.currentNodeId);
  if (node?.type === 'boss') {
    return {
      ...s,
      status: 'won',
      currentEncounter: undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  // Mark available nodes
  const nextNodes = getAvailableNodes(s.map, s.currentNodeId).map((n) => n.id);
  s = {
    ...s,
    map: markAvailable(s.map, nextNodes),
    currentEncounter: undefined,
    updatedAt: new Date().toISOString(),
  };

  return s;
}

// ── Log helper ────────────────────────────────────────────────────────────────

function addRunLog(state: RunState, message: string, type: RunLogEntry['type']): RunState {
  const entry: RunLogEntry = {
    id: Math.random().toString(36).slice(2, 9),
    turn: state.currentEncounter?.round ?? 0,
    type,
    message,
    ts: Date.now(),
  };
  return { ...state, log: [...state.log, entry] };
}

// ── Void pressure helpers ─────────────────────────────────────────────────────

export function getVoidPressureLabel(pressure: number): string {
  if (pressure <= 5) return 'Klidný';
  if (pressure <= 10) return 'Aktivní';
  if (pressure <= 15) return 'Zvýšený';
  if (pressure <= 19) return 'Kritický';
  return 'Kolaps';
}

export function getVoidPressureClass(pressure: number): string {
  if (pressure <= 5) return 'void-calm';
  if (pressure <= 10) return 'void-active';
  if (pressure <= 15) return 'void-elevated';
  if (pressure <= 19) return 'void-critical';
  return 'void-collapse';
}
