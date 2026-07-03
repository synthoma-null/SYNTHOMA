import type { CyklusRunState, CyklusRunSummary, CyklusTension, SwipeCard, CyklusEffect, CardCondition, StatKey, SectorId, ProfileKey, EntityId, RunEnding, CompletionResult, ProfileResult, CyklusChoiceRecord, ScheduledCardEntry } from './cyklusTypes';
import { STAT_LABELS, SECTOR_LABELS } from './cyklusTypes';
import { loadMetaUnlockPools } from './cyklusFindings';
import { CYKLUS_CARDS } from './cyklusCards';
import { CYKLUS_IMPRINTS } from './cyklusImprints';
import { CYKLUS_ITEMS } from './cyklusItems';
import { CYKLUS_UNLOCKS } from './cyklusUnlocks';

const CHOICES_PER_CYCLE = 12;
const MAX_DIFFICULTY = 5;

export function createCyklusRun(tutorialSeen = false): CyklusRunState {
  const now = Date.now();
  const seed = `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const startStats = { energy: 50, memory: 50, bond: 50, control: 50 };
  const { pools: unlockedPools, cards: unlockedCards } = loadMetaUnlockPools();
  const state: CyklusRunState = {
    id: `cyklus_${now}_${seed.slice(-6)}`,
    status: 'playing',
    cycle: 1,
    choiceInCycle: 1,
    totalChoices: 0,
    difficulty: 1,
    sector: 'void',
    visitedSectors: ['void'],
    stats: { ...startStats },
    profile: {},
    inventory: [],
    flags: [],
    imprints: [],
    scheduledCards: [],
    entityRelations: {},
    unlockedPools,
    unlockedCards,
    usedCardIds: [],
    currentCardId: tutorialSeen ? 'restart_0' : 'tutorial_stats',
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
  };
  return state;
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
      'Nový přístup. Nový problém. Klasický pořadí.',
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
    sectorBefore,
    sectorAfter: s.sector,
    ts: Date.now(),
  };

  // Compose outcome text: resultText + impactNarrative + crisis intervention (never stale lastOutcomeText)
  let outcomeText = outcome.resultText;
  const impactNarrative = composeImpactNarrative(record, card);
  if (impactNarrative) {
    outcomeText = outcomeText ? `${outcomeText}\n\n${impactNarrative}` : impactNarrative;
  }
  if (crisisResult.interventionText) {
    outcomeText = outcomeText ? `${outcomeText}\n\n${crisisResult.interventionText}` : crisisResult.interventionText;
  }

  s = { ...s, totalChoices: s.totalChoices + 1, choiceInCycle: s.choiceInCycle + 1, rngStep: s.rngStep + 1, usedCardIds: [...s.usedCardIds, card.id], lastOutcomeText: outcomeText, history: [...s.history, record], tension: updateTension(s, card) };

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

function processCycleEnd(state: CyklusRunState): CyklusRunState {
  let s = { ...state, cycle: state.cycle + 1, choiceInCycle: 1 };
  s = { ...s, difficulty: Math.min(MAX_DIFFICULTY, s.difficulty + 1) };
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
    lines.push('Subjekt souhlasil se vším. I s tím, co neslibovalo nic dobrého.');
  } else if (noCount > yesCount * 2) {
    lines.push('Subjekt odmítal konzistentně. Systém to eviduje jako politiku, ne charakter.');
  } else {
    lines.push(`Subjekt v cyklu ${cycleNum}x přijal a ${noCount}x odmítl. Bez jasné logiky. Nebo s logikou, kterou systém zatím nepochopil.`);
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
    patterns.push('casto prijima nezname predmety');
  }

  const helpRefused = h.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.tags.includes('tai') && r.direction === 'no';
  });
  if (helpRefused.length >= 2) {
    patterns.push('odmita primou pomoc');
  }

  const controlOverBond = (state.stats.control - state.stats.bond) > 20;
  if (controlOverBond) {
    patterns.push('preferuje kontrolu pred vazbou');
  }

  const bondOverControl = (state.stats.bond - state.stats.control) > 20;
  if (bondOverControl) {
    patterns.push('preferuje vazbu pred kontrolou');
  }

  const memoryHigh = state.stats.memory > 70;
  if (memoryHigh) {
    patterns.push('pamet otevira i za cenu energie');
  }

  const crisisYes = h.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.category === 'crisis' && r.direction === 'yes';
  });
  if (crisisYes.length >= 2) {
    patterns.push('v krizich voli stabilizaci, ne risk');
  }

  const archiveAffinity = (state.entityRelations.archive ?? 0) >= 3;
  if (archiveAffinity) {
    patterns.push('vykazuje afinitu k Archivu');
  }

  const sarkasmaNegative = (state.entityRelations.sarkasma ?? 0) < -2;
  if (sarkasmaNegative) {
    patterns.push('komplikovaný vztah se Sarkasou');
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

  const tensionScore = applyTensionScore(state, score, card);
  const tensionDelta = tensionScore - score;
  if (tensionDelta !== 0) reasons.push(`tension ${tensionDelta > 0 ? '+' : ''}${tensionDelta}`);
  score = tensionScore;

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
  const tutorialDone = state.flags.includes('tutorial_done') || state.usedCardIds.includes('tutorial_consequences');
  const hasPendingTutorial = state.scheduledCards.some((sc) => sc.cardId.startsWith('tutorial_'));
  const isOnTutorialCard = state.currentCardId.startsWith('tutorial_');
  const tutorialActive = !tutorialDone && (hasPendingTutorial || isOnTutorialCard);
  const nextRestart = tutorialActive ? null : getNextRestartCard(state);
  if (nextRestart) return nextRestart;

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

export function exportRunLog(state: CyklusRunState, mode: 'short' | 'full' = 'full'): string {
  const profile = computeProfile(state);
  const ending = computeEnding(state);
  const death = analyzeDeath(state);
  const codename = generateRunCodename(state);
  const sectors = [...new Set(state.visitedSectors)].map((s) => SECTOR_LABELS[s]).join(' → ');
  const near = getNearestExtreme(state.stats);

  if (mode === 'short') {
    const lines: string[] = [
      'SYNTHOMA: CYKLUS',
      `Kódové označení: ${codename}`,
      '────────────────────────────────────',
      `Konec: ${ending?.title ?? 'neznámý'}`,
      `Profil: ${profile.dominantLabel}-like · ${profile.archetype}`,
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
    `Profil: ${profile.dominantLabel}-like`,
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

  const behavior = composeBehavioralAnalysis(state);
  if (behavior.length > 0) {
    lines.push('Chování subjektu:');
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
  const item = significantItem ? ` se ${CODENAME_ITEM[significantItem]}` : '';
  const end = rng(CODENAME_ENDING[endType] ?? ['']);

  return `${adj} ${noun}${item}, ${end}`;
}
