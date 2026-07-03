import type { GameState, GamePlayer, GamePiece, NewGameConfig, FragmentKind, GameProfileVector } from './types';
import { BOARD, START_NODE_ID } from './boardMap';
import { CARD_IDS } from './cards';
import { shuffleArray } from './dice';
import { GAME_VERSION, FRAGMENTS_PER_PLAYER, MAX_HAND_SIZE, DRAW_ON_TURN_START } from './constants';

const FRAGMENT_KINDS: FragmentKind[] = ['memory', 'laugh', 'choice'];

const DEFAULT_PROFILE: GameProfileVector = {
  dominance: 0,
  caution: 0,
  courage: 0,
  tenderness: 0,
  sarcasm: 0,
  chaos: 0,
  cooperation: 0,
};

function makeid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function seedFromConfig(config: NewGameConfig): number {
  if (config.seed !== undefined) return config.seed;
  return Math.floor(Math.random() * 2 ** 32);
}

export function createGameState(config: NewGameConfig): GameState {
  const seed = seedFromConfig(config);
  const rngSeed = seed.toString();

  const players: GamePlayer[] = config.players.map((p, i) => ({
    id: makeid(),
    name: p.name,
    color: p.color,
    ...(p.userId !== undefined ? { userId: p.userId } : {}),
    seatIndex: i,
    resources: { noise: 0, laugh: 0, fragments: 0 },
    hand: [],
    profile: { ...DEFAULT_PROFILE },
    status: 'active' as const,
    sabotageCount: 0,
    auditsSurvived: 0,
  }));

  // Shuffle deck
  const allCardIds = [...CARD_IDS, ...CARD_IDS]; // two copies for more variety
  const { shuffled: deck, nextSeed: deckSeed } = shuffleArray(allCardIds, rngSeed);

  // Deal initial hands
  let currentDeck = [...deck];
  let currentSeed = deckSeed;
  const updatedPlayers: GamePlayer[] = players.map((player) => {
    const hand = currentDeck.slice(0, DRAW_ON_TURN_START);
    currentDeck = currentDeck.slice(DRAW_ON_TURN_START);
    return { ...player, hand };
  });

  // Create pieces (3 per player)
  const pieces: GamePiece[] = [];
  for (const player of updatedPlayers) {
    for (let k = 0; k < FRAGMENTS_PER_PLAYER; k++) {
      pieces.push({
        id: makeid(),
        playerId: player.id,
        kind: FRAGMENT_KINDS[k % FRAGMENT_KINDS.length]!,
        nodeId: START_NODE_ID,
        finished: false,
        trappedTurns: 0,
      });
    }
  }

  const finalRngState = parseInt(currentSeed.split(':').pop() ?? '0', 10) || seed + 1;

  return {
    id: makeid(),
    version: GAME_VERSION,
    mode: config.mode,
    status: 'playing',
    turnNumber: 1,
    activePlayerId: updatedPlayers[0]?.id ?? '',
    phase: 'roll',
    board: BOARD,
    players: updatedPlayers,
    pieces,
    voidPressure: 0,
    bossActive: false,
    bossHp: 0,
    deck: currentDeck,
    discard: [],
    log: [{
      id: makeid(),
      turn: 1,
      type: 'system',
      message: `Hra začíná. Hráčů: ${updatedPlayers.length}. Void čeká.`,
      ts: Date.now(),
    }],
    seed,
    rngState: finalRngState,
  };
}
