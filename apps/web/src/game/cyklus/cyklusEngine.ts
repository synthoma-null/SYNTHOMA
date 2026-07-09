import type { CyklusRunFocus, CyklusRunState, CyklusRunSummary, CyklusTension, SwipeCard, CyklusEffect, CardCondition, StatKey, SectorId, ProfileKey, EntityId, RunEnding, CompletionResult, ProfileResult, CyklusChoiceRecord, CyklusRunModifier, CyklusRunGoal, StatDelta, ProfileDelta, EntityDelta } from './cyklusTypes';
import { STAT_LABELS, SECTOR_LABELS } from './cyklusTypes';
import { loadMetaUnlockPools, loadFreshMetaPools } from './cyklusFindings';
import { CYKLUS_CARDS, CYKLUS_ITEMS, CYKLUS_CONTENT_PACKS } from './content';
import { cardMatchesUnlockedPool } from './cyklusPoolCatalog';
import { explainItemMoodScore, getPocketMoodProfile } from './cyklusItemMood';
import { loadCyklusRunHistory, isTutorialV2Seen } from './cyklusStorage';
import { applyProgressionToNewRun, loadSubjectProgression, SUBJECT_UPGRADES, SUBJECT_SCARS, PROFILE_PROTOCOLS, CRAFTED_ARTIFACTS, type RunReward } from './cyklusProgression';
import { formatDelta, formatAbsDelta } from './cyklusFormat';
import { pickAvoidingRecent } from './cyklusCommentPool';
import { seededRandom, pickFromPool } from './cyklusRandom';
import { addFlag, addImprint, applyEffects, moveSector, scheduleCard, unlockPool } from './cyklusEffects';
export { applyEffects, applySingleEffect } from './cyklusEffects';
import { computeProfile, computeBaselineProfileFromHistory } from './cyklusProfile';
export { computeProfile, computeBaselineProfileFromHistory } from './cyklusProfile';
import {
  computeEnding,
  computeCompletion,
  analyzeDeath,
  computeStabilizationProgress,
  computeStabilizationVariant,
  getStabilizationBuildProgress,
  type StabilizationVariantId,
  type StabilizationVariant,
  type BuildVariantProgress,
} from './cyklusEnding';
export {
  computeEnding,
  computeCompletion,
  analyzeDeath,
  computeStabilizationProgress,
  computeStabilizationVariant,
  getStabilizationBuildProgress,
  type StabilizationVariantId,
  type StabilizationVariant,
  type BuildVariantProgress,
} from './cyklusEnding';
import {
  getCycleChapterName,
  getSectorIntroText,
  composeCycleSummary,
  composeBehavioralAnalysis,
  composeCycleForecast,
  summarizeRun,
  generateRunCodename,
} from './cyklusSummary';
export {
  getCycleChapterName,
  getSectorIntroText,
  composeCycleSummary,
  composeBehavioralAnalysis,
  composeCycleForecast,
  summarizeRun,
  generateRunCodename,
} from './cyklusSummary';
import { exportRunLog, getNearestExtreme, type NearestExtreme } from './cyklusExport';
export { exportRunLog, getNearestExtreme, type NearestExtreme } from './cyklusExport';
import {
  getCardPool,
  explainCardScore,
  scoreCard,
  pickNextCard,
  pickNextCardState,
  getTopScoredCards,
  updateTension,
  applyMetaProgressionPreviewHint,
  checkCardConditions,
  checkCondition,
  hasItem,
  hasFlag,
  isCrisisCard,
  isItemTrigger,
  isFollowup,
  isBasicSceneCard,
  isRestartCard,
  cardWouldIncreaseStat,
  cardWouldDecreaseStat,
  isFreshMetaPoolCard,
  cardMatchesCurrentSector,
  getReadyScheduledCards,
  clearScheduledCard,
  type CardScoreBreakdown,
} from './cyklusCardPicker';
export {
  getCardPool,
  explainCardScore,
  scoreCard,
  pickNextCard,
  pickNextCardState,
  getTopScoredCards,
  updateTension,
  applyMetaProgressionPreviewHint,
  checkCardConditions,
  checkCondition,
  hasItem,
  hasFlag,
  isCrisisCard,
  isItemTrigger,
  isFollowup,
  isBasicSceneCard,
  isRestartCard,
  cardWouldIncreaseStat,
  cardWouldDecreaseStat,
  isFreshMetaPoolCard,
  cardMatchesCurrentSector,
  getReadyScheduledCards,
  clearScheduledCard,
  type CardScoreBreakdown,
} from './cyklusCardPicker';
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
  { id: 'form_day', title: 'Úřední den', description: 'Formulářové karty častější, razítko je silnější.', tags: ['form', 'office'] },
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

  const story = loadStoryProgression();
  const storyDirective = getStoryDirective(state, story);
  if (storyDirective.interludeText) {
    warning = warning ? `${warning}\n${storyDirective.interludeText}` : storyDirective.interludeText;
  }

  return warning;
}

export function createCyklusRun(skipTutorial = false, runFocus?: CyklusRunFocus): CyklusRunState {
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
    ...(runFocus ? { runFocus: { ...runFocus, startedAtCycle: runFocus.startedAtCycle ?? 1 } } : {}),
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

  const statDelta: StatDelta = {};
  for (const key of Object.keys(state.stats) as StatKey[]) {
    const delta = s.stats[key] - state.stats[key];
    if (delta !== 0) statDelta[key] = delta;
  }
  const profileDelta: ProfileDelta = {};
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
  const entityDelta: EntityDelta = {};
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

  let runFocus = s.runFocus;
  if (runFocus?.remainingCards !== undefined && card.category !== 'tutorial' && card.category !== 'restart') {
    const remainingCards = runFocus.remainingCards - 1;
    runFocus = remainingCards > 0 ? { ...runFocus, remainingCards } : undefined;
  }

  const advancedState = { ...s, totalChoices: s.totalChoices + 1, choiceInCycle: s.choiceInCycle + 1, rngStep: s.rngStep + 1, usedCardIds: [...s.usedCardIds, card.id], lastOutcomeText: outcomeText, history: [...s.history, record], tension: updateTension(s, card), freshMetaPools, activeContracts };
  if (runFocus) {
    s = { ...advancedState, runFocus };
  } else {
    const { runFocus: expiredFocus, ...withoutFocus } = advancedState;
    void expiredFocus;
    s = withoutFocus;
  }

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

const CYCLE_CENTER_DRIFT = 0.15;

function scheduleInterludeIfDue(state: CyklusRunState): CyklusRunState {
  if (state.cycle % 2 !== 0) return state;
  const tutorialDone = state.flags.includes('tutorial_v2_done') || state.flags.includes('tutorial_done') || state.usedCardIds.includes('tutorial_15_ready');
  if (!tutorialDone) return state;
  if (state.scheduledCards.some((sc) => sc.cardId.startsWith('tutorial_'))) return state;
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

// ── CYCLE CHAPTER NAMES ───────────────────────────────────────────────────────

// ── CARD POOL + SCORING (delegated to cyklusCardPicker) ───────────────────────

export function getCycleProgress(state: CyklusRunState): number {
  return (state.choiceInCycle / CHOICES_PER_CYCLE) * 100;
}

export function getCompletionStatus(state: CyklusRunState): 'playing' | 'dead' | 'completed' {
  return state.status;
}
