import {
  computeRunRewards,
  awardRunRewards,
  purchaseUpgrade,
  equipUpgrade,
  unequipUpgrade,
  setActiveScar,
  applyProgressionToNewRun,
  SUBJECT_UPGRADES,
  SUBJECT_SCARS,
  MAX_EQUIPPED_UPGRADES,
  loadSubjectProgression,
  saveSubjectProgression,
  getEmptyProgression,
  upgradeVoidRoom,
  getVoidRoomState,
  applyVoidRoomsToNewRun,
  updateProfileMasteryFromRun,
  purchaseProtocol,
  equipProtocol,
  unequipProtocol,
  canCraftRecipe,
  craftRecipe,
  equipArtifact,
  unequipArtifact,
  applyCraftedArtifactsToNewRun,
  getLoadoutLimits,
  PROFILE_PROTOCOLS,
  CRAFT_RECIPES,
  CRAFTED_ARTIFACTS,
  VOID_ROOMS,
  type MetaCurrencyId,
  type CraftMaterialId,
  type VoidRoomId,
} from '../cyklusProgression';
import { createCyklusRun } from '../cyklusEngine';
import type { CyklusRunState } from '../cyklusTypes';
import type { CyklusDiscovery } from '../cyklusDiscovery';

describe('cyklus progression', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function mockProgression(currencies: Partial<Record<MetaCurrencyId, number>> = {}, purchased: string[] = []) {
    const progression = {
      ...getEmptyProgression(),
      currencies,
      purchasedUpgrades: purchased,
      equippedUpgrades: purchased.slice(0, MAX_EQUIPPED_UPGRADES),
    };
    saveSubjectProgression(progression);
    return progression;
  }

  it('computeRunRewards returns residuum for survived cycles', () => {
    const state = createCyklusRun(true);
    state.cycle = 3;
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const reward = computeRunRewards(state, discovery);
    expect(reward.currencies.residuum).toBe(9);
    expect(reward.reasons).toContain('Přežité cykly: +9');
  });

  it('death by memory gives memoryResidue', () => {
    const state = createCyklusRun(true);
    state.status = 'dead';
    state.stats = { energy: 50, memory: 0, bond: 50, control: 50 };
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const reward = computeRunRewards(state, discovery);
    expect(reward.currencies.memoryResidue).toBe(1);
    expect(reward.reasons.some((r) => r.includes('Paměťová sraženina'))).toBe(true);
  });

  it('completed run gives stabilizationCore', () => {
    const state = createCyklusRun(true);
    state.status = 'completed';
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const reward = computeRunRewards(state, discovery);
    expect(reward.currencies.stabilizationCore).toBe(1);
    expect(reward.currencies.residuum).toBe(23);
  });

  it('purchaseUpgrade subtracts currency', () => {
    mockProgression({ residuum: 30 });
    const ok = purchaseUpgrade('inner_pocket');
    expect(ok).toBe(true);
    const p = loadSubjectProgression();
    expect(p.currencies.residuum).toBe(0);
    expect(p.purchasedUpgrades).toContain('inner_pocket');
    expect(p.equippedUpgrades).toContain('inner_pocket');
  });

  it('purchaseUpgrade fails without enough currency', () => {
    mockProgression({ residuum: 5 });
    const ok = purchaseUpgrade('inner_pocket');
    expect(ok).toBe(false);
    const p = loadSubjectProgression();
    expect(p.purchasedUpgrades).not.toContain('inner_pocket');
  });

  it('equipUpgrade respects slot limit', () => {
    mockProgression({ residuum: 200 }, ['black_box', 'goal_reroll', 'inventory_instinct']);
    const equipped = loadSubjectProgression().equippedUpgrades;
    expect(equipped.length).toBeLessThanOrEqual(MAX_EQUIPPED_UPGRADES);
    const ok = equipUpgrade('inner_pocket');
    expect(ok).toBe(false);
  });

  it('unequipUpgrade frees a slot', () => {
    mockProgression({ residuum: 200 }, ['black_box', 'goal_reroll', 'inventory_instinct']);
    const before = loadSubjectProgression().equippedUpgrades.length;
    const ok = unequipUpgrade('black_box');
    expect(ok).toBe(true);
    const after = loadSubjectProgression().equippedUpgrades.length;
    expect(after).toBe(before - 1);
  });

  it('activeScar is applied only when progression has activeScar', () => {
    const state = createCyklusRun(true);
    const progression = getEmptyProgression();
    const result = applyProgressionToNewRun(state, progression);
    expect(result.flags).not.toContain('memory_scar_active');
    progression.activeScar = 'memory_scar';
    const scarred = applyProgressionToNewRun(state, progression);
    expect(scarred.flags).toContain('memory_scar_active');
    expect(scarred.stats.memory).toBe(55);
    expect(scarred.stats.energy).toBe(45);
  });

  it('applyProgressionToNewRun adds equipped upgrade effects', () => {
    const state = createCyklusRun(true);
    const progression = getEmptyProgression();
    progression.equippedUpgrades = ['inner_pocket'];
    const result = applyProgressionToNewRun(state, progression);
    expect(result.inventory.length).toBe(1);
    expect(result.flags).toContain('inner_pocket_active');
  });

  it('applyProgressionToNewRun adds resonance imprint when available', () => {
    const state = createCyklusRun(true);
    const progression = getEmptyProgression();
    progression.equippedUpgrades = ['resonance_slot'];
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') {
        return JSON.stringify({ cards: [], sectors: [], items: [], imprints: ['unfinished_conversation'], endings: [], variants: [], findings: [] });
      }
      return null;
    });
    const result = applyProgressionToNewRun(state, progression);
    expect(result.imprints).toContain('unfinished_conversation');
    expect(result.flags).toContain('resonance_slot_active');
    spy.mockRestore();
  });

  it('no upgrade gives a permanent raw stat boost without drawback', () => {
    const upgrades = Object.values(SUBJECT_UPGRADES);
    const bad = upgrades.filter((u) => {
      const text = `${u.description} ${u.drawback ?? ''}`.toLowerCase();
      const hasPureBoost = u.category === 'boot' && !u.drawback && text.includes('start');
      return hasPureBoost;
    });
    expect(bad).toHaveLength(0);
  });

  it('reward screen data is generatable for death and completed runs', () => {
    const dead = createCyklusRun(true);
    dead.status = 'dead';
    dead.stats = { energy: 50, memory: 0, bond: 50, control: 50 };
    const completed = createCyklusRun(true);
    completed.status = 'completed';
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const deathReward = computeRunRewards(dead, discovery);
    const completedReward = computeRunRewards(completed, discovery);
    expect(deathReward.reasons.length).toBeGreaterThan(0);
    expect(completedReward.reasons.length).toBeGreaterThan(0);
    expect(deathReward.currencies.residuum).toBeGreaterThanOrEqual(0);
    expect(completedReward.currencies.residuum).toBeGreaterThanOrEqual(0);
  });

  it('awardRunRewards persists currencies and unlocks', () => {
    mockProgression({ residuum: 10 });
    const reward = {
      currencies: { residuum: 7, stabilizationCore: 1 },
      unlockedUpgrades: ['black_box'],
      unlockedScars: ['memory_scar'],
      newTitles: [],
      reasons: ['test'],
      craftingMaterials: {},
      unlockedRecipes: [],
      profileMastery: {},
      voidRoomHints: [],
      recommendedActions: [],
      deathStat: undefined,
    };
    awardRunRewards(reward);
    const p = loadSubjectProgression();
    expect(p.currencies.residuum).toBe(17);
    expect(p.currencies.stabilizationCore).toBe(1);
    expect(p.purchasedUpgrades).toContain('black_box');
    expect(p.unlockedScars).toContain('memory_scar');
  });

  it('all scars are defined with balanced start stats', () => {
    Object.values(SUBJECT_SCARS).forEach((scar) => {
      expect(scar.startBonus).toBeLessThanOrEqual(5);
      expect(scar.startPenalty).toBeLessThanOrEqual(5);
      expect(scar.stat).not.toBe(scar.startPenaltyStat);
    });
  });

  it('old progression save migrates to new structure', () => {
    const old = {
      currencies: { residuum: 5 },
      purchasedUpgrades: ['black_box'],
      equippedUpgrades: ['black_box'],
      unlockedScars: [],
      entityReputation: { glitchka: 1 },
      discoveredUpgradeHints: [],
    };
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_progression_v1') return JSON.stringify(old);
      return null;
    });
    const p = loadSubjectProgression();
    expect(p.profileMastery).toBeDefined();
    expect(p.voidRooms).toBeDefined();
    expect(p.craftingInventory).toBeDefined();
    expect(p.totalRuns).toBe(0);
    expect(p.currencies.residuum).toBe(5);
    spy.mockRestore();
  });

  it('upgradeVoidRoom subtracts currency and raises level', () => {
    const progression = {
      ...getEmptyProgression(),
      currencies: { residuum: 100 },
    };
    saveSubjectProgression(progression);
    const ok = upgradeVoidRoom('corner');
    expect(ok).toBe(true);
    const p = loadSubjectProgression();
    expect(p.currencies.residuum).toBe(85);
    expect(getVoidRoomState(p, 'corner').level).toBe(1);
  });

  it('void room level changes new run via applyVoidRoomsToNewRun', () => {
    const progression = {
      ...getEmptyProgression(),
      voidRooms: {
        corner: { id: 'corner' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] },
      },
    };
    const state = createCyklusRun(true);
    const result = applyVoidRoomsToNewRun(state, progression);
    expect(result.flags).toContain('corner_hidden_item_active');
    expect(result.inventory.length).toBeGreaterThanOrEqual(1);
  });

  it('profile mastery rises from history profileDelta', () => {
    const progression = getEmptyProgression();
    const state = createCyklusRun(true);
    state.history = [
      { turn: 1, cycle: 1, cardId: 'x', direction: 'yes', statDelta: {}, profileDelta: { Ni: 3 }, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, statsAfter: { energy: 50, memory: 50, bond: 50, control: 50 }, sectorBefore: 'void', sectorAfter: 'void', ts: 0 },
      { turn: 2, cycle: 1, cardId: 'x', direction: 'no', statDelta: {}, profileDelta: { Ni: -2, Fe: 4 }, flagsGained: [], itemsGained: [], itemsLost: [], imprintsGained: [], poolsUnlocked: [], scheduledAdded: [], entityDelta: {}, statsAfter: { energy: 50, memory: 50, bond: 50, control: 50 }, sectorBefore: 'void', sectorAfter: 'void', ts: 1 },
    ];
    const next = updateProfileMasteryFromRun(progression, state);
    expect(next.profileMastery.Ni).toBe(5);
    expect(next.profileMastery.Fe).toBe(4);
  });

  it('profile protocol cannot be purchased without mastery', () => {
    const progression = { ...getEmptyProgression(), currencies: { residuum: 100, memoryResidue: 5 } };
    saveSubjectProgression(progression);
    const ok = purchaseProtocol('ni_premonition');
    expect(ok).toBe(false);
  });

  it('profile protocol can be purchased and equipped with slot limit', () => {
    const progression = {
      ...getEmptyProgression(),
      currencies: { residuum: 100, memoryResidue: 5 },
      profileMastery: { Ni: 25 },
    };
    saveSubjectProgression(progression);
    expect(purchaseProtocol('ni_premonition')).toBe(true);
    expect(purchaseProtocol('ni_premonition')).toBe(false);
    expect(equipProtocol('ni_premonition')).toBe(true);
    expect(loadSubjectProgression().equippedProtocols).toContain('ni_premonition');
    expect(equipProtocol('ne_side_door')).toBe(false);
  });

  it('crafting recipe cannot be crafted without requirements', () => {
    const progression = getEmptyProgression();
    const ok = canCraftRecipe(progression, 'fox_blanket_protocol');
    expect(ok).toBe(false);
  });

  it('crafting subtracts currencies/materials and adds artifact', () => {
    const discovery = {
      cards: [],
      sectors: [],
      items: ['blanket_of_pause'],
      imprints: ['held_without_fixing'],
      endings: [],
      variants: [],
      findings: [],
    };
    const progression = {
      ...getEmptyProgression(),
      currencies: { residuum: 100, bondThread: 5 },
      craftingInventory: { fox_warmth: 2 },
      knownRecipes: ['fox_blanket_protocol'],
      voidRooms: {
        fox_nest: { id: 'fox_nest' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] },
        crafting_table: { id: 'crafting_table' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] },
      },
    };
    saveSubjectProgression(progression);
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(discovery);
      return originalGetItem.call(localStorage, key);
    });
    const ok = craftRecipe('fox_blanket_protocol');
    expect(ok).toBe(true);
    const p = loadSubjectProgression();
    expect(p.craftingInventory.fox_warmth).toBe(1);
    expect(p.currencies.residuum).toBe(80);
    expect(p.currencies.bondThread).toBe(4);
    expect(p.craftedArtifacts).toContain('soft_pause_protocol');
    spy.mockRestore();
  });

  it('artifact can be equipped and respects slot limit', () => {
    const progression = {
      ...getEmptyProgression(),
      craftedArtifacts: ['soft_pause_protocol'],
    };
    saveSubjectProgression(progression);
    expect(equipArtifact('soft_pause_protocol')).toBe(true);
    expect(equipArtifact('soft_pause_protocol')).toBe(true);
    expect(loadSubjectProgression().equippedArtifacts).toContain('soft_pause_protocol');
  });

  it('applyCraftedArtifactsToNewRun adds expected flags and items', () => {
    const progression = {
      ...getEmptyProgression(),
      equippedArtifacts: ['soft_pause_protocol'],
    };
    const state = createCyklusRun(true);
    const result = applyCraftedArtifactsToNewRun(state, progression);
    expect(result.flags).toContain('soft_pause_protocol_active');
    expect(result.inventory).toContain('blanket_of_pause');
  });

  it('computeRunRewards returns crafting materials from pack usage', () => {
    const state = createCyklusRun(true);
    state.usedCardIds = ['glitchka_sits_next_to_you'];
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const reward = computeRunRewards(state, discovery);
    expect(reward.craftingMaterials.fox_warmth).toBe(1);
    expect(reward.craftingMaterials.laugh_dust).toBe(1);
    expect(reward.profileMastery).toBeDefined();
    expect(reward.voidRoomHints).toContain('fox_nest');
  });

  it('getLoadoutLimits reacts to stabilization_core room level', () => {
    const base = getEmptyProgression();
    expect(getLoadoutLimits(base).upgradeSlots).toBe(3);
    const core1 = { ...base, voidRooms: { stabilization_core: { id: 'stabilization_core' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] } } };
    expect(getLoadoutLimits(core1).upgradeSlots).toBe(4);
    const core2 = { ...base, voidRooms: { stabilization_core: { id: 'stabilization_core' as VoidRoomId, level: 2, unlocked: true, installedUpgrades: [] } } };
    expect(getLoadoutLimits(core2).artifactSlots).toBe(3);
    expect(getLoadoutLimits(core2).protocolSlots).toBe(2);
  });

  it('no upgrade, artifact or protocol gives a pure permanent stat boost without drawback', () => {
    const upgrades = Object.values(SUBJECT_UPGRADES).filter((u) => {
      const text = `${u.description} ${u.drawback ?? ''}`.toLowerCase();
      return u.category === 'boot' && !u.drawback && text.includes('start');
    });
    const artifacts = Object.values(CRAFTED_ARTIFACTS).filter((a) => {
      const text = `${a.description} ${a.drawback ?? ''}`.toLowerCase();
      const hasPureStat = !a.drawback && (text.includes('+') || text.includes('stat'));
      return hasPureStat;
    });
    const protocols = Object.values(PROFILE_PROTOCOLS).filter((p) => !p.drawback);
    expect(upgrades).toHaveLength(0);
    expect(artifacts).toHaveLength(0);
    expect(protocols).toHaveLength(0);
  });

  it('stabilization_core level 1 increases upgrade slot to 4', () => {
    const progression = {
      ...getEmptyProgression(),
      currencies: { residuum: 100 },
      voidRooms: {
        stabilization_core: { id: 'stabilization_core' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] },
      },
    };
    saveSubjectProgression(progression);
    expect(purchaseUpgrade('black_box')).toBe(true);
    expect(purchaseUpgrade('goal_reroll')).toBe(true);
    expect(purchaseUpgrade('inventory_instinct')).toBe(true);
    expect(purchaseUpgrade('inner_pocket')).toBe(true);
    const p = loadSubjectProgression();
    expect(p.equippedUpgrades).toHaveLength(4);
    expect(p.purchasedUpgrades).toContain('inner_pocket');
  });

  it('equipUpgrade respects dynamic slot limit from stabilization_core', () => {
    const progression = {
      ...getEmptyProgression(),
      purchasedUpgrades: ['black_box', 'goal_reroll', 'inventory_instinct', 'inner_pocket'],
      equippedUpgrades: ['black_box', 'goal_reroll', 'inventory_instinct'],
      voidRooms: {
        stabilization_core: { id: 'stabilization_core' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] },
      },
    };
    saveSubjectProgression(progression);
    expect(equipUpgrade('inner_pocket')).toBe(true);
    expect(loadSubjectProgression().equippedUpgrades).toHaveLength(4);
  });

  it('canCraftRecipe checks discovery items, imprints and findings', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') {
        return JSON.stringify({
          cards: [],
          sectors: [],
          items: ['blanket_of_pause'],
          imprints: ['held_without_fixing'],
          endings: [],
          variants: [],
          findings: [],
        });
      }
      return null;
    });
    const progression = {
      ...getEmptyProgression(),
      currencies: { residuum: 100, bondThread: 5 },
      craftingInventory: { fox_warmth: 2 },
      knownRecipes: ['fox_blanket_protocol'],
      voidRooms: {
        fox_nest: { id: 'fox_nest' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] },
        crafting_table: { id: 'crafting_table' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] },
      },
    };
    expect(canCraftRecipe(progression, 'fox_blanket_protocol')).toBe(true);
    spy.mockRestore();
  });

  it('computeRunRewards unlocks recipes when crafting_table is present and discovery matches', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') {
        return JSON.stringify({
          cards: [],
          sectors: [],
          items: ['blanket_of_pause'],
          imprints: ['held_without_fixing'],
          endings: [],
          variants: [],
          findings: [],
        });
      }
      if (key === 'synthoma_cyklus_progression_v1') {
        return JSON.stringify({
          ...getEmptyProgression(),
          voidRooms: {
            crafting_table: { id: 'crafting_table' as VoidRoomId, level: 1, unlocked: true, installedUpgrades: [] },
          },
        });
      }
      return null;
    });
    const state = createCyklusRun(true);
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const reward = computeRunRewards(state, discovery);
    expect(reward.unlockedRecipes).toContain('fox_blanket_protocol');
    spy.mockRestore();
  });

  it('death by memory unlocks memory scar and records death stat', () => {
    const state = createCyklusRun(true);
    state.status = 'dead';
    state.stats = { energy: 50, memory: 0, bond: 50, control: 50 };
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const reward = computeRunRewards(state, discovery);
    expect(reward.deathStat).toBe('memory');
    expect(reward.unlockedScars).toContain('memory_scar');
    mockProgression({ residuum: 0 });
    awardRunRewards(reward);
    const p = loadSubjectProgression();
    expect(p.deathsByStat.memory).toBe(1);
    expect(p.unlockedScars).toContain('memory_scar');
  });

  it('export run log includes crafting materials and unlocked recipes', () => {
    const { exportRunLog } = require('../cyklusEngine');
    const state = createCyklusRun(true);
    state.usedCardIds = ['glitchka_sits_next_to_you'];
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const reward = computeRunRewards(state, discovery);
    const log = exportRunLog(state, 'full', reward);
    expect(log).toContain('Suroviny:');
    expect(log).toContain('fox_warmth');
    expect(log).toContain('Prázdnota doporučuje:');
    expect(log).toContain('fox_nest');
  });

  it('computeRunRewards deduplicates voidRoomHints', () => {
    const state = createCyklusRun(true);
    state.usedCardIds = [
      'detective_crime_scene_in_memory',
      'detective_witness_with_no_face',
      'detective_magnifier_finds_you',
    ];
    const discovery: CyklusDiscovery = { cards: [], sectors: [], items: [], imprints: [], endings: [], variants: [], findings: [] };
    const reward = computeRunRewards(state, discovery);
    const unique = [...new Set(reward.voidRoomHints)];
    expect(reward.voidRoomHints).toContain('archive_drawer');
    expect(reward.voidRoomHints.length).toBe(unique.length);
  });

  it('getRecommendedNextProgressionActions contains no duplicates', () => {
    const { getRecommendedNextProgressionActions } = require('../cyklusProgression');
    const state = createCyklusRun(true);
    const progression = mockProgression({ residuum: 100 });
    const actions = getRecommendedNextProgressionActions(state, progression);
    const unique = [...new Set(actions)];
    expect(actions.length).toBe(unique.length);
  });
});
