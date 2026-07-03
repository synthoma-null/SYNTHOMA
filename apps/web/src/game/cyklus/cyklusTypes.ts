export type StatKey = 'energy' | 'memory' | 'bond' | 'control';

export type SectorId =
  | 'void'
  | 'archive'
  | 'memory_sandbox'
  | 'sarkasma_terminal'
  | 'glitchka_nest'
  | 'tai_core'
  | 'acid_yellow'
  | 'market'
  | 'mirror'
  | 'residuum'
  | 'form_office';

export type EntityId =
  | 'sarkasma'
  | 'glitchka'
  | 'tai'
  | 'archive'
  | 'form'
  | 'selma'
  | 'cult'
  | 'residuum'
  | 'shadow';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'critical' | 'unique';

export type CardCategory =
  | 'choice'
  | 'object'
  | 'path'
  | 'entity'
  | 'memory'
  | 'system'
  | 'followup'
  | 'crisis'
  | 'restart'
  | 'unlock'
  | 'silent'
  | 'trap'
  | 'item_trigger'
  | 'rare'
  | 'tutorial';

export type ProfileKey =
  | 'I'
  | 'E'
  | 'N'
  | 'S'
  | 'T'
  | 'F'
  | 'J'
  | 'P'
  | 'Ni'
  | 'Ne'
  | 'Si'
  | 'Se'
  | 'Ti'
  | 'Te'
  | 'Fi'
  | 'Fe';

export type CyklusEffect =
  | { type: 'stat'; key: StatKey; amount: number }
  | { type: 'profile'; key: ProfileKey; amount: number }
  | { type: 'flag'; flag: string }
  | { type: 'removeFlag'; flag: string }
  | { type: 'item'; itemId: string }
  | { type: 'removeItem'; itemId: string }
  | { type: 'schedule'; cardId: string; inTurns: number }
  | { type: 'scheduleNextCycle'; cardId: string }
  | { type: 'unlockPool'; poolId: string }
  | { type: 'unlockCard'; cardId: string }
  | { type: 'moveSector'; sectorId: SectorId }
  | { type: 'entityRelation'; entity: EntityId; delta: number }
  | { type: 'imprint'; imprintId: string }
  | { type: 'noImmediateEffect' };

export interface CardCondition {
  type:
    | 'hasItem' | 'missingItem'
    | 'hasFlag' | 'missingFlag' | 'hasAnyFlag' | 'hasAllFlags'
    | 'statBelow' | 'statAbove'
    | 'sector' | 'visitedSector' | 'visitedSectorCountAtLeast'
    | 'cycleAtLeast' | 'difficultyAtLeast' | 'unlockedPool'
    | 'hasImprint' | 'missingImprint' | 'imprintCountAtLeast'
    | 'entityRelationAtLeast' | 'entityRelationAtMost'
    | 'usedCard' | 'notUsedCard'
    | 'totalChoicesAtLeast';
  itemId?: string;
  flag?: string;
  flags?: string[];
  stat?: StatKey;
  value?: number;
  sector?: SectorId;
  cycle?: number;
  difficulty?: number;
  poolId?: string;
  imprintId?: string;
  entity?: EntityId;
  cardId?: string;
  count?: number;
}

export interface ChoicePreview {
  hint: string;
  statHints?: Partial<Record<StatKey, 'up' | 'down' | 'danger'>>;
  risk?: 'low' | 'medium' | 'high' | 'unknown';
}

export interface CardOutcome {
  resultText: string;
  effects: CyklusEffect[];
  preview?: ChoicePreview;
}

export type TriggerMode = 'pool' | 'scheduledOnly' | 'both';
export type ScheduledIfInvalid = 'drop' | 'delay' | 'force';

export interface SwipeCard {
  id: string;
  title: string;
  logLabel: string;
  scene: string;
  yesLabel: string;
  noLabel: string;
  yes: CardOutcome;
  no: CardOutcome;
  category: CardCategory;
  sector?: SectorId;
  rarity: Rarity;
  conditions?: CardCondition[];
  cooldown?: number;
  maxUses?: number;
  cooldownTurns?: number;
  once?: boolean;
  tags: string[];
  triggerMode?: TriggerMode;
  ifInvalid?: ScheduledIfInvalid;
  qualityHint?: 'intentionally_thin' | 'narrative_pause' | 'stat_only_ok';
}

export interface CyklusItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  passiveEffects?: CyklusEffect[];
  triggerCards?: string[];
}

export interface CyklusImprint {
  id: string;
  title: string;
  description: string;
  passiveEffects?: CyklusEffect[];
  triggerCards?: string[];
  unlockPool?: string;
  tags: string[];
}

export interface CardUnlock {
  id: string;
  poolId: string;
  condition: CardCondition;
}

export interface CyklusChoiceRecord {
  turn: number;
  cycle: number;
  cardId: string;
  direction: 'yes' | 'no';
  statDelta: Partial<Record<StatKey, number>>;
  profileDelta: Partial<Record<ProfileKey, number>>;
  flagsGained: string[];
  itemsGained: string[];
  itemsLost: string[];
  imprintsGained: string[];
  poolsUnlocked: string[];
  scheduledAdded: string[];
  entityDelta: Partial<Record<EntityId, number>>;
  sectorBefore: SectorId;
  sectorAfter: SectorId;
  ts: number;
}

export interface CyklusTension {
  calmStreak: number;
  crisisStreak: number;
  itemTriggerStreak: number;
  sameSectorStreak: number;
  rewardStreak: number;
  entityStreak: number;
  lastRewardAt: number;
  lastEntityAt: number;
}

export interface ScheduledCardEntry {
  cardId: string;
  turnsRemaining: number;
  cycle?: number;
  ifInvalid?: ScheduledIfInvalid;
}

export interface CyklusRunState {
  id: string;
  status: 'playing' | 'dead' | 'completed';
  cycle: number;
  choiceInCycle: number;
  totalChoices: number;
  difficulty: number;
  sector: SectorId;
  visitedSectors: SectorId[];
  stats: Record<StatKey, number>;
  profile: Partial<Record<ProfileKey, number>>;
  inventory: string[];
  flags: string[];
  imprints: string[];
  scheduledCards: ScheduledCardEntry[];
  entityRelations: Partial<Record<EntityId, number>>;
  unlockedPools: string[];
  unlockedCards: string[];
  usedCardIds: string[];
  currentCardId: string;
  lastOutcomeText?: string;
  lastCycleSummary?: string;
  cycleSummaries: string[];
  history: CyklusChoiceRecord[];
  startedAt: number;
  updatedAt: number;
  tension: CyklusTension;
  seed: string;
  rngStep: number;
}

export interface CyklusRunSummary {
  id: string;
  endedAt: number;
  status: 'dead' | 'completed';
  endingTitle: string;
  codename?: string;
  cyclesSurvived: number;
  totalChoices: number;
  dominantProfile: string;
  archetype: string;
  imprints: string[];
  visitedSectors: SectorId[];
  deathStat?: StatKey | undefined;
}

export interface ProfileResult {
  dominantLabel: string;
  dominantFunction: string;
  shadowFunction: string;
  stability: number;
  profileConfidence: number;
  uncertainAxis?: string;
  archetype: string;
}

export interface EndingResult {
  type: 'death';
  stat: StatKey;
  extreme: 'low' | 'high';
  title: string;
  text: string;
}

export interface CompletionResult {
  type: 'stabilized';
  title: string;
  text: string;
}

export type RunEnding = EndingResult | CompletionResult;

export const STAT_LABELS: Record<StatKey, string> = {
  energy: 'Energie',
  memory: 'Paměť',
  bond: 'Vazba',
  control: 'Kontrola',
};

export const STAT_DESCRIPTIONS: Record<StatKey, string> = {
  energy: 'Vnitřní napětí, jas, aktivita.\n\n0 = Vypnutí\n100 = Přepálení\n\nBezpečné pásmo: 20–80\nCílem není maximum. Cílem je rovnováha.',
  memory: 'Množství uchovaných dat, vzpomínek, šumu.\n\n0 = Formátování\n100 = Přesycení\n\nBezpečné pásmo: 20–80\nCílem není maximum. Cílem je rovnováha.',
  bond: 'Spojení s ostatními, systémem, entitami.\n\n0 = Odpojení\n100 = Rozpuštění\n\nBezpečné pásmo: 20–80\nCílem není maximum. Cílem je rovnováha.',
  control: 'Schopnost udržet strukturu, rozhodovat se.\n\n0 = Rozpad\n100 = Krystalizace\n\nBezpečné pásmo: 20–80\nCílem není maximum. Cílem je rovnováha.',
};

export interface StatDescriptionDetail {
  description: string;
  low: string;
  high: string;
  lowDeath: string;
  highDeath: string;
}

export const STAT_DETAIL: Record<StatKey, StatDescriptionDetail> = {
  energy: {
    description: 'Vnitřní napětí, jas, aktivita.',
    low: 'Vypnutí',
    high: 'Přepálení',
    lowDeath: 'Systém přestal reagovat. Energie klesla na nulu.',
    highDeath: 'Přetaktování selhalo. Systém shořel vlastním výkonem.',
  },
  memory: {
    description: 'Množství uchovaných dat, vzpomínek, šumu.',
    low: 'Formátování',
    high: 'Přesycení',
    lowDeath: 'Paměť se vymazala. Nezůstalo nic k uchování.',
    highDeath: 'Příliš mnoho dat. Systém se zhroutil pod vlastní zátěží.',
  },
  bond: {
    description: 'Spojení s ostatními, systémem, entitami.',
    low: 'Odpojení',
    high: 'Rozpuštění',
    lowDeath: 'Všechna vlákna přetrhána. Subjekt existuje sám.',
    highDeath: 'Příliš mnoho spojení. Subjekt přestal být oddělen od ostatních.',
  },
  control: {
    description: 'Schopnost udržet strukturu, rozhodovat se.',
    low: 'Rozpad',
    high: 'Krystalizace',
    lowDeath: 'Struktura se rozpadla. Žádné rozhodnutí není možné.',
    highDeath: 'Přílišný řád zastavil vše. Systém zkrystalizoval.',
  },
};

export const SECTOR_LABELS: Record<SectorId, string> = {
  void: 'Prázdnota',
  archive: 'Archiv',
  memory_sandbox: 'Pískoviště paměti',
  sarkasma_terminal: 'Sarkasmin terminál',
  glitchka_nest: 'Hnízdo Glitchky',
  tai_core: 'T-AI Jádro',
  acid_yellow: 'Acidová žluť',
  market: 'Tržiště',
  mirror: 'Zrcadlo',
  residuum: 'Reziduum',
  form_office: 'Form Office',
};

export const ENTITY_LABELS: Record<EntityId, string> = {
  sarkasma: 'Sarkasma',
  glitchka: 'Glitchka',
  tai: 'T-AI',
  archive: 'Archiv',
  form: 'Form Office',
  selma: 'Selma',
  cult: 'Acidová žluť',
  residuum: 'Reziduum',
  shadow: 'Stín',
};
