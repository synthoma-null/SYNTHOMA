export type BoardNodeType =
  | 'start'
  | 'safe'
  | 'noise'
  | 'trap'
  | 'portal'
  | 'market'
  | 'archive'
  | 'glitch'
  | 'sarkasma'
  | 'shortcut'
  | 'boss'
  | 'finish';

export interface BoardNode {
  id: string;
  x: number;
  y: number;
  type: BoardNodeType;
  label: string;
  next: string[];
  trapId?: string | undefined;
  trapVisible?: boolean | undefined;
  shortcutTo?: string | undefined;
  blockedBy?: string | undefined;
  portalPair?: string | undefined;
}

export interface BoardEdge {
  id: string;
  from: string;
  to: string;
  kind: 'normal' | 'shortcut' | 'portal';
}

export interface BoardGraph {
  nodes: BoardNode[];
  edges: BoardEdge[];
}

export type FragmentKind = 'memory' | 'laugh' | 'choice';

export interface GamePiece {
  id: string;
  playerId: string;
  kind: FragmentKind;
  nodeId: string;
  finished: boolean;
  trappedTurns: number;
}

export type TurnPhase =
  | 'roll'
  | 'select_piece'
  | 'move'
  | 'event'
  | 'card'
  | 'end';

export interface MovementState {
  pieceId: string;
  stepsRemaining: number;
  visitedNodeIds: string[];
}

export interface FinalRound {
  triggeredByPlayerId: string;
  remainingPlayerIds: string[];
}

export interface DiceResult {
  value: number;
  rolledAt: number;
}

export interface GameProfileVector {
  dominance: number;
  caution: number;
  courage: number;
  tenderness: number;
  sarcasm: number;
  chaos: number;
  cooperation: number;
}

export interface PlayerResources {
  noise: number;
  laugh: number;
  fragments: number;
}

export type PlayerStatus = 'active' | 'disconnected' | 'left';

export interface GamePlayer {
  id: string;
  name: string;
  color: string;
  userId?: string | undefined;
  seatIndex: number;
  resources: PlayerResources;
  hand: string[];
  profile: GameProfileVector;
  status: PlayerStatus;
  sabotageCount: number;
  auditsSurvived: number;
}

export type StoryEffect =
  | { kind: 'gain_resource'; resource: 'noise' | 'laugh' | 'fragments'; amount: number }
  | { kind: 'lose_resource'; resource: 'noise' | 'laugh' | 'fragments'; amount: number }
  | { kind: 'move_to'; nodeId: string }
  | { kind: 'move_steps'; steps: number }
  | { kind: 'move_back'; steps: number }
  | { kind: 'draw_cards'; amount: number }
  | { kind: 'discard_card'; amount: number }
  | { kind: 'trigger_trap'; trapId?: string }
  | { kind: 'place_trap'; trapId: string; visible: boolean }
  | { kind: 'roll_table'; tableId: string }
  | { kind: 'global_void'; amount: number }
  | { kind: 'swap_positions'; targetPlayerId: string }
  | { kind: 'steal_laugh'; targetPlayerId: string; amount: number }
  | { kind: 'pass_card_left' }
  | { kind: 'pass_noise' }
  | { kind: 'send_to_start'; targetPlayerId: string }
  | { kind: 'skip_turn'; turns: number }
  | { kind: 'custom'; key: string };

export interface StoryChoice {
  id: string;
  label: string;
  text: string;
  effect: StoryEffect;
  profileDelta?: Partial<GameProfileVector>;
}

export interface StoryEvent {
  id: string;
  nodeType: BoardNodeType | 'void_global';
  title: string;
  logLabel: string;
  text: string;
  choices?: StoryChoice[];
  effect: StoryEffect;
  tags?: string[];
  profileDelta?: Partial<GameProfileVector>;
}

export interface StoryEventInstance {
  event: StoryEvent;
  pieceId: string;
  nodeId: string;
  resolvedAt?: number | undefined;
  choiceId?: string | undefined;
}

export type CardType = 'action' | 'sabotage' | 'relic' | 'glitch' | 'void' | 'event';

export type CardTiming =
  | 'before_roll'
  | 'after_roll'
  | 'before_event'
  | 'after_event'
  | 'any_turn'
  | 'reaction';

export type CardTarget = 'self' | 'player' | 'piece' | 'node' | 'none';

export type CardEffect =
  | { kind: 'gain_resource'; resource: 'noise' | 'laugh' | 'fragments'; amount: number }
  | { kind: 'lose_resource'; resource: 'noise' | 'laugh' | 'fragments'; amount: number }
  | { kind: 'move_steps'; steps: number }
  | { kind: 'move_back'; steps: number }
  | { kind: 'reroll_dice' }
  | { kind: 'cancel_event' }
  | { kind: 'steal_laugh'; amount: number }
  | { kind: 'swap_positions' }
  | { kind: 'place_trap'; trapId: string; visible: boolean }
  | { kind: 'send_to_start' }
  | { kind: 'skip_turn'; turns: number }
  | { kind: 'draw_cards'; amount: number }
  | { kind: 'discard_card'; amount: number }
  | { kind: 'move_to'; nodeId: string }
  | { kind: 'pass_card_left' }
  | { kind: 'pass_noise' }
  | { kind: 'cancel_trap' }
  | { kind: 'global_void'; amount: number }
  | { kind: 'custom'; key: string };

export interface GameCard {
  id: string;
  type: CardType;
  timing: CardTiming;
  title: string;
  text: string;
  flavor: string;
  target: CardTarget;
  effect: CardEffect;
}

export interface TrapDefinition {
  id: string;
  name: string;
  text: string;
  triggerEffect: StoryEffect;
  disarmEffect: StoryEffect;
  visible: boolean;
}

export type GameLogEntryType =
  | 'move'
  | 'event'
  | 'card'
  | 'trap'
  | 'void'
  | 'system'
  | 'roll'
  | 'final_round'
  | 'boss';

export interface GameLogEntry {
  id: string;
  turn: number;
  playerId?: string | undefined;
  type: GameLogEntryType;
  message: string;
  ts: number;
}

export type GameMode = 'party' | 'coop' | 'chaos';
export type GameStatus = 'lobby' | 'playing' | 'finished';

export interface GameState {
  id: string;
  version: number;
  roomCode?: string | undefined;
  mode: GameMode;
  status: GameStatus;
  turnNumber: number;
  activePlayerId: string;
  phase: TurnPhase;
  movement?: MovementState | undefined;
  board: BoardGraph;
  players: GamePlayer[];
  pieces: GamePiece[];
  dice?: DiceResult | undefined;
  pendingEvent?: StoryEventInstance | undefined;
  voidPressure: number;
  finalRound?: FinalRound | undefined;
  bossActive: boolean;
  bossHp: number;
  bossTurnsLeft?: number | undefined;
  deck: string[];
  discard: string[];
  log: GameLogEntry[];
  seed: number;
  rngState: number;
}

export interface NewGameConfig {
  mode: GameMode;
  players: Array<{ name: string; color: string; userId?: string }>;
  seed?: number;
}

export interface PlayerResult {
  playerId: string;
  name: string;
  color: string;
  otisk: number;
  fragmentsFinished: number;
  noise: number;
  laugh: number;
  sabotageCount: number;
  auditsSurvived: number;
  archetype: string;
  shareText: string;
  profile: GameProfileVector;
}

export interface GameResult {
  won: boolean;
  reason: 'fragments' | 'void_collapse' | 'boss_defeated' | 'boss_victory';
  players: PlayerResult[];
  voidPressure: number;
  turnsPlayed: number;
  winnerId?: string;
}
