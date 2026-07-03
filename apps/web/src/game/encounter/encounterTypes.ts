import type { RewardOption } from '../run/runTypes';

// ── Encounter types ───────────────────────────────────────────────────────────

export type EncounterType =
  | 'combat'
  | 'elite'
  | 'boss'
  | 'event'
  | 'trap'
  | 'dialogue'
  | 'market'
  | 'rest'
  | 'archive';

// ── Enemy intent ──────────────────────────────────────────────────────────────

export type EnemyIntentType =
  | 'attack'
  | 'attack_dot'
  | 'lock_card'
  | 'audit'
  | 'steal_laugh'
  | 'aoe'
  | 'mirror'
  | 'sprint'
  | 'buff_self'
  | 'void_surge';

export interface EnemyIntentDefinition {
  id: string;
  type: EnemyIntentType;
  label: string;
  damage?: number | undefined;
  noiseAmount?: number | undefined;
  dotTurns?: number | undefined;
  description: string;
  voidPressureThreshold?: number | undefined;
}

// ── Enemy definition ──────────────────────────────────────────────────────────

export interface EnemyDefinition {
  id: string;
  name: string;
  maxHp: number;
  armor?: number | undefined;
  intents: EnemyIntentDefinition[];
  aggressiveIntents: EnemyIntentDefinition[];
  text: {
    intro: string[];
    hit: string[];
    death: string[];
  };
  tags: string[];
  isBoss?: boolean | undefined;
  bossPhases?: BossPhase[] | undefined;
}

export interface BossPhase {
  phase: number;
  label: string;
  hpThreshold: number;
  description: string;
  intents: EnemyIntentDefinition[];
  phaseText: string;
}

// ── Enemy state (runtime) ─────────────────────────────────────────────────────

export interface EnemyState {
  id: string;
  definitionId: string;
  name: string;
  hp: number;
  maxHp: number;
  armor: number;
  block: number;
  currentIntentIndex: number;
  statuses: EnemyStatus[];
  bossPhase?: number | undefined;
  lockedCardSlots?: number | undefined;
  isBoss?: boolean | undefined;
}

export interface EnemyStatus {
  id: string;
  label: string;
  stacks: number;
  turnsLeft?: number | undefined;
}

// ── Encounter choice ──────────────────────────────────────────────────────────

export interface EncounterChoice {
  id: string;
  label: string;
  text: string;
  outcomeText: string;
  effects: string[];
  profileDelta?: Partial<Record<string, number>> | undefined;
  requiresRelic?: string | undefined;
}

// ── Encounter definition ──────────────────────────────────────────────────────

export interface EncounterDefinition {
  id: string;
  type: EncounterType;
  title: string;
  logLabel: string;
  intro: string[];
  enemyIds?: string[] | undefined;
  choices?: EncounterChoice[] | undefined;
  rewardPool?: string[] | undefined;
  tags: string[];
}

// ── Encounter state (runtime) ─────────────────────────────────────────────────

export type EncounterPhase =
  | 'intro'
  | 'choose_actions'
  | 'resolve'
  | 'choice'
  | 'reward'
  | 'finished';

export interface EncounterState {
  id: string;
  definitionId: string;
  type: EncounterType;
  round: number;
  enemies: EnemyState[];
  phase: EncounterPhase;
  pendingChoice?: EncounterChoice[] | undefined;
  rewardOptions?: RewardOption[] | undefined;
  introText: string;
  lastResolutionText?: string | undefined;
  lastActionId?: string | undefined;
  deadlineAt?: string | undefined;
}

// ── Player action in encounter ────────────────────────────────────────────────

export type PlayerActionId = 'attack' | 'dash' | 'hack' | 'defend' | 'sarcasm';

export interface PendingPlayerAction {
  playerId: string;
  actionId: PlayerActionId;
  cardId?: string | undefined;
  targetEnemyId?: string | undefined;
}
