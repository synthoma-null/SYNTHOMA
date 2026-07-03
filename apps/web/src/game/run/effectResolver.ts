import type { RunState, RunPlayer, RunLogEntry } from './runTypes';
import type { EnemyState } from '../encounter/encounterTypes';
import type { RunEffect } from './effects';
import { RUN_CARDS, type RunCard } from './runCards';
import { FRAGMENTATION_TEXTS, NOISE_COLLAPSE_TEXT } from '../encounter/textPools';

const MAX_HAND_SIZE = 7;
const MAX_NOISE = 20;

// ── Helpers ───────────────────────────────────────────────────────────────────

function updatePlayer(state: RunState, playerId: string, patch: Partial<RunPlayer>): RunState {
  return {
    ...state,
    players: state.players.map((p) => p.id === playerId ? { ...p, ...patch } : p),
  };
}

function updateEnemy(state: RunState, enemyId: string, patch: Partial<EnemyState>): RunState {
  if (!state.currentEncounter) return state;
  return {
    ...state,
    currentEncounter: {
      ...state.currentEncounter,
      enemies: state.currentEncounter.enemies.map((e) =>
        e.id === enemyId ? { ...e, ...patch } : e,
      ),
    },
  };
}

function addLog(state: RunState, message: string): RunState {
  const entry: RunLogEntry = {
    id: Math.random().toString(36).slice(2, 9),
    turn: state.currentEncounter?.round ?? 0,
    type: 'system',
    message,
    ts: Date.now(),
  };
  return { ...state, log: [...state.log, entry] };
}

function drawCards(state: RunState, playerId: string, amount: number): RunState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return state;
  let deck = [...state.deck];
  let discard = [...state.discard];

  if (deck.length < amount && discard.length > 0) {
    deck = [...deck, ...discard];
    discard = [];
  }

  const drawn = deck.slice(0, amount);
  const remaining = deck.slice(amount);
  const newHand = [...player.hand, ...drawn].slice(0, MAX_HAND_SIZE);

  return {
    ...updatePlayer(state, playerId, { hand: newHand }),
    deck: remaining,
    discard,
  };
}

// ── Main resolver ─────────────────────────────────────────────────────────────

export function resolveEffects(state: RunState, effects: RunEffect[]): RunState {
  let s = state;

  for (const effect of effects) {
    switch (effect.type) {
      case 'deal_damage': {
        const enemy = s.currentEncounter?.enemies.find((e) => e.id === effect.targetId);
        if (enemy) {
          const absorbed = Math.min(enemy.block, effect.amount);
          const actualDamage = effect.amount - absorbed;
          const newBlock = enemy.block - absorbed;
          const newHp = Math.max(0, enemy.hp - actualDamage);
          s = updateEnemy(s, effect.targetId, { hp: newHp, block: newBlock });
          break;
        }
        const player = s.players.find((p) => p.id === effect.targetId);
        if (player) {
          const absorbed = Math.min(player.block, effect.amount);
          const actualDamage = effect.amount - absorbed;
          const newBlock = player.block - absorbed;
          const newHp = Math.max(0, player.hp - actualDamage);
          s = updatePlayer(s, effect.targetId, { hp: newHp, block: newBlock });
        }
        break;
      }

      case 'gain_block': {
        const p = s.players.find((pl) => pl.id === effect.playerId);
        if (p) s = updatePlayer(s, effect.playerId, { block: p.block + effect.amount });
        break;
      }

      case 'gain_noise': {
        const p = s.players.find((pl) => pl.id === effect.playerId);
        if (p) s = updatePlayer(s, effect.playerId, { noise: Math.min(MAX_NOISE, p.noise + effect.amount) });
        break;
      }

      case 'lose_noise': {
        const p = s.players.find((pl) => pl.id === effect.playerId);
        if (p) s = updatePlayer(s, effect.playerId, { noise: Math.max(0, p.noise - effect.amount) });
        break;
      }

      case 'gain_laugh': {
        const p = s.players.find((pl) => pl.id === effect.playerId);
        if (p) s = updatePlayer(s, effect.playerId, { laugh: p.laugh + effect.amount });
        break;
      }

      case 'lose_laugh': {
        const p = s.players.find((pl) => pl.id === effect.playerId);
        if (p) s = updatePlayer(s, effect.playerId, { laugh: Math.max(0, p.laugh - effect.amount) });
        break;
      }

      case 'heal': {
        const p = s.players.find((pl) => pl.id === effect.playerId);
        if (p) s = updatePlayer(s, effect.playerId, { hp: Math.min(p.maxHp, p.hp + effect.amount) });
        break;
      }

      case 'draw_cards': {
        s = drawCards(s, effect.playerId, effect.amount);
        break;
      }

      case 'discard_random': {
        const p = s.players.find((pl) => pl.id === effect.playerId);
        if (p && p.hand.length > 0) {
          const idx = Math.floor(Math.random() * p.hand.length);
          const discarded = p.hand[idx]!;
          const newHand = p.hand.filter((_, i) => i !== idx);
          s = updatePlayer(s, effect.playerId, { hand: newHand });
          s = { ...s, discard: [...s.discard, discarded] };
        }
        break;
      }

      case 'add_status': {
        const enemy = s.currentEncounter?.enemies.find((e) => e.id === effect.targetId);
        if (enemy) {
          const existing = enemy.statuses.find((st) => st.id === effect.statusId);
          const newStatuses = existing
            ? enemy.statuses.map((st) => st.id === effect.statusId ? { ...st, stacks: st.stacks + effect.stacks } : st)
            : [...enemy.statuses, { id: effect.statusId, label: effect.label, stacks: effect.stacks, turnsLeft: effect.turnsLeft }];
          s = updateEnemy(s, effect.targetId, { statuses: newStatuses });
          break;
        }
        const p = s.players.find((pl) => pl.id === effect.targetId);
        if (p) {
          const existing = p.statuses.find((st) => st.id === effect.statusId);
          const newStatuses = existing
            ? p.statuses.map((st) => st.id === effect.statusId ? { ...st, stacks: st.stacks + effect.stacks } : st)
            : [...p.statuses, { id: effect.statusId, label: effect.label, stacks: effect.stacks, turnsLeft: effect.turnsLeft }];
          s = updatePlayer(s, effect.targetId, { statuses: newStatuses });
        }
        break;
      }

      case 'remove_status': {
        const enemy = s.currentEncounter?.enemies.find((e) => e.id === effect.targetId);
        if (enemy) {
          s = updateEnemy(s, effect.targetId, { statuses: enemy.statuses.filter((st) => st.id !== effect.statusId) });
          break;
        }
        const p = s.players.find((pl) => pl.id === effect.targetId);
        if (p) {
          s = updatePlayer(s, effect.targetId, { statuses: p.statuses.filter((st) => st.id !== effect.statusId) });
        }
        break;
      }

      case 'modify_void_pressure': {
        const gainMultiplier = effect.amount > 0 ? (s.modifiers?.voidPressureGain ?? 1) : 1;
        const adjustedAmount = Math.round(effect.amount * gainMultiplier);
        s = { ...s, voidPressure: Math.max(0, Math.min(20, s.voidPressure + adjustedAmount)) };
        if (adjustedAmount > 0) s = addLog(s, `Prázdnota roste o ${adjustedAmount}. Tlak: ${s.voidPressure}/20`);
        if (adjustedAmount < 0) s = addLog(s, `Tlak Prázdnoty snížen o ${Math.abs(adjustedAmount)}. Tlak: ${s.voidPressure}/20`);
        break;
      }

      case 'lock_card': {
        s = addLog(s, `Karta zamčena na ${effect.turns} kol.`);
        break;
      }

      case 'steal_laugh': {
        const p = s.players.find((pl) => pl.id === effect.fromPlayerId);
        if (p) {
          const stolen = Math.min(effect.amount, p.laugh);
          s = updatePlayer(s, effect.fromPlayerId, { laugh: p.laugh - stolen });
          s = addLog(s, `Nepřítel ukradl ${stolen} Smích.`);
        }
        break;
      }

      case 'advance_boss_phase': {
        const enemy = s.currentEncounter?.enemies.find((e) => e.id === effect.enemyId);
        if (enemy && enemy.bossPhase !== undefined) {
          s = updateEnemy(s, effect.enemyId, { bossPhase: enemy.bossPhase + 1 });
          s = addLog(s, `Boss postoupil do fáze ${(enemy.bossPhase ?? 0) + 1}.`);
        }
        break;
      }

      case 'skip_enemy_intent': {
        s = addLog(s, `Záměr nepřítele byl přeskočen.`);
        break;
      }

      case 'add_log': {
        s = addLog(s, effect.message);
        break;
      }

      case 'apply_fragmentation': {
        const p = s.players.find((pl) => pl.id === effect.playerId);
        if (!p) break;
        const existingFrag = p.statuses.find((st) => st.id === 'fragmentation');
        const currentStack = existingFrag?.stacks ?? 0;
        const newStack = currentStack + 1;

        if (newStack >= 3) {
          // Stack 3: run over
          s = addLog(s, FRAGMENTATION_TEXTS[3] ?? '');
          s = { ...s, status: 'lost' };
        } else {
          // Stack 1 or 2
          const newStatuses = existingFrag
            ? p.statuses.map((st) => st.id === 'fragmentation' ? { ...st, stacks: newStack } : st)
            : [...p.statuses, { id: 'fragmentation', label: `Fragmentace ${newStack}`, stacks: newStack }];
          let newMaxHp = p.maxHp;
          if (newStack === 1) newMaxHp = Math.max(10, p.maxHp - 5);
          s = updatePlayer(s, effect.playerId, {
            hp: 1,
            maxHp: newMaxHp,
            statuses: newStatuses,
          });
          s = addLog(s, FRAGMENTATION_TEXTS[newStack] ?? `LOG [FRAGMENTACE_${newStack}]: Subjekt poškozena.`);
        }
        break;
      }

      case 'noise_collapse': {
        s = addLog(s, NOISE_COLLAPSE_TEXT);
        s = { ...s, status: 'lost' };
        break;
      }

      default:
        break;
    }
  }

  return s;
}

// ── Card effect resolver ──────────────────────────────────────────────────────

export function resolveCardEffects(
  state: RunState,
  cardId: string,
  playerId: string,
  targetEnemyId?: string,
): RunState {
  const card: RunCard | undefined = RUN_CARDS[cardId];
  if (!card) return state;

  const player = state.players.find((p) => p.id === playerId);
  if (!player || !player.hand.includes(cardId)) return state;

  const newHand = player.hand.filter((id) => id !== cardId);
  let s = updatePlayer(state, playerId, { hand: newHand });
  s = { ...s, discard: [...s.discard, cardId] };

  const effects = card.effects(playerId, targetEnemyId ?? '');
  s = resolveEffects(s, effects);
  s = addLog(s, `${player.name} použil kartu: „${card.title}"`);

  return s;
}
