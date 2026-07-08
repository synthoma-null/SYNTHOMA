import type { CyklusEffect, CyklusRunState, ScheduledCardEntry, SectorId } from './cyklusTypes';
import { CYKLUS_IMPRINTS, CYKLUS_ITEMS } from './content';
import { checkCondition } from './cyklusCardPicker';
import { clampRelation, clampStat } from './cyklusMath';
import { CYKLUS_UNLOCKS } from './cyklusUnlocks';

const CHOICES_PER_CYCLE = 12;

export function addFlag(state: CyklusRunState, flag: string): CyklusRunState {
  if (state.flags.includes(flag)) return state;
  return { ...state, flags: [...state.flags, flag] };
}

export function removeFlag(state: CyklusRunState, flag: string): CyklusRunState {
  return { ...state, flags: state.flags.filter((f) => f !== flag) };
}

export function addItem(state: CyklusRunState, itemId: string): CyklusRunState {
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

export function removeItem(state: CyklusRunState, itemId: string): CyklusRunState {
  return { ...state, inventory: state.inventory.filter((i) => i !== itemId) };
}

export function addImprint(state: CyklusRunState, imprintId: string): CyklusRunState {
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

export function unlockPool(state: CyklusRunState, poolId: string): CyklusRunState {
  if (state.unlockedPools.includes(poolId)) return state;
  return { ...state, unlockedPools: [...state.unlockedPools, poolId] };
}

export function unlockCard(state: CyklusRunState, cardId: string): CyklusRunState {
  if (state.unlockedCards.includes(cardId)) return state;
  return { ...state, unlockedCards: [...state.unlockedCards, cardId] };
}

export function moveSector(state: CyklusRunState, sectorId: SectorId): CyklusRunState {
  const visited = state.visitedSectors.includes(sectorId) ? state.visitedSectors : [...state.visitedSectors, sectorId];
  return { ...state, sector: sectorId, visitedSectors: visited };
}

export function scheduleCard(state: CyklusRunState, cardId: string, inTurns: number, entry?: Partial<ScheduledCardEntry>): CyklusRunState {
  const newEntry: ScheduledCardEntry = { cardId, turnsRemaining: inTurns, cycle: state.cycle, ...entry };
  return { ...state, scheduledCards: [...state.scheduledCards, newEntry] };
}

export function applySingleEffect(state: CyklusRunState, effect: CyklusEffect): CyklusRunState {
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
    case 'removeItem': return removeItem(state, effect.itemId);
    case 'schedule': return scheduleCard(state, effect.cardId, effect.inTurns);
    case 'scheduleNextCycle': return scheduleCard(state, effect.cardId, Math.max(1, CHOICES_PER_CYCLE - state.choiceInCycle + 1));
    case 'unlockPool': return unlockPool(state, effect.poolId);
    case 'unlockCard': return unlockCard(state, effect.cardId);
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

export function evaluateUnlocks(state: CyklusRunState): CyklusRunState {
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
