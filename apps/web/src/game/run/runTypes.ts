import type { GameProfileVector } from '../types';
import type { EncounterState } from '../encounter/encounterTypes';

// ── Run-specific log (separate from party GameLogEntry) ───────────────────────

export type RunLogEntryType =
  | 'system'
  | 'encounter'
  | 'action'
  | 'reward'
  | 'map'
  | 'relic'
  | 'boss';

export interface RunLogEntry {
  id: string;
  turn: number;
  playerId?: string | undefined;
  type: RunLogEntryType;
  message: string;
  ts: number;
}

// ── Run modes & status ────────────────────────────────────────────────────────

export type RunMode = 'solo' | 'coop' | 'party' | 'chaos';
export type RunStatus = 'playing' | 'won' | 'lost' | 'abandoned';
export type RunType = 'standard' | 'sarcastic' | 'calm' | 'void_rush';

export interface RunModifiers {
  startingHpMultiplier: number;
  startingNoise: number;
  startingLaugh: number;
  voidPressureGain: number; // multiplier for void pressure increases
  cardDrawBonus: number;
  description: string;
}

// ── Player in a run ───────────────────────────────────────────────────────────

export interface RunPlayer {
  id: string;
  name: string;
  color: string;
  userId?: string | undefined;
  seatIndex: number;
  hp: number;
  maxHp: number;
  block: number;
  noise: number;
  laugh: number;
  hand: string[];
  statuses: PlayerStatus[];
  profile: GameProfileVector;
  sabotageCount: number;
  relicsTriggered: string[];
}

export interface PlayerStatus {
  id: string;
  label: string;
  stacks: number;
  turnsLeft?: number | undefined;
}

// ── Run map ───────────────────────────────────────────────────────────────────

export type RunNodeType =
  | 'start'
  | 'combat'
  | 'elite'
  | 'boss'
  | 'event'
  | 'trap'
  | 'dialogue'
  | 'market'
  | 'rest'
  | 'archive';

export interface RunMapNode {
  id: string;
  x: number;
  y: number;
  depth: number;
  type: RunNodeType;
  encounterId: string;
  next: string[];
  visited: boolean;
  available: boolean;
}

export interface RunMap {
  nodes: RunMapNode[];
  seed: string;
}

// ── Rewards ───────────────────────────────────────────────────────────────────

export type RewardOption =
  | { id: string; type: 'card'; cardId: string; label: string }
  | { id: string; type: 'relic'; relicId: string; label: string }
  | { id: string; type: 'heal'; amount: number; label: string }
  | { id: string; type: 'resource'; resource: 'laugh' | 'fragments' | 'relicParts'; amount: number; label: string }
  | { id: string; type: 'remove_noise'; amount: number; label: string }
  | { id: string; type: 'upgrade'; targetCardId: string; label: string };

// ── Run state (root) ──────────────────────────────────────────────────────────

export interface RunState {
  id: string;
  seed: string;
  mode: RunMode;
  runType: RunType;
  modifiers: RunModifiers;
  status: RunStatus;

  act: number;
  currentNodeId: string;
  map: RunMap;

  players: RunPlayer[];
  activePlayerId?: string | undefined;

  deck: string[];
  discard: string[];
  relics: string[];

  currentEncounter?: EncounterState | undefined;
  voidPressure: number;

  log: RunLogEntry[];

  createdAt: string;
  updatedAt: string;
}

// ── Starter deck ──────────────────────────────────────────────────────────────

export interface StarterDeckDefinition {
  id: string;
  title: string;
  description: string;
  cardIds: string[];
}

// ── Relic ─────────────────────────────────────────────────────────────────────

export type RelicTrigger =
  | 'on_death'
  | 'on_enter_node'
  | 'on_sarcasm'
  | 'on_noise_gain'
  | 'on_elite_reward'
  | 'on_rest'
  | 'on_boss_enter'
  | 'passive';

export interface RelicDefinition {
  id: string;
  name: string;
  description: string;
  flavour: string;
  trigger: RelicTrigger;
  nodeTypeFilter?: RunNodeType[] | undefined;
  oncePerRun: boolean;
}

// ── Run result ────────────────────────────────────────────────────────────────

export interface RunResult {
  runId: string;
  status: RunStatus;
  voidPressure: number;
  turnsPlayed: number;
  nodesVisited: number;
  playersResult: RunPlayerResult[];
}

export interface RunPlayerResult {
  playerId: string;
  name: string;
  color: string;
  finalHp: number;
  finalNoise: number;
  finalLaugh: number;
  relicsCollected: string[];
  profile: GameProfileVector;
  archetype: string;
}
