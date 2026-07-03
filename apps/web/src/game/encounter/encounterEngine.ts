import type { RunState, RunLogEntry } from '../run/runTypes';
import type {
  EncounterState,
  EnemyState,
  PendingPlayerAction,
  PlayerActionId,
} from './encounterTypes';
import type { RunEffect } from '../run/effects';
import { resolveEffects } from '../run/effectResolver';
import { resolveCardEffects } from '../run/effectResolver';
import { getEnemyById } from './enemies';
import { getEncounterById } from './encounters';
import { getRunCardById, getUpgradedCardId, isUpgradable } from '../run/runCards';
import { composeActionLog, composeEnemyLog, composeSystemLog } from './logComposer';
import { VOID_STAGE_TRANSITION_TEXTS } from './textPools';

// ── Seeded dice for sarcasm ───────────────────────────────────────────────────

function rollD6(seed: number, round: number): number {
  const h = ((seed + round * 0x6d2b79f5) | 0) >>> 0;
  return (h % 6) + 1;
}

function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ── Start encounter ───────────────────────────────────────────────────────────

export function startEncounter(state: RunState, encounterId: string): RunState {
  const def = getEncounterById(encounterId);
  if (!def) return state;

  const enemies: EnemyState[] = (def.enemyIds ?? []).map((enemyId) => {
    const enemyDef = getEnemyById(enemyId);
    if (!enemyDef) throw new Error(`Unknown enemy: ${enemyId}`);
    return {
      id: `${enemyId}-${Date.now()}`,
      definitionId: enemyId,
      name: enemyDef.name,
      hp: enemyDef.maxHp,
      maxHp: enemyDef.maxHp,
      armor: enemyDef.armor ?? 0,
      block: 0,
      currentIntentIndex: 0,
      statuses: [],
      bossPhase: enemyDef.isBoss ? 0 : undefined,
    };
  });

  const introText = def.intro[Math.floor(Math.random() * def.intro.length)] ?? '';

  const encounter: EncounterState = {
    id: `enc-${Date.now()}`,
    definitionId: encounterId,
    type: def.type,
    round: 0,
    enemies,
    phase: def.type === 'combat' || def.type === 'elite' || def.type === 'boss'
      ? 'intro'
      : 'choice',
    pendingChoice: def.choices,
    introText,
    lastResolutionText: undefined,
    rewardOptions: undefined,
  };

  const logEntry = {
    id: Math.random().toString(36).slice(2, 9),
    turn: 0,
    type: 'system' as const,
    message: composeSystemLog(`[${def.logLabel}]\n\n${introText}`),
    ts: Date.now(),
  };

  return {
    ...state,
    currentEncounter: encounter,
    log: [...state.log, logEntry],
  };
}

// ── Skip intro → choose_actions ───────────────────────────────────────────────

export function skipIntro(state: RunState): RunState {
  if (!state.currentEncounter || state.currentEncounter.phase !== 'intro') return state;

  // Reset block at start of round
  let s = resetRoundBlock(state);

  return {
    ...s,
    currentEncounter: {
      ...s.currentEncounter!,
      phase: 'choose_actions',
    },
  };
}

// ── Apply relic: Acidový filtr — ignore first noise in combat ─────────────────

function applyAcidicFilter(state: RunState, noiseAmount: number, playerId: string): number {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return noiseAmount;
  if (state.relics.includes('acidovy-filtr') && player.relicsTriggered.includes('acidovy-filtr')) {
    return noiseAmount;
  }
  if (state.relics.includes('acidovy-filtr') && !player.relicsTriggered.includes('acidovy-filtr')) {
    return 0;
  }
  return noiseAmount;
}

// ── Player action ─────────────────────────────────────────────────────────────

export function resolvePlayerAction(
  state: RunState,
  action: PendingPlayerAction,
): RunState {
  if (!state.currentEncounter) return state;
  if (state.currentEncounter.phase !== 'choose_actions') return state;

  const player = state.players.find((p) => p.id === action.playerId);
  if (!player) return state;

  const round = state.currentEncounter.round;
  const seed = seedFromString(state.seed);
  const enemy = state.currentEncounter.enemies[0];
  const enemyId = enemy?.id ?? '';

  let s = state;
  let logText = '';
  let damage = 0;
  let blocked = 0;
  let noiseGained = 0;
  let laughGained = 0;

  if (action.cardId) {
    s = resolveCardEffects(s, action.cardId, action.playerId, action.targetEnemyId);
    return resolveEnemyTurn(s);
  }

  const actionId: PlayerActionId = action.actionId;
  let effects: RunEffect[] = [];
  let outcome: 'success' | 'fail' | 'crit' | 'neutral' | 'partial' = 'success';

  switch (actionId) {
    case 'attack': {
      const baseDamage = 6;
      const isHighNoise = player.noise >= 5;
      const actualDamage = isHighNoise ? baseDamage + 3 : baseDamage;
      damage = actualDamage;
      effects = [
        { type: 'deal_damage', targetId: enemyId, amount: actualDamage },
        ...(isHighNoise ? [{ type: 'gain_noise' as const, playerId: action.playerId, amount: 1 }] : []),
      ];
      noiseGained = isHighNoise ? 1 : 0;
      break;
    }

    case 'dash': {
      const blockAmount = 8;
      blocked = blockAmount;
      effects = [{ type: 'gain_block', playerId: action.playerId, amount: blockAmount }];
      laughGained = 1;
      effects.push({ type: 'gain_laugh', playerId: action.playerId, amount: 1 });
      break;
    }

    case 'hack': {
      const currentIntent = enemy?.statuses.find((s) => s.id === 'audit');
      effects = [
        { type: 'deal_damage', targetId: enemyId, amount: 4 },
        { type: 'skip_enemy_intent', enemyId },
      ];
      if (currentIntent) {
        effects.push({ type: 'remove_status', targetId: enemyId, statusId: 'audit' });
      }
      damage = 4;
      break;
    }

    case 'defend': {
      blocked = 12;
      effects = [
        { type: 'gain_block', playerId: action.playerId, amount: 12 },
        { type: 'lose_noise', playerId: action.playerId, amount: 1 },
      ];
      break;
    }

    case 'sarcasm': {
      const roll = rollD6(seed, round);
      const hasSarkasminPodpis = s.relics.includes('sarkasminin-podpis');
      const isGood = hasSarkasminPodpis ? true : roll >= 4;
      outcome = isGood ? 'success' : 'fail';

      if (isGood) {
        damage = 3;
        laughGained = 1;
        effects = [
          { type: 'deal_damage', targetId: enemyId, amount: 3 },
          { type: 'gain_laugh', playerId: action.playerId, amount: 1 },
        ];
      } else {
        noiseGained = 1;
        effects = [{ type: 'gain_noise', playerId: action.playerId, amount: 1 }];
      }
      break;
    }
  }

  logText = composeActionLog({
    actionId,
    playerName: player.name,
    enemyName: enemy?.name,
    damage: damage > 0 ? damage : undefined,
    blocked: blocked > 0 ? blocked : undefined,
    noiseGained: noiseGained > 0 ? noiseGained : undefined,
    laughGained: laughGained > 0 ? laughGained : undefined,
    outcome,
    round,
  });

  s = resolveEffects(s, effects);
  s = addLogEntry(s, logText, round);

  // Check if all enemies dead
  const allDead = s.currentEncounter!.enemies.every((e) => e.hp <= 0);
  if (allDead) {
    return resolveEncounterVictory(s);
  }

  return resolveEnemyTurn(s);
}

// ── Enemy turn ────────────────────────────────────────────────────────────────

function resolveEnemyTurn(state: RunState): RunState {
  if (!state.currentEncounter) return state;

  const enc = state.currentEncounter;
  let s = state;

  for (const enemy of enc.enemies) {
    if (enemy.hp <= 0) continue;

    const def = getEnemyById(enemy.definitionId);
    if (!def) continue;

    const useAggressive = s.voidPressure >= 6;
    const intents = useAggressive && def.aggressiveIntents.length > 0
      ? def.aggressiveIntents
      : def.intents;

    const intentDef = intents[enemy.currentIntentIndex % intents.length]!;
    const activePlayer = s.players.find((p) => p.id === s.activePlayerId) ?? s.players[0];
    if (!activePlayer) continue;

    let outcome: 'hit' | 'blocked' | 'missed' = 'hit';
    const effects: RunEffect[] = [];

    switch (intentDef.type) {
      case 'attack': {
        const raw = intentDef.damage ?? 0;
        const absorbed = Math.min(activePlayer.block, raw);
        const actual = raw - absorbed;
        outcome = absorbed >= raw ? 'blocked' : actual > 0 ? 'hit' : 'missed';
        effects.push({ type: 'deal_damage', targetId: activePlayer.id, amount: raw });
        if (intentDef.noiseAmount) {
          const noise = applyAcidicFilter(s, intentDef.noiseAmount, activePlayer.id);
          if (noise > 0) effects.push({ type: 'gain_noise', playerId: activePlayer.id, amount: noise });
        }
        break;
      }
      case 'attack_dot': {
        effects.push({ type: 'deal_damage', targetId: activePlayer.id, amount: intentDef.damage ?? 0 });
        effects.push({
          type: 'add_status',
          targetId: activePlayer.id,
          statusId: 'dot_noise',
          label: 'Šumový DOT',
          stacks: intentDef.noiseAmount ?? 1,
          turnsLeft: intentDef.dotTurns ?? 3,
        });
        break;
      }
      case 'lock_card': {
        effects.push({ type: 'lock_card', playerId: activePlayer.id, turns: 1 });
        break;
      }
      case 'steal_laugh': {
        effects.push({ type: 'steal_laugh', fromPlayerId: activePlayer.id, toEnemyId: enemy.id, amount: 3 });
        break;
      }
      case 'aoe': {
        for (const p of s.players) {
          effects.push({ type: 'deal_damage', targetId: p.id, amount: intentDef.damage ?? 4 });
        }
        break;
      }
      case 'audit': {
        effects.push({ type: 'gain_noise', playerId: activePlayer.id, amount: 1 });
        effects.push({ type: 'modify_void_pressure', amount: 1 });
        break;
      }
      case 'sprint': {
        const sprintDmg = intentDef.damage ?? 3;
        effects.push({ type: 'deal_damage', targetId: activePlayer.id, amount: sprintDmg });
        effects.push({ type: 'deal_damage', targetId: activePlayer.id, amount: sprintDmg });
        break;
      }
      case 'mirror': {
        const lastActionId = enc.lastActionId;
        if (lastActionId === 'attack' || lastActionId === 'hack') {
          effects.push({ type: 'deal_damage', targetId: activePlayer.id, amount: 3 });
        }
        break;
      }
      case 'void_surge': {
        effects.push({ type: 'modify_void_pressure', amount: 2 });
        effects.push({ type: 'deal_damage', targetId: activePlayer.id, amount: 5 });
        break;
      }
      case 'buff_self': {
        effects.push({
          type: 'add_status',
          targetId: enemy.id,
          statusId: 'buffed',
          label: 'Posílen',
          stacks: 1,
          turnsLeft: 3,
        });
        break;
      }
    }

    const enemyLogText = composeEnemyLog({
      enemyId: enemy.definitionId,
      enemyName: enemy.name,
      intentLabel: intentDef.label,
      damage: intentDef.damage,
      outcome,
      blocked: activePlayer.block,
      round: enc.round,
    });

    s = resolveEffects(s, effects);
    s = addLogEntry(s, enemyLogText, enc.round);

    // Advance intent
    s = {
      ...s,
      currentEncounter: s.currentEncounter ? {
        ...s.currentEncounter,
        enemies: s.currentEncounter.enemies.map((e) =>
          e.id === enemy.id
            ? { ...e, currentIntentIndex: (e.currentIntentIndex + 1) % intents.length, block: 0 }
            : e,
        ),
      } : undefined,
    };
  }

  // Advance round
  s = advanceRound(s);

  // Check player death
  const activePlayer = s.players.find((p) => p.id === s.activePlayerId) ?? s.players[0];
  if (activePlayer && activePlayer.hp <= 0) {
    return resolvePlayerDeath(s, activePlayer.id);
  }

  return s;
}

// ── Round advance ─────────────────────────────────────────────────────────────

function advanceRound(state: RunState): RunState {
  if (!state.currentEncounter) return state;

  const newRound = state.currentEncounter.round + 1;

  // Tick DOT statuses on players
  let s = state;
  for (const player of s.players) {
    const dotStatus = player.statuses.find((st) => st.id === 'dot_noise');
    if (dotStatus) {
      s = resolveEffects(s, [{ type: 'gain_noise', playerId: player.id, amount: dotStatus.stacks }]);
      if (dotStatus.turnsLeft !== undefined && dotStatus.turnsLeft <= 1) {
        s = resolveEffects(s, [{ type: 'remove_status', targetId: player.id, statusId: 'dot_noise' }]);
      } else if (dotStatus.turnsLeft !== undefined) {
        s = {
          ...s,
          players: s.players.map((p) =>
            p.id === player.id
              ? {
                  ...p,
                  statuses: p.statuses.map((st) =>
                    st.id === 'dot_noise' && st.turnsLeft !== undefined
                      ? { ...st, turnsLeft: st.turnsLeft - 1 }
                      : st,
                  ),
                }
              : p,
          ),
        };
      }
    }
  }

  // Void pressure +1 per combat round, with stage transition messages
  const prevVoid = s.voidPressure;
  s = resolveEffects(s, [{ type: 'modify_void_pressure', amount: 1 }]);
  const newVoid = s.voidPressure;
  const stageKey = getVoidStageTransitionKey(prevVoid, newVoid);
  if (stageKey) {
    s = addLogEntry(s, VOID_STAGE_TRANSITION_TEXTS[stageKey] ?? '', newRound);
  }

  // Noise collapse check
  for (const p of s.players) {
    if (p.noise >= 10 && s.status === 'playing') {
      s = resolveEffects(s, [{ type: 'noise_collapse', playerId: p.id }]);
    }
  }

  // Boss phase advance check
  if (s.currentEncounter) {
    for (const enemy of s.currentEncounter.enemies) {
      if (enemy.hp > 0) {
        const def = getEnemyById(enemy.definitionId);
        if (def?.bossPhases && enemy.bossPhase !== undefined) {
          const hpPercent = Math.round((enemy.hp / enemy.maxHp) * 100);
          const nextPhase = def.bossPhases.find(
            (bp) => bp.phase === (enemy.bossPhase ?? 0) + 1 && hpPercent <= bp.hpThreshold,
          );
          if (nextPhase) {
            s = {
              ...s,
              currentEncounter: s.currentEncounter ? {
                ...s.currentEncounter,
                enemies: s.currentEncounter.enemies.map((e) =>
                  e.id === enemy.id ? { ...e, bossPhase: nextPhase.phase } : e,
                ),
              } : undefined,
            };
            s = resolveEffects(s, [{ type: 'modify_void_pressure', amount: 1 }]);
            s = addLogEntry(s, nextPhase.phaseText, newRound);
          }
        }
      }
    }
  }

  return {
    ...s,
    currentEncounter: s.currentEncounter
      ? { ...s.currentEncounter, round: newRound, phase: 'choose_actions' }
      : undefined,
  };
}

function resetRoundBlock(state: RunState): RunState {
  return {
    ...state,
    players: state.players.map((p) => ({ ...p, block: 0 })),
  };
}

// ── Victory / defeat ──────────────────────────────────────────────────────────

function resolveEncounterVictory(state: RunState): RunState {
  if (!state.currentEncounter) return state;

  const enc = state.currentEncounter;
  const def = getEncounterById(enc.definitionId);
  const rewardPool = def?.rewardPool ?? [];

  const rewardOptions = generateRewardOptions(rewardPool, enc.type, state.seed, enc.round, state.deck);

  const s = {
    ...state,
    currentEncounter: {
      ...enc,
      phase: 'reward' as const,
      rewardOptions,
      lastResolutionText: 'Encounter ukončen. Vyber odměnu.',
    },
  };

  return addLogEntry(s, composeSystemLog('Nepřítel poražen. Vyberte odměnu.'), enc.round);
}

function resolvePlayerDeath(state: RunState, playerId: string): RunState {
  // Check Gumový tuleň relic — prevents death once
  const player = state.players.find((p) => p.id === playerId);
  if (player && state.relics.includes('gumovy-tuleň') && !player.relicsTriggered.includes('gumovy-tuleň')) {
    const s = {
      ...state,
      players: state.players.map((p) =>
        p.id === playerId
          ? { ...p, hp: 1, relicsTriggered: [...p.relicsTriggered, 'gumovy-tuleň'] }
          : p,
      ),
    };
    return addLogEntry(
      s,
      'Gumový tuleň tě vrátil zpět do reality. Netvářil se nadšeně. Upřímně, nikdo by nebyl.',
      state.currentEncounter?.round ?? 0,
    );
  }

  // Fragmentation instead of immediate death
  return resolveEffects(state, [{ type: 'apply_fragmentation', playerId }]);
}

// ── Choice resolution ─────────────────────────────────────────────────────────

export function resolveChoice(state: RunState, choiceId: string): RunState {
  if (!state.currentEncounter || state.currentEncounter.phase !== 'choice') return state;

  const enc = state.currentEncounter;
  const choice = enc.pendingChoice?.find((c) => c.id === choiceId);
  if (!choice) return state;

  const player = state.players.find((p) => p.id === state.activePlayerId) ?? state.players[0];
  if (!player) return state;

  // Parse string effects (e.g. 'gain_laugh:2', 'heal:5', etc.)
  const effects: RunEffect[] = choice.effects
    .filter((e) => !e.startsWith('trigger_encounter'))
    .map((e) => parseStringEffect(e, player.id));

  let s = resolveEffects(state, effects);
  s = addLogEntry(s, choice.outcomeText, enc.round);

  // Update profile
  if (choice.profileDelta) {
    s = {
      ...s,
      players: s.players.map((p) => {
        if (p.id !== player.id) return p;
        const newProfile = { ...p.profile };
        for (const [key, val] of Object.entries(choice.profileDelta ?? {})) {
          const k = key as keyof typeof newProfile;
          if (typeof newProfile[k] === 'number' && val !== undefined) {
            (newProfile[k] as number) += val;
          }
        }
        return { ...p, profile: newProfile };
      }),
    };
  }

  // Check for trigger_encounter effect
  const triggerEffect = choice.effects.find((e) => e.startsWith('trigger_encounter:'));
  if (triggerEffect) {
    const triggerId = triggerEffect.split(':')[1] ?? '';
    s = { ...s, currentEncounter: { ...s.currentEncounter!, phase: 'finished' } };
    return startEncounter(s, triggerId);
  }

  // Non-combat encounters proceed to reward or finished
  const hasCombat = enc.enemies.length > 0;
  if (!hasCombat) {
    const def = getEncounterById(enc.definitionId);
    const rewardOptions = generateRewardOptions(def?.rewardPool ?? [], enc.type, s.seed, enc.round, s.deck);
    s = {
      ...s,
      currentEncounter: s.currentEncounter ? {
        ...s.currentEncounter,
        phase: rewardOptions.length > 0 ? 'reward' : 'finished',
        rewardOptions: rewardOptions.length > 0 ? rewardOptions : undefined,
        pendingChoice: undefined,
      } : undefined,
    };
  } else {
    s = {
      ...s,
      currentEncounter: s.currentEncounter ? {
        ...s.currentEncounter,
        phase: 'choose_actions',
        pendingChoice: undefined,
      } : undefined,
    };
  }

  return s;
}

// ── Reward claiming ───────────────────────────────────────────────────────────

export function claimReward(state: RunState, rewardId: string): RunState {
  if (!state.currentEncounter || state.currentEncounter.phase !== 'reward') return state;

  const enc = state.currentEncounter;
  const reward = enc.rewardOptions?.find((r) => r.id === rewardId);
  if (!reward) return state;

  const player = state.players.find((p) => p.id === state.activePlayerId) ?? state.players[0];
  if (!player) return state;

  let s = state;

  switch (reward.type) {
    case 'card':
      s = { ...s, discard: [...s.discard, reward.cardId] };
      s = addLogEntry(s, `Karta přidána do balíčku: ${reward.label}`, enc.round);
      break;
    case 'relic':
      s = { ...s, relics: [...s.relics, reward.relicId] };
      s = addLogEntry(s, `Relikvie získána: ${reward.label}`, enc.round);
      break;
    case 'heal':
      s = resolveEffects(s, [{ type: 'heal', playerId: player.id, amount: reward.amount }]);
      break;
    case 'remove_noise':
      s = resolveEffects(s, [{ type: 'lose_noise', playerId: player.id, amount: reward.amount }]);
      break;
    case 'resource':
      if (reward.resource === 'laugh') {
        s = resolveEffects(s, [{ type: 'gain_laugh', playerId: player.id, amount: reward.amount }]);
      }
      break;
    case 'upgrade': {
      const upgradedId = getUpgradedCardId(reward.targetCardId);
      if (!upgradedId) break;
      const upgradedCard = getRunCardById(upgradedId);
      s = {
        ...s,
        deck: s.deck.map((id) => (id === reward.targetCardId ? upgradedId : id)),
        discard: s.discard.map((id) => (id === reward.targetCardId ? upgradedId : id)),
      };
      s = addLogEntry(s, `Karta vylepšena: ${upgradedCard?.title ?? upgradedId}`, enc.round);
      break;
    }
  }

  s = {
    ...s,
    currentEncounter: s.currentEncounter ? {
      ...s.currentEncounter,
      phase: 'finished' as const,
    } : undefined,
  };

  return s;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function addLogEntry(state: RunState, message: string, round: number): RunState {
  const entry: RunLogEntry = {
    id: Math.random().toString(36).slice(2, 9),
    turn: round,
    type: 'action',
    message,
    ts: Date.now(),
  };
  return { ...state, log: [...state.log, entry] };
}

function parseStringEffect(effect: string, playerId: string): RunEffect {
  const [type, rawValue] = effect.split(':');
  const amount = parseInt(rawValue ?? '0', 10);
  switch (type) {
    case 'gain_laugh': return { type: 'gain_laugh', playerId, amount };
    case 'gain_noise': return { type: 'gain_noise', playerId, amount };
    case 'lose_noise': return { type: 'lose_noise', playerId, amount };
    case 'heal': return { type: 'heal', playerId, amount };
    case 'draw_cards': return { type: 'draw_cards', playerId, amount };
    case 'lose_laugh': return { type: 'lose_laugh', playerId, amount };
    default: return { type: 'add_log', message: `Unknown effect: ${effect}` };
  }
}

// ── Void pressure stage transition helper ─────────────────────────────────────

function getVoidStageTransitionKey(prev: number, next: number): string | null {
  if (prev < 6 && next >= 6) return '5_to_6';
  if (prev < 11 && next >= 11) return '10_to_11';
  if (prev < 16 && next >= 16) return '15_to_16';
  if (prev < 20 && next >= 20) return '19_to_20';
  return null;
}

function generateRewardOptions(
  pool: string[],
  encounterType: string,
  seed: string,
  round: number,
  deck: string[],
): import('../run/runTypes').RewardOption[] {
  if (pool.length === 0) return [];
  if (encounterType === 'rest' || encounterType === 'archive') return [];

  const count = encounterType === 'elite' ? 2 : 3;
  const seedNum = seedFromString(seed + round);

  const shuffled = [...pool].sort(() => {
    const a = seedNum ^ (round * 0x5851f42d);
    return ((a & 1) === 0 ? 1 : -1);
  });

  const baseOptions: import('../run/runTypes').RewardOption[] = shuffled.slice(0, count).map((cardId, i) => {
    const card = getRunCardById(cardId);
    return {
      id: `reward-${i}-${cardId}`,
      type: 'card' as const,
      cardId,
      label: card?.title ?? cardId,
    };
  });

  // 30% chance to offer an upgrade for an upgradable deck card instead of one card reward
  const upgradableDeckCards = [...new Set(deck)].filter(isUpgradable);
  if (upgradableDeckCards.length > 0 && ((seedNum % 10) < 3)) {
    const targetCardId = upgradableDeckCards[seedNum % upgradableDeckCards.length]!;
    const upgradedId = getUpgradedCardId(targetCardId);
    const upgradedCard = upgradedId ? getRunCardById(upgradedId) : undefined;
    baseOptions[0] = {
      id: `reward-upgrade-${targetCardId}`,
      type: 'upgrade' as const,
      targetCardId,
      label: `Vylepšit: ${upgradedCard?.title ?? upgradedId ?? targetCardId}`,
    };
  }

  return baseOptions;
}
