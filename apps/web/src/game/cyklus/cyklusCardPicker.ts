import type { CyklusRunState, SwipeCard, CyklusTension, StatKey, CardCondition, SectorId } from './cyklusTypes';
import { CYKLUS_CARDS } from './content';
import { cardMatchesUnlockedPool } from './cyklusPoolCatalog';
import { explainItemMoodScore, getPocketMoodProfile } from './cyklusItemMood';
import { loadStoryProgression, getStoryDirective, applyStoryScore } from './cyklusStory';
import { loadMetaUnlockPools, loadFreshMetaPools } from './cyklusFindings';
import { seededRandom } from './cyklusRandom';
import { PROFILE_PROTOCOLS, CRAFTED_ARTIFACTS } from './cyklusProgression';

const TOP_CANDIDATES = 8;

const BASIC_SCENE_CATEGORIES = new Set(['system', 'choice', 'memory', 'silent', 'object']);
const BASIC_SCENE_EXCLUDE_TAGS = new Set(['crisis', 'danger', 'followup', 'item_trigger', 'restart', 'tutorial', 'trap']);

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

export function hasItem(state: CyklusRunState, itemId: string): boolean {
  return state.inventory.includes(itemId);
}

export function hasFlag(state: CyklusRunState, flag: string): boolean {
  return state.flags.includes(flag);
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

export function isCrisisCard(card: SwipeCard): boolean {
  return card.category === 'crisis' || card.tags.includes('crisis') || card.tags.includes('danger');
}

export function isItemTrigger(card: SwipeCard): boolean {
  return card.category === 'item_trigger' || card.tags.includes('item_trigger');
}

export function isFollowup(card: SwipeCard): boolean {
  return card.category === 'followup' || card.tags.includes('followup');
}

export function isRestartCard(card: SwipeCard): boolean {
  return card.category === 'restart';
}

export function isBasicSceneCard(card: SwipeCard): boolean {
  if (!BASIC_SCENE_CATEGORIES.has(card.category)) return false;
  if (card.tags.some((t) => BASIC_SCENE_EXCLUDE_TAGS.has(t))) return false;
  return true;
}

export function cardWouldIncreaseStat(card: SwipeCard, stat: StatKey): boolean {
  return [...card.yes.effects, ...card.no.effects].some(
    (e) => e.type === 'stat' && e.key === stat && e.amount > 0,
  );
}

export function cardWouldDecreaseStat(card: SwipeCard, stat: StatKey): boolean {
  return [...card.yes.effects, ...card.no.effects].some(
    (e) => e.type === 'stat' && e.key === stat && e.amount < 0,
  );
}

export function isFreshMetaPoolCard(state: CyklusRunState, card: SwipeCard): boolean {
  if (!state.freshMetaPools || state.freshMetaPools.length === 0) return false;
  return card.conditions?.some(
    (cond) => cond.type === 'unlockedPool' && state.freshMetaPools.includes(cond.poolId ?? ''),
  ) ?? false;
}

export function cardMatchesCurrentSector(state: CyklusRunState, card: SwipeCard): boolean {
  if (card.sector === state.sector) return true;
  if (card.conditions?.some((c) => c.type === 'sector' && c.sector === state.sector)) return true;
  if (card.tags.includes(state.sector)) return true;
  const sectorTags = SECTOR_TAG_MAP[state.sector] ?? [];
  return sectorTags.some((tag) => card.tags.includes(tag));
}

export function getReadyScheduledCards(state: CyklusRunState): string[] {
  return state.scheduledCards
    .filter((entry) => entry.turnsRemaining <= 0)
    .map((entry) => entry.cardId);
}

export function filterReadyScheduledCards(state: CyklusRunState): CyklusRunState['scheduledCards'] {
  return state.scheduledCards.filter((entry) => {
    if (entry.turnsRemaining > 0) return true;
    const card = CYKLUS_CARDS[entry.cardId];
    if (!card) return false;
    const conditionsOk = checkCardConditions(state, card);
    if (conditionsOk) return true;
    const strategy = entry.ifInvalid ?? card.ifInvalid ?? 'drop';
    if (strategy === 'force') return true;
    return false;
  });
}

export function refreshScheduledCards(state: CyklusRunState): CyklusRunState['scheduledCards'] {
  return state.scheduledCards.map((entry) => {
    if (entry.turnsRemaining > 0) return entry;
    const card = CYKLUS_CARDS[entry.cardId];
    if (!card) return entry;
    const conditionsOk = checkCardConditions(state, card);
    if (conditionsOk) return entry;
    const strategy = entry.ifInvalid ?? card.ifInvalid ?? 'drop';
    if (strategy === 'delay') return { ...entry, turnsRemaining: 3 };
    return entry;
  });
}

export function clearScheduledCard(state: CyklusRunState, cardId: string): CyklusRunState {
  let removed = false;
  return {
    ...state,
    scheduledCards: state.scheduledCards.filter((entry) => {
      if (removed) return true;
      if (entry.cardId === cardId) {
        removed = true;
        return false;
      }
      return true;
    }),
  };
}

function turnsSinceLastUsed(state: CyklusRunState, cardId: string): number | null {
  const lastIndex = state.usedCardIds.lastIndexOf(cardId);
  if (lastIndex === -1) return null;
  return state.usedCardIds.length - 1 - lastIndex;
}

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
  if (state.unlockedPools.some((poolId) => cardMatchesUnlockedPool(card, poolId))) {
    score += 200; reasons.push('unlocked pool alias +200');
  }
  const itemMoodScore = explainItemMoodScore(state, card);
  if (itemMoodScore.score !== 0) {
    score += itemMoodScore.score;
    reasons.push(...itemMoodScore.reasons);
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

export function getTopScoredCards(state: CyklusRunState, count = 5): CardScoreBreakdown[] {
  const pool = getCardPool(state);
  return pool
    .map((card) => explainCardScore(state, card))
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
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

  if (flags.includes('pocket_listener_active')) {
    if (card.tags.includes('pocket') || card.tags.includes('object') || isItemTrigger(card)) s += 35;
  }

  if (flags.includes('pocket_resonance_tuner_active')) {
    if (card.category === 'followup' || isItemTrigger(card) || card.tags.includes('item_trigger')) s += 55;
  }

  if (flags.includes('pocket_mediator_active')) {
    if (card.tags.includes('stabilize') || card.tags.includes('boundary') || card.tags.includes('care')) s += 45;
    if (isCrisisCard(card) && state.inventory.length >= 3) s -= 35;
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
    pocket_shrine_mood_reader_active: { tags: ['pocket', 'object', 'item_trigger'], bonus: 35 },
    pocket_shrine_resonance_tuning_active: { tags: ['item_trigger', 'followup', 'glitch'], bonus: 45 },
    pocket_shrine_argument_mediator_active: { tags: ['stabilize', 'boundary', 'care'], bonus: 55 },
    seal_stamp_charm_active: { tags: ['seal', 'form', 'crisis', 'bond'], bonus: 45 },
    pocket_weather_vane_active: { tags: ['path', 'glitch', 'noise'], bonus: 45 },
    named_resonance_thread_active: { tags: ['name', 'identity', 'soft_bug', 'token'], bonus: 45 },
    boundary_clip_active: { tags: ['boundary', 'shadow', 'market'], bonus: 45 },
    archive_pocket_index_active: { tags: ['archive', 'memory', 'index'], bonus: 45 },
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
  if (flags.includes('pocket_listener_active') && state.inventory.length > 0 && (card.tags.includes('pocket') || card.tags.includes('object') || card.tags.includes('item_trigger'))) {
    const ambient = getPocketMoodProfile(state).ambientText;
    if (ambient) extras.push(`Kapsa: ${ambient}`);
  }
  if (flags.includes('pocket_resonance_tuner_active') && (card.category === 'followup' || card.tags.includes('item_trigger'))) {
    extras.push('Ladička kapsy: předmět si přitahuje vlastní následky.');
  }
  if (flags.includes('pocket_mediator_active') && (card.tags.includes('stabilize') || card.tags.includes('boundary'))) {
    extras.push('Mediátor kapsy: hádka předmětů má méně ostré hrany.');
  }
  if (flags.includes('pocket_shrine_mood_reader_active') && state.inventory.length > 0) {
    extras.push('Kapesní oltář: nálady předmětů jsou čitelnější.');
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
