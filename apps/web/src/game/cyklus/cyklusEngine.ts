import type { CyklusRunState, CyklusRunSummary, CyklusTension, SwipeCard, CyklusEffect, CardCondition, StatKey, SectorId, ProfileKey, EntityId, RunEnding, CompletionResult, ProfileResult, CyklusChoiceRecord } from './cyklusTypes';
import { STAT_LABELS, SECTOR_LABELS } from './cyklusTypes';
import { CYKLUS_CARDS } from './cyklusCards';
import { CYKLUS_IMPRINTS } from './cyklusImprints';
import { CYKLUS_ITEMS } from './cyklusItems';
import { CYKLUS_UNLOCKS } from './cyklusUnlocks';

const CHOICES_PER_CYCLE = 12;
const MAX_DIFFICULTY = 5;

export function createCyklusRun(): CyklusRunState {
  const now = Date.now();
  const startStats = { energy: 50, memory: 50, bond: 50, control: 50 };
  const state: CyklusRunState = {
    id: `cyklus_${now}_${Math.random().toString(36).slice(2, 8)}`,
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
    unlockedPools: [],
    usedCardIds: [],
    currentCardId: 'restart_0',
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
    case 'statBelow': return condition.stat ? state.stats[condition.stat] < (condition.value ?? 50) : false;
    case 'statAbove': return condition.stat ? state.stats[condition.stat] > (condition.value ?? 50) : false;
    case 'sector': return condition.sector ? state.sector === condition.sector : false;
    case 'cycleAtLeast': return state.cycle >= (condition.cycle ?? 1);
    case 'difficultyAtLeast': return state.difficulty >= (condition.difficulty ?? 1);
    case 'unlockedPool': return condition.poolId ? state.unlockedPools.includes(condition.poolId) : false;
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

function scheduleCard(state: CyklusRunState, cardId: string, inTurns: number): CyklusRunState {
  return { ...state, scheduledCards: [...state.scheduledCards, { cardId, turnsRemaining: inTurns, cycle: state.cycle }] };
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
    case 'unlockCard': return unlockPool(state, `card_${effect.cardId}`);
    case 'moveSector': return moveSector(state, effect.sectorId);
    case 'entityRelation': {
      const relations = state.entityRelations ?? {};
      const entityRelations = { ...relations, [effect.entity]: (relations[effect.entity] ?? 0) + effect.delta };
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

function applyCrisisItems(state: CyklusRunState): CyklusRunState {
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
    interventions.push('LOG [ACID_FILTER_BURNED]\n\nFiltr zachytil přepětí. Pak se roztekl způsobem, který by výrobce určitě označil jako „očekávané opotřebení“.');
  }

  // Archive key: memory extremes
  if (s.inventory.includes('archive_key') && (s.stats.memory <= 0 || s.stats.memory >= 100)) {
    const newMemory = s.stats.memory <= 0 ? 15 : 85;
    s = { ...s, stats: { ...s.stats, memory: newMemory }, inventory: s.inventory.filter((i) => i !== 'archive_key'), flags: [...s.flags, 'archive_key_used'] };
    s = moveSector(s, 'archive');
    interventions.push('LOG [ARCHIVE_KEY]\n\nArchivní klíč se otočil sám. Dveře, které předstíraly, že nejsou dveře, se otevřely. Paměť byla evakuována.');
  }

  if (interventions.length > 0) {
    s = { ...s, lastOutcomeText: interventions.join('\n\n───\n\n') };
  }
  return s;
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
  s = applyCrisisItems(s);

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
  const flagsGained: string[] = [];
  const itemsGained: string[] = [];
  for (const effect of outcome.effects) {
    if (effect.type === 'flag' && !state.flags.includes(effect.flag)) flagsGained.push(effect.flag);
    if (effect.type === 'item' && !state.inventory.includes(effect.itemId)) itemsGained.push(effect.itemId);
  }

  const record = {
    turn: state.totalChoices + 1,
    cycle: state.cycle,
    cardId: card.id,
    direction,
    statDelta,
    profileDelta,
    flagsGained,
    itemsGained,
    sectorBefore,
    sectorAfter: s.sector,
    ts: Date.now(),
  };
  // Compose narrative impact text that actually relates to the choice
  const impactNarrative = composeImpactNarrative(record, card);
  let outcomeText = outcome.resultText;
  if (impactNarrative) {
    outcomeText = outcomeText ? `${outcome.resultText}\n\n${impactNarrative}` : impactNarrative;
  }
  // Crisis text takes precedence over normal outcome text
  outcomeText = s.lastOutcomeText || outcomeText;
  s = { ...s, totalChoices: s.totalChoices + 1, choiceInCycle: s.choiceInCycle + 1, usedCardIds: [...s.usedCardIds, card.id], lastOutcomeText: outcomeText, history: [...s.history, record], tension: updateTension(s, card) };

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

  // Decrement scheduled cards and pick next card
  s = tickScheduledCards(s);
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

function processCycleEnd(state: CyklusRunState): CyklusRunState {
  let s = { ...state, cycle: state.cycle + 1, choiceInCycle: 1 };
  s = { ...s, difficulty: Math.min(MAX_DIFFICULTY, s.difficulty + 1) };
  // Add imprint based on dominant stat
  const dominantStat = getDominantStat(s);
  const imprintMap: Record<StatKey, string> = {
    energy: 'acid_echo',
    memory: 'archive_scent',
    bond: 'unfinished_conversation',
    control: 'rubber_stamp',
  };
  if (imprintMap[dominantStat]) {
    s = addImprint(s, imprintMap[dominantStat]);
  }
  // Reset stats slightly toward center
  for (const key of Object.keys(s.stats) as StatKey[]) {
    const center = 50;
    const drift = Math.round((center - s.stats[key]) * 0.15);
    s = { ...s, stats: { ...s.stats, [key]: clampStat(s.stats[key] + drift) } };
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

export function computeProfile(state: CyklusRunState): ProfileResult {
  const p = state.profile;
  const ei = (p.E ?? 0) >= (p.I ?? 0) ? 'E' : 'I';
  const sn = (p.S ?? 0) >= (p.N ?? 0) ? 'S' : 'N';
  const tf = (p.T ?? 0) >= (p.F ?? 0) ? 'T' : 'F';
  const jp = (p.J ?? 0) >= (p.P ?? 0) ? 'J' : 'P';
  const type = `${ei}${sn}${tf}${jp}`;
  const functions: { key: ProfileKey; score: number }[] = [
    { key: 'Ni' as ProfileKey, score: p.Ni ?? 0 }, { key: 'Ne' as ProfileKey, score: p.Ne ?? 0 },
    { key: 'Si' as ProfileKey, score: p.Si ?? 0 }, { key: 'Se' as ProfileKey, score: p.Se ?? 0 },
    { key: 'Ti' as ProfileKey, score: p.Ti ?? 0 }, { key: 'Te' as ProfileKey, score: p.Te ?? 0 },
    { key: 'Fi' as ProfileKey, score: p.Fi ?? 0 }, { key: 'Fe' as ProfileKey, score: p.Fe ?? 0 },
  ].sort((a, b) => b.score - a.score);
  const dominant = functions[0]?.key ?? 'Ni';
  const shadow = functions[functions.length - 1]?.key ?? 'Se';
  const total = state.history.length;
  const extremes = Object.values(state.stats).some((v) => v < 15 || v > 85) ? 0 : 10;
  const stability = Math.max(0, Math.min(100, 50 - Math.abs((p.I ?? 0) - (p.E ?? 0)) - Math.abs((p.J ?? 0) - (p.P ?? 0)) + extremes));
  const archetypes: Record<string, string> = {
    INFJ: 'Prorok v mlze', INFP: 'Archivář citu', INTJ: 'Tichý architekt', INTP: 'Schéma ve tmě',
    ENFJ: 'Most mezi světy', ENFP: 'Rozbíječ forem', ENTJ: 'Velitel restartu', ENTP: 'Nepřítel protokolu',
    ISFJ: 'Strážce ztracených řádů', ISFP: 'Tichý tvůrce zázraků', ISTJ: 'Pevný záznam', ISTP: 'Samoúčelný nástroj',
    ESFJ: 'Slunečné rozhraní', ESFP: 'Divoký signál', ESTJ: 'Ředitel systému', ESTP: 'Adrenalinový kabel',
  };
  return { dominantLabel: type, dominantFunction: dominant, shadowFunction: shadow, stability, archetype: archetypes[type] ?? 'Neklasifikovatelný subjekt' };
}

export function getCardPool(state: CyklusRunState): SwipeCard[] {
  return Object.values(CYKLUS_CARDS).filter((card) => {
    if (isRestartCard(card)) return false; // restarts handled separately
    if (card.once && state.usedCardIds.includes(card.id)) return false;
    if (card.cooldown && state.usedCardIds.filter((id) => id === card.id).length >= card.cooldown) return false;
    return true;
  });
}

export function scoreCard(state: CyklusRunState, card: SwipeCard): number {
  let score = 0;
  if (!checkCardConditions(state, card)) return 0;

  // Scheduled ready
  if (getReadyScheduledCards(state).includes(card.id)) score += 1000;

  // Crisis
  if (isCrisisCard(card)) score += 500;

  // Item triggers
  if (isItemTrigger(card)) score += 400;

  // Follow-ups with conditions
  if (isFollowup(card) && card.conditions) score += 300;

  // Sector match
  if (isSectorCard(card) && card.sector === state.sector) score += 250;

  // Unlocked pool tags
  if (state.unlockedPools.some((poolId) => card.tags.includes(poolId) || card.tags.includes(poolId.replace('_pool', '')))) score += 200;

  // Difficulty gating
  score += (card.rarity === 'common' ? 20 : card.rarity === 'uncommon' ? 35 : card.rarity === 'rare' ? 50 : 60);

  // Profile affinity (small bonus)
  const profile = state.profile;
  if (card.tags.includes('memory') && ((profile.N ?? 0) > (profile.S ?? 0))) score += 10;
  if (card.tags.includes('system') && ((profile.J ?? 0) > (profile.P ?? 0))) score += 10;
  if (card.tags.includes('bond') && ((profile.F ?? 0) > (profile.T ?? 0))) score += 10;
  if (card.tags.includes('chaos') && ((profile.P ?? 0) > (profile.J ?? 0))) score += 10;

  // Avoid repeating the same card too soon
  const lastUsedId = state.usedCardIds[state.usedCardIds.length - 1];
  if (lastUsedId === card.id) return 0; // hard block immediate repeat
  const recentIndex = state.usedCardIds.slice(-8).lastIndexOf(card.id);
  if (recentIndex !== -1) {
    const distance = state.usedCardIds.length - (state.usedCardIds.length - 8 + recentIndex);
    if (distance <= 2) score -= 800;
    else if (distance <= 4) score -= 400;
    else score -= 150;
  }

  // Tension director adjusts pacing
  score = applyTensionScore(state, score, card);

  return score;
}

function getNextRestartCard(state: CyklusRunState): SwipeCard | null {
  const restartIds = state.usedCardIds.filter((id) => id.startsWith('restart_'));
  if (restartIds.length === 0) return CYKLUS_CARDS.restart_0 ?? null;
  const last = restartIds.sort().pop() ?? 'restart_0';
  const nextNum = Number.parseInt(last.split('_')[1] ?? '0', 10) + 1;
  const nextId = `restart_${nextNum}`;
  return (CYKLUS_CARDS[nextId] as SwipeCard | undefined) ?? null;
}

function weightedPick<T>(candidates: { item: T; weight: number }[]): T | null {
  const total = candidates.reduce((sum, c) => sum + c.weight, 0);
  if (total <= 0) return candidates[0]?.item ?? null;
  let roll = Math.random() * total;
  for (const c of candidates) {
    roll -= c.weight;
    if (roll <= 0) return c.item;
  }
  return candidates[candidates.length - 1]?.item ?? null;
}

const TOP_CANDIDATES = 8;

export function pickNextCard(state: CyklusRunState): SwipeCard {
  const nextRestart = getNextRestartCard(state);
  if (nextRestart) return nextRestart;

  const pool = getCardPool(state);
  const scored = pool.map((card) => ({ card, score: scoreCard(state, card) })).filter((entry) => entry.score > 0);
  if (scored.length === 0) {
    // Fallback to any valid card, excluding the immediately previous one
    const lastId = state.usedCardIds[state.usedCardIds.length - 1];
    const fallback = pool.find((c) => checkCardConditions(state, c) && c.id !== lastId) ?? pool.find((c) => c.id !== lastId) ?? CYKLUS_CARDS.first_boot!;
    return fallback;
  }

  // Scheduled cards still have absolute priority via score; if one is ready, it almost always wins.
  const readyScheduled = getReadyScheduledCards(state);
  const hasScheduled = scored.some((entry) => readyScheduled.includes(entry.card.id));
  if (hasScheduled) {
    // Keep only scheduled-ready cards among the top candidates so they are guaranteed to appear.
    const scheduledTop = scored.filter((entry) => readyScheduled.includes(entry.card.id));
    const picked = weightedPick(scheduledTop.map((entry) => ({ item: entry.card, weight: entry.score })));
    if (picked) return picked;
  }

  const top = scored.sort((a, b) => b.score - a.score).slice(0, TOP_CANDIDATES);
  const picked = weightedPick(top.map((entry) => ({ item: entry.card, weight: entry.score })));
  return picked ?? top[0]?.card ?? CYKLUS_CARDS.first_boot!;
}

export function pickNextCardState(state: CyklusRunState): CyklusRunState {
  if (state.status !== 'playing') return state;
  const next = pickNextCard(state);
  const readyScheduled = getReadyScheduledCards(state);
  const wasScheduled = readyScheduled.includes(next.id);
  const s = wasScheduled ? clearScheduledCard(state, next.id) : state;
  return { ...s, currentCardId: next.id };
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
  return {
    id: state.id,
    endedAt: Date.now(),
    status: state.status === 'completed' ? 'completed' : 'dead',
    endingTitle,
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
  const sameSector = card.sector === state.sector;

  return {
    calmStreak: isCalm ? t.calmStreak + 1 : 0,
    crisisStreak: cardIsCrisis ? t.crisisStreak + 1 : 0,
    itemTriggerStreak: cardIsItemTrigger ? t.itemTriggerStreak + 1 : 0,
    sameSectorStreak: sameSector ? t.sameSectorStreak + 1 : 0,
    rewardStreak: hasReward ? 0 : t.rewardStreak + 1,
    entityStreak: hasEntity || hasEntityEffect ? 0 : t.entityStreak + 1,
    lastRewardAt: hasReward ? state.totalChoices : t.lastRewardAt,
    lastEntityAt: hasEntity || hasEntityEffect ? state.totalChoices : t.lastEntityAt,
  };
}

function applyTensionScore(state: CyklusRunState, score: number, card: SwipeCard): number {
  const t = state.tension;
  let s = score;
  if (t.calmStreak >= 3 && (card.tags.includes('chaos') || card.tags.includes('glitch') || card.tags.includes('noise') || card.tags.includes('anomaly') || card.category === 'crisis')) {
    s += 120;
  }
  if (t.crisisStreak >= 2 && (card.tags.includes('calm') || card.tags.includes('stabilize') || card.tags.includes('system') || card.tags.includes('archive'))) {
    s += 150;
  }
  if (t.sameSectorStreak >= 3 && (isSectorCard(card) || card.tags.includes('path'))) {
    s += 140;
  }
  if (t.entityStreak >= 4 && (card.tags.includes('sarkasma') || card.tags.includes('glitchka') || card.tags.includes('tai') || card.tags.includes('archive'))) {
    s += 130;
  }
  if (t.rewardStreak >= 5 && (card.tags.includes('reward') || card.tags.includes('item_trigger') || card.tags.includes('item'))) {
    s += 110;
  }
  return s;
}

