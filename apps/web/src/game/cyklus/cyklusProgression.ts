import type { CyklusRunState, StatKey, EntityId, ProfileKey } from './cyklusTypes';
import type { CyklusDiscovery } from './cyklusDiscovery';
import { getEmptyDiscovery, loadDiscovery, saveDiscovery } from './cyklusDiscovery';
import { serverSaveProgression } from './cyklusStorage';
import { CYKLUS_CARDS } from './content';

export type MetaCurrencyId =
  | 'residuum'
  | 'memoryResidue'
  | 'energySpark'
  | 'bondThread'
  | 'controlShard'
  | 'stabilizationCore';

export const CURRENCY_LABELS: Record<MetaCurrencyId, string> = {
  residuum: 'Reziduum',
  memoryResidue: 'Paměťová sraženina',
  energySpark: 'Jiskra přepětí',
  bondThread: 'Vlákno odloučení',
  controlShard: 'Úlomek kontroly',
  stabilizationCore: 'Stabilizační jádro',
};

export type CraftMaterialId =
  | 'laugh_dust'
  | 'broken_log_splinter'
  | 'red_smoke'
  | 'fox_warmth'
  | 'archive_dust'
  | 'mirror_sand'
  | 'unpaid_comfort'
  | 'false_pattern'
  | 'soft_error';

export const MATERIAL_LABELS: Record<CraftMaterialId, string> = {
  laugh_dust: 'Smíchový prach',
  broken_log_splinter: 'Tříska z rozbitého záznamu',
  red_smoke: 'Červený dým',
  fox_warmth: 'Liščí teplo',
  archive_dust: 'Archivní prach',
  mirror_sand: 'Zrcadlový písek',
  unpaid_comfort: 'Nezaplacená útěcha',
  false_pattern: 'Falešný vzor',
  soft_error: 'Měkká chyba',
};

export type VoidRoomId =
  | 'corner'
  | 'mirror_wall'
  | 'fox_nest'
  | 'sarkasma_couch'
  | 'archive_drawer'
  | 'tai_terminal'
  | 'crafting_table'
  | 'toll_shelf'
  | 'stabilization_core';

export type ProtocolId = string;
export type RecipeId = string;
export type CraftedArtifactId = string;

export type ProfileMastery = Partial<Record<ProfileKey, number>>;

export interface VoidRoomState {
  id: VoidRoomId;
  level: number;
  unlocked: boolean;
  installedUpgrades: string[];
}

export interface SubjectProgression {
  currencies: Partial<Record<MetaCurrencyId, number>>;
  purchasedUpgrades: string[];
  equippedUpgrades: string[];
  unlockedScars: string[];
  activeScar?: string | undefined;
  entityReputation: Partial<Record<EntityId, number>>;
  discoveredUpgradeHints: string[];

  profileMastery: ProfileMastery;
  unlockedProtocols: ProtocolId[];
  equippedProtocols: ProtocolId[];

  voidRooms: Partial<Record<VoidRoomId, VoidRoomState>>;
  unlockedVoidUpgrades: string[];
  installedVoidUpgrades: string[];

  knownRecipes: RecipeId[];
  craftedArtifacts: CraftedArtifactId[];
  equippedArtifacts: CraftedArtifactId[];
  craftingInventory: Partial<Record<CraftMaterialId, number>>;

  totalResiduumEarned: number;
  totalRuns: number;
  stabilizedRuns: number;
  deathsByStat: Partial<Record<StatKey, number>>;
}

export interface RunReward {
  currencies: Partial<Record<MetaCurrencyId, number>>;
  unlockedUpgrades: string[];
  unlockedScars: string[];
  newTitles: string[];
  reasons: string[];
  craftingMaterials: Partial<Record<CraftMaterialId, number>>;
  unlockedRecipes: RecipeId[];
  profileMastery: ProfileMastery;
  voidRoomHints: VoidRoomId[];
  recommendedActions: string[];
  deathStat: StatKey | undefined;
}

export type SubjectUpgradeCategory =
  | 'boot'
  | 'pocket'
  | 'imprint'
  | 'entity'
  | 'navigation'
  | 'risk'
  | 'archive';

export interface SubjectUpgrade {
  id: string;
  title: string;
  description: string;
  category: SubjectUpgradeCategory;
  cost: Partial<Record<MetaCurrencyId, number>>;
  maxRank: number;
  requires?: string[];
  equipCost?: number;
  drawback?: string;
}

export interface SubjectScar {
  id: string;
  title: string;
  description: string;
  stat: StatKey;
  startBonus: number;
  startPenalty: number;
  startPenaltyStat: StatKey;
  effectDescription: string;
}

export interface ProfileProtocol {
  id: ProtocolId;
  title: string;
  description: string;
  requiresProfile: ProfileMastery;
  cost: Partial<Record<MetaCurrencyId, number>>;
  drawback?: string;
  effect: {
    startFlag?: string;
    previewBonus?: string;
    scoringTags?: string[];
  };
}

export interface CraftedArtifact {
  id: CraftedArtifactId;
  title: string;
  description: string;
  tags: string[];
  equipCost: number;
  effects: {
    startFlags?: string[];
    startItems?: string[];
    startImprints?: string[];
    previewBonus?: string;
    scoringTags?: string[];
  };
  drawback?: string;
}

export interface CraftRecipe {
  id: RecipeId;
  title: string;
  description: string;
  requiresRoom?: VoidRoomId;
  requiresRoomLevel?: number;
  itemIds?: string[];
  imprintIds?: string[];
  findingIds?: string[];
  materialCosts?: Partial<Record<CraftMaterialId, number>>;
  currencyCosts?: Partial<Record<MetaCurrencyId, number>>;
  result:
    | { type: 'artifact'; artifactId: CraftedArtifactId }
    | { type: 'upgrade'; upgradeId: string }
    | { type: 'voidUpgrade'; voidUpgradeId: string }
    | { type: 'protocol'; protocolId: ProtocolId };
  drawback?: string;
  hiddenUntil?: {
    itemIds?: string[];
    imprintIds?: string[];
    findingIds?: string[];
  };
}

export const MAX_EQUIPPED_UPGRADES = 3;

export const SUBJECT_UPGRADES: Record<string, SubjectUpgrade> = {
  black_box: {
    id: 'black_box',
    title: 'Černá skříň',
    description: 'Po smrti uvidíš přesnější kartu a příčinu kolapsu.',
    category: 'boot',
    cost: { residuum: 20 },
    maxRank: 1,
  },
  incomplete_manual: {
    id: 'incomplete_manual',
    title: 'Neúplný návod',
    description: 'Před prvním tahem uvidíš, který stat bude pravděpodobně nejnebezpečnější.',
    category: 'boot',
    cost: { residuum: 25, stabilizationCore: 1 },
    maxRank: 1,
  },
  goal_reroll: {
    id: 'goal_reroll',
    title: 'Přegenerování cílů',
    description: 'Jednou před runem můžeš přegenerovat diagnostické cíle.',
    category: 'boot',
    cost: { residuum: 25 },
    maxRank: 1,
  },
  inner_pocket: {
    id: 'inner_pocket',
    title: 'Vnitřní kapsa',
    description: 'Na začátku runu získáš jeden slabý předmět.',
    category: 'pocket',
    cost: { residuum: 30 },
    maxRank: 1,
    drawback: 'item_trigger karty mají vyšší šanci.',
  },
  inventory_instinct: {
    id: 'inventory_instinct',
    title: 'Inventární instinkt',
    description: 'Hinty kapsy jsou konkrétnější, když držíš polovinu item komba.',
    category: 'pocket',
    cost: { residuum: 25 },
    maxRank: 1,
  },
  second_touch: {
    id: 'second_touch',
    title: 'Druhý dotyk',
    description: 'Jednou za run můžeš aktivovat kapsu podruhé ve stejném cyklu.',
    category: 'pocket',
    cost: { residuum: 35 },
    maxRank: 1,
    drawback: 'po druhé aktivaci +6 Energie / Šum.',
  },
  resonance_slot: {
    id: 'resonance_slot',
    title: 'Rezonanční slot',
    description: 'Před runem získáš jeden dříve objevený imprint jako slabou startovní rezonanci.',
    category: 'imprint',
    cost: { residuum: 30, stabilizationCore: 1 },
    maxRank: 1,
  },
  weaker_imprint: {
    id: 'weaker_imprint',
    title: 'Slabší otisk',
    description: 'První imprint v runu má snížený negativní efekt.',
    category: 'imprint',
    cost: { residuum: 20 },
    maxRank: 1,
  },
  stabilization_echo: {
    id: 'stabilization_echo',
    title: 'Stabilizační dozvuk',
    description: 'Po dokončení cyklu je center drift o trochu silnější.',
    category: 'imprint',
    cost: { residuum: 25, stabilizationCore: 1 },
    maxRank: 1,
    drawback: 'rare/risk karty jsou mírně častější.',
  },
  tai_trust: {
    id: 'tai_trust',
    title: 'T-AI důvěra',
    description: 'T-AI smlouvy dávají lepší preview.',
    category: 'entity',
    cost: { residuum: 25 },
    maxRank: 1,
    drawback: 'system/form karty jsou častější.',
  },
  glitchka_affinity: {
    id: 'glitchka_affinity',
    title: 'Glitchka afinita',
    description: 'glitch/noise karty častěji nabídnou únik.',
    category: 'entity',
    cost: { residuum: 25 },
    maxRank: 1,
    drawback: 'Kontrola je křehčí.',
  },
  archive_reader: {
    id: 'archive_reader',
    title: 'Čtenář s průkazkou',
    description: 'Archivní karty častěji pomáhají, když je Paměť > 85.',
    category: 'entity',
    cost: { residuum: 25 },
    maxRank: 1,
    drawback: 'memory follow-upy jsou častější.',
  },
  sarkasma_debtor: {
    id: 'sarkasma_debtor',
    title: 'Sarkasmin dlužní protokol',
    description: 'Sarkasma jednou pomůže se stabilizací.',
    category: 'entity',
    cost: { residuum: 30 },
    maxRank: 1,
    drawback: 'collect karta je tvrdší.',
  },
};

export const SUBJECT_SCARS: Record<string, SubjectScar> = {
  memory_scar: {
    id: 'memory_scar',
    title: 'Přesycený záznam',
    description: 'Paměťová/archivní karty jsou častější. První archive karta má lepší reward.',
    stat: 'memory',
    startBonus: 5,
    startPenalty: 5,
    startPenaltyStat: 'energy',
    effectDescription: 'Paměť začíná na 55, Energie na 45.',
  },
  energy_scar: {
    id: 'energy_scar',
    title: 'Tlumený jas',
    description: 'Energie padá pomaleji.',
    stat: 'energy',
    startBonus: 5,
    startPenalty: 5,
    startPenaltyStat: 'control',
    effectDescription: 'Energie začíná na 55, Kontrola na 45.',
  },
  bond_scar: {
    id: 'bond_scar',
    title: 'Prázdné vlákno',
    description: 'Entity odmítnutí dávají větší reward.',
    stat: 'bond',
    startBonus: 5,
    startPenalty: 5,
    startPenaltyStat: 'memory',
    effectDescription: 'Vazba začíná na 55, Paměť na 45.',
  },
  control_scar: {
    id: 'control_scar',
    title: 'Skleněný protokol',
    description: 'Preview je přesnější.',
    stat: 'control',
    startBonus: 5,
    startPenalty: 5,
    startPenaltyStat: 'bond',
    effectDescription: 'Kontrola začíná na 55, Vazba na 45.',
  },
};

const WEAK_STARTER_ITEMS = [
  'rusty_token',
  'wrong_map',
  'glitch_pebble',
  'soft_bug',
  'market_coin',
  'returned_no',
  'ownerless_shadow',
  'childhood_spade',
  'archive_key',
  'blank_form',
];

export const VOID_ROOMS: Record<VoidRoomId, {
  id: VoidRoomId;
  title: string;
  description: string;
  maxLevel: number;
  costByLevel: Array<Partial<Record<MetaCurrencyId, number>>>;
}> = {
  corner: {
    id: 'corner',
    title: 'Kout Prázdnoty',
    description: 'Místo, kam systém nedohlédne úplně. Zatím.',
    maxLevel: 3,
    costByLevel: [
      { residuum: 15 },
      { residuum: 30, controlShard: 1 },
      { residuum: 50, stabilizationCore: 1 },
    ],
  },
  mirror_wall: {
    id: 'mirror_wall',
    title: 'Zrcadlová stěna',
    description: 'Umožní před runem nahlédnout jeden možný profilový směr.',
    maxLevel: 3,
    costByLevel: [
      { residuum: 20 },
      { residuum: 35, memoryResidue: 1 },
      { residuum: 60, stabilizationCore: 1 },
    ],
  },
  fox_nest: {
    id: 'fox_nest',
    title: 'Liščí hnízdo',
    description: 'Glitchka občas nechá v Prázdnotě měkký předmět.',
    maxLevel: 3,
    costByLevel: [
      { residuum: 25, bondThread: 1 },
      { residuum: 40, bondThread: 2 },
      { residuum: 60, stabilizationCore: 1 },
    ],
  },
  sarkasma_couch: {
    id: 'sarkasma_couch',
    title: 'Červená pohovka',
    description: 'Sarkasma zpřístupní terapeutické protokoly a přesnější řezy.',
    maxLevel: 3,
    costByLevel: [
      { residuum: 25 },
      { residuum: 40, controlShard: 1 },
      { residuum: 60, bondThread: 1, stabilizationCore: 1 },
    ],
  },
  archive_drawer: {
    id: 'archive_drawer',
    title: 'Archivní šuplík',
    description: 'Umožní uložit jednu stopu z minulého runu jako craft materiál.',
    maxLevel: 3,
    costByLevel: [
      { residuum: 20, memoryResidue: 1 },
      { residuum: 35, memoryResidue: 2 },
      { residuum: 55, stabilizationCore: 1 },
    ],
  },
  tai_terminal: {
    id: 'tai_terminal',
    title: 'T-AI terminál',
    description: 'T-AI poskytne informační protokoly a smluvní preview.',
    maxLevel: 2,
    costByLevel: [
      { residuum: 30, controlShard: 1 },
      { residuum: 55, stabilizationCore: 1 },
    ],
  },
  crafting_table: {
    id: 'crafting_table',
    title: 'Stůl nepravděpodobných kombinací',
    description: 'Zpřístupní crafting artefaktů z předmětů, otisků a nálezů.',
    maxLevel: 3,
    costByLevel: [
      { residuum: 30 },
      { residuum: 50, energySpark: 1 },
      { residuum: 75, stabilizationCore: 1 },
    ],
  },
  toll_shelf: {
    id: 'toll_shelf',
    title: 'Mýtnice',
    description: 'Dvanáctník zde zanechává smluvní a platební možnosti.',
    maxLevel: 2,
    costByLevel: [
      { residuum: 25 },
      { residuum: 50, energySpark: 1 },
    ],
  },
  stabilization_core: {
    id: 'stabilization_core',
    title: 'Stabilizační jádro',
    description: 'Rozšíří počet vybavitelných protokolů a odemkne hlubší upgrade větve.',
    maxLevel: 2,
    costByLevel: [
      { residuum: 80, stabilizationCore: 2 },
      { residuum: 150, stabilizationCore: 5 },
    ],
  },
};

export const PROFILE_PROTOCOLS: Record<ProtocolId, ProfileProtocol> = {
  ni_premonition: {
    id: 'ni_premonition',
    title: 'Ni: Předtucha vzoru',
    description: 'Jednou za cyklus ukáže, zda aktuální karta vede spíš k follow-upu, pasti nebo stabilizaci.',
    requiresProfile: { Ni: 20 },
    cost: { residuum: 30, memoryResidue: 1 },
    drawback: 'Falešné vzory jsou o něco častější.',
    effect: { startFlag: 'ni_premonition_active', previewBonus: 'pattern' },
  },
  ne_side_door: {
    id: 'ne_side_door',
    title: 'Ne: Boční dveře',
    description: 'Občas nabídne třetí výstup přes path/sandbox kartu.',
    requiresProfile: { Ne: 20 },
    cost: { residuum: 30, energySpark: 1 },
    drawback: 'Zvyšuje šanci na absurdní twist.',
    effect: { startFlag: 'ne_side_door_active', previewBonus: 'extra_path' },
  },
  si_anchor: {
    id: 'si_anchor',
    title: 'Si: Kotva známého',
    description: 'Jednou za run můžeš vrátit stat směrem k hodnotě z předchozího cyklu.',
    requiresProfile: { Si: 20 },
    cost: { residuum: 30, memoryResidue: 1 },
    drawback: 'Archivní karty častěji reagují na minulost.',
    effect: { startFlag: 'si_anchor_active', previewBonus: 'anchor' },
  },
  se_now_cut: {
    id: 'se_now_cut',
    title: 'Se: Řez přítomností',
    description: 'Při vysoké Paměti nabídne fyzickou/akční kartu, která sníží zahlcení.',
    requiresProfile: { Se: 20 },
    cost: { residuum: 30, energySpark: 1 },
    drawback: 'Energie se snáze přepaluje.',
    effect: { startFlag: 'se_now_cut_active', previewBonus: 'action_window' },
  },
  ti_contradiction: {
    id: 'ti_contradiction',
    title: 'Ti: Detektor rozporu',
    description: 'Preview upozorní, když text karty a efekt podezřele nesedí.',
    requiresProfile: { Ti: 20 },
    cost: { residuum: 30, controlShard: 1 },
    drawback: 'Vazba někdy klesá při entity kartách.',
    effect: { startFlag: 'ti_contradiction_active', previewBonus: 'contradiction' },
  },
  te_cost_preview: {
    id: 'te_cost_preview',
    title: 'Te: Cena před podpisem',
    description: 'U smluv, mýtnic a Formulářovny ukáže pozdější cenu přesněji.',
    requiresProfile: { Te: 20 },
    cost: { residuum: 30, controlShard: 1 },
    drawback: 'Méně náhodných měkkých rewardů.',
    effect: { startFlag: 'te_cost_preview_active', previewBonus: 'cost_preview' },
  },
  fi_authentic_no: {
    id: 'fi_authentic_no',
    title: 'Fi: Autentické ne',
    description: 'Odmítnutí entity může dát Bond místo ztráty, pokud chrání hranici.',
    requiresProfile: { Fi: 20 },
    cost: { residuum: 30, bondThread: 1 },
    drawback: 'Systémové autority reagují tvrději.',
    effect: { startFlag: 'fi_authentic_no_active', scoringTags: ['entity', 'boundary'] },
  },
  fe_warm_thread: {
    id: 'fe_warm_thread',
    title: 'Fe: Teplé vlákno',
    description: 'Entity vztahy rostou rychleji, pokud hráč volí péči bez rozpuštění.',
    requiresProfile: { Fe: 20 },
    cost: { residuum: 30, bondThread: 1 },
    drawback: 'Riziko dissolution karet je vyšší.',
    effect: { startFlag: 'fe_warm_thread_active', scoringTags: ['entity', 'care'] },
  },
};

export const CRAFTED_ARTIFACTS: Record<CraftedArtifactId, CraftedArtifact> = {
  soft_pause_protocol: {
    id: 'soft_pause_protocol',
    title: 'Protokol měkké pauzy',
    description: 'Deka pauzy přestane být jen předmět a stane se rituálem začátku.',
    tags: ['glitchka', 'pause', 'comfort'],
    equipCost: 1,
    effects: { startFlags: ['soft_pause_protocol_active'], startItems: ['blanket_of_pause'] },
    drawback: 'Méně akčních začátků. Více silent/pause karet.',
  },
  noise_lens: {
    id: 'noise_lens',
    title: 'Šumová čočka',
    description: 'Zrcadlový střep se naučí číst šum, aniž by mu okamžitě uvěřil.',
    tags: ['mirror', 'noise', 'preview'],
    equipCost: 1,
    effects: { startFlags: ['noise_lens_active'], previewBonus: 'noise' },
    drawback: 'Falešné vzory jsou častější.',
  },
  clean_cut_scalpel: {
    id: 'clean_cut_scalpel',
    title: 'Čistý řez Sarkasmy',
    description: 'Sarkasmin skalpel se naučí oddělit krutost od přesnosti.',
    tags: ['sarkasma', 'overcut', 'precision'],
    equipCost: 1,
    effects: { startFlags: ['clean_cut_scalpel_active'], previewBonus: 'overcut' },
    drawback: 'Při odmítání entity může Vazba klesnout víc.',
  },
  named_shell: {
    id: 'named_shell',
    title: 'Pojmenovaná skořápka',
    description: 'Jizva Černého boxu se přestane tvářit jako trest a začne fungovat jako ochranná vrstva.',
    tags: ['blackbox', 'name', 'protection'],
    equipCost: 1,
    effects: { startFlags: ['named_shell_active'], startImprints: ['named_error'] },
    drawback: 'Formulářové karty tě častěji rozpoznají.',
  },
  refund_stamp: {
    id: 'refund_stamp',
    title: 'Razítko vrácené útěchy',
    description: 'Dvanáctník ti neodpustil. Jen uznal, že některé účty se dají zaplatit pravdou.',
    tags: ['toll', 'comfort', 'truth'],
    equipCost: 1,
    effects: { startFlags: ['refund_stamp_active'], scoringTags: ['toll', 'contract'] },
    drawback: 'Mýtné karty dávají větší reward i větší cenu.',
  },
};

export const CRAFT_RECIPES: Record<RecipeId, CraftRecipe> = {
  fox_blanket_protocol: {
    id: 'fox_blanket_protocol',
    title: 'Protokol měkké pauzy',
    description: 'Deka pauzy přestane být jen předmět a stane se rituálem začátku.',
    requiresRoom: 'fox_nest',
    requiresRoomLevel: 1,
    itemIds: ['blanket_of_pause'],
    imprintIds: ['held_without_fixing'],
    materialCosts: { fox_warmth: 1 },
    currencyCosts: { residuum: 20, bondThread: 1 },
    result: { type: 'artifact', artifactId: 'soft_pause_protocol' },
    drawback: 'Méně akčních začátků. Více silent/pause karet.',
    hiddenUntil: { itemIds: ['blanket_of_pause'], imprintIds: ['held_without_fixing'] },
  },
  mirror_noise_lens: {
    id: 'mirror_noise_lens',
    title: 'Šumová čočka',
    description: 'Zrcadlový střep se naučí číst šum, aniž by mu okamžitě uvěřil.',
    requiresRoom: 'mirror_wall',
    requiresRoomLevel: 2,
    itemIds: ['mirror_shard', 'noise_clump'],
    materialCosts: { mirror_sand: 1 },
    currencyCosts: { residuum: 25, memoryResidue: 1 },
    result: { type: 'artifact', artifactId: 'noise_lens' },
    drawback: 'Falešné vzory jsou častější.',
    hiddenUntil: { itemIds: ['mirror_shard', 'noise_clump'] },
  },
  sarkasma_clean_cut: {
    id: 'sarkasma_clean_cut',
    title: 'Čistý řez Sarkasmy',
    description: 'Sarkasmin skalpel se naučí oddělit krutost od přesnosti.',
    requiresRoom: 'sarkasma_couch',
    requiresRoomLevel: 2,
    itemIds: ['joke_scalpel'],
    imprintIds: ['overcut_warning'],
    materialCosts: { red_smoke: 1 },
    currencyCosts: { residuum: 30, controlShard: 1 },
    result: { type: 'artifact', artifactId: 'clean_cut_scalpel' },
    drawback: 'Při odmítání entity může Vazba klesnout víc.',
    hiddenUntil: { itemIds: ['joke_scalpel'], imprintIds: ['overcut_warning'] },
  },
  blackbox_named_shell: {
    id: 'blackbox_named_shell',
    title: 'Pojmenovaná skořápka',
    description: 'Jizva Černého boxu se přestane tvářit jako trest a začne fungovat jako ochranná vrstva.',
    requiresRoom: 'corner',
    requiresRoomLevel: 2,
    imprintIds: ['blackbox_scar', 'named_error'],
    materialCosts: { broken_log_splinter: 1 },
    currencyCosts: { residuum: 35, controlShard: 1, memoryResidue: 1 },
    result: { type: 'artifact', artifactId: 'named_shell' },
    drawback: 'Formulářové karty tě častěji rozpoznají.',
    hiddenUntil: { imprintIds: ['blackbox_scar', 'named_error'] },
  },
  toll_refund_stamp: {
    id: 'toll_refund_stamp',
    title: 'Razítko vrácené útěchy',
    description: 'Dvanáctník ti neodpustil. Jen uznal, že některé účty se dají zaplatit pravdou.',
    requiresRoom: 'toll_shelf',
    requiresRoomLevel: 1,
    itemIds: ['toll_receipt'],
    imprintIds: ['comfort_refunded'],
    materialCosts: { unpaid_comfort: 1 },
    currencyCosts: { residuum: 25 },
    result: { type: 'artifact', artifactId: 'refund_stamp' },
    drawback: 'Mýtné karty dávají větší reward i větší cenu.',
    hiddenUntil: { itemIds: ['toll_receipt'], imprintIds: ['comfort_refunded'] },
  },
};

export function getEmptyProgression(): SubjectProgression {
  return {
    currencies: {},
    purchasedUpgrades: [],
    equippedUpgrades: [],
    unlockedScars: [],
    entityReputation: {},
    discoveredUpgradeHints: [],
    profileMastery: {},
    unlockedProtocols: [],
    equippedProtocols: [],
    voidRooms: {},
    unlockedVoidUpgrades: [],
    installedVoidUpgrades: [],
    knownRecipes: [],
    craftedArtifacts: [],
    equippedArtifacts: [],
    craftingInventory: {},
    totalResiduumEarned: 0,
    totalRuns: 0,
    stabilizedRuns: 0,
    deathsByStat: {},
  };
}

export function loadSubjectProgression(): SubjectProgression {
  if (typeof window === 'undefined') return getEmptyProgression();
  try {
    const raw = localStorage.getItem('synthoma_cyklus_progression_v1');
    if (!raw) return getEmptyProgression();
    const parsed = JSON.parse(raw) as SubjectProgression;
    const empty = getEmptyProgression();
    return {
      ...empty,
      ...parsed,
      currencies: { ...empty.currencies, ...parsed.currencies },
      entityReputation: { ...empty.entityReputation, ...parsed.entityReputation },
      profileMastery: { ...empty.profileMastery, ...parsed.profileMastery },
      voidRooms: { ...empty.voidRooms, ...parsed.voidRooms },
      craftingInventory: { ...empty.craftingInventory, ...parsed.craftingInventory },
      deathsByStat: { ...empty.deathsByStat, ...parsed.deathsByStat },
    };
  } catch {
    return getEmptyProgression();
  }
}

export function saveSubjectProgression(progression: SubjectProgression): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('synthoma_cyklus_progression_v1', JSON.stringify(progression));
  } catch {
    // ignore storage errors
  }
  serverSaveProgression(progression).catch(() => {});
}

export function computeRunRewards(
  state: CyklusRunState,
  discoveryBefore: CyklusDiscovery,
  findingIds?: string[],
  variantId?: string,
): RunReward {
  const currencies: Partial<Record<MetaCurrencyId, number>> = {};
  const reasons: string[] = [];
  const unlockedUpgrades: string[] = [];
  const unlockedScars: string[] = [];
  const newTitles: string[] = [];
  const craftingMaterials: Partial<Record<CraftMaterialId, number>> = {};
  const unlockedRecipes: RecipeId[] = [];
  const profileMastery: ProfileMastery = {};
  const voidRoomHints: VoidRoomId[] = [];
  const recommendedActions: string[] = [];

  const addCurrency = (key: MetaCurrencyId, amount: number, reason: string) => {
    if (amount <= 0) return;
    currencies[key] = (currencies[key] ?? 0) + amount;
    reasons.push(reason);
  };

  const addMaterial = (key: CraftMaterialId, amount: number, reason: string) => {
    if (amount <= 0) return;
    craftingMaterials[key] = (craftingMaterials[key] ?? 0) + amount;
    reasons.push(reason);
  };

  addCurrency('residuum', state.cycle * 3, `Přežité cykly: +${state.cycle * 3}`);

  const completedGoals = state.goals.filter((g) => g.completed).length;
  if (completedGoals > 0) {
    addCurrency('residuum', completedGoals * 5, `Diagnostické cíle: +${completedGoals * 5}`);
  }

  const discoveryAfter = loadDiscovery();
  const newCards = discoveryAfter.cards.length - discoveryBefore.cards.length;
  const newSectors = discoveryAfter.sectors.length - discoveryBefore.sectors.length;
  const newItems = discoveryAfter.items.length - discoveryBefore.items.length;
  const newImprints = discoveryAfter.imprints.length - discoveryBefore.imprints.length;
  const newEndings = discoveryAfter.endings.length - discoveryBefore.endings.length;

  if (newCards > 0) addCurrency('residuum', newCards * 1, `Nové karty: +${newCards}`);
  if (newSectors > 0) addCurrency('residuum', newSectors * 3, `Nové sektory: +${newSectors * 3}`);
  if (newItems > 0) addCurrency('residuum', newItems * 2, `Nové předměty: +${newItems * 2}`);
  if (newImprints > 0) addCurrency('residuum', newImprints * 5, `Nové otisky: +${newImprints * 5}`);
  if (newEndings > 0) addCurrency('residuum', newEndings * 8, `Nové konce: +${newEndings * 8}`);

  const newFindings = (findingIds ?? []).length;
  if (newFindings > 0) addCurrency('residuum', newFindings * 8, `Diagnostické nálezy: +${newFindings * 8}`);

  if (variantId) addCurrency('residuum', 5, `Stabilizační varianta: +5`);

  let deathStat: StatKey | undefined;
  if (state.status === 'completed') {
    addCurrency('residuum', 20, 'Stabilizace subjektu: +20');
    addCurrency('stabilizationCore', 1, 'Stabilizační jádro: +1');
  } else if (state.status === 'dead') {
    const stats = state.stats;
    const nearest = Object.entries(stats)
      .map(([key, value]) => ({ key: key as StatKey, dist: Math.min(value, 100 - value) }))
      .sort((a, b) => a.dist - b.dist)[0];
    if (nearest) {
      deathStat = nearest.key;
      const deathCurrencyMap: Record<StatKey, MetaCurrencyId> = {
        memory: 'memoryResidue',
        energy: 'energySpark',
        bond: 'bondThread',
        control: 'controlShard',
      };
      addCurrency(deathCurrencyMap[deathStat], 1, `${CURRENCY_LABELS[deathCurrencyMap[deathStat]]}: +1`);
      const scarId = `${deathStat}_scar`;
      if (SUBJECT_SCARS[scarId] && !unlockedScars.includes(scarId)) {
        unlockedScars.push(scarId);
        reasons.push(`Nová jizva: ${SUBJECT_SCARS[scarId].title}`);
      }
    }
  }

  // ── profile mastery from run history ─────────────────────────────────────────
  for (const record of state.history) {
    for (const [key, amount] of Object.entries(record.profileDelta)) {
      if (!amount) continue;
      const profileKey = key as ProfileKey;
      profileMastery[profileKey] = (profileMastery[profileKey] ?? 0) + Math.abs(amount);
    }
  }

  // ── crafting materials from pack usage ───────────────────────────────────────
  const usedPacks = new Set<string>();
  const tagCounts: Record<string, number> = {};
  for (const cardId of state.usedCardIds) {
    const card = CYKLUS_CARDS[cardId];
    if (!card) continue;
    if (card.packId) usedPacks.add(card.packId);
    for (const tag of card.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  if (usedPacks.has('glitchka_chat')) {
    addMaterial('fox_warmth', 1, 'Liščí teplo: +1');
    addMaterial('laugh_dust', 1, 'Smíchový prach: +1');
  }
  if (usedPacks.has('brutal_blackbox')) {
    addMaterial('broken_log_splinter', 1, 'Tříska z rozbitého záznamu: +1');
  }
  if (usedPacks.has('sarkasma_therapy')) {
    addMaterial('red_smoke', 1, 'Červený dým: +1');
  }
  if (usedPacks.has('detective_echo_case')) {
    addMaterial('false_pattern', 1, 'Falešný vzor: +1');
  }
  if (usedPacks.has('toll_dvanactnik')) {
    addMaterial('unpaid_comfort', 1, 'Nezaplacená útěcha: +1');
  }
  if ((tagCounts['archive'] ?? 0) >= 3) {
    addMaterial('archive_dust', 1, 'Archivní prach: +1');
  }
  if ((tagCounts['mirror'] ?? 0) >= 3) {
    addMaterial('mirror_sand', 1, 'Zrcadlový písek: +1');
  }

  // ── recipe unlocks based on owned discovered items/imprints ──────────────────
  const discovery = loadDiscovery();
  const progression = loadSubjectProgression();
  const hasCraftingTable = (progression.voidRooms.crafting_table?.level ?? 0) >= 1;
  for (const recipe of Object.values(CRAFT_RECIPES)) {
    const hidden = recipe.hiddenUntil;
    const hasItems = (hidden?.itemIds ?? recipe.itemIds ?? []).every((id) => discovery.items.includes(id));
    const hasImprints = (hidden?.imprintIds ?? recipe.imprintIds ?? []).every((id) => discovery.imprints.includes(id));
    const hasFindings = (hidden?.findingIds ?? []).every((id) => discovery.findings.includes(id));
    if (hasCraftingTable && hasItems && hasImprints && hasFindings) {
      unlockedRecipes.push(recipe.id);
    }
  }

  // ── void room hints based on run themes ──────────────────────────────────────
  if (usedPacks.has('glitchka_chat')) voidRoomHints.push('fox_nest');
  if (usedPacks.has('sarkasma_therapy')) voidRoomHints.push('sarkasma_couch');
  if (usedPacks.has('detective_echo_case')) voidRoomHints.push('archive_drawer');
  if (usedPacks.has('toll_dvanactnik')) voidRoomHints.push('toll_shelf');
  if ((tagCounts['mirror'] ?? 0) >= 3) voidRoomHints.push('mirror_wall');
  if ((tagCounts['archive'] ?? 0) >= 3) voidRoomHints.push('archive_drawer');
  if ((tagCounts['tai'] ?? 0) >= 3) voidRoomHints.push('tai_terminal');

  // ── recommended actions ──────────────────────────────────────────────────────
  if (Object.keys(profileMastery).length > 0) {
    recommendedActions.push('Zkontroluj profilové protokoly.');
  }
  if (Object.keys(craftingMaterials).length > 0) {
    recommendedActions.push('Přečti si craft materiály v kapse.');
  }
  if (voidRoomHints.length > 0) {
    recommendedActions.push('Vylepšením místnosti v Prázdnotě odemkneš nový směr.');
  }

  return {
    currencies,
    unlockedUpgrades,
    unlockedScars,
    newTitles,
    reasons,
    craftingMaterials,
    unlockedRecipes,
    profileMastery,
    voidRoomHints,
    recommendedActions,
    deathStat,
  };
}

export function awardRunRewards(reward: RunReward): void {
  const progression = loadSubjectProgression();
  for (const [key, value] of Object.entries(reward.currencies)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    progression.currencies[k] = (progression.currencies[k] ?? 0) + value;
  }
  for (const [key, value] of Object.entries(reward.craftingMaterials)) {
    if (!value) continue;
    const m = key as CraftMaterialId;
    progression.craftingInventory[m] = (progression.craftingInventory[m] ?? 0) + value;
  }
  for (const id of reward.unlockedUpgrades) {
    if (!progression.purchasedUpgrades.includes(id)) {
      progression.purchasedUpgrades.push(id);
    }
  }
  for (const id of reward.unlockedScars) {
    if (!progression.unlockedScars.includes(id)) {
      progression.unlockedScars.push(id);
    }
  }
  for (const id of reward.unlockedRecipes) {
    if (!progression.knownRecipes.includes(id)) {
      progression.knownRecipes.push(id);
    }
  }
  for (const [key, value] of Object.entries(reward.profileMastery)) {
    if (!value) continue;
    const p = key as ProfileKey;
    progression.profileMastery[p] = (progression.profileMastery[p] ?? 0) + value;
  }
  for (const id of reward.voidRoomHints) {
    if (!progression.discoveredUpgradeHints.includes(id)) {
      progression.discoveredUpgradeHints.push(id);
    }
  }
  if (reward.deathStat) {
    const stat = reward.deathStat;
    progression.deathsByStat[stat] = (progression.deathsByStat[stat] ?? 0) + 1;
    const scarId = `${stat}_scar`;
    if (SUBJECT_SCARS[scarId] && !progression.unlockedScars.includes(scarId)) {
      progression.unlockedScars.push(scarId);
    }
  }
  progression.totalResiduumEarned += reward.currencies.residuum ?? 0;
  progression.totalRuns += 1;
  if (reward.currencies.stabilizationCore && reward.currencies.stabilizationCore > 0) {
    progression.stabilizedRuns += 1;
  }
  saveSubjectProgression(progression);
}

export function purchaseUpgrade(upgradeId: string): boolean {
  const upgrade = SUBJECT_UPGRADES[upgradeId];
  if (!upgrade) return false;
  const progression = loadSubjectProgression();
  if (progression.purchasedUpgrades.includes(upgradeId)) return false;
  for (const [key, value] of Object.entries(upgrade.cost)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    const available = progression.currencies[k] ?? 0;
    if (available < value) return false;
  }
  for (const [key, value] of Object.entries(upgrade.cost)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    progression.currencies[k] = (progression.currencies[k] ?? 0) - value;
  }
  progression.purchasedUpgrades.push(upgradeId);
  if (!progression.equippedUpgrades.includes(upgradeId)) {
    const limits = getLoadoutLimits(progression);
    if (progression.equippedUpgrades.length < limits.upgradeSlots) {
      progression.equippedUpgrades.push(upgradeId);
    }
  }
  saveSubjectProgression(progression);
  return true;
}

export function equipUpgrade(upgradeId: string): boolean {
  const progression = loadSubjectProgression();
  if (!progression.purchasedUpgrades.includes(upgradeId)) return false;
  if (progression.equippedUpgrades.includes(upgradeId)) return true;
  const limits = getLoadoutLimits(progression);
  if (progression.equippedUpgrades.length >= limits.upgradeSlots) return false;
  progression.equippedUpgrades.push(upgradeId);
  saveSubjectProgression(progression);
  return true;
}

export function unequipUpgrade(upgradeId: string): boolean {
  const progression = loadSubjectProgression();
  if (!progression.equippedUpgrades.includes(upgradeId)) return false;
  progression.equippedUpgrades = progression.equippedUpgrades.filter((id) => id !== upgradeId);
  saveSubjectProgression(progression);
  return true;
}

export function setActiveScar(scarId: string | undefined): boolean {
  const progression = loadSubjectProgression();
  if (scarId && !progression.unlockedScars.includes(scarId)) return false;
  progression.activeScar = scarId;
  saveSubjectProgression(progression);
  return true;
}

function deterministicPick<T>(seed: string, items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  let hash = 0;
  const input = seed + '_progression';
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % items.length;
  return items[index];
}

export function applyProgressionToNewRun(
  state: CyklusRunState,
  progression: SubjectProgression,
): CyklusRunState {
  let s = { ...state, flags: [...state.flags], inventory: [...state.inventory], imprints: [...state.imprints], stats: { ...state.stats } };

  for (const upgradeId of progression.equippedUpgrades) {
    switch (upgradeId) {
      case 'inner_pocket': {
        const item = deterministicPick(s.seed, WEAK_STARTER_ITEMS);
        if (item && !s.inventory.includes(item)) {
          s.inventory.push(item);
          s.flags.push('inner_pocket_active');
        }
        break;
      }
      case 'resonance_slot': {
        const discovery = loadDiscovery();
        const available = discovery.imprints.length > 0 ? discovery.imprints : Object.keys(s.imprints);
        const imprint = deterministicPick(s.seed + '_resonance', available);
        if (imprint && !s.imprints.includes(imprint)) {
          s.imprints.push(imprint);
          s.flags.push('resonance_slot_active');
        }
        break;
      }
      case 'stabilization_echo': {
        s.flags.push('stabilization_echo_active');
        break;
      }
      case 'tai_trust': {
        s.flags.push('tai_trust_active');
        break;
      }
      case 'glitchka_affinity': {
        s.flags.push('glitchka_affinity_active');
        break;
      }
      case 'archive_reader': {
        s.flags.push('archive_reader_active');
        break;
      }
      case 'sarkasma_debtor': {
        s.flags.push('sarkasma_debtor_active');
        break;
      }
      case 'black_box': {
        s.flags.push('black_box_active');
        break;
      }
      case 'incomplete_manual': {
        s.flags.push('incomplete_manual_active');
        break;
      }
      case 'goal_reroll': {
        s.flags.push('goal_reroll_active');
        break;
      }
      case 'inventory_instinct': {
        s.flags.push('inventory_instinct_active');
        break;
      }
      case 'second_touch': {
        s.flags.push('second_touch_active');
        break;
      }
      case 'weaker_imprint': {
        s.flags.push('weaker_imprint_active');
        break;
      }
      default:
        break;
    }
  }

  if (progression.activeScar) {
    const scar = SUBJECT_SCARS[progression.activeScar];
    if (scar) {
      s.flags.push(`${scar.id}_active`);
      s.stats[scar.stat] = 50 + scar.startBonus;
      s.stats[scar.startPenaltyStat] = 50 - scar.startPenalty;
    }
  }

  s = applyVoidRoomsToNewRun(s, progression);
  s = applyProfileProtocolsToNewRun(s, progression);
  s = applyCraftedArtifactsToNewRun(s, progression);

  return s;
}

export function hasCurrency(progression: SubjectProgression, currency: MetaCurrencyId, amount: number): boolean {
  return (progression.currencies[currency] ?? 0) >= amount;
}

export function canPurchaseUpgrade(progression: SubjectProgression, upgradeId: string): boolean {
  const upgrade = SUBJECT_UPGRADES[upgradeId];
  if (!upgrade) return false;
  if (progression.purchasedUpgrades.includes(upgradeId)) return false;
  for (const [key, value] of Object.entries(upgrade.cost)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    if ((progression.currencies[k] ?? 0) < value) return false;
  }
  if (upgrade.requires) {
    for (const req of upgrade.requires) {
      if (!progression.purchasedUpgrades.includes(req)) return false;
    }
  }
  return true;
}

export function computeCurrencyTotal(currencies: Partial<Record<MetaCurrencyId, number>>): number {
  return Object.values(currencies).reduce((sum, v) => sum + (v ?? 0), 0);
}

export function getUpgradeStatus(progression: SubjectProgression, upgradeId: string): 'locked' | 'available' | 'purchased' | 'equipped' {
  const upgrade = SUBJECT_UPGRADES[upgradeId];
  if (!upgrade) return 'locked';
  if (progression.equippedUpgrades.includes(upgradeId)) return 'equipped';
  if (progression.purchasedUpgrades.includes(upgradeId)) return 'purchased';
  if (canPurchaseUpgrade(progression, upgradeId)) return 'available';
  return 'locked';
}

export function formatRewardReasons(reasons: string[]): string[] {
  return reasons.map((r) => r.replace(/^\+/, '').trim());
}

// ── VOID ROOMS ─────────────────────────────────────────────────────────────────

export function getVoidRoomState(progression: SubjectProgression, roomId: VoidRoomId): VoidRoomState {
  const existing = progression.voidRooms[roomId];
  if (existing) return existing;
  return { id: roomId, level: 0, unlocked: false, installedUpgrades: [] };
}

export function upgradeVoidRoom(roomId: VoidRoomId): boolean {
  const progression = loadSubjectProgression();
  const room = VOID_ROOMS[roomId];
  const state = getVoidRoomState(progression, roomId);
  if (state.level >= room.maxLevel) return false;
  const cost = room.costByLevel[state.level] ?? {};
  for (const [key, value] of Object.entries(cost)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    if ((progression.currencies[k] ?? 0) < value) return false;
  }
  for (const [key, value] of Object.entries(cost)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    progression.currencies[k] = (progression.currencies[k] ?? 0) - value;
  }
  const nextLevel = state.level + 1;
  progression.voidRooms[roomId] = {
    id: roomId,
    level: nextLevel,
    unlocked: true,
    installedUpgrades: state.installedUpgrades,
  };
  saveSubjectProgression(progression);
  return true;
}

export function getVoidRoomStatus(progression: SubjectProgression, roomId: VoidRoomId): 'locked' | 'available' | 'maxed' {
  const room = VOID_ROOMS[roomId];
  const state = getVoidRoomState(progression, roomId);
  if (state.level >= room.maxLevel) return 'maxed';
  const cost = room.costByLevel[state.level] ?? {};
  for (const [key, value] of Object.entries(cost)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    if ((progression.currencies[k] ?? 0) < value) return 'locked';
  }
  return 'available';
}

export function applyVoidRoomsToNewRun(
  state: CyklusRunState,
  progression: SubjectProgression,
): CyklusRunState {
  let s = { ...state, flags: [...state.flags], inventory: [...state.inventory], imprints: [...state.imprints] };
  const rooms = progression.voidRooms;

  const corner = rooms.corner;
  if (corner && corner.level >= 1) {
    const item = deterministicPick(s.seed + '_corner', WEAK_STARTER_ITEMS);
    if (item && !s.inventory.includes(item)) {
      s.inventory.push(item);
      s.flags.push('corner_hidden_item_active');
    }
  }

  const foxNest = rooms.fox_nest;
  if (foxNest && foxNest.level >= 1) {
    s.flags.push('fox_nest_soft_start_active');
  }
  if (foxNest && foxNest.level >= 2) {
    s.flags.push('fox_nest_pool_support_active');
  }
  if (foxNest && foxNest.level >= 3) {
    s.flags.push('fox_nest_fake_detection_active');
  }

  const sarkasmaCouch = rooms.sarkasma_couch;
  if (sarkasmaCouch && sarkasmaCouch.level >= 1) {
    s.flags.push('sarkasma_couch_therapy_active');
  }
  if (sarkasmaCouch && sarkasmaCouch.level >= 2) {
    s.flags.push('sarkasma_couch_overcut_warning_active');
  }
  if (sarkasmaCouch && sarkasmaCouch.level >= 3) {
    s.flags.push('sarkasma_couch_clean_cut_active');
  }

  const mirrorWall = rooms.mirror_wall;
  if (mirrorWall && mirrorWall.level >= 1) {
    s.flags.push('mirror_wall_profile_preview_active');
  }
  if (mirrorWall && mirrorWall.level >= 2) {
    s.flags.push('mirror_wall_protocol_slot_active');
  }

  const archiveDrawer = rooms.archive_drawer;
  if (archiveDrawer && archiveDrawer.level >= 1) {
    s.flags.push('archive_drawer_material_active');
  }
  if (archiveDrawer && archiveDrawer.level >= 2) {
    s.flags.push('archive_drawer_recycle_active');
  }

  const craftingTable = rooms.crafting_table;
  if (craftingTable && craftingTable.level >= 1) {
    s.flags.push('crafting_table_tier1_active');
  }
  if (craftingTable && craftingTable.level >= 2) {
    s.flags.push('crafting_table_tier2_active');
  }
  if (craftingTable && craftingTable.level >= 3) {
    s.flags.push('crafting_table_tier3_active');
  }

  const taiTerminal = rooms.tai_terminal;
  if (taiTerminal && taiTerminal.level >= 1) {
    s.flags.push('tai_terminal_preview_active');
  }

  const tollShelf = rooms.toll_shelf;
  if (tollShelf && tollShelf.level >= 1) {
    s.flags.push('toll_shelf_active');
  }

  return s;
}

// ── PROFILE MASTERY & PROTOCOLS ──────────────────────────────────────────────

export function updateProfileMasteryFromRun(
  progression: SubjectProgression,
  state: CyklusRunState,
): SubjectProgression {
  const next = { ...progression, profileMastery: { ...progression.profileMastery } };
  for (const record of state.history) {
    for (const [key, amount] of Object.entries(record.profileDelta)) {
      if (!amount) continue;
      const profileKey = key as ProfileKey;
      next.profileMastery[profileKey] = (next.profileMastery[profileKey] ?? 0) + Math.abs(amount);
    }
  }
  return next;
}

export function purchaseProtocol(protocolId: ProtocolId): boolean {
  const protocol = PROFILE_PROTOCOLS[protocolId];
  if (!protocol) return false;
  const progression = loadSubjectProgression();
  if (progression.unlockedProtocols.includes(protocolId)) return false;
  for (const [key, value] of Object.entries(protocol.requiresProfile)) {
    if (!value) continue;
    const current = progression.profileMastery[key as ProfileKey] ?? 0;
    if (current < value) return false;
  }
  for (const [key, value] of Object.entries(protocol.cost)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    if ((progression.currencies[k] ?? 0) < value) return false;
  }
  for (const [key, value] of Object.entries(protocol.cost)) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    progression.currencies[k] = (progression.currencies[k] ?? 0) - value;
  }
  progression.unlockedProtocols.push(protocolId);
  saveSubjectProgression(progression);
  return true;
}

export function equipProtocol(protocolId: ProtocolId): boolean {
  const progression = loadSubjectProgression();
  if (!progression.unlockedProtocols.includes(protocolId)) return false;
  if (progression.equippedProtocols.includes(protocolId)) return true;
  const limits = getLoadoutLimits(progression);
  if (progression.equippedProtocols.length >= limits.protocolSlots) return false;
  progression.equippedProtocols.push(protocolId);
  saveSubjectProgression(progression);
  return true;
}

export function unequipProtocol(protocolId: ProtocolId): boolean {
  const progression = loadSubjectProgression();
  if (!progression.equippedProtocols.includes(protocolId)) return false;
  progression.equippedProtocols = progression.equippedProtocols.filter((id) => id !== protocolId);
  saveSubjectProgression(progression);
  return true;
}

export function applyProfileProtocolsToNewRun(
  state: CyklusRunState,
  progression: SubjectProgression,
): CyklusRunState {
  let s = { ...state, flags: [...state.flags] };
  for (const protocolId of progression.equippedProtocols) {
    const protocol = PROFILE_PROTOCOLS[protocolId];
    if (protocol?.effect.startFlag) {
      s.flags.push(protocol.effect.startFlag);
    }
  }
  return s;
}

// ── CRAFTING ───────────────────────────────────────────────────────────────────

export function getCraftingTier(progression: SubjectProgression): number {
  const table = progression.voidRooms.crafting_table;
  return table?.level ?? 0;
}

export function canCraftRecipe(progression: SubjectProgression, recipeId: RecipeId): boolean {
  const recipe = CRAFT_RECIPES[recipeId];
  if (!recipe) return false;
  if (!progression.knownRecipes.includes(recipeId)) return false;
  const tier = getCraftingTier(progression);
  if (recipe.requiresRoom && (progression.voidRooms[recipe.requiresRoom]?.level ?? 0) < (recipe.requiresRoomLevel ?? 1)) {
    return false;
  }
  const tierRequired = recipe.requiresRoom === 'crafting_table' ? (recipe.requiresRoomLevel ?? 1) : 1;
  if (tier < tierRequired) return false;

  const discovery = loadDiscovery();
  const requiredItems = recipe.hiddenUntil?.itemIds ?? recipe.itemIds ?? [];
  for (const id of requiredItems) {
    if (!discovery.items.includes(id)) return false;
  }
  const requiredImprints = recipe.hiddenUntil?.imprintIds ?? recipe.imprintIds ?? [];
  for (const id of requiredImprints) {
    if (!discovery.imprints.includes(id)) return false;
  }
  const requiredFindings = recipe.hiddenUntil?.findingIds ?? [];
  for (const id of requiredFindings) {
    if (!discovery.findings.includes(id)) return false;
  }

  for (const [key, value] of Object.entries(recipe.materialCosts ?? {})) {
    if (!value) continue;
    const k = key as CraftMaterialId;
    if ((progression.craftingInventory[k] ?? 0) < value) return false;
  }
  for (const [key, value] of Object.entries(recipe.currencyCosts ?? {})) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    if ((progression.currencies[k] ?? 0) < value) return false;
  }
  return true;
}

export function craftRecipe(recipeId: RecipeId): boolean {
  const recipe = CRAFT_RECIPES[recipeId];
  if (!recipe) return false;
  const progression = loadSubjectProgression();
  if (!canCraftRecipe(progression, recipeId)) return false;
  for (const [key, value] of Object.entries(recipe.materialCosts ?? {})) {
    if (!value) continue;
    const k = key as CraftMaterialId;
    progression.craftingInventory[k] = (progression.craftingInventory[k] ?? 0) - value;
  }
  for (const [key, value] of Object.entries(recipe.currencyCosts ?? {})) {
    if (!value) continue;
    const k = key as MetaCurrencyId;
    progression.currencies[k] = (progression.currencies[k] ?? 0) - value;
  }
  if (recipe.result.type === 'artifact') {
    if (!progression.craftedArtifacts.includes(recipe.result.artifactId)) {
      progression.craftedArtifacts.push(recipe.result.artifactId);
    }
  }
  saveSubjectProgression(progression);
  return true;
}

export function equipArtifact(artifactId: CraftedArtifactId): boolean {
  const progression = loadSubjectProgression();
  if (!progression.craftedArtifacts.includes(artifactId)) return false;
  if (progression.equippedArtifacts.includes(artifactId)) return true;
  const limits = getLoadoutLimits(progression);
  if (progression.equippedArtifacts.length >= limits.artifactSlots) return false;
  progression.equippedArtifacts.push(artifactId);
  saveSubjectProgression(progression);
  return true;
}

export function unequipArtifact(artifactId: CraftedArtifactId): boolean {
  const progression = loadSubjectProgression();
  if (!progression.equippedArtifacts.includes(artifactId)) return false;
  progression.equippedArtifacts = progression.equippedArtifacts.filter((id) => id !== artifactId);
  saveSubjectProgression(progression);
  return true;
}

export function applyCraftedArtifactsToNewRun(
  state: CyklusRunState,
  progression: SubjectProgression,
): CyklusRunState {
  let s = { ...state, flags: [...state.flags], inventory: [...state.inventory], imprints: [...state.imprints] };
  for (const artifactId of progression.equippedArtifacts) {
    const artifact = CRAFTED_ARTIFACTS[artifactId];
    if (!artifact) continue;
    for (const flag of artifact.effects.startFlags ?? []) {
      if (!s.flags.includes(flag)) s.flags.push(flag);
    }
    for (const itemId of artifact.effects.startItems ?? []) {
      if (!s.inventory.includes(itemId)) s.inventory.push(itemId);
    }
    for (const imprintId of artifact.effects.startImprints ?? []) {
      if (!s.imprints.includes(imprintId)) s.imprints.push(imprintId);
    }
  }
  return s;
}

// ── LOADOUT & OVERVIEW HELPERS ─────────────────────────────────────────────────

export function getLoadoutLimits(progression: SubjectProgression): {
  upgradeSlots: number;
  artifactSlots: number;
  protocolSlots: number;
  scarSlots: number;
} {
  const core = progression.voidRooms.stabilization_core;
  const coreLevel = core?.level ?? 0;
  return {
    upgradeSlots: MAX_EQUIPPED_UPGRADES + (coreLevel >= 1 ? 1 : 0),
    artifactSlots: 2 + (coreLevel >= 2 ? 1 : 0),
    protocolSlots: 1 + (coreLevel >= 2 ? 1 : 0),
    scarSlots: 1,
  };
}

export function getProgressionOverview(progression: SubjectProgression) {
  return {
    currencies: progression.currencies,
    craftingInventory: progression.craftingInventory,
    totalRuns: progression.totalRuns,
    stabilizedRuns: progression.stabilizedRuns,
    totalResiduumEarned: progression.totalResiduumEarned,
    equippedLoadout: {
      upgrades: progression.equippedUpgrades,
      artifacts: progression.equippedArtifacts,
      protocols: progression.equippedProtocols,
      scar: progression.activeScar,
    },
    loadoutLimits: getLoadoutLimits(progression),
  };
}

export function getAvailablePurchases(progression: SubjectProgression) {
  const upgrades = Object.values(SUBJECT_UPGRADES).filter((u) => canPurchaseUpgrade(progression, u.id));
  const protocols = Object.values(PROFILE_PROTOCOLS).filter((p) => {
    if (progression.unlockedProtocols.includes(p.id)) return false;
    for (const [key, value] of Object.entries(p.requiresProfile)) {
      if (!value) continue;
      if ((progression.profileMastery[key as ProfileKey] ?? 0) < value) return false;
    }
    for (const [key, value] of Object.entries(p.cost)) {
      if (!value) continue;
      if ((progression.currencies[key as MetaCurrencyId] ?? 0) < value) return false;
    }
    return true;
  });
  const rooms = Object.values(VOID_ROOMS).filter((r) => getVoidRoomStatus(progression, r.id) === 'available');
  return { upgrades, protocols, rooms };
}

export function getAvailableCrafts(progression: SubjectProgression) {
  return Object.values(CRAFT_RECIPES).filter((r) => canCraftRecipe(progression, r.id));
}

export function getVoidRoomOverview(progression: SubjectProgression) {
  return Object.values(VOID_ROOMS).map((room) => ({
    ...room,
    state: getVoidRoomState(progression, room.id),
    status: getVoidRoomStatus(progression, room.id),
  }));
}

export function getProfileProtocolOverview(progression: SubjectProgression) {
  return Object.values(PROFILE_PROTOCOLS).map((protocol) => ({
    ...protocol,
    unlocked: progression.unlockedProtocols.includes(protocol.id),
    equipped: progression.equippedProtocols.includes(protocol.id),
    masteryMet: Object.entries(protocol.requiresProfile).every(([key, value]) => {
      if (!value) return true;
      return (progression.profileMastery[key as ProfileKey] ?? 0) >= value;
    }),
  }));
}

export function getRecommendedNextProgressionActions(
  state: CyklusRunState | null,
  progression: SubjectProgression,
): string[] {
  const actions: string[] = [];
  if (progression.totalRuns === 0) {
    actions.push('Začni první průchod. Prázdnota si tě ještě nepamatuje.');
  }
  const available = getAvailablePurchases(progression);
  if (available.rooms.length > 0) {
    actions.push(`Vylepši místnost Prázdnoty: ${available.rooms[0]?.title ?? '?'}.`);
  }
  if (available.protocols.length > 0) {
    actions.push(`Kup profilový protokol: ${available.protocols[0]?.title ?? '?'}.`);
  }
  if (available.upgrades.length > 0) {
    actions.push(`Kup upgrade: ${available.upgrades[0]?.title ?? '?'}.`);
  }
  if (getAvailableCrafts(progression).length > 0) {
    actions.push('Vyrob artefakt na Stolu nepravděpodobných kombinací.');
  }
  if (progression.equippedUpgrades.length === 0 && progression.purchasedUpgrades.length > 0) {
    actions.push('Vybav si alespoň jeden upgrade.');
  }
  if (state && state.status === 'dead') {
    actions.push('Systém tě znovu pustil do Prázdnoty. Tvrdí, že je stejná. Lže.');
  }
  return actions;
}
