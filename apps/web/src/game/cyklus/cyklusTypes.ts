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
  | 'glitchena'
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

export type CardChoice = 'yes' | 'no';
export type CardChoiceOrder = readonly [CardChoice, CardChoice];

export interface CardPresentation {
  mode: 'text' | 'poster-then-text' | 'text-with-art';
  artSrc?: string;
  artAlt?: string;
  choiceOrder?: CardChoiceOrder;
  focalPoint?: string;
  revealLabel?: string;
}

export type TriggerMode = 'pool' | 'scheduledOnly' | 'both';
export type ScheduledIfInvalid = 'drop' | 'delay' | 'force';

export interface SwipeCard {
  id: string;
  title: string;
  logLabel: string;
  /**
   * Plain fallback scene. Keep this readable when rich HTML rendering is disabled.
   */
  scene: string;
  /**
   * Optional trusted SYNTHOMA markup for the reader/card UI.
   * Use only the whitelisted CSS classes from efekty.md: text, log, dialog*, fx-*, halo,
   * datastream, corrupt, static-noise, quantum-blur, echo-ghost, bios-warning, etc.
   * Never put user-generated content here without sanitizing it first. Humanity already invented XSS,
   * apparently because fire and paperwork weren't enough.
   */
  sceneHtml?: string;
  /**
   * Optional wrapper classes for the card scene container, e.g. ['scene-system', 'scene-void'].
   */
  sceneFx?: string[];
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
  packId?: string;
  role?: PackCardRole;
  tone?: string[];
  presentation?: CardPresentation;
}

export type PackCardRole =
  | 'entry'
  | 'temptation'
  | 'object'
  | 'escalation'
  | 'twist'
  | 'bill'
  | 'resolution'
  | 'echo';

export type PackTone =
  | 'absurd'
  | 'brutal'
  | 'romantic'
  | 'erotic_symbolic'
  | 'horror'
  | 'tender'
  | 'comic'
  | 'tragic';

export interface CyklusItemResonance {
  /** Pooly, které předmět tematicky podporuje. Slouží pro nápovědy, mood scoring a budoucí UI. */
  poolIds?: string[];
  /** Další tematické značky mimo běžné tags. Nejsou povinné na kartách, ale pomáhají náladě kapsy. */
  aliases?: string[];
  /** Sektory, ve kterých předmět reaguje silněji. */
  favoriteSectors?: SectorId[];
  /** Staty, které předmět typicky pomáhá stabilizovat. */
  stabilizes?: StatKey[];
  /** Staty, které předmět rád rozkolísá, když má špatnou náladu. Protože samozřejmě. */
  destabilizes?: StatKey[];
  /** Entita, ke které se předmět chová jako malý kapesní vyslanec. */
  entity?: EntityId;
}

export interface CyklusItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  passiveEffects?: CyklusEffect[];
  triggerCards?: string[];
  resonance?: CyklusItemResonance;
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

export type StatDelta = Partial<Record<StatKey, number>>;
export type ProfileDelta = Partial<Record<ProfileKey, number>>;
export type EntityDelta = Partial<Record<EntityId, number>>;

export interface CyklusChoiceRecord {
  turn: number;
  cycle: number;
  cardId: string;
  direction: 'yes' | 'no';
  statDelta: StatDelta;
  profileDelta: ProfileDelta;
  flagsGained: string[];
  itemsGained: string[];
  itemsLost: string[];
  imprintsGained: string[];
  poolsUnlocked: string[];
  scheduledAdded: string[];
  entityDelta: EntityDelta;
  statsAfter: Record<StatKey, number>;
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

export type CyklusRunModifierId =
  | 'archive_rain'
  | 'silent_shift'
  | 'acid_shift'
  | 'form_day'
  | 'glitch_weather'
  | 'none';

export interface CyklusRunModifier {
  id: CyklusRunModifierId;
  title: string;
  description: string;
  tags: string[];
}

export interface CyklusRunGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  rewardPool?: string;
  rewardTitle?: string;
}

export interface ScheduledCardEntry {
  cardId: string;
  turnsRemaining: number;
  cycle?: number;
  ifInvalid?: ScheduledIfInvalid;
}

export interface CyklusRunFocus {
  type: 'sector' | 'pack' | 'story' | 'appendix';
  id: string;
  label: string;
  strictness: 'soft' | 'strong';
  remainingCards?: number;
  startedAtCycle?: number;
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
  freshMetaPools: string[];
  modifier: CyklusRunModifier;
  goals: CyklusRunGoal[];
  lastItemActivationCycle: number;
  itemActivationCount: number;
  itemActivationCountThisCycle: number;
  activeContracts: string[];
  preRunWarning: string | null;
  preRunChoice: string | null;
  runFocus?: CyklusRunFocus;
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
  profile: Partial<Record<ProfileKey, number>>;
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
  form_office: 'Formulářovna',
};

export const ENTITY_LABELS: Record<EntityId, string> = {
  sarkasma: 'Sarkasma',
  glitchka: 'Glitchka',
  glitchena: 'Glitchena',
  tai: 'T-AI',
  archive: 'Archiv',
  form: 'Formulářovna',
  selma: 'Selma',
  cult: 'Acidová žluť',
  residuum: 'Reziduum',
  shadow: 'Stín',
};
