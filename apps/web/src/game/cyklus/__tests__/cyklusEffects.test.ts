import { applySingleEffect } from '../cyklusEffects';
import type { CyklusRunState } from '../cyklusTypes';

function makeState(overrides: Partial<CyklusRunState> = {}): CyklusRunState {
  return {
    id: 'effects-test-run',
    status: 'playing',
    cycle: 1,
    choiceInCycle: 1,
    totalChoices: 0,
    difficulty: 1,
    sector: 'void',
    visitedSectors: ['void'],
    stats: { energy: 50, memory: 50, bond: 50, control: 50 },
    profile: {},
    inventory: [],
    flags: [],
    imprints: [],
    scheduledCards: [],
    entityRelations: {},
    unlockedPools: [],
    unlockedCards: [],
    usedCardIds: [],
    currentCardId: 'first_boot',
    cycleSummaries: [],
    history: [],
    startedAt: 1,
    updatedAt: 1,
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
    seed: 'effects-test-seed',
    rngStep: 0,
    freshMetaPools: [],
    modifier: { id: 'none', title: 'None', description: 'No modifier.', tags: [] },
    goals: [],
    lastItemActivationCycle: 0,
    itemActivationCount: 0,
    itemActivationCountThisCycle: 0,
    activeContracts: [],
    preRunWarning: null,
    preRunChoice: null,
    ...overrides,
  };
}

describe('cyklusEffects', () => {
  it('stat effect clamps values to 0-100', () => {
    const high = applySingleEffect(makeState(), { type: 'stat', key: 'energy', amount: 80 });
    const low = applySingleEffect(makeState(), { type: 'stat', key: 'memory', amount: -80 });

    expect(high.stats.energy).toBe(100);
    expect(low.stats.memory).toBe(0);
  });

  it('item effect does not add a duplicate item', () => {
    const state = makeState({ inventory: ['rubber_seal'] });
    const next = applySingleEffect(state, { type: 'item', itemId: 'rubber_seal' });

    expect(next.inventory).toEqual(['rubber_seal']);
  });

  it('removeItem removes only the requested item', () => {
    const state = makeState({ inventory: ['rubber_seal', 'acid_filter', 'archive_key'] });
    const next = applySingleEffect(state, { type: 'removeItem', itemId: 'acid_filter' });

    expect(next.inventory).toEqual(['rubber_seal', 'archive_key']);
  });

  it('flag effect does not add a duplicate flag', () => {
    const state = makeState({ flags: ['rubber_seal_ready'] });
    const next = applySingleEffect(state, { type: 'flag', flag: 'rubber_seal_ready' });

    expect(next.flags).toEqual(['rubber_seal_ready']);
  });

  it('removeFlag removes only the requested flag', () => {
    const state = makeState({ flags: ['rubber_seal_ready', 'acid_filter_burned', 'archive_key_used'] });
    const next = applySingleEffect(state, { type: 'removeFlag', flag: 'acid_filter_burned' });

    expect(next.flags).toEqual(['rubber_seal_ready', 'archive_key_used']);
  });

  it('imprint effect does not add a duplicate imprint', () => {
    const state = makeState({ imprints: ['mirror_crack'] });
    const next = applySingleEffect(state, { type: 'imprint', imprintId: 'mirror_crack' });

    expect(next.imprints).toEqual(['mirror_crack']);
  });

  it('unlockPool does not add a duplicate pool', () => {
    const state = makeState({ unlockedPools: ['archive_pool'] });
    const next = applySingleEffect(state, { type: 'unlockPool', poolId: 'archive_pool' });

    expect(next.unlockedPools).toEqual(['archive_pool']);
  });

  it('moveSector updates sector and visitedSectors without duplicates', () => {
    const moved = applySingleEffect(makeState(), { type: 'moveSector', sectorId: 'archive' });
    const repeated = applySingleEffect(moved, { type: 'moveSector', sectorId: 'archive' });

    expect(moved.sector).toBe('archive');
    expect(moved.visitedSectors).toEqual(['void', 'archive']);
    expect(repeated.visitedSectors).toEqual(['void', 'archive']);
  });

  it('entityRelation adds the delta to the current relation', () => {
    const state = makeState({ entityRelations: { glitchka: 2 } });
    const next = applySingleEffect(state, { type: 'entityRelation', entity: 'glitchka', delta: 3 });

    expect(next.entityRelations.glitchka).toBe(5);
  });

  it('schedule effect adds a scheduled card with the requested inTurns', () => {
    const state = makeState({ cycle: 2 });
    const next = applySingleEffect(state, { type: 'schedule', cardId: 'mirror_shard_hums', inTurns: 3 });

    expect(next.scheduledCards).toEqual([{ cardId: 'mirror_shard_hums', turnsRemaining: 3, cycle: 2 }]);
  });
});
