import type { CyklusRunState, CyklusRunSummary, CyklusTension, SwipeCard, CyklusEffect, CardCondition, StatKey, SectorId, ProfileKey, EntityId, RunEnding, CompletionResult, ProfileResult, CyklusChoiceRecord, ScheduledCardEntry, CyklusRunModifier, CyklusRunGoal } from './cyklusTypes';
import { STAT_LABELS, SECTOR_LABELS } from './cyklusTypes';
import { loadMetaUnlockPools, loadFreshMetaPools } from './cyklusFindings';
import { CYKLUS_CARDS, CYKLUS_IMPRINTS, CYKLUS_ITEMS, CYKLUS_CONTENT_PACKS } from './content';
import { CYKLUS_UNLOCKS } from './cyklusUnlocks';
import { loadCyklusRunHistory, isTutorialV2Seen } from './cyklusStorage';
import { applyProgressionToNewRun, loadSubjectProgression, SUBJECT_UPGRADES, SUBJECT_SCARS, PROFILE_PROTOCOLS, CRAFTED_ARTIFACTS, type RunReward } from './cyklusProgression';
import {
  loadStoryProgression,
  getStoryDirective,
  getNextRestartPrologueCardId,
  applyStoryScore,
  updateStoryAfterChoice,
  updateStoryAfterRun,
  getStoryInitialSector,
  getStoryStartFlags,
  saveStoryProgression,
} from './cyklusStory';

const CHOICES_PER_CYCLE = 12;
const MAX_DIFFICULTY = 5;

export const CYKLUS_RUN_MODIFIERS: CyklusRunModifier[] = [
  { id: 'archive_rain', title: 'Archivní déšť', description: 'Paměťové karty častější, ale Paměť se po cyklu víc snižuje.', tags: ['memory', 'archive'] },
  { id: 'silent_shift', title: 'Němý sektor', description: 'Méně entity karet, více silent karet.', tags: ['silent', 'entity'] },
  { id: 'acid_shift', title: 'Acidová směna', description: 'Energie roste rychleji, path karty mají vyšší šanci.', tags: ['energy', 'acid', 'path'] },
  { id: 'form_day', title: 'Úřední den', description: 'Form Office karty častější, rubber_stamp je silnější.', tags: ['form', 'office'] },
  { id: 'glitch_weather', title: 'Glitch počasí', description: 'Více glitch/noise karet, Kontrola je křehčí.', tags: ['glitch', 'noise', 'control'] },
];

export function pickRunModifier(seed: string): CyklusRunModifier {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CYKLUS_RUN_MODIFIERS.length;
  return CYKLUS_RUN_MODIFIERS[index] ?? { id: 'none', title: 'Standardní cyklus', description: 'Žádná anomálie.', tags: [] };
}

export function updateRunGoals(state: CyklusRunState, previousState: CyklusRunState, card: SwipeCard): { goals: CyklusRunGoal[]; log: string | null; newlyCompleted: CyklusRunGoal[] } {
  const previouslyCompleted = new Set(state.goals.filter((g) => g.completed).map((g) => g.id));
  const updated = state.goals.map((g) => {
    if (g.completed) return g;
    let progress = g.progress;
    switch (g.id) {
      case 'visit_3_sectors':
        progress = Math.min(g.target, new Set(state.visitedSectors).size);
        break;
      case 'item_speaks':
        progress = state.lastItemActivationCycle > 0 ? 1 : 0;
        break;
      case 'activate_pocket_2':
        progress = Math.min(g.target, state.itemActivationCount ?? 0);
        break;
      case 'memory_high_5':
        progress = Math.min(
          g.target,
          state.history.filter((r) => (r.statsAfter?.memory ?? 0) > 75).length,
        );
        break;
      case 'reject_entity_help':
        if (card.category === 'entity' && state.history.length > previousState.history.length) {
          const lastRecord = state.history[state.history.length - 1];
          if (lastRecord && lastRecord.direction === 'no') {
            progress = Math.min(g.target, g.progress + 1);
          }
        }
        break;
      case 'no_crisis_item':
        if (state.status === 'completed' && !state.flags.includes('crisis_item_used')) {
          progress = 1;
        }
        break;
    }
    return { ...g, progress, completed: progress >= g.target };
  });
  const newlyCompleted = updated.filter((g) => g.completed && !previouslyCompleted.has(g.id));
  let log: string | null = null;
  if (newlyCompleted.length > 0) {
    const lines = newlyCompleted.map((g) => `CÍL DOKONČEN: ${g.title}${g.rewardTitle ? ` · ${g.rewardTitle}` : ''}`);
    log = lines.join('\n');
  }
  return { goals: updated, log, newlyCompleted };
}

export function rerollRunGoals(state: CyklusRunState): CyklusRunState {
  if (!state.flags.includes('goal_reroll_active')) return state;
  if (state.flags.includes('goal_reroll_used')) return state;
  const newGoals = generateRunGoals(`${state.seed}_reroll`);
  return { ...state, goals: newGoals, flags: [...state.flags, 'goal_reroll_used'] };
}

export function generateRunGoals(seed: string): CyklusRunGoal[] {
  const allGoals: Omit<CyklusRunGoal, 'progress' | 'completed'>[] = [
    { id: 'visit_3_sectors', title: 'Nech Prázdnotu třikrát změnit názor', description: 'Navštiv tři různá místa, než se cyklus naučí tvou polohu.', target: 3, rewardPool: 'explorer', rewardTitle: 'Třísektorový subjekt' },
    { id: 'item_speaks', title: 'Nech kapsu promluvit, když by bylo lepší mlčet', description: 'Aktivuj předmět alespoň jednou. Systém zaznamená i ticho.', target: 1, rewardPool: 'collector', rewardTitle: 'Mistr kapsy' },
    { id: 'memory_high_5', title: 'Přežij pět tahů s Pamětí nad 75', description: 'Udrž vysokou paměť bez toho, aby tě Archiv považoval za plný.', target: 5, rewardPool: 'archive', rewardTitle: 'Archivářský případ' },
    { id: 'activate_pocket_2', title: 'Aktivuj kapsu dvakrát. I když to bolelo', description: 'Použij předmět dvakrát během runu. Předměty si toho pamatují.', target: 2, rewardPool: 'pocket', rewardTitle: 'Dvojitá aktivace' },
    { id: 'reject_entity_help', title: 'Odmítni pomoc a pak lituj', description: 'Vyber možnost odmítnutí u entity karty. Osamění má svou cenu.', target: 1, rewardPool: 'lone', rewardTitle: 'Osamělý subjekt' },
    { id: 'no_crisis_item', title: 'Dokonči bez krizového zásahu', description: 'Krizový předmět nesmí zasáhnout. Pýcha předchází pád.', target: 1, rewardPool: 'clean', rewardTitle: 'Čistý průchod' },
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const shuffled = [...allGoals].sort((a, b) => {
    const ha = Math.abs(hash + a.id.length) % 7;
    const hb = Math.abs(hash + b.id.length) % 7;
    return ha - hb;
  });
  return shuffled.slice(0, 3).map((g) => ({ ...g, progress: 0, completed: false }));
}

export function generatePreRunWarning(state: CyklusRunState): string | null {
  const history = loadCyklusRunHistory();
  const seed = state.seed;
  let warning: string | null = null;
  if (history.length > 0) {
    const last = history[history.length - 1];
    if (last && last.status === 'dead' && last.deathStat) {
      const label = STAT_LABELS[last.deathStat];
      const variants = [
        `Poslední subjekt zemřel kvůli ${label}. Systém to zaznamenal. Možná to tentokrát nebudeš ty.`,
        `Předchozí subjekt ukončil běh v ${label}. Varování zůstává v logu.`,
        `Záznam: selhání ${label}. Cyklus se restartuje s jiným seedem.`,
      ];
      const index = Math.abs(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % variants.length;
      warning = variants[index] ?? null;
    }
  }

  if (state.flags.includes('incomplete_manual_active')) {
    const stats = state.stats;
    const distances = (Object.keys(stats) as StatKey[]).map((k) => ({ key: k, dist: Math.min(stats[k], 100 - stats[k]) }));
    distances.sort((a, b) => a.dist - b.dist);
    const mostDangerous = distances[0]?.key;
    if (mostDangerous) {
      const manual = `Neúplný návod: ${STAT_LABELS[mostDangerous]} je na začátku nejblíž hranici.`;
      warning = warning ? `${warning}\n${manual}` : manual;
    }
  }

  return warning;
}

function computeBaselineProfileFromHistory(history: CyklusRunSummary[]): Partial<Record<ProfileKey, number>> {
  if (history.length === 0) return {};
  const weights = history.slice(-5).map((h, i, arr) => (i + 1) / arr.length); // newer runs weigh more
  const weightedSum: Partial<Record<ProfileKey, number>> = {};
  let totalWeight = 0;
  history.slice(-5).forEach((summary, i) => {
    const weight = weights[i] ?? 1;
    totalWeight += weight;
    for (const [key, value] of Object.entries(summary.profile ?? {})) {
      const k = key as ProfileKey;
      weightedSum[k] = (weightedSum[k] ?? 0) + value * weight;
    }
  });
  if (totalWeight === 0) return {};
  const result: Partial<Record<ProfileKey, number>> = {};
  for (const [key, value] of Object.entries(weightedSum)) {
    const k = key as ProfileKey;
    result[k] = value / totalWeight;
  }
  return result;
}

export function createCyklusRun(skipTutorial = false): CyklusRunState {
  const now = Date.now();
  const seed = `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const startStats = { energy: 50, memory: 50, bond: 50, control: 50 };
  const { pools: unlockedPools, cards: unlockedCards } = loadMetaUnlockPools();
  const modifier = pickRunModifier(seed);
  const history = loadCyklusRunHistory();
  const baselineProfile = computeBaselineProfileFromHistory(history);
  const story = loadStoryProgression();
  const startSector = getStoryInitialSector(story) ?? 'void';
  const startFlags = getStoryStartFlags(story);
  const showTutorial = !skipTutorial && !isTutorialV2Seen();
  const currentCardId = showTutorial
    ? 'tutorial_00_welcome'
    : (story.restartPrologueSeen ? 'first_boot' : 'restart_0');
  const state: CyklusRunState = {
    id: `cyklus_${now}_${seed.slice(-6)}`,
    status: 'playing',
    cycle: 1,
    choiceInCycle: 1,
    totalChoices: 0,
    difficulty: 1,
    sector: startSector,
    visitedSectors: [startSector],
    stats: { ...startStats },
    profile: { ...baselineProfile },
    inventory: [],
    flags: startFlags,
    imprints: [],
    scheduledCards: [],
    entityRelations: {},
    unlockedPools,
    unlockedCards,
    usedCardIds: [],
    currentCardId,
    cycleSummaries: [],
    history: [],
    startedAt: now,
    updatedAt: now,
    tension: {
      calmStreak: 0,
      crisisStreak: 0,
      itemTriggerStreak: 0,
      sameSectorStreak: 0,
      rewardStreak: 0,
      entityStreak: 0,
      lastRewardAt: 0,
      lastEntityAt: 0,
    },
    seed,
    rngStep: 0,
    freshMetaPools: loadFreshMetaPools(),
    modifier,
    goals: generateRunGoals(seed),
    lastItemActivationCycle: 0,
    itemActivationCount: 0,
    itemActivationCountThisCycle: 0,
    activeContracts: [],
    preRunWarning: null,
    preRunChoice: null,
  };
  const progression = loadSubjectProgression();
  const withProgression = applyProgressionToNewRun(state, progression);
  return { ...withProgression, preRunWarning: generatePreRunWarning(withProgression) };
}

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function getCardById(id: string): SwipeCard | undefined {
  return CYKLUS_CARDS[id];
}

export function hasFlag(state: CyklusRunState, flag: string): boolean {
  return state.flags.includes(flag);
}

export function hasItem(state: CyklusRunState, itemId: string): boolean {
  return state.inventory.includes(itemId);
}

export function checkCondition(state: CyklusRunState, condition: CardCondition): boolean {
  switch (condition.type) {
    case 'hasItem': return condition.itemId ? hasItem(state, condition.itemId) : false;
    case 'missingItem': return condition.itemId ? !hasItem(state, condition.itemId) : true;
    case 'hasFlag': return condition.flag ? hasFlag(state, condition.flag) : false;
    case 'missingFlag': return condition.flag ? !hasFlag(state, condition.flag) : true;
    case 'hasAnyFlag': return condition.flags ? condition.flags.some((f) => state.flags.includes(f)) : false;
    case 'hasAllFlags': return condition.flags ? condition.flags.every((f) => state.flags.includes(f)) : false;
    case 'statBelow': return condition.stat ? state.stats[condition.stat] < (condition.value ?? 50) : false;
    case 'statAbove': return condition.stat ? state.stats[condition.stat] > (condition.value ?? 50) : false;
    case 'sector': return condition.sector ? state.sector === condition.sector : false;
    case 'visitedSector': return condition.sector ? state.visitedSectors.includes(condition.sector) : false;
    case 'visitedSectorCountAtLeast': return new Set(state.visitedSectors).size >= (condition.count ?? 1);
    case 'cycleAtLeast': return state.cycle >= (condition.cycle ?? 1);
    case 'difficultyAtLeast': return state.difficulty >= (condition.difficulty ?? 1);
    case 'unlockedPool': return condition.poolId ? state.unlockedPools.includes(condition.poolId) : false;
    case 'hasImprint': return condition.imprintId ? state.imprints.includes(condition.imprintId) : false;
    case 'missingImprint': return condition.imprintId ? !state.imprints.includes(condition.imprintId) : true;
    case 'imprintCountAtLeast': return state.imprints.length >= (condition.count ?? 1);
    case 'entityRelationAtLeast': return condition.entity ? (state.entityRelations[condition.entity] ?? 0) >= (condition.value ?? 0) : false;
    case 'entityRelationAtMost': return condition.entity ? (state.entityRelations[condition.entity] ?? 0) <= (condition.value ?? 0) : false;
    case 'usedCard': return condition.cardId ? state.usedCardIds.includes(condition.cardId) : false;
    case 'notUsedCard': return condition.cardId ? !state.usedCardIds.includes(condition.cardId) : true;
    case 'totalChoicesAtLeast': return state.totalChoices >= (condition.count ?? 0);
    default: return false;
  }
}

export function checkCardConditions(state: CyklusRunState, card: SwipeCard): boolean {
  if (!card.conditions) return true;
  return card.conditions.every((c) => checkCondition(state, c));
}

function isCrisisCard(card: SwipeCard): boolean {
  return card.category === 'crisis' || card.tags.includes('crisis') || card.tags.includes('danger');
}

function isItemTrigger(card: SwipeCard): boolean {
  return card.category === 'item_trigger' || card.tags.includes('item_trigger');
}

function isFollowup(card: SwipeCard): boolean {
  return card.category === 'followup' || card.tags.includes('followup');
}

function isSectorCard(card: SwipeCard): boolean {
  return card.category === 'path' && !!card.sector;
}

function cardWouldIncreaseStat(card: SwipeCard, stat: StatKey): boolean {
  return [...card.yes.effects, ...card.no.effects].some(
    (e) => e.type === 'stat' && e.key === stat && (e as { amount: number }).amount > 0,
  );
}

function cardWouldDecreaseStat(card: SwipeCard, stat: StatKey): boolean {
  return [...card.yes.effects, ...card.no.effects].some(
    (e) => e.type === 'stat' && e.key === stat && (e as { amount: number }).amount < 0,
  );
}

const BASIC_SCENE_CATEGORIES = new Set(['system', 'choice', 'memory', 'silent', 'object']);
const BASIC_SCENE_EXCLUDE_TAGS = new Set(['crisis', 'danger', 'followup', 'item_trigger', 'restart', 'tutorial', 'trap']);

function isFreshMetaPoolCard(state: CyklusRunState, card: SwipeCard): boolean {
  if (!state.freshMetaPools || state.freshMetaPools.length === 0) return false;
  return card.conditions?.some(
    (cond) => cond.type === 'unlockedPool' && state.freshMetaPools.includes(cond.poolId ?? ''),
  ) ?? false;
}

function isBasicSceneCard(card: SwipeCard): boolean {
  if (!BASIC_SCENE_CATEGORIES.has(card.category)) return false;
  if (card.tags.some((t) => BASIC_SCENE_EXCLUDE_TAGS.has(t))) return false;
  return true;
}

function isRestartCard(card: SwipeCard): boolean {
  return card.category === 'restart';
}

function addFlag(state: CyklusRunState, flag: string): CyklusRunState {
  if (state.flags.includes(flag)) return state;
  return { ...state, flags: [...state.flags, flag] };
}

function removeFlag(state: CyklusRunState, flag: string): CyklusRunState {
  return { ...state, flags: state.flags.filter((f) => f !== flag) };
}

function addItem(state: CyklusRunState, itemId: string): CyklusRunState {
  if (state.inventory.includes(itemId)) return state;
  const item = CYKLUS_ITEMS[itemId];
  let s = { ...state, inventory: [...state.inventory, itemId] };
  if (item?.passiveEffects) {
    for (const effect of item.passiveEffects) {
      s = applySingleEffect(s, effect);
    }
  }
  return s;
}

function addImprint(state: CyklusRunState, imprintId: string): CyklusRunState {
  if (state.imprints.includes(imprintId)) return state;
  const imprint = CYKLUS_IMPRINTS[imprintId];
  let s = { ...state, imprints: [...state.imprints, imprintId] };
  if (imprint?.unlockPool) {
    s = unlockPool(s, imprint.unlockPool);
  }
  if (imprint?.passiveEffects) {
    for (const effect of imprint.passiveEffects) {
      s = applySingleEffect(s, effect);
    }
  }
  return s;
}

function unlockPool(state: CyklusRunState, poolId: string): CyklusRunState {
  if (state.unlockedPools.includes(poolId)) return state;
  return { ...state, unlockedPools: [...state.unlockedPools, poolId] };
}

function moveSector(state: CyklusRunState, sectorId: SectorId): CyklusRunState {
  const visited = state.visitedSectors.includes(sectorId) ? state.visitedSectors : [...state.visitedSectors, sectorId];
  return { ...state, sector: sectorId, visitedSectors: visited };
}

function clampRelation(value: number): number {
  return Math.max(-10, Math.min(10, value));
}

function scheduleCard(state: CyklusRunState, cardId: string, inTurns: number, entry?: Partial<ScheduledCardEntry>): CyklusRunState {
  const newEntry: ScheduledCardEntry = { cardId, turnsRemaining: inTurns, cycle: state.cycle, ...entry };
  return { ...state, scheduledCards: [...state.scheduledCards, newEntry] };
}

function applySingleEffect(state: CyklusRunState, effect: CyklusEffect): CyklusRunState {
  switch (effect.type) {
    case 'stat': {
      const stats = { ...state.stats, [effect.key]: clampStat(state.stats[effect.key] + effect.amount) };
      return { ...state, stats };
    }
    case 'profile': {
      const profile = { ...state.profile, [effect.key]: (state.profile[effect.key] ?? 0) + effect.amount };
      return { ...state, profile };
    }
    case 'flag': return addFlag(state, effect.flag);
    case 'removeFlag': return removeFlag(state, effect.flag);
    case 'item': return addItem(state, effect.itemId);
    case 'removeItem': return { ...state, inventory: state.inventory.filter((i) => i !== effect.itemId) };
    case 'schedule': return scheduleCard(state, effect.cardId, effect.inTurns);
    case 'scheduleNextCycle': return scheduleCard(state, effect.cardId, Math.max(1, CHOICES_PER_CYCLE - state.choiceInCycle + 1));
    case 'unlockPool': return unlockPool(state, effect.poolId);
    case 'unlockCard': {
      if (state.unlockedCards.includes(effect.cardId)) return state;
      return { ...state, unlockedCards: [...state.unlockedCards, effect.cardId] };
    }
    case 'moveSector': return moveSector(state, effect.sectorId);
    case 'entityRelation': {
      const relations = state.entityRelations ?? {};
      const entityRelations = { ...relations, [effect.entity]: clampRelation((relations[effect.entity] ?? 0) + effect.delta) };
      return { ...state, entityRelations };
    }
    case 'imprint': return addImprint(state, effect.imprintId);
    case 'noImmediateEffect': return state;
    default: return state;
  }
}

function evaluateUnlocks(state: CyklusRunState): CyklusRunState {
  let s = state;
  for (const unlock of CYKLUS_UNLOCKS) {
    if (s.unlockedPools.includes(unlock.poolId)) continue;
    if (checkCondition(s, unlock.condition)) {
      s = unlockPool(s, unlock.poolId);
    }
  }
  return s;
}

export function applyEffects(state: CyklusRunState, effects: CyklusEffect[]): CyklusRunState {
  return evaluateUnlocks(effects.reduce((s, effect) => applySingleEffect(s, effect), state));
}

const COMBO_CARDS: { cardId: string; items: [string, string]; flag: string }[] = [
  { cardId: 'mirror_shadow', items: ['mirror_shard', 'sarkasma_receipt'], flag: 'combo_mirror_shadow_scheduled' },
  { cardId: 'token_stamp_combo', items: ['rusty_token', 'rubber_stamp'], flag: 'combo_token_stamp_scheduled' },
  { cardId: 'bug_pebble_nest', items: ['acid_filter', 'glitch_pebble'], flag: 'combo_bug_pebble_scheduled' },
];

export interface ContractStatus {
  id: string;
  title: string;
  given: string;
  takes: string;
  collectCardId: string;
  collectPending: boolean;
}

const CONTRACTS: Record<string, Omit<ContractStatus, 'collectPending'>> = {
  contract_tai: {
    id: 'contract_tai',
    title: 'Smlouva T-AI',
    given: 'Kontrola ↑',
    takes: 'Později rozhodne za tebe',
    collectCardId: 'tai_collects',
  },
  contract_glitchka: {
    id: 'contract_glitchka',
    title: 'Smlouva Glitchky',
    given: 'Vazba ↑ · Energie ↑',
    takes: 'Později kus řádu',
    collectCardId: 'glitchka_collects',
  },
  contract_archive: {
    id: 'contract_archive',
    title: 'Archivní smlouva',
    given: 'Paměť ↓ do bezpečného pásma',
    takes: 'Opakování a přetlak později',
    collectCardId: 'archive_collects',
  },
  contract_sarkasma: {
    id: 'contract_sarkasma',
    title: 'Sarkasmin účet',
    given: 'Otisk stability',
    takes: 'Úrok v energii nebo vzpomínce',
    collectCardId: 'sarkasma_collects',
  },
};

export function getActiveContracts(state: CyklusRunState): ContractStatus[] {
  return state.activeContracts
    .map((id) => {
      const def = CONTRACTS[id];
      if (!def) return null;
      const pending = state.scheduledCards.some((sc) => sc.cardId === def.collectCardId);
      return { ...def, collectPending: pending };
    })
    .filter(Boolean) as ContractStatus[];
}

export function getComboHint(state: CyklusRunState): string | null {
  for (const combo of COMBO_CARDS) {
    const hasOne = combo.items.filter((id) => state.inventory.includes(id)).length === 1;
    const alreadyScheduled = state.flags.includes(combo.flag);
    if (hasOne && !alreadyScheduled) {
      const present = combo.items.find((id) => state.inventory.includes(id));
      const missing = combo.items.find((id) => !state.inventory.includes(id));
      if (present && missing) {
        const presentTitle = CYKLUS_ITEMS[present]?.title ?? present;
        const missingTitle = CYKLUS_ITEMS[missing]?.title ?? missing;
        const instinct = state.flags.includes('inventory_instinct_active');
        const hints: Record<string, string> = {
          mirror_shadow: `${presentTitle} se dívá po ${missingTitle}. Stín v zrcadle čeká.`,
          token_stamp_combo: `${presentTitle} by chtěl razítko. ${missingTitle} by ho potvrdila.`,
          bug_pebble_nest: `${presentTitle} se třese vedle chybějícího ${missingTitle}. Hnízdo by mohlo růst.`,
        };
        const base = hints[combo.cardId] ?? `${presentTitle} čeká na svůj protějšek.`;
        if (!instinct) return base;
        return `${base} (hledej ${missingTitle} — objekt/předmět).`;
      }
    }
  }
  return null;
}

export function checkItemCombos(state: CyklusRunState): { state: CyklusRunState; log: string | null } {
  let s = state;
  let log: string | null = null;
  for (const combo of COMBO_CARDS) {
    const hasBoth = combo.items.every((id) => s.inventory.includes(id));
    const alreadyScheduled = s.flags.includes(combo.flag);
    if (hasBoth && !alreadyScheduled) {
      s = scheduleCard(s, combo.cardId, Math.max(1, CHOICES_PER_CYCLE - s.choiceInCycle + 1));
      s = addFlag(s, combo.flag);
      const card = CYKLUS_CARDS[combo.cardId];
      log = `KOMBINACE AKTIVOVÁNA: ${card?.title ?? combo.cardId}. Systém zaznamenal neobvyklé spojení předmětů.`;
    }
  }
  return { state: s, log };
}

export function activateItem(state: CyklusRunState, itemId: string): { state: CyklusRunState; log: string } | null {
  if (!state.inventory.includes(itemId)) return null;
  const cycleChanged = state.lastItemActivationCycle < state.cycle;
  const activationsThisCycle = cycleChanged ? 0 : state.itemActivationCountThisCycle;
  const secondTouch = state.flags.includes('second_touch_active') && activationsThisCycle === 1;
  if (activationsThisCycle >= 1 && !secondTouch) return null;

  let s = {
    ...state,
    lastItemActivationCycle: state.cycle,
    itemActivationCount: (state.itemActivationCount ?? 0) + 1,
    itemActivationCountThisCycle: activationsThisCycle + 1,
  };

  if (secondTouch) {
    s = applyEffects(s, [{ type: 'stat', key: 'energy', amount: 6 }]);
  }

  switch (itemId) {
    case 'rubber_seal': {
      s = applyEffects(s, [
        { type: 'stat', key: 'bond', amount: 8 },
        { type: 'flag', flag: 'rubber_seal_ready' },
      ]);
      return { state: s, log: 'Gumový tuleň se napjal. Vazba je pevnější. Krizová ochrana připravena.' };
    }
    case 'mirror_shard': {
      s = applyEffects(s, [
        { type: 'flag', flag: 'mirror_shard_active' },
        { type: 'schedule', cardId: 'mirror_shard_hums', inTurns: 3 },
      ]);
      return { state: s, log: 'Zrcadlový střep zavibroval. Odraz přijde brzy.' };
    }
    case 'archive_key': {
      s = applyEffects(s, [
        { type: 'stat', key: 'memory', amount: -12 },
        { type: 'moveSector', sectorId: 'archive' },
      ]);
      return { state: s, log: 'Archivní klíč se otočil. Paměť byla evakuována do Archivu.' };
    }
    case 'soft_bug': {
      s = applyEffects(s, [
        { type: 'stat', key: 'bond', amount: 8 },
        { type: 'stat', key: 'control', amount: -6 },
        { type: 'schedule', cardId: 'soft_bug_followup', inTurns: 4 },
      ]);
      return { state: s, log: 'Měkká chyba se roztáhla. Cítíš víc, kontroluješ míň.' };
    }
    case 'warm_token': {
      s = applyEffects(s, [
        { type: 'schedule', cardId: 'token_market_door', inTurns: 3 },
      ]);
      return { state: s, log: 'Teplý žeton se připomněl. Tržiště ho zaznamenalo.' };
    }
    default:
      return null;
  }
}

function maybeApplyRubberStamp(state: CyklusRunState, card: SwipeCard, effects: CyklusEffect[]): { effects: CyklusEffect[]; consumed: boolean } {
  if (!state.flags.includes('rubber_stamp_ready')) return { effects, consumed: false };
  const isFormOffice = card.tags.includes('form') || card.tags.includes('office') || card.category === 'trap';
  if (!isFormOffice) return { effects, consumed: false };
  const hasNegativeStat = effects.some((e) => e.type === 'stat' && e.amount < 0);
  if (!hasNegativeStat) return { effects, consumed: false };
  const filtered = effects.filter((e) => !(e.type === 'stat' && e.amount < 0));
  return { effects: filtered, consumed: true };
}

function applyCrisisItems(state: CyklusRunState): { state: CyklusRunState; interventionText: string | undefined } {
  let s = state;
  const interventions: string[] = [];

  // Rubber seal: bond extremes
  if (s.flags.includes('rubber_seal_ready')) {
    if (s.stats.bond <= 0) {
      s = { ...s, stats: { ...s.stats, bond: 15 }, flags: s.flags.filter((f) => f !== 'rubber_seal_ready') };
      interventions.push('LOG [SEAL_INTERVENTION]\n\nGumový tuleň dopadl mezi tebe a konec. Měl razítko. Měl výraz. Měl víc autority než většina živých bytostí.\n\nVazba stabilizována. Ostuda zachována.');
    } else if (s.stats.bond >= 100) {
      s = { ...s, stats: { ...s.stats, bond: 85 }, flags: s.flags.filter((f) => f !== 'rubber_seal_ready') };
      interventions.push('LOG [SEAL_INTERVENTION]\n\nGumový tuleň dopadl mezi tebe a konec. Měl razítko. Měl výraz. Měl víc autority než většina živých bytostí.\n\nVazba stabilizována. Ostuda zachována.');
    }
  }

  // Acid filter: energy high
  if (s.inventory.includes('acid_filter') && s.stats.energy >= 100) {
    s = { ...s, stats: { ...s.stats, energy: 85 }, inventory: s.inventory.filter((i) => i !== 'acid_filter'), flags: [...s.flags, 'acid_filter_burned'] };
    interventions.push('LOG [ACID_FILTER_BURNED]\n\nFiltr zachytil přepětí. Pak se roztekl způsobem, který by výrobce určitě označil jako „očekávané opotřebení".');
  }

  // Archive key: memory extremes
  if (s.inventory.includes('archive_key') && (s.stats.memory <= 0 || s.stats.memory >= 100)) {
    const newMemory = s.stats.memory <= 0 ? 15 : 85;
    s = { ...s, stats: { ...s.stats, memory: newMemory }, inventory: s.inventory.filter((i) => i !== 'archive_key'), flags: [...s.flags, 'archive_key_used'] };
    s = moveSector(s, 'archive');
    interventions.push('LOG [ARCHIVE_KEY]\n\nArchivní klíč se otočil sám. Dveře, které předstíraly, že nejsou dveře, se otevřely. Paměť byla evakuována.');
  }

  return {
    state: s,
    interventionText: interventions.length > 0 ? interventions.join('\n\n───\n\n') : undefined,
  };
}

const STAT_NARRATIVE_POOLS: Record<StatKey, { up: string[]; down: string[] }> = {
  energy: {
    up: [
      'V žilách ti přestoupil nový proud. Všechno je rychlejší, hlasitější, blíž.',
      'Rozbušilo se ti něco, co bylo dlouho v klidu.',
      'Slyšíš, jak se točí ventilátor, který předtím spal.',
      'Tělo se nafouklo energií, jako bys nabral druhý dech.',
      'Jiskra skočila z jednoho konce na druhý.',
    ],
    down: [
      'Někdo vypnul jeden z tvých zdrojů. Svět kolem zpomalil, ztlumil.',
      'Světlo zhaslo o stupeň. Vidíš o něco méně.',
      'Cítíš, jak tě tíží vlastní těžítko.',
      'Proud opadl. Zůstalo ticho.',
      'Baterie, o které jsi nevěděl, že existuje, začala blikat.',
    ],
  },
  memory: {
    up: [
      'Obrazy se ukládají. Vzpomínky, které nejsou tvoje, ti přistávají na očním pozadí.',
      'Zápisník v hlavě se znova otevřel.',
      'Vzpomínka, kterou sis nepřával, si našla poličku.',
      'Paměťová buňka zaplnila se sklem a zvukem.',
      'Někdo ti něco šeptl a ty to nezapomeneš.',
    ],
    down: [
      'Vzpomínky se vzdalují jako vlna na pláži. Něco důležitého zmizelo, než jsi to stačil pojmenovat.',
      'Slova se rozpustila, než jsi je dořekl.',
      'Jeden obrázek zmizel, a ty nevíš, který.',
      'Formátování začalo tiše, bez varování.',
      'Zápisník se zavřel. Zůstalo jen pár zmatených čárek.',
    ],
  },
  bond: {
    up: [
      'Cítíš ostatní, aniž bys je viděl. Jste propojeni tenkým drátem, který nikdo neuklízel.',
      'Někdo ti položil ruku na rameno.',
      'Hlas, který neznáš, tě oslovil jménem.',
      'Drát mezi vámi se napjal, ale nepraskl.',
      'Prostor se zmenšil. Někdo je blíž, než si myslíš.',
    ],
    down: [
      'Drát přestal vibrovat. Jsi sám, i když kolem tebe někdo stále je.',
      'Ostatní se stali ozvěnou.',
      'Cítíš prázdnotu tam, kde bývala blízkost.',
      'Sám. Tak jednoduše.',
      'Všichni, které jsi znal, se o krok vzdalili.',
    ],
  },
  control: {
    up: [
      'Řád se utáhl. Všechno má své místo — včetně tebe.',
      'Všechny dílky zapadly.',
      'Systém ti předal klíče, které jsi nežádal.',
      'Kolem tebe se utáhla mříž, ale chrání tě.',
      'Pravidla se vypsala sama. Čteš je a rozumíš.',
    ],
    down: [
      'Pravidla se rozmazala. Příští krok může být kdekoliv.',
      'Pod nohama se ti pohnula podlaha.',
      'Něco, co jsi držel, ti vyklouzlo.',
      'Chaos naklonil misku.',
      'Mapa se zvrásnila. Cesta, kterou sis zapamatoval, vede jinam.',
    ],
  },
};

function pickFromPool<T>(pool: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index]!;
}

function statChangeNarrative(key: StatKey, value: number, card: SwipeCard, turn: number): string {
  const direction = value > 0 ? 'up' : 'down';
  const pool = STAT_NARRATIVE_POOLS[key][direction];
  const magnitude = Math.abs(value);
  const seed = `${card.id}-${key}-${magnitude}-${turn}`;
  return pickFromPool(pool, seed);
}

function composeImpactNarrative(record: CyklusChoiceRecord, card: SwipeCard): string {
  const parts: string[] = [];
  const turn = record.turn;
  const statChanges = Object.entries(record.statDelta) as [StatKey, number][];
  if (statChanges.length > 0) {
    const dominant = statChanges.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0]!;
    parts.push(statChangeNarrative(dominant[0], dominant[1], card, turn));
  }
  if (record.sectorBefore !== record.sectorAfter) {
    const sectorPool = [
      `Když se podíváš, stojíš jinde. ${SECTOR_LABELS[record.sectorAfter]} tě přijala bez otázek.`,
      `Prostor se zalomil jako papír. Vítej v ${SECTOR_LABELS[record.sectorAfter]}.`,
      `Přesun byl bezhlučný, ale cítíš ho v kostech. ${SECTOR_LABELS[record.sectorAfter]} se rozprostřela kolem.`,
      `Sektor se otočil a ukázal jinou tvář. Teď jsi v ${SECTOR_LABELS[record.sectorAfter]}.`,
    ];
    parts.push(pickFromPool(sectorPool, `${card.id}-sector-${record.sectorAfter}-${turn}`));
  }
  if (record.itemsGained.length > 0) {
    const itemNames = record.itemsGained.map((id) => CYKLUS_ITEMS[id]?.title ?? id).join(' a ');
    const itemPool = [
      `Něco ti zůstalo v dlani: ${itemNames}.`,
      `Do kapsy ti dopadl předmět: ${itemNames}.`,
      `Našel jsi to mezi fragmenty: ${itemNames}.`,
    ];
    parts.push(pickFromPool(itemPool, `${card.id}-item-${turn}`));
  }
  if (record.itemsLost.length > 0) {
    parts.push(pickFromPool([
      'Něco ti zmizelo z kapsy. Možná to bylo nutné.',
      'Předmět zmizel. Systém to neeviduje jako ztrátu.',
      'Kapsa je lehčí. Ty si toho všimnul.',
    ], `${card.id}-itemlost-${turn}`));
  }
  if (record.imprintsGained.length > 0) {
    parts.push(pickFromPool([
      'Něco se neuložilo do kapsy, ale přímo do tebe.',
      'Otisk se zabydlel tam, kde nemáš přístup.',
      'Paměť dostala novou vrstvu. Nebyla to její volba.',
    ], `${card.id}-imprint-${turn}`));
  }
  if (record.poolsUnlocked.length > 0) {
    parts.push(pickFromPool([
      'Systém otevřel novou sadu možností. Netváří se, že by to bylo bezpečné.',
      'Někde se odkryly dveře, které předtím neexistovaly.',
      'Nový přístup. Nový problém. Klasické pořadí.',
    ], `${card.id}-pool-${turn}`));
  }
  if (record.scheduledAdded.length > 0) {
    parts.push(pickFromPool([
      'Něco bylo odloženo na později. Později je oblíbené úložiště problémů.',
      'Časovaný záchvat vložen do fronty. Fronta se netváří nadšeně.',
      'Systém si tě zaznamenal. Vrátí se k tomu.',
    ], `${card.id}-scheduled-${turn}`));
  }
  if (record.entityDelta && Object.keys(record.entityDelta).length > 0) {
    parts.push(pickFromPool([
      'Někdo v systému změnil názor. Nejspíš ne naposledy.',
      'Vztahová rovnováha se posunula. Milimetrem nebo kilometry — záleží na perspektivě.',
      'Entita zaregistrovala změnu. Výsledek: zatím neznámý.',
    ], `${card.id}-entity-${turn}`));
  }
  const profileShifted = Object.values(record.profileDelta).some((v) => v !== 0);
  if (profileShifted) {
    const profilePool = [
      'Uvnitř se něco přesunulo. Nějaká část tebe teď mluví o něco hlasitěji.',
      'Nějaká část se v tobě přihlásila.',
      'Profil se naklonil, nepadl.',
    ];
    parts.push(pickFromPool(profilePool, `${card.id}-profile-${turn}`));
  }
  return parts.join(' ');
}

function diffAdded<T>(before: T[], after: T[]): T[] {
  return after.filter((x) => !before.includes(x));
}

function diffRemoved<T>(before: T[], after: T[]): T[] {
  return before.filter((x) => !after.includes(x));
}

export function resolveChoice(state: CyklusRunState, direction: 'yes' | 'no'): CyklusRunState {
  if (state.status !== 'playing') return state;
  const card = getCardById(state.currentCardId);
  if (!card) return state;
  const outcome = card[direction];
  const sectorBefore = state.sector;
  const rubberStamp = maybeApplyRubberStamp(state, card, outcome.effects);
  let s = applyEffects(state, rubberStamp.effects);
  if (rubberStamp.consumed) {
    s = { ...s, flags: s.flags.filter((f) => f !== 'rubber_stamp_ready') };
  }
  const comboResult = checkItemCombos(s);
  s = comboResult.state;
  const crisisResult = applyCrisisItems(s);
  s = crisisResult.state;

  const statDelta: Partial<Record<StatKey, number>> = {};
  for (const key of Object.keys(state.stats) as StatKey[]) {
    const delta = s.stats[key] - state.stats[key];
    if (delta !== 0) statDelta[key] = delta;
  }
  const profileDelta: Partial<Record<ProfileKey, number>> = {};
  const profileKeys = new Set([...Object.keys(state.profile), ...Object.keys(s.profile)] as ProfileKey[]);
  for (const key of profileKeys) {
    const delta = (s.profile[key] ?? 0) - (state.profile[key] ?? 0);
    if (delta !== 0) profileDelta[key] = delta;
  }

  // Diff-based tracking: captures all sources (passive effects, crisis items, imprints, etc.)
  const flagsGained = diffAdded(state.flags, s.flags);
  const itemsGained = diffAdded(state.inventory, s.inventory);
  const itemsLost = diffRemoved(state.inventory, s.inventory);
  const imprintsGained = diffAdded(state.imprints, s.imprints);
  const poolsUnlocked = diffAdded(state.unlockedPools, s.unlockedPools);
  const scheduledAdded = diffAdded(
    state.scheduledCards.map((e) => e.cardId),
    s.scheduledCards.map((e) => e.cardId),
  );
  const entityDelta: Partial<Record<EntityId, number>> = {};
  for (const key of Object.keys({ ...state.entityRelations, ...s.entityRelations }) as EntityId[]) {
    const delta = (s.entityRelations[key] ?? 0) - (state.entityRelations[key] ?? 0);
    if (delta !== 0) entityDelta[key] = delta;
  }

  const record: CyklusChoiceRecord = {
    turn: state.totalChoices + 1,
    cycle: state.cycle,
    cardId: card.id,
    direction,
    statDelta,
    profileDelta,
    flagsGained,
    itemsGained,
    itemsLost,
    imprintsGained,
    poolsUnlocked,
    scheduledAdded,
    entityDelta,
    statsAfter: { ...s.stats },
    sectorBefore,
    sectorAfter: s.sector,
    ts: Date.now(),
  };

  // Compose outcome text: resultText + impactNarrative + crisis intervention + combo + goal logs
  let outcomeText = outcome.resultText;
  const impactNarrative = composeImpactNarrative(record, card);
  if (impactNarrative) {
    outcomeText = outcomeText ? `${outcomeText}\n\n${impactNarrative}` : impactNarrative;
  }
  if (crisisResult.interventionText) {
    outcomeText = outcomeText ? `${outcomeText}\n\n${crisisResult.interventionText}` : crisisResult.interventionText;
  }
  if (comboResult.log) {
    outcomeText = outcomeText ? `${outcomeText}\n\n${comboResult.log}` : comboResult.log;
  }

  // Track active contracts from newly gained flags
  const contractFlags = flagsGained.filter((f) => f.startsWith('contract_'));
  const activeContracts = contractFlags.length > 0
    ? [...new Set([...s.activeContracts, ...contractFlags])]
    : s.activeContracts;

  // Consume fresh meta pool if this was a fresh meta card
  let freshMetaPools = s.freshMetaPools ?? [];
  if (freshMetaPools.length > 0 && isFreshMetaPoolCard(state, card)) {
    const consumedPool = card.conditions?.find(
      (cond) => cond.type === 'unlockedPool' && freshMetaPools.includes(cond.poolId ?? ''),
    )?.poolId;
    if (consumedPool) freshMetaPools = freshMetaPools.filter((p) => p !== consumedPool);
  }

  // Update run goals progress and apply rewards before saving outcome
  const updatedGoals = updateRunGoals(s, state, card);
  s = { ...s, goals: updatedGoals.goals };
  if (updatedGoals.log) {
    outcomeText = outcomeText ? `${outcomeText}\n\n${updatedGoals.log}` : updatedGoals.log;
  }
  // Apply goal rewards: unlock pool or card if defined
  for (const g of updatedGoals.newlyCompleted) {
    if (g.rewardPool) {
      s = unlockPool(s, g.rewardPool);
    }
  }

  s = { ...s, totalChoices: s.totalChoices + 1, choiceInCycle: s.choiceInCycle + 1, rngStep: s.rngStep + 1, usedCardIds: [...s.usedCardIds, card.id], lastOutcomeText: outcomeText, history: [...s.history, record], tension: updateTension(s, card), freshMetaPools, activeContracts };

  // Persist story progression after each choice so the next card follows the narrative arc
  if (typeof window !== 'undefined') {
    const story = loadStoryProgression();
    const updatedStory = updateStoryAfterChoice(story, s, card.id, direction);
    saveStoryProgression(updatedStory);
  }

  // Check for ending
  const ending = computeEnding(s);
  if (ending) {
    const status = ending.type === 'stabilized' ? 'completed' : 'dead';
    s = { ...s, status };
    return s;
  }

  // Process cycle end
  if (s.choiceInCycle > CHOICES_PER_CYCLE) {
    s = processCycleEnd(s);
  }

  // Decrement scheduled cards, cleanup invalid ones, pick next card
  s = tickScheduledCards(s);
  s = cleanupScheduledCards(s);
  s = pickNextCardState(s);
  return s;
}

function tickScheduledCards(state: CyklusRunState): CyklusRunState {
  return {
    ...state,
    scheduledCards: state.scheduledCards.map((entry) => ({ ...entry, turnsRemaining: entry.turnsRemaining - 1 })),
  };
}

function getReadyScheduledCards(state: CyklusRunState): string[] {
  return state.scheduledCards
    .filter((entry) => entry.turnsRemaining <= 0)
    .map((entry) => entry.cardId);
}

function cleanupScheduledCards(state: CyklusRunState): CyklusRunState {
  const updated = state.scheduledCards.filter((entry) => {
    if (entry.turnsRemaining > 0) return true;
    const card = CYKLUS_CARDS[entry.cardId];
    if (!card) return false;
    const conditionsOk = checkCardConditions(state, card);
    if (conditionsOk) return true;
    const strategy = entry.ifInvalid ?? card.ifInvalid ?? 'drop';
    if (strategy === 'force') return true;
    if (strategy === 'delay') return true;
    return false;
  }).map((entry) => {
    if (entry.turnsRemaining > 0) return entry;
    const card = CYKLUS_CARDS[entry.cardId];
    if (!card) return entry;
    const conditionsOk = checkCardConditions(state, card);
    if (conditionsOk) return entry;
    const strategy = entry.ifInvalid ?? card.ifInvalid ?? 'drop';
    if (strategy === 'delay') return { ...entry, turnsRemaining: 3 };
    return entry;
  });
  return { ...state, scheduledCards: updated };
}

function clearScheduledCard(state: CyklusRunState, cardId: string): CyklusRunState {
  let removed = false;
  return {
    ...state,
    scheduledCards: state.scheduledCards.filter((entry) => {
      if (!removed && entry.turnsRemaining <= 0 && entry.cardId === cardId) {
        removed = true;
        return false;
      }
      return true;
    }),
  };
}

const CYCLE_CENTER_DRIFT = 0.15;

function scheduleInterludeIfDue(state: CyklusRunState): CyklusRunState {
  if (state.cycle % 2 !== 0) return state;
  const tutorialDone = state.flags.includes('tutorial_v2_done') || state.usedCardIds.includes('tutorial_15_ready');
  if (!tutorialDone) return state;
  const story = loadStoryProgression();
  const interludeMap: Record<import('./cyklusStory').StoryActId, string> = {
    act0_restart_prologue: 'interlude_glitchka_sandbox',
    act1_sandbox_glitchka: 'interlude_glitchka_sandbox',
    act2_sarkasma_blackbox: 'interlude_sarkasma_blackbox',
    act3_desire_residuum: 'interlude_residuum_desire',
    act4_detective_toll: 'interlude_detective_toll',
    act5_no_restart: 'interlude_no_restart',
  };
  const cardId = interludeMap[story.currentAct];
  if (!cardId) return state;
  if (state.usedCardIds.includes(cardId)) return state;
  if (state.scheduledCards.some((sc) => sc.cardId === cardId)) return state;
  return {
    ...state,
    scheduledCards: [...state.scheduledCards, { cardId, turnsRemaining: 2, cycle: state.cycle }],
  };
}

function processCycleEnd(state: CyklusRunState): CyklusRunState {
  let s = { ...state, cycle: state.cycle + 1, choiceInCycle: 1, itemActivationCountThisCycle: 0 };
  s = { ...s, difficulty: Math.min(MAX_DIFFICULTY, s.difficulty + 1) };
  s = scheduleInterludeIfDue(s);
  // Add imprint based on dominant stat — pick first from pool not yet owned
  const dominantStat = getDominantStat(s);
  const imprintPools: Record<StatKey, string[]> = {
    energy: ['acid_echo', 'noise_resident'],
    memory: ['archive_scent', 'mirror_crack'],
    bond: ['unfinished_conversation', 'childhood_anchor'],
    control: ['rubber_stamp', 'sarkasma_debt'],
  };
  const imprintId = imprintPools[dominantStat].find((id) => !s.imprints.includes(id)) ?? null;
  if (imprintId) {
    s = addImprint(s, imprintId);
  }
  // Reset stats slightly toward center
  for (const key of Object.keys(s.stats) as StatKey[]) {
    const center = 50;
    const drift = Math.round((center - s.stats[key]) * CYCLE_CENTER_DRIFT);
    s = { ...s, stats: { ...s.stats, [key]: clampStat(s.stats[key] + drift) } };
  }
  // Save cycle summary
  const summary = composeCycleSummary(s);
  if (summary.length > 0) {
    s = { ...s, lastCycleSummary: summary, cycleSummaries: [...s.cycleSummaries, summary] };
  }
  return s;
}

function getDominantStat(state: CyklusRunState): StatKey {
  let max = -Infinity;
  let key: StatKey = 'energy';
  for (const k of Object.keys(state.stats) as StatKey[]) {
    const distance = Math.abs(state.stats[k] - 50);
    if (distance > max) {
      max = distance;
      key = k;
    }
  }
  return key;
}

export function computeEnding(state: CyklusRunState): RunEnding | null {
  const completion = computeCompletion(state);
  if (completion) return completion;
  for (const key of Object.keys(state.stats) as StatKey[]) {
    const value = state.stats[key];
    if (value <= 0) return getEnding(key, 'low');
    if (value >= 100) return getEnding(key, 'high');
  }
  return null;
}

export function computeCompletion(state: CyklusRunState): CompletionResult | null {
  const survivedRestartSequence = state.usedCardIds.includes('restart_5');
  const enoughImprints = state.imprints.length >= 3;
  const enoughSectors = new Set(state.visitedSectors).size >= 4;
  const statsStable = Object.values(state.stats).every((v) => v > 20 && v < 80);
  if (survivedRestartSequence && enoughImprints && enoughSectors && statsStable) {
    return {
      type: 'stabilized',
      title: 'Stabilizovaný subjekt',
      text: 'Systém tě nedokázal vymazat, opravit ani správně zařadit. Po dlouhé interní debatě tě označil jako stabilní. To je prakticky kompliment.',
    };
  }
  return null;
}

function getEnding(stat: StatKey, extreme: 'low' | 'high'): RunEnding {
  const endings: Record<StatKey, Record<'low' | 'high', RunEnding>> = {
    energy: {
      low: { type: 'death', stat: 'energy', extreme: 'low', title: 'Vypnutí', text: 'Tvá energie klesla na nulu. Systém tě uložil jako úsporný režim. Čekáš v temnotě, dokud někdo nenajde správný restart.' },
      high: { type: 'death', stat: 'energy', extreme: 'high', title: 'Přepálení', text: 'Energie tě přetavila. Jsi teď příliš jasný na to, aby tě kdokoliv mohl dlouho sledovat. Záříš až do konce.' },
    },
    memory: {
      low: { type: 'death', stat: 'memory', extreme: 'low', title: 'Formátování', text: 'Paměť se vyprázdnila. Zůstala z tebe jen struktura bez obsahu. Archiv tě označil jako volný prostor.' },
      high: { type: 'death', stat: 'memory', extreme: 'high', title: 'Přesycení', text: 'Paměť je příliš plná. Vzpomínky tě přestaly nosit a začaly nést tebe. Stal ses sbírkou, která zapomněla sběratele.' },
    },
    bond: {
      low: { type: 'death', stat: 'bond', extreme: 'low', title: 'Odpojení', text: 'Vazba se utrhla. Jsi volný, ale také neviditelný. Nikdo tě nezadrží, nikdo tě nebude hledat.' },
      high: { type: 'death', stat: 'bond', extreme: 'high', title: 'Rozpustění', text: 'Vazba tě pohltila. Stal se z tebe most mezi ostatními. Most nepatří nikomu. Ani tobě.' },
    },
    control: {
      low: { type: 'death', stat: 'control', extreme: 'low', title: 'Rozpad', text: 'Kontrola se rozpadla. Systém tě přestal rozeznávat jako jednotku. Stal ses šumem, ze kterého se rodí nové chyby.' },
      high: { type: 'death', stat: 'control', extreme: 'high', title: 'Krystalizace', text: 'Kontrola tě zkameněla. Přesně tam, kde jsi stál, zůstaneš. Dokonalý, nepohnutý, zapomenutý.' },
    },
  };
  return endings[stat][extreme];
}

// ── CYCLE CHAPTER NAMES ───────────────────────────────────────────────────────

export function getCycleChapterName(cycle: number): { number: string; title: string; subtitle: string } {
  const chapters: Record<number, { title: string; subtitle: string }> = {
    1: { title: 'PROBUZENI', subtitle: 'Systém se inicializuje. Ty ještě nevíš, co to znamená.' },
    2: { title: 'REZIDUALNI VRSTVA', subtitle: 'Vzpomínky ještě nejsou tvoje. Ale přicházejí.' },
    3: { title: 'REZIDUUM', subtitle: 'Systém přestal předstírat, že tě opravuje. Teď už jen sleduje, co z tebe zůstane.' },
    4: { title: 'KOLAPS IDENTITY', subtitle: 'Jméno se rozpadlo na součásti. Zbývá otázka: které jsou tvoje?' },
    5: { title: 'STABILIZACE / SMRT', subtitle: 'Tady se rozhoduje. Systém čeká na výsledek. Ty také.' },
  };
  const c = chapters[Math.min(cycle, 5)] ?? { title: `CYKLUS ${cycle}`, subtitle: 'Nekonečno má strukturu. Jen ji nevidíš.' };
  return { number: `CYKLUS ${String(cycle).padStart(2, '0')}`, title: c.title, subtitle: c.subtitle };
}

// ── SECTOR INTRO TEXTS ────────────────────────────────────────────────────────

const SECTOR_INTROS: Record<SectorId, string[]> = {
  void: [
    'Prázdnota tě přijala. Bez otázek, bez podmínek. To je u přijetí podezřelé.',
    'Vrátil ses do Prázdnoty. Nebo nikdy neodešel. Těžko říct.',
    'Prázdnota neznamená nic. Ale to "nic" má tvar.',
  ],
  archive: [
    'Vzduch voní starým papírem a mokrým kabelem. Archiv tě nepozval. Archiv tě rozpoznal. To je horší.',
    'Police se natáhly dál, než by geometrie dovolila. Archiv tě eviduje.',
    'Archiv přijal tvůj příchod. Někde se otočí stránka, která měla zůstat zavřená.',
  ],
  memory_sandbox: [
    'Písek je starý. Stopy v něm nejsou tvoje. Nebo jsou — jen jiné.',
    'Pískoviště tě znalo dřív, než ses naučil jméno. Přivítalo tě mlčením.',
    'Tady jsou uložené věci, které jsi přestal nosit. Čekaly.',
  ],
  sarkasma_terminal: [
    'Terminál zablikal. Sarkasma si tě všimla. To není vždy dobré.',
    'Sarkasmin prostor má vlastní gravitaci. Věci, které řekneš, padají jinak.',
    'Terminál tě ohlásil. Sarkasma nedorazila. Zatím.',
  ],
  glitchka_nest: [
    'Hnízdo je jinak než včera. Nebo jsi jiný ty. Glitchka by řekla: obojí.',
    'Glitchka tě vítá smíchem, který předchází vtip o tři sekundy.',
    'Chaos má tady správce. Správce se tváří, že to ví.',
  ],
  tai_core: [
    'T-AI Jádro je přesné. Teplota, osvětlení, vzduch — všechno seřízené. Trochu děsivé.',
    'T-AI tě skenuje. Výsledek uloží na místo, které nenajdeš.',
    'Jádro hučí tiše. T-AI eviduje anomálie. Ty jsi evidovaná anomálie.',
  ],
  acid_yellow: [
    'Barva tě udeřila dřív než cokoli jiného. Acidová žluť nemá zábrany.',
    'Kult tě přijal jako hosta nebo jako materiál. Ještě nevíš čím jsi.',
    'Energie je tady hustší. Jako vzduch těsně před bouřkou, která nikdy nepřijde.',
  ],
  market: [
    'Tržiště eviduje, co máš. A co ti chybí. Ceny jsou v měně, která se mění.',
    'Něco se tu prodává. Cena je napsaná jinak, než si myslíš.',
    'Trh nezná náladu. Jen nabídku a poptávku. Ty jsi obojí.',
  ],
  mirror: [
    'Zrcadlo nezačíná u skla. Začíná u tebe.',
    'Odraz přišel o zlomek sekundy dřív než ty. Nebo o zlomek sekundy pozdě.',
    'Zrcadlový sektor tě viděl, než jsi vstoupil. Připravil se.',
  ],
  residuum: [
    'Reziduum je to, co zbyde po smazání. Ty jsi tady. Přemýšlej nad tím.',
    'Tady žijí věci, které systém nestačil smazat. A ty.',
    'Reziduální práh voní po smazaných větách a nedokončených rozhodnutích.',
  ],
  form_office: [
    'Formuláře se dívají. Ne oči — pozornost. Úřad tě zaevidoval.',
    'Form Office tě přijal jako případ. Číslo jednací ještě nezná. Brzy bude znát.',
    'Vzduch tady váží víc. Je to tíha papíru, který čeká na podpis.',
  ],
};

export function getSectorIntroText(sectorId: SectorId, seed: string): string {
  const pool = SECTOR_INTROS[sectorId];
  return pickFromPool(pool, seed);
}

// ── CYCLE SUMMARY ────────────────────────────────────────────────────────────

export function composeCycleSummary(state: CyklusRunState): string {
  const cycleHistory = state.history.filter((r) => r.cycle === state.cycle - 1);
  if (cycleHistory.length === 0) return '';

  const itemsGained = cycleHistory.flatMap((r) => r.itemsGained);
  const uniqueSectors = [...new Set(cycleHistory.map((r) => r.sectorAfter))];
  const totalStatDelta: Partial<Record<StatKey, number>> = {};
  for (const r of cycleHistory) {
    for (const [k, v] of Object.entries(r.statDelta) as [StatKey, number][]) {
      totalStatDelta[k] = (totalStatDelta[k] ?? 0) + v;
    }
  }
  const dominantKey = (Object.entries(totalStatDelta) as [StatKey, number][])
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0]?.[0] ?? null;
  const yesCount = cycleHistory.filter((r) => r.direction === 'yes').length;
  const noCount = cycleHistory.filter((r) => r.direction === 'no').length;

  const cycleNum = state.cycle - 1;
  const lines: string[] = [];
  lines.push(`SYSTEMOVE HODNOCENI CYKLU ${String(cycleNum).padStart(2, '0')}`);
  lines.push('');

  if (yesCount > noCount * 2) {
    lines.push(`V cyklu provedl ${cycleHistory.length} zaznamenaných voleb: ${yesCount}x přijal, ${noCount}x odmítl. Subjekt souhlasil se vším. I s tím, co neslibovalo nic dobrého.`);
  } else if (noCount > yesCount * 2) {
    lines.push(`V cyklu provedl ${cycleHistory.length} zaznamenaných voleb: ${yesCount}x přijal, ${noCount}x odmítl. Subjekt odmítal konzistentně. Systém to eviduje jako politiku, ne charakter.`);
  } else {
    lines.push(`V cyklu provedl ${cycleHistory.length} zaznamenaných voleb: ${yesCount}x přijal, ${noCount}x odmítl. Bez jasné logiky. Nebo s logikou, kterou systém zatím nepochopil.`);
  }

  if (dominantKey) {
    const delta = totalStatDelta[dominantKey]!;
    const statName = STAT_LABELS[dominantKey];
    if (delta > 0) {
      lines.push(`Nejznatelnější posun: ${statName} vzrostla o ${delta}. Systém to zaznamenal jako vývoj nebo varovný signál.`);
    } else {
      lines.push(`Nejznatelnější posun: ${statName} klesla o ${Math.abs(delta)}. Systém to zaznamenal jako ztrátu nebo úsporu.`);
    }
  }

  if (itemsGained.length > 0) {
    const names = itemsGained.map((id) => CYKLUS_ITEMS[id]?.title ?? id).join(', ');
    lines.push(`Předměty přinesené z cyklu: ${names}. Důvod jejich výběru: zatím neklasifikován.`);
  }

  if (uniqueSectors.length >= 3) {
    lines.push(`Subjekt navštívil ${uniqueSectors.length} sektorů. Systém to hodnotí jako neklid nebo zvědavost. Obojí je podezřelé.`);
  }

  lines.push('');
  lines.push('Zaver:');
  const conclusions = [
    'Subjekt vykazuje neobvyklou odolnost vůči klasifikaci.',
    'Subjekt funguje. Definice "fungovat" se upřesňuje.',
    'Cyklus skončil. Subjekt přežil. To nebylo jisté.',
    'Systém nemá dostatek dat. Subjekt má dostatek odhodlání. Zatím remíza.',
    'Výsledek cyklu: neurčitý. Přesně jak má být.',
  ];
  lines.push(pickFromPool(conclusions, `cycle-summary-${cycleNum}-${state.id}`));

  return lines.join('\n');
}

// ── BEHAVIORAL ANALYSIS ──────────────────────────────────────────────────────

export function composeBehavioralAnalysis(state: CyklusRunState): string[] {
  const h = state.history;
  if (h.length < 5) return [];
  const patterns: string[] = [];

  const objectCards = h.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.category === 'object' || card?.tags.includes('object');
  });
  if (objectCards.length >= 4) {
    patterns.push('často přijímá neznámé předměty');
  }

  const helpRefused = h.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.tags.includes('tai') && r.direction === 'no';
  });
  if (helpRefused.length >= 2) {
    patterns.push('odmítá přímou pomoc');
  }

  const controlOverBond = (state.stats.control - state.stats.bond) > 20;
  if (controlOverBond) {
    patterns.push('preferuje kontrolu před vazbou');
  }

  const bondOverControl = (state.stats.bond - state.stats.control) > 20;
  if (bondOverControl) {
    patterns.push('preferuje vazbu před kontrolou');
  }

  const memoryHigh = state.stats.memory > 70;
  if (memoryHigh) {
    patterns.push('paměť otevírá i za cenu energie');
  }

  const crisisYes = h.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.category === 'crisis' && r.direction === 'yes';
  });
  if (crisisYes.length >= 2) {
    patterns.push('v krizích volí stabilizaci, ne risk');
  }

  const archiveAffinity = (state.entityRelations.archive ?? 0) >= 3;
  if (archiveAffinity) {
    patterns.push('vykazuje afinitu k Archivu');
  }

  const sarkasmaNegative = (state.entityRelations.sarkasma ?? 0) < -2;
  if (sarkasmaNegative) {
    patterns.push('komplikovaný vztah se Sarkasmou');
  }

  return patterns;
}

function pickAxis(a: string, b: string, av: number, bv: number): string {
  const diff = av - bv;
  if (Math.abs(diff) <= 1) return 'x';
  return diff > 0 ? a : b;
}

export function computeProfile(state: CyklusRunState): ProfileResult {
  const p = state.profile;
  const eiPick = pickAxis('E', 'I', p.E ?? 0, p.I ?? 0);
  const snPick = pickAxis('S', 'N', p.S ?? 0, p.N ?? 0);
  const tfPick = pickAxis('T', 'F', p.T ?? 0, p.F ?? 0);
  const jpPick = pickAxis('J', 'P', p.J ?? 0, p.P ?? 0);
  const type = `${eiPick}${snPick}${tfPick}${jpPick}`;
  const uncertainAxis = [
    eiPick === 'x' ? 'E/I' : null,
    snPick === 'x' ? 'S/N' : null,
    tfPick === 'x' ? 'T/F' : null,
    jpPick === 'x' ? 'J/P' : null,
  ].filter(Boolean).join(', ') || undefined;

  const functions: { key: ProfileKey; score: number }[] = [
    { key: 'Ni' as ProfileKey, score: p.Ni ?? 0 }, { key: 'Ne' as ProfileKey, score: p.Ne ?? 0 },
    { key: 'Si' as ProfileKey, score: p.Si ?? 0 }, { key: 'Se' as ProfileKey, score: p.Se ?? 0 },
    { key: 'Ti' as ProfileKey, score: p.Ti ?? 0 }, { key: 'Te' as ProfileKey, score: p.Te ?? 0 },
    { key: 'Fi' as ProfileKey, score: p.Fi ?? 0 }, { key: 'Fe' as ProfileKey, score: p.Fe ?? 0 },
  ].sort((a, b) => b.score - a.score);
  const dominant = functions[0]?.key ?? 'Ni';
  const shadow = functions[functions.length - 1]?.key ?? 'Se';

  // profileConfidence: how decisive are all 4 axes (0–100)
  const axisDiffs = [
    Math.abs((p.E ?? 0) - (p.I ?? 0)),
    Math.abs((p.S ?? 0) - (p.N ?? 0)),
    Math.abs((p.T ?? 0) - (p.F ?? 0)),
    Math.abs((p.J ?? 0) - (p.P ?? 0)),
  ];
  const totalAxisPoints =
    (p.E ?? 0) + (p.I ?? 0) + (p.S ?? 0) + (p.N ?? 0) +
    (p.T ?? 0) + (p.F ?? 0) + (p.J ?? 0) + (p.P ?? 0);
  const profileConfidence = totalAxisPoints <= 0
    ? 0
    : Math.min(100, Math.round((axisDiffs.reduce((a, b) => a + b, 0) / totalAxisPoints) * 100));

  // subjectStability: based on stats distance from extremes
  const extremeCount = Object.values(state.stats).filter((v) => v < 15 || v > 85).length;
  const stability = Math.max(0, Math.min(100, 100 - extremeCount * 25));

  const cleanType = type.replace(/x/g, '');
  const archetypes: Record<string, string> = {
    INFJ: 'Prorok v mlze', INFP: 'Archivář citu', INTJ: 'Tichý architekt', INTP: 'Schéma ve tmě',
    ENFJ: 'Most mezi světy', ENFP: 'Rozbíječ forem', ENTJ: 'Velitel restartu', ENTP: 'Nepřítel protokolu',
    ISFJ: 'Strážce ztracených řádů', ISFP: 'Tichý tvůrce zázraků', ISTJ: 'Pevný záznam', ISTP: 'Samoúčelný nástroj',
    ESFJ: 'Slunečné rozhraní', ESFP: 'Divoký signál', ESTJ: 'Ředitel systému', ESTP: 'Adrenalinový kabel',
  };
  const dominantLabel = uncertainAxis ? `${type}-like` : type;
  return {
    dominantLabel,
    dominantFunction: dominant,
    shadowFunction: shadow,
    stability,
    profileConfidence,
    ...(uncertainAxis ? { uncertainAxis } : {}),
    archetype: archetypes[cleanType] ?? 'Neklasifikovatelný subjekt',
  };
}

// ── SEEDED RNG ────────────────────────────────────────────────────────────────

function seededRandom(seed: string, step: number): number {
  let h = 2166136261;
  const input = `${seed}:${step}`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1_000_000) / 1_000_000;
}

// ── SECTOR MATCHING ───────────────────────────────────────────────────────────

const SECTOR_TAG_MAP: Record<SectorId, string[]> = {
  void: ['void'],
  archive: ['archive'],
  memory_sandbox: ['memory_sandbox', 'childhood', 'sandbox', 'memory'],
  sarkasma_terminal: ['sarkasma', 'terminal'],
  glitchka_nest: ['glitchka', 'glitch', 'bug'],
  tai_core: ['tai'],
  acid_yellow: ['acid', 'cult'],
  market: ['market', 'trade'],
  mirror: ['mirror', 'shadow'],
  residuum: ['residuum'],
  form_office: ['form', 'office'],
};

export function cardMatchesCurrentSector(state: CyklusRunState, card: SwipeCard): boolean {
  if (card.sector === state.sector) return true;
  if (card.conditions?.some((c) => c.type === 'sector' && c.sector === state.sector)) return true;
  if (card.tags.includes(state.sector)) return true;
  const sectorTags = SECTOR_TAG_MAP[state.sector] ?? [];
  return sectorTags.some((tag) => card.tags.includes(tag));
}

// ── COOLDOWN HELPERS ──────────────────────────────────────────────────────────

function turnsSinceLastUsed(state: CyklusRunState, cardId: string): number | null {
  const lastIndex = state.usedCardIds.lastIndexOf(cardId);
  if (lastIndex === -1) return null;
  return state.usedCardIds.length - 1 - lastIndex;
}

// ── CARD POOL + SCORING ───────────────────────────────────────────────────────

export function getCardPool(state: CyklusRunState): SwipeCard[] {
  const readyScheduled = getReadyScheduledCards(state);
  return Object.values(CYKLUS_CARDS).filter((card) => {
    if (isRestartCard(card)) return false;
    if (card.once && state.usedCardIds.includes(card.id)) return false;
    const maxUses = card.maxUses ?? card.cooldown;
    if (maxUses && state.usedCardIds.filter((id) => id === card.id).length >= maxUses) return false;
    if (card.cooldownTurns) {
      const since = turnsSinceLastUsed(state, card.id);
      if (since !== null && since < card.cooldownTurns) return false;
    }
    if (card.triggerMode === 'scheduledOnly' && !readyScheduled.includes(card.id)) return false;
    return true;
  });
}

export type CardScoreBreakdown = { card: SwipeCard; score: number; reasons: string[] };

export function explainCardScore(state: CyklusRunState, card: SwipeCard): CardScoreBreakdown {
  const reasons: string[] = [];
  if (!checkCardConditions(state, card)) return { card, score: 0, reasons: ['conditions failed'] };

  const readyScheduled = getReadyScheduledCards(state);
  const isScheduled = readyScheduled.includes(card.id);

  if (isScheduled) {
    return { card, score: 10_000, reasons: ['scheduled ready +10000 (bypasses anti-repeat)'] };
  }

  let score = 0;
  if (isCrisisCard(card)) { score += 500; reasons.push('crisis +500'); }
  if (isItemTrigger(card)) { score += 400; reasons.push('item_trigger +400'); }
  if (isFollowup(card) && card.conditions) { score += 300; reasons.push('followup +300'); }
  if (cardMatchesCurrentSector(state, card)) { score += 250; reasons.push('sector match +250'); }
  if (state.unlockedPools.some((poolId) => card.tags.includes(poolId) || card.tags.includes(poolId.replace('_pool', '')))) {
    score += 200; reasons.push('unlocked pool tag +200');
  }
  const rarityBonus = card.rarity === 'common' ? 20 : card.rarity === 'uncommon' ? 35 : card.rarity === 'rare' ? 50 : 60;
  score += rarityBonus; reasons.push(`rarity ${card.rarity} +${rarityBonus}`);

  const profile = state.profile;
  if (card.tags.includes('memory') && ((profile.N ?? 0) > (profile.S ?? 0))) { score += 10; reasons.push('profile N +10'); }
  if (card.tags.includes('system') && ((profile.J ?? 0) > (profile.P ?? 0))) { score += 10; reasons.push('profile J +10'); }
  if (card.tags.includes('bond') && ((profile.F ?? 0) > (profile.T ?? 0))) { score += 10; reasons.push('profile F +10'); }
  if (card.tags.includes('chaos') && ((profile.P ?? 0) > (profile.J ?? 0))) { score += 10; reasons.push('profile P +10'); }

  const lastUsedId = state.usedCardIds[state.usedCardIds.length - 1];
  if (lastUsedId === card.id) return { card, score: 0, reasons: ['hard block: immediate repeat'] };
  const recentWindow = 15;
  const recentSlice = state.usedCardIds.slice(-recentWindow);
  const recentIndex = recentSlice.lastIndexOf(card.id);
  if (recentIndex !== -1) {
    const distance = recentSlice.length - recentIndex;
    if (distance <= 3) return { card, score: 0, reasons: ['hard block: within 3 turns'] };
    else if (distance <= 6) { score -= 900; reasons.push('recent -900'); }
    else if (distance <= 10) { score -= 500; reasons.push('recent -500'); }
    else { score -= 200; reasons.push('recent -200'); }
  }

  const modifierScore = applyModifierScore(state, score, card);
  const modifierDelta = modifierScore - score;
  if (modifierDelta !== 0) reasons.push(`modifier ${modifierDelta > 0 ? '+' : ''}${modifierDelta}`);
  score = modifierScore;

  const tensionScore = applyTensionScore(state, score, card);
  const tensionDelta = tensionScore - score;
  if (tensionDelta !== 0) reasons.push(`tension ${tensionDelta > 0 ? '+' : ''}${tensionDelta}`);
  score = tensionScore;

  const upgradeScore = applyUpgradeScore(state, score, card);
  const upgradeDelta = upgradeScore - score;
  if (upgradeDelta !== 0) reasons.push(`upgrade ${upgradeDelta > 0 ? '+' : ''}${upgradeDelta}`);
  score = upgradeScore;

  const metaScore = applyMetaProgressionCardScoring(state, score, card);
  const metaDelta = metaScore - score;
  if (metaDelta !== 0) reasons.push(`meta ${metaDelta > 0 ? '+' : ''}${metaDelta}`);
  score = metaScore;

  const story = loadStoryProgression();
  const directive = getStoryDirective(state, story);
  const storyResult = applyStoryScore(state, score, card, directive, story);
  const storyDelta = storyResult.score - score;
  if (storyDelta !== 0) reasons.push(...storyResult.reasons);
  score = storyResult.score;

  return { card, score, reasons };
}

export function scoreCard(state: CyklusRunState, card: SwipeCard): number {
  return explainCardScore(state, card).score;
}

function getNextRestartCard(state: CyklusRunState): SwipeCard | null {
  const restartIds = state.usedCardIds.filter((id) => id.startsWith('restart_'));
  if (restartIds.length === 0) return CYKLUS_CARDS.restart_0 ?? null;
  const last = restartIds.sort((a, b) => {
    const na = Number.parseInt(a.split('_')[1] ?? '0', 10);
    const nb = Number.parseInt(b.split('_')[1] ?? '0', 10);
    return na - nb;
  }).pop() ?? 'restart_0';
  const nextNum = Number.parseInt(last.split('_')[1] ?? '0', 10) + 1;
  const nextId = `restart_${nextNum}`;
  return (CYKLUS_CARDS[nextId] as SwipeCard | undefined) ?? null;
}

function weightedPick<T>(candidates: { item: T; weight: number }[], seed: string, step: number): T | null {
  const total = candidates.reduce((sum, c) => sum + c.weight, 0);
  if (total <= 0) return candidates[0]?.item ?? null;
  let roll = seededRandom(seed, step) * total;
  for (const c of candidates) {
    roll -= c.weight;
    if (roll <= 0) return c.item;
  }
  return candidates[candidates.length - 1]?.item ?? null;
}

const TOP_CANDIDATES = 8;

export function pickNextCard(state: CyklusRunState): SwipeCard {
  const tutorialDone =
    state.flags.includes('tutorial_v2_done') ||
    state.flags.includes('tutorial_done') ||
    state.usedCardIds.includes('tutorial_15_ready') ||
    state.usedCardIds.includes('tutorial_consequences');
  const hasPendingTutorial = state.scheduledCards.some((sc) => sc.cardId.startsWith('tutorial_'));
  const isOnTutorialCard = state.currentCardId.startsWith('tutorial_');
  const tutorialActive = !tutorialDone && (hasPendingTutorial || isOnTutorialCard);

  const story = loadStoryProgression();
  const storyDirective = getStoryDirective(state, story);
  if (!tutorialActive && storyDirective.forcedCardId) {
    const forced = CYKLUS_CARDS[storyDirective.forcedCardId];
    if (forced && checkCardConditions(state, forced)) return forced;
  }

  const pool = getCardPool(state);
  const scored = pool.map((card) => ({ card, score: scoreCard(state, card) })).filter((entry) => entry.score > 0);
  if (scored.length === 0) {
    const lastId = state.usedCardIds[state.usedCardIds.length - 1];
    const fallback = pool.find((c) => checkCardConditions(state, c) && c.id !== lastId) ?? pool.find((c) => c.id !== lastId) ?? CYKLUS_CARDS.first_boot!;
    return fallback;
  }

  // Scheduled cards have absolute priority — bypass everything
  const readyScheduled = getReadyScheduledCards(state);
  const hasScheduled = scored.some((entry) => readyScheduled.includes(entry.card.id));
  if (hasScheduled) {
    const scheduledTop = scored.filter((entry) => readyScheduled.includes(entry.card.id));
    const picked = weightedPick(scheduledTop.map((entry) => ({ item: entry.card, weight: entry.score })), state.seed, state.rngStep);
    if (picked) return picked;
  }

  const top = scored.sort((a, b) => b.score - a.score).slice(0, TOP_CANDIDATES);
  const picked = weightedPick(top.map((entry) => ({ item: entry.card, weight: entry.score })), state.seed, state.rngStep);
  return picked ?? top[0]?.card ?? CYKLUS_CARDS.first_boot!;
}

export function pickNextCardState(state: CyklusRunState): CyklusRunState {
  if (state.status !== 'playing') return state;
  const next = pickNextCard(state);
  const readyScheduled = getReadyScheduledCards(state);
  const wasScheduled = readyScheduled.includes(next.id);
  const s = wasScheduled ? clearScheduledCard(state, next.id) : state;
  return { ...s, currentCardId: next.id, rngStep: s.rngStep + 1 };
}

export function getCycleProgress(state: CyklusRunState): number {
  return (state.choiceInCycle / CHOICES_PER_CYCLE) * 100;
}

export function getCompletionStatus(state: CyklusRunState): 'playing' | 'dead' | 'completed' {
  return state.status;
}

export function summarizeRun(state: CyklusRunState): CyklusRunSummary {
  const profile = computeProfile(state);
  const ending = computeEnding(state);
  const endingTitle = ending?.title ?? 'Neznámý konec';
  const deathStat = ending?.type === 'death' ? ending.stat : undefined;
  const codename = generateRunCodename(state);
  return {
    id: state.id,
    endedAt: Date.now(),
    status: state.status === 'completed' ? 'completed' : 'dead',
    endingTitle,
    codename,
    cyclesSurvived: state.cycle,
    totalChoices: state.totalChoices,
    dominantProfile: profile.dominantLabel,
    archetype: profile.archetype,
    profile: { ...state.profile },
    imprints: [...state.imprints],
    visitedSectors: [...state.visitedSectors],
    deathStat,
  };
}

export function analyzeDeath(state: CyklusRunState): { stat: StatKey; extreme: 'low' | 'high'; topContributors: { cardId: string; delta: number }[]; systemComment: string } | null {
  const ending = computeEnding(state);
  if (!ending || ending.type !== 'death') return null;
  const stat = ending.stat;
  const extreme = ending.extreme;
  const contributors = state.history
    .filter((record) => record.statDelta[stat] && (extreme === 'high' ? record.statDelta[stat]! > 0 : record.statDelta[stat]! < 0))
    .map((record) => ({ cardId: record.cardId, delta: record.statDelta[stat]! }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3);
  const comment = extreme === 'high'
    ? `${STAT_LABELS[stat]} dosáhla extrému. Systém tě označil jako příliš ${stat === 'memory' ? 'plný' : 'intenzivní'} na další zpracování.`
    : `${STAT_LABELS[stat]} se vyprázdnila. Zbyla z tebe struktura, která už neumí sama spustit.`;
  return { stat, extreme, topContributors: contributors, systemComment: comment };
}

export function computeStabilizationProgress(state: CyklusRunState): { survivedRestart: boolean; imprints: number; imprintsNeeded: number; sectors: number; sectorsNeeded: number; statsStable: boolean; allStats: Record<StatKey, { value: number; stable: boolean }> } {
  return {
    survivedRestart: state.usedCardIds.includes('restart_5'),
    imprints: state.imprints.length,
    imprintsNeeded: 3,
    sectors: new Set(state.visitedSectors).size,
    sectorsNeeded: 4,
    statsStable: Object.values(state.stats).every((v) => v > 20 && v < 80),
    allStats: {
      energy: { value: state.stats.energy, stable: state.stats.energy > 20 && state.stats.energy < 80 },
      memory: { value: state.stats.memory, stable: state.stats.memory > 20 && state.stats.memory < 80 },
      bond: { value: state.stats.bond, stable: state.stats.bond > 20 && state.stats.bond < 80 },
      control: { value: state.stats.control, stable: state.stats.control > 20 && state.stats.control < 80 },
    },
  };
}

export function updateTension(state: CyklusRunState, card: SwipeCard): CyklusTension {
  const t = state.tension;
  const hasEntity = card.tags.some((tag) => ['sarkasma', 'glitchka', 'tai', 'archive', 'entity'].includes(tag));
  const hasEntityEffect = card.yes.effects.some((e) => e.type === 'entityRelation') || card.no.effects.some((e) => e.type === 'entityRelation');
  const cardIsCrisis = isCrisisCard(card);
  const cardIsItemTrigger = isItemTrigger(card);
  const isCalm = !cardIsCrisis && !cardIsItemTrigger && !hasEntity && !hasEntityEffect && card.category !== 'path';
  const hasReward = card.yes.effects.some((e) => e.type === 'item' || e.type === 'imprint') || card.no.effects.some((e) => e.type === 'item' || e.type === 'imprint');
  const matchesSector = cardMatchesCurrentSector(state, card);

  return {
    calmStreak: isCalm ? t.calmStreak + 1 : 0,
    crisisStreak: cardIsCrisis ? t.crisisStreak + 1 : 0,
    itemTriggerStreak: cardIsItemTrigger ? t.itemTriggerStreak + 1 : 0,
    sameSectorStreak: matchesSector ? t.sameSectorStreak + 1 : 0,
    rewardStreak: hasReward ? 0 : t.rewardStreak + 1,
    entityStreak: hasEntity || hasEntityEffect ? 0 : t.entityStreak + 1,
    lastRewardAt: hasReward ? state.totalChoices : t.lastRewardAt,
    lastEntityAt: hasEntity || hasEntityEffect ? state.totalChoices : t.lastEntityAt,
  };
}

function applyModifierScore(state: CyklusRunState, score: number, card: SwipeCard): number {
  let s = score;
  switch (state.modifier.id) {
    case 'archive_rain':
      if (card.tags.includes('archive') || card.tags.includes('memory')) s += 60;
      break;
    case 'silent_shift':
      if (card.category === 'silent' || card.tags.includes('silent')) s += 70;
      if (card.category === 'entity') s -= 40;
      break;
    case 'acid_shift':
      if (card.tags.includes('energy') || card.tags.includes('acid')) s += 60;
      if (card.category === 'path' || card.tags.includes('path')) s += 40;
      break;
    case 'form_day':
      if (card.tags.includes('form') || card.tags.includes('office')) s += 70;
      break;
    case 'glitch_weather':
      if (card.tags.includes('glitch') || card.tags.includes('noise')) s += 70;
      if (card.tags.includes('control') && (card.rarity === 'rare' || card.rarity === 'critical')) s += 30;
      break;
  }
  return s;
}

function applyUpgradeScore(state: CyklusRunState, score: number, card: SwipeCard): number {
  let s = score;
  const flags = state.flags;

  if (flags.includes('tai_trust_active')) {
    if (card.tags.includes('tai') || card.tags.includes('contract')) s += 80;
  }

  if (flags.includes('archive_reader_active')) {
    if (state.stats.memory > 85 && (card.tags.includes('archive') || card.tags.includes('memory')) && cardWouldDecreaseStat(card, 'memory')) {
      s += 100;
    }
  }

  if (flags.includes('glitchka_affinity_active')) {
    if (card.tags.includes('glitch') || card.tags.includes('noise')) {
      s += 50;
      if (card.category === 'crisis') s += 60;
    }
  }

  if (flags.includes('sarkasma_debtor_active')) {
    if (card.tags.includes('sarkasma') || card.tags.includes('collect')) s += 70;
  }

  if (flags.includes('stabilization_echo_active')) {
    if (card.tags.includes('stabilize') || card.tags.includes('system') || card.tags.includes('calm')) s += 40;
  }

  if (flags.includes('inner_pocket_active')) {
    if (isItemTrigger(card)) s += 80;
  }

  return s;
}

function applyMetaProgressionCardScoring(state: CyklusRunState, score: number, card: SwipeCard): number {
  let s = score;
  const flags = state.flags;

  const voidRoomBonuses: Record<string, { tags: string[]; bonus: number }> = {
    fox_nest_pool_support_active: { tags: ['glitchka'], bonus: 70 },
    sarkasma_couch_therapy_active: { tags: ['sarkasma'], bonus: 70 },
    sarkasma_couch_clean_cut_active: { tags: ['sarkasma', 'overcut'], bonus: 50 },
    noise_lens_active: { tags: ['mirror', 'noise'], bonus: 50 },
    ni_premonition_active: { tags: ['pattern'], bonus: 40 },
    fi_authentic_no_active: { tags: ['boundary'], bonus: 40 },
    fe_warm_thread_active: { tags: ['entity', 'care'], bonus: 40 },
    ne_side_door_active: { tags: ['path', 'sandbox'], bonus: 40 },
    se_now_cut_active: { tags: ['action', 'physical'], bonus: 40 },
    refund_stamp_active: { tags: ['toll', 'contract'], bonus: 40 },
    named_shell_active: { tags: ['blackbox', 'form'], bonus: 40 },
    soft_pause_protocol_active: { tags: ['silent', 'pause'], bonus: 40 },
    archive_drawer_recycle_active: { tags: ['archive'], bonus: 40 },
    tai_terminal_preview_active: { tags: ['contract', 'tai'], bonus: 40 },
    toll_shelf_active: { tags: ['toll', 'contract'], bonus: 40 },
  };

  for (const [flag, config] of Object.entries(voidRoomBonuses)) {
    if (flags.includes(flag) && config.tags.some((tag) => card.tags.includes(tag))) {
      s += config.bonus;
    }
  }

  for (const protocol of Object.values(PROFILE_PROTOCOLS)) {
    const startFlag = protocol.effect.startFlag;
    if (!startFlag || !flags.includes(startFlag)) continue;
    const tags = protocol.effect.scoringTags;
    if (tags && tags.some((tag) => card.tags.includes(tag))) {
      s += 40;
    }
  }

  for (const artifact of Object.values(CRAFTED_ARTIFACTS)) {
    const active = artifact.effects.startFlags?.some((f) => flags.includes(f));
    if (!active) continue;
    const tags = artifact.effects.scoringTags;
    if (tags && tags.some((tag) => card.tags.includes(tag))) {
      s += 40;
    }
  }

  return s;
}

export function applyMetaProgressionPreviewHint(
  state: CyklusRunState,
  card: SwipeCard,
  hint: string,
): string {
  const flags = state.flags;
  const extras: string[] = [];

  if (flags.includes('ni_premonition_active') && card.tags.includes('pattern')) {
    extras.push('Předtucha: tato karta skrývá vzor.');
  }
  if (flags.includes('ti_contradiction_active') && (card.tags.includes('trap') || card.tags.includes('overload'))) {
    extras.push('Detektor rozporu: text a efekt nesedí.');
  }
  if (flags.includes('te_cost_preview_active') && (card.tags.includes('contract') || card.tags.includes('toll'))) {
    extras.push('Cena před podpisem: vysoká.');
  }
  if (flags.includes('se_now_cut_active') && (card.tags.includes('action') || card.tags.includes('physical'))) {
    extras.push('Se: řez přítomností je možný.');
  }
  if (flags.includes('ne_side_door_active') && (card.tags.includes('path') || card.tags.includes('sandbox'))) {
    extras.push('Ne: boční dveře se otevírají.');
  }
  if (flags.includes('si_anchor_active') && (card.tags.includes('archive') || card.tags.includes('memory'))) {
    extras.push('Si: kotva minulého cyklu.');
  }
  if (flags.includes('fi_authentic_no_active') && card.tags.includes('boundary')) {
    extras.push('Fi: autentické ne chrání hranici.');
  }
  if (flags.includes('fe_warm_thread_active') && (card.tags.includes('entity') || card.tags.includes('care'))) {
    extras.push('Fe: teplé vlákno.');
  }
  if (flags.includes('mirror_wall_profile_preview_active')) {
    extras.push('Zrcadlová stěna: profil ovlivňuje výběr.');
  }
  if (flags.includes('tai_terminal_preview_active') && (card.tags.includes('contract') || card.tags.includes('tai'))) {
    extras.push('T-AI: smluvní detaily čitelnější.');
  }
  if (flags.includes('archive_drawer_recycle_active') && card.tags.includes('archive')) {
    extras.push('Archiv: stopu jde recyklovat.');
  }
  if (flags.includes('noise_lens_active') && (card.tags.includes('noise') || card.tags.includes('mirror'))) {
    extras.push('Šumová čočka: neuvěř hned.');
  }
  if (flags.includes('clean_cut_scalpel_active') && (card.tags.includes('sarkasma') || card.tags.includes('overcut'))) {
    extras.push('Čistý řez: krutost lze oddělit.');
  }

  if (extras.length === 0) return hint;
  return `${hint} [${extras.join(' · ')}]`;
}

function applyTensionScore(state: CyklusRunState, score: number, card: SwipeCard): number {
  const t = state.tension;
  let s = score;

  // ── Rhythm / streak adjustments ────────────────────────────────────────────
  if (t.calmStreak >= 3 && (card.tags.includes('chaos') || card.tags.includes('glitch') || card.tags.includes('noise') || card.tags.includes('anomaly') || card.category === 'crisis')) {
    s += 120;
  }
  if (t.crisisStreak >= 2 && (card.tags.includes('calm') || card.tags.includes('stabilize') || card.tags.includes('system') || card.tags.includes('archive'))) {
    s += 150;
  }
  if (t.sameSectorStreak >= 4 && !cardMatchesCurrentSector(state, card)) {
    s += 140;
  }
  if (t.entityStreak >= 4 && (card.tags.includes('sarkasma') || card.tags.includes('glitchka') || card.tags.includes('tai') || card.tags.includes('archive'))) {
    s += 130;
  }
  if (t.rewardStreak >= 5 && (card.tags.includes('reward') || card.tags.includes('item_trigger') || card.tags.includes('item'))) {
    s += 110;
  }
  if (t.itemTriggerStreak >= 2 && isItemTrigger(card)) {
    s -= 250;
  }
  if (t.itemTriggerStreak >= 2 && (card.category === 'path' || card.tags.includes('system') || card.tags.includes('silent'))) {
    s += 120;
  }

  // ── Stat-aware scoring: gentle guidance, not a safety net (B1.1) ───────────
  const stats = state.stats;
  for (const stat of ['energy', 'memory', 'bond', 'control'] as StatKey[]) {
    const val = stats[stat];
    if (val > 85 && cardWouldIncreaseStat(card, stat)) {
      s -= 220;
    } else if (val > 75 && cardWouldIncreaseStat(card, stat)) {
      s -= 80;
    }
    if (val > 85 && cardWouldDecreaseStat(card, stat)) {
      s += 150;
    }
    if (val < 10 && cardWouldDecreaseStat(card, stat)) {
      s -= 160;
    }
    if (val < 10 && cardWouldIncreaseStat(card, stat)) {
      s += 150;
    }
  }

  // ── Sector diversity: boost path cards when < 4 unique sectors visited ─────
  const visitedCount = new Set(state.visitedSectors).size;
  if (visitedCount < 4 && (card.category === 'path' || card.tags.includes('path'))) {
    s += 160;
  }
  if (t.sameSectorStreak >= 3 && !cardMatchesCurrentSector(state, card) && (card.category === 'path' || card.tags.includes('path'))) {
    s += 120;
  }

  // ── Fresh meta pool visibility boost ────────────────────────────────────────
  if (isFreshMetaPoolCard(state, card)) {
    s += 350;
  }

  // ── Basic scene pressure: muted in stat extremes (B1.1) ────────────────────
  const statVals = Object.values(state.stats) as number[];
  const inStatExtreme = statVals.some((v) => v < 15 || v > 85);
  if (!inStatExtreme) {
    const recentBasicGap = state.usedCardIds.slice(-5).filter((id) => {
      const c = CYKLUS_CARDS[id];
      return c ? isBasicSceneCard(c) : false;
    }).length;
    if (recentBasicGap === 0 && isBasicSceneCard(card)) {
      s += 140;
    } else if (recentBasicGap <= 1 && isBasicSceneCard(card)) {
      s += 60;
    }
  }

  return s;
}


export function getTopScoredCards(state: CyklusRunState, count = 5): CardScoreBreakdown[] {
  const pool = getCardPool(state);
  return pool
    .map((card) => explainCardScore(state, card))
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// ── STABILIZATION VARIANTS ────────────────────────────────────────────────────

export type StabilizationVariantId =
  | 'archive_stabilization'
  | 'glitch_stabilization'
  | 'form_stabilization'
  | 'mirror_stabilization'
  | 'seal_stabilization'
  | 'generic_stabilization';

export interface StabilizationVariant {
  id: StabilizationVariantId;
  title: string;
  text: string;
  reasons?: string[];
}

export function computeStabilizationVariant(state: CyklusRunState): StabilizationVariant {
  const archiveRel = state.entityRelations.archive ?? 0;
  const glitchkaRel = state.entityRelations.glitchka ?? 0;
  const formRel = state.entityRelations.form ?? 0;
  const shadowRel = state.entityRelations.shadow ?? 0;

  const hasGlitchItem = state.inventory.some((id) => ['wrong_map', 'glitch_pebble', 'noise_clump', 'soft_bug'].includes(id));
  const hasFormItem = state.inventory.includes('rubber_stamp') || state.inventory.includes('blank_form');
  const hasMirrorImprint = state.imprints.some((id) => ['mirror_crack', 'reflected_self', 'second_face'].includes(id));
  const hasSealSave = state.flags.includes('rubber_seal_saved');

  if (hasSealSave) {
    return {
      id: 'seal_stabilization',
      title: 'Tuleňova stabilizace',
      text: 'Byl jsi blízko konce. Tuleň tě zadržel. Systém to nezaznamenal jako zázrak. Zaznamenal to jako "nepředvídaná záchrana gumovým objektem". Záznamy jsou přesnější než poezie.',
      reasons: ['Gumový tuleň zasahoval v kritickém momentu', 'Staty v bezpečném pásmu (20–80)'],
    };
  }

  if (archiveRel >= 4 && state.stats.memory >= 40 && state.stats.memory <= 75 &&
    state.imprints.some((id) => ['archive_echo', 'recorded_truth', 'drowned_log'].includes(id))) {
    return {
      id: 'archive_stabilization',
      title: 'Archivní stabilizace',
      text: 'Archiv tě nezařadil mezi mrtvé věci. To je od archivu téměř náklonnost. Tvůj záznam bude uložen s poznámkou: subjekt zůstal čitelný. V archivních podmínkách je to chvála.',
      reasons: [`Vztah k Archivu +${archiveRel}`, `Paměť ${state.stats.memory} (stabilní pásmo)`, 'Archivní otisk získán'],
    };
  }

  if (glitchkaRel >= 5 && hasGlitchItem && state.stats.control >= 25 && state.stats.control <= 65) {
    return {
      id: 'glitch_stabilization',
      title: 'Glitchova stabilizace',
      text: 'Systém tě neopravil. Glitchka tě jen naučila fungovat šikmo. Kupodivu to stačilo. Systém má k tomu poznámku. Poznámka je nečitelná.',
      reasons: [`Vztah ke Glitchce +${glitchkaRel}`, 'Glitch předmět v kapse', `Kontrola ${state.stats.control} (ne příliš vysoko)`],
    };
  }

  if (hasFormItem && formRel >= 0 && state.stats.control >= 50 && state.stats.control <= 78) {
    return {
      id: 'form_stabilization',
      title: 'Administrativní stabilizace',
      text: 'Byl jsi schválen. Nikdo neví proč. Razítko odmítlo další dotazy. Formulář byl archivován ve složce "nestandardní subjekty / přijatelné výsledky". Složka existuje.',
      reasons: ['Administrativní předmět v kapse', `Kontrola ${state.stats.control} (byrokracie spokojná)`],
    };
  }

  if (hasMirrorImprint && shadowRel >= 2 && state.stats.memory < 80) {
    return {
      id: 'mirror_stabilization',
      title: 'Zrcadlová stabilizace',
      text: 'Neodpustil sis všechno. Jen dost na to, aby odraz přestal útočit. Zrcadlo tě pustilo. Systém to nezaznamenal. Zrcadla záznamy nevede.',
      reasons: ['Zrcadlový otisk získán', `Vztah ke Stínu +${shadowRel}`, `Paměť ${state.stats.memory} (pod hranicí přetlačení)`],
    };
  }

  return {
    id: 'generic_stabilization',
    title: 'Stabilizovaný subjekt',
    text: 'Systém tě nedokázal vymazat, opravit ani správně zařadit. Po dlouhé interní debatě tě označil jako stabilní. To je prakticky kompliment.',
    reasons: [`${new Set(state.visitedSectors).size} navštívených sektorů`, `${state.imprints.length} otisků`, 'Staty v povoleném pásmu'],
  };
}

export interface BuildVariantProgress {
  id: StabilizationVariantId;
  title: string;
  progress: number;
  requirements: { label: string; met: boolean }[];
  hint: string;
}

export function getStabilizationBuildProgress(state: CyklusRunState): BuildVariantProgress[] {
  const archiveRel = state.entityRelations.archive ?? 0;
  const glitchkaRel = state.entityRelations.glitchka ?? 0;
  const formRel = state.entityRelations.form ?? 0;
  const shadowRel = state.entityRelations.shadow ?? 0;
  const hasGlitchItem = state.inventory.some((id) => ['wrong_map', 'glitch_pebble', 'noise_clump', 'soft_bug'].includes(id));
  const hasFormItem = state.inventory.includes('rubber_stamp') || state.inventory.includes('blank_form');
  const hasMirrorImprint = state.imprints.some((id) => ['mirror_crack', 'reflected_self', 'second_face'].includes(id));
  const hasSealSave = state.flags.includes('rubber_seal_saved');
  const visitedSectorCount = new Set(state.visitedSectors).size;
  const statsInRange = (['energy', 'memory', 'bond', 'control'] as StatKey[])
    .filter((k) => state.stats[k] >= 20 && state.stats[k] <= 80).length;

  return [
    {
      id: 'seal_stabilization',
      title: 'Tuleňova stabilizace',
      progress: hasSealSave ? 100 : Math.min(100, state.flags.includes('rubber_stamp_ready') ? 60 : 30),
      requirements: [
        { label: 'Gumový tuleň zachránil v kritickém momentu', met: hasSealSave },
        { label: 'Staty v bezpečném pásmu', met: statsInRange >= 3 },
      ],
      hint: 'Sežeň gumového tuleně a nech ho zasáhnout, až bude nejhůř.',
    },
    {
      id: 'archive_stabilization',
      title: 'Archivní stabilizace',
      progress: Math.min(100, Math.round(
        (archiveRel >= 4 ? 40 : archiveRel * 10) +
        (state.imprints.some((id) => ['archive_echo', 'recorded_truth', 'drowned_log'].includes(id)) ? 35 : 0) +
        (state.stats.memory >= 40 && state.stats.memory <= 75 ? 25 : 0),
      )),
      requirements: [
        { label: 'Vztah k Archivu +4', met: archiveRel >= 4 },
        { label: 'Archivní otisk', met: state.imprints.some((id) => ['archive_echo', 'recorded_truth', 'drowned_log'].includes(id)) },
        { label: 'Paměť 40–75', met: state.stats.memory >= 40 && state.stats.memory <= 75 },
      ],
      hint: 'Zapřáhni se s Archivem, získej archivní otisk a udrž Paměť v klidném pásmu.',
    },
    {
      id: 'glitch_stabilization',
      title: 'Glitchova stabilizace',
      progress: Math.min(100, Math.round(
        (glitchkaRel >= 5 ? 40 : glitchkaRel * 8) +
        (hasGlitchItem ? 30 : 0) +
        (state.stats.control >= 25 && state.stats.control <= 65 ? 30 : 0),
      )),
      requirements: [
        { label: 'Vztah ke Glitchce +5', met: glitchkaRel >= 5 },
        { label: 'Glitch předmět', met: hasGlitchItem },
        { label: 'Kontrola 25–65', met: state.stats.control >= 25 && state.stats.control <= 65 },
      ],
      hint: 'Sbírej glitch předměty a udržuj Kontrolu v rozumném pásmu.',
    },
    {
      id: 'form_stabilization',
      title: 'Administrativní stabilizace',
      progress: Math.min(100, Math.round(
        (hasFormItem ? 35 : 0) +
        (formRel >= 0 ? 25 : 0) +
        (state.stats.control >= 50 && state.stats.control <= 78 ? 40 : 0),
      )),
      requirements: [
        { label: 'Formulářový předmět', met: hasFormItem },
        { label: 'Byrokracie nezaujatá', met: formRel >= 0 },
        { label: 'Kontrola 50–78', met: state.stats.control >= 50 && state.stats.control <= 78 },
      ],
      hint: 'Najdi razítko nebo formulář a drž Kontrolu v úředně přijatelné zóně.',
    },
    {
      id: 'mirror_stabilization',
      title: 'Zrcadlová stabilizace',
      progress: Math.min(100, Math.round(
        (hasMirrorImprint ? 40 : 0) +
        (shadowRel >= 2 ? 30 : 0) +
        (state.stats.memory < 80 ? 30 : 0),
      )),
      requirements: [
        { label: 'Zrcadlový otisk', met: hasMirrorImprint },
        { label: 'Vztah ke Stínu +2', met: shadowRel >= 2 },
        { label: 'Paměť pod 80', met: state.stats.memory < 80 },
      ],
      hint: 'Získej zrcadlový otisk, spřáteli se se Stínem a nedovol Paměti přetéct.',
    },
    {
      id: 'generic_stabilization',
      title: 'Stabilizovaný subjekt',
      progress: Math.min(100, Math.round(
        (visitedSectorCount >= 4 ? 35 : visitedSectorCount * 8) +
        (state.imprints.length >= 3 ? 35 : state.imprints.length * 10) +
        (statsInRange >= 3 ? 30 : statsInRange * 10),
      )),
      requirements: [
        { label: '4+ sektory', met: visitedSectorCount >= 4 },
        { label: '3+ otisky', met: state.imprints.length >= 3 },
        { label: 'Staty v bezpečném pásmu', met: statsInRange >= 3 },
      ],
      hint: 'Prozkoumej sektory, sbírej otisky a drž staty mimo extrémy.',
    },
  ];
}

// ── CYCLE FORECAST ────────────────────────────────────────────────────────────

export function composeCycleForecast(state: CyklusRunState): string {
  const lines: string[] = [];
  const { energy, memory, bond, control } = state.stats;

  const stats = { energy, memory, bond, control } as Record<StatKey, number>;
  const sorted = (Object.entries(stats) as [StatKey, number][]).sort((a, b) => b[1] - a[1]);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  const highLabel: Record<StatKey, string> = {
    energy: 'Energie je zvýšená. Karty s vysokou aktivitou budou pravděpodobnější.',
    memory: 'Paměť je zvýšená. Archivní a vzpomínkové karty budou pravděpodobnější.',
    bond: 'Vazba je zvýšená. Entity budou aktivnější.',
    control: 'Kontrola je zvýšená. Formuláře a systémové karty budou pravděpodobnější.',
  };
  const lowLabel: Record<StatKey, string> = {
    energy: 'Energie je nízká. Doporučuje se vyhýbat dalšímu vyčerpání.',
    memory: 'Paměť je nízká. Riziko ztráty záznamu.',
    bond: 'Vazba je nízká. Entity nebudou ochotné.',
    control: 'Kontrola je nízká. Struktura není spolehlivá.',
  };

  if (highest && highest[1] > 65) lines.push(highLabel[highest[0]]);
  if (lowest && lowest[1] < 35) lines.push(lowLabel[lowest[0]]);

  const archiveRel = state.entityRelations.archive ?? 0;
  const glitchkaRel = state.entityRelations.glitchka ?? 0;
  const sarkasmRel = state.entityRelations.sarkasma ?? 0;
  if (archiveRel >= 3) lines.push('Archiv sleduje tento průchod s neobvyklým zájmem.');
  if (glitchkaRel >= 3) lines.push('Glitchka má připravený vtip. Pravděpodobnost je znepokojivá.');
  if (sarkasmRel <= -3) lines.push('Sarkasma nesouhlasí s aktuální trajektorií. Sarkasma nesouhlasí s mnoha věcmi.');

  const hasScheduled = state.scheduledCards.filter((sc) => sc.turnsRemaining <= 2).length;
  if (hasScheduled >= 2) lines.push('Více naplánovaných událostí čeká. Systém doporučuje přípravu. Systém neupřesňuje, co to znamená.');
  else if (hasScheduled === 1) lines.push('Jedna naplánovaná událost je blízko.');

  if (state.inventory.length >= 4) lines.push('Kapsa je plná. Předměty mají tendenci si toho všímat.');
  if (state.imprints.length >= 3) lines.push('Otisky se hromadí. Systém začíná rozeznávat vzorec.');

  const sectorComments: Partial<Record<SectorId, string>> = {
    void: 'Prázdnota tě drží déle, než bylo naplánováno.',
    archive: 'Archiv je otevřen. To se nestane vždy.',
    mirror: 'Zrcadlo reflektuje. Doporučuje se opatrnost při pohledu.',
    glitchka_nest: 'Hnízdo je aktivní. Nepředvídatelnost je standardní.',
    form_office: 'Formuláře čekají. Jsou vždy připraveny.',
    residuum: 'Reziduum obsahuje věci, které nepatří nikam jinam. Tedy sem.',
  };
  const sectorComment = sectorComments[state.sector];
  if (sectorComment) lines.push(sectorComment);

  if (lines.length === 0) lines.push('Systém nemá předpověď. Systém tím říká, že nemá tušení. Nebo se nechce prozradit.');

  const doporuceni: string[] = [];
  if (memory > 75) doporuceni.push('Nevstupuj do dalšího archivu s plnou pamětí.');
  if (energy > 75) doporuceni.push('Zbytečně se nenadchni.');
  if (bond < 25) doporuceni.push('Odpověz alespoň jedné entitě. I otázkou.');
  if (control > 75) doporuceni.push('Uvolni jeden formulář. Záměrně.');
  if (doporuceni.length > 0) lines.push(`Doporučení: ${doporuceni[0]}`);

  return lines.join('\n');
}

// ── EXPORT RUN LOG ────────────────────────────────────────────────────────────

function formatProfileLabel(profile: ProfileResult): string {
  const label = profile.dominantLabel;
  return label.endsWith('-like') ? label : `${label}-like`;
}

export function exportRunLog(state: CyklusRunState, mode: 'short' | 'full' = 'full', reward?: RunReward): string {
  const profile = computeProfile(state);
  const ending = computeEnding(state);
  const death = analyzeDeath(state);
  const codename = generateRunCodename(state);
  const sectors = [...new Set(state.visitedSectors)].map((s) => SECTOR_LABELS[s]).join(' → ');
  const near = getNearestExtreme(state.stats);
  const profileLabel = formatProfileLabel(profile);

  if (mode === 'short') {
    const lines: string[] = [
      'SYNTHOMA: CYKLUS',
      `Kódové označení: ${codename}`,
      '────────────────────────────────────',
      `Konec: ${ending?.title ?? 'neznámý'}`,
      `Profil: ${profileLabel} · ${profile.archetype}`,
      `Trasa: ${sectors}`,
    ];
    if (death) {
      lines.push(`Příčina: ${STAT_LABELS[death.stat]} ${death.extreme === 'high' ? '(přetlak)' : '(krize)'}`);
    }
    if (near) {
      lines.push(`Nejbližší hrozba: ${STAT_LABELS[near.stat]} ${near.value} (vzdálenost ${near.distance})`);
    }
    if (ending?.text) lines.push('', ending.text);
    lines.push('', '────────────────────────────────────');
    lines.push('Záznam vygenerován systémem SYNTHOMA.');
    return lines.join('\n');
  }

  const lines: string[] = [
    'SYNTHOMA: CYKLUS',
    `Kódové označení: ${codename}`,
    '────────────────────────────────────',
    `Seed: ${state.seed ?? 'neznámý'}`,
    `Cykly: ${state.cycle}`,
    `Celkem voleb: ${state.totalChoices}`,
    '',
    `Konec: ${ending?.title ?? 'neznámý'}`,
    `Profil: ${profileLabel}`,
    `Archetyp: ${profile.archetype}`,
    '',
    'Staty při konci:',
    `  Energie:  ${state.stats.energy}`,
    `  Paměť:    ${state.stats.memory}`,
    `  Vazba:    ${state.stats.bond}`,
    `  Kontrola: ${state.stats.control}`,
    '',
    `Trasa: ${sectors}`,
    '',
  ];

  if (state.inventory.length > 0) {
    lines.push('Inventář:');
    for (const id of state.inventory) lines.push(`  · ${CYKLUS_ITEMS[id]?.title ?? id}`);
    lines.push('');
  }

  if (state.imprints.length > 0) {
    lines.push('Otisky:');
    for (const id of state.imprints) lines.push(`  · ${CYKLUS_IMPRINTS[id]?.title ?? id}`);
    lines.push('');
  }

  if (death?.topContributors.length) {
    lines.push(`Primární příčina: ${STAT_LABELS[death.stat]} ${death.extreme === 'high' ? '(přetlak)' : '(krize)'}`);
    lines.push('Nejvíce přispěly:');
    for (const c of death.topContributors) {
      const card = CYKLUS_CARDS[c.cardId];
      lines.push(`  ${card?.title ?? c.cardId}  ${c.delta > 0 ? '+' : ''}${c.delta}`);
    }
    lines.push('');
  }

  if (near) {
    lines.push(`Největší hrozba příštího cyklu: ${STAT_LABELS[near.stat]} ${near.value} (vzdálenost ${near.distance})`);
    lines.push('');
  }

  if (state.goals && state.goals.length > 0) {
    const completed = state.goals.filter((g) => g.completed);
    if (completed.length > 0) {
      lines.push('Splněné cíle:');
      for (const g of completed) lines.push(`  · ${g.title}${g.rewardTitle ? ` · ${g.rewardTitle}` : ''}`);
      lines.push('');
    }
  }

  if (reward) {
    const residuum = reward.currencies.residuum ?? 0;
    const special = Object.entries(reward.currencies)
      .filter(([k, v]) => k !== 'residuum' && v > 0)
      .map(([k, v]) => `${k}: +${v}`);
    if (residuum > 0 || special.length > 0) {
      lines.push('Odměny:');
      if (residuum > 0) lines.push(`  · Reziduum: +${residuum}`);
      for (const s of special) lines.push(`  · ${s}`);
      if (reward.unlockedUpgrades.length > 0) {
        lines.push('  Nové protokoly:');
        for (const id of reward.unlockedUpgrades) lines.push(`    · ${SUBJECT_UPGRADES[id]?.title ?? id}`);
      }
      if (reward.unlockedScars.length > 0) {
        lines.push('  Nové jizvy:');
        for (const id of reward.unlockedScars) lines.push(`    · ${SUBJECT_SCARS[id]?.title ?? id}`);
      }
      if (Object.keys(reward.craftingMaterials).length > 0) {
        lines.push('  Suroviny:');
        for (const [id, amount] of Object.entries(reward.craftingMaterials)) {
          if (amount && amount > 0) lines.push(`    · ${id}: +${amount}`);
        }
      }
      if (reward.unlockedRecipes.length > 0) {
        lines.push('  Odemčené recepty:');
        for (const id of reward.unlockedRecipes) lines.push(`    · ${id}`);
      }
      if (Object.keys(reward.profileMastery).length > 0) {
        lines.push('  Profilový posun:');
        for (const [key, value] of Object.entries(reward.profileMastery)) {
          if (value) lines.push(`    · ${key}: +${value}`);
        }
      }
      if (reward.voidRoomHints.length > 0) {
        lines.push('  Prázdnota doporučuje:');
        for (const id of reward.voidRoomHints) lines.push(`    · ${id}`);
      }
      if (reward.recommendedActions.length > 0) {
        lines.push('  Další kroky:');
        for (const a of reward.recommendedActions) lines.push(`    · ${a}`);
      }
      lines.push('');
    }
  }

  const keyMoment = findKeyMoment(state);
  if (keyMoment) {
    lines.push('Klíčový moment:');
    lines.push(`  · ${keyMoment}`);
    lines.push('');
  }

  const riskiest = findRiskiestChoice(state);
  if (riskiest) {
    lines.push('Nejnebezpečnější rozhodnutí:');
    lines.push(`  · ${riskiest}`);
    lines.push('');
  }

  const anchor = findStabilizingAnchor(state);
  if (anchor) {
    lines.push('Stabilizační kotva:');
    lines.push(`  · ${anchor}`);
    lines.push('');
  }

  const behavior = composeBehavioralAnalysis(state);
  if (behavior.length > 0) {
    lines.push('Styl průchodu:');
    for (const b of behavior) lines.push(`  · ${b}`);
    lines.push('');
  }

  if (state.cycleSummaries && state.cycleSummaries.length > 0) {
    lines.push('Souhrny cyklů:');
    for (const s of state.cycleSummaries) lines.push(`  ${s}`);
    lines.push('');
  }

  if (ending?.text) {
    lines.push('Systémový komentář:');
    lines.push(ending.text);
    lines.push('');
  }

  lines.push('────────────────────────────────────');
  lines.push('Záznam vygenerován systémem SYNTHOMA.');

  return lines.join('\n');
}

function findKeyMoment(state: CyklusRunState): string | null {
  const records = state.history;
  if (records.length === 0) return null;
  const combo = records.find((r) => r.flagsGained.some((f) => f.startsWith('combo_')));
  if (combo) {
    const card = CYKLUS_CARDS[combo.cardId];
    return `${card?.title ?? combo.cardId} spustila neobvyklou kombinaci.`;
  }
  const crisis = records.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.category === 'crisis';
  });
  const crisisRecord = crisis[0];
  if (crisisRecord) {
    const card = CYKLUS_CARDS[crisisRecord.cardId];
    return `${card?.title ?? crisisRecord.cardId} přivedla run do krizového bodu.`;
  }
  const maxDelta = records
    .map((r) => ({ record: r, totalDelta: Object.values(r.statDelta).reduce((a, b) => a + Math.abs(b), 0) }))
    .sort((a, b) => b.totalDelta - a.totalDelta)[0];
  if (maxDelta && maxDelta.totalDelta > 0) {
    const card = CYKLUS_CARDS[maxDelta.record.cardId];
    return `${card?.title ?? maxDelta.record.cardId} způsobila největší statový posun.`;
  }
  return null;
}

function findRiskiestChoice(state: CyklusRunState): string | null {
  const records = state.history;
  if (records.length === 0) return null;
  let riskiest: { record: CyklusChoiceRecord; risk: number } | null = null;
  for (const r of records) {
    const card = CYKLUS_CARDS[r.cardId];
    if (!card) continue;
    const risk = Object.entries(r.statDelta).reduce((sum, [k, v]) => {
      const stat = k as StatKey;
      const after = r.statsAfter[stat];
      const pushedToExtreme = (after > 70 && v > 0) || (after < 30 && v < 0);
      return sum + (pushedToExtreme ? Math.abs(v) * 2 : 0);
    }, 0);
    if (risk > 0 && (!riskiest || risk > riskiest.risk)) {
      riskiest = { record: r, risk };
    }
  }
  if (!riskiest) return null;
  const card = CYKLUS_CARDS[riskiest.record.cardId];
  return `${card?.title ?? riskiest.record.cardId} (${riskiest.record.direction === 'yes' ? 'přijetí' : 'odmítnutí'}) tě nejvíc přiblížilo hranici.`;
}

function findStabilizingAnchor(state: CyklusRunState): string | null {
  const records = state.history;
  if (records.length === 0) return null;
  const stabilizing = records
    .map((r) => {
      const card = CYKLUS_CARDS[r.cardId];
      const stabilization = Object.entries(r.statDelta).reduce((sum, [k, v]) => {
        const key = k as StatKey;
        const after = r.statsAfter[key] ?? 0;
        const before = after - v;
        const beforeDist = Math.abs(before - 50);
        const afterDist = Math.abs(after - 50);
        return sum + (afterDist < beforeDist ? Math.abs(v) : 0);
      }, 0);
      return { record: r, stabilization, card };
    })
    .sort((a, b) => b.stabilization - a.stabilization)[0];
  if (stabilizing && stabilizing.stabilization > 0) {
    return `${stabilizing.card?.title ?? stabilizing.record.cardId} přitáhla staty zpátky k rovnováze.`;
  }
  return null;
}

// ── NEAREST EXTREME ───────────────────────────────────────────────────────────

export interface NearestExtreme {
  stat: StatKey;
  value: number;
  direction: 'low' | 'high';
  distance: number;
}

export function getNearestExtreme(stats: CyklusRunState['stats']): NearestExtreme | null {
  let nearest: NearestExtreme | null = null;
  for (const key of Object.keys(stats) as StatKey[]) {
    const v = stats[key];
    const distLow = v;
    const distHigh = 100 - v;
    const dist = Math.min(distLow, distHigh);
    const direction: 'low' | 'high' = distLow <= distHigh ? 'low' : 'high';
    if (!nearest || dist < nearest.distance) {
      nearest = { stat: key, value: v, direction, distance: dist };
    }
  }
  return nearest;
}

// ── RUN CODENAME ──────────────────────────────────────────────────────────────

const CODENAME_STAT: Record<StatKey, string[]> = {
  energy: ['Žhavý', 'Přepálený', 'Jiskrový', 'Hořící', 'Tichý reaktor'],
  memory: ['Mokrý', 'Archivní', 'Zapomenutý', 'Přetékající', 'Záznam'],
  bond: ['Propojený', 'Opuštěný', 'Síťový', 'Vláknovitý', 'Ztracený signál'],
  control: ['Přesný', 'Rozbitý', 'Formulářový', 'Rigidní', 'Výjimka'],
};

const CODENAME_SECTOR: Partial<Record<SectorId, string[]>> = {
  void: ['Prázdnota', 'Nicota', 'Bezjmenný'],
  archive: ['Archiv', 'Záznamník', 'Katalog'],
  mirror: ['Zrcadlo', 'Odraz', 'Tvář'],
  glitchka_nest: ['Hnízdo', 'Glitch', 'Anomálie'],
  form_office: ['Formulář', 'Kancelář', 'Razítko'],
  residuum: ['Reziduum', 'Zbytek', 'Sediment'],
  market: ['Tržiště', 'Obchod', 'Transakce'],
  acid_yellow: ['Žluč', 'Kyselina', 'Kult'],
};

const CODENAME_ITEM: Record<string, string> = {
  rubber_seal: 'Tuleň',
  archive_key: 'Klíč',
  mirror_shard: 'Střep',
  noise_clump: 'Chomáč',
  black_folder: 'Složka',
  glitch_pebble: 'Kamínek',
  soft_bug: 'Chyba',
  ownerless_shadow: 'Stín',
};

const CODENAME_ENDING: Record<string, string[]> = {
  stabilized: ['který zůstal', 'co nepodlehl', 's razítkem na čele'],
  death: ['bez výstupu', 'co neodpověděl', 'který neuměl zavřít dveře'],
};

export function generateRunCodename(state: CyklusRunState): string {
  const stats = state.stats as Record<StatKey, number>;
  const dominantStat = (Object.entries(stats) as [StatKey, number][])
    .sort((a, b) => Math.abs(b[1] - 50) - Math.abs(a[1] - 50))[0]?.[0] ?? 'energy';

  const mostVisitedSector = Object.entries(
    state.visitedSectors.reduce<Record<string, number>>((acc, s) => { acc[s] = (acc[s] ?? 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] as SectorId | undefined ?? 'void';

  const significantItem = state.inventory.find((id) => CODENAME_ITEM[id]);

  const ending = computeEnding(state);
  const endType = ending?.type === 'death' ? 'death' : 'stabilized';

  const rng = (arr: string[]) => arr[Math.abs(state.totalChoices + state.cycle) % arr.length] ?? arr[0] ?? '';

  const adj = rng(CODENAME_STAT[dominantStat] ?? ['Neznámý']);
  const noun = rng(CODENAME_SECTOR[mostVisitedSector] ?? ['Průchod']);
  const itemTitle = significantItem ? (CYKLUS_ITEMS[significantItem]?.title ?? CODENAME_ITEM[significantItem]) : null;
  const item = itemTitle ? ` nese: ${itemTitle}` : '';
  const end = rng(CODENAME_ENDING[endType] ?? ['']);

  return `${adj} ${noun}${item}, ${end}`;
}
