// ── RunEffect union ───────────────────────────────────────────────────────────
// All game effects (cards, enemy intents, relics, event choices, rewards, boss)
// flow through resolveEffects(state, effects, context) in effectResolver.ts

export type RunEffect =
  | { type: 'deal_damage'; targetId: string; amount: number }
  | { type: 'gain_block'; playerId: string; amount: number }
  | { type: 'gain_noise'; playerId: string; amount: number }
  | { type: 'lose_noise'; playerId: string; amount: number }
  | { type: 'gain_laugh'; playerId: string; amount: number }
  | { type: 'lose_laugh'; playerId: string; amount: number }
  | { type: 'heal'; playerId: string; amount: number }
  | { type: 'draw_cards'; playerId: string; amount: number }
  | { type: 'discard_random'; playerId: string; amount: number }
  | { type: 'add_status'; targetId: string; statusId: string; label: string; stacks: number; turnsLeft?: number }
  | { type: 'remove_status'; targetId: string; statusId: string }
  | { type: 'modify_void_pressure'; amount: number }
  | { type: 'lock_card'; playerId: string; turns: number }
  | { type: 'steal_laugh'; fromPlayerId: string; toEnemyId: string; amount: number }
  | { type: 'advance_boss_phase'; enemyId: string }
  | { type: 'skip_enemy_intent'; enemyId: string }
  | { type: 'add_log'; message: string }
  | { type: 'apply_fragmentation'; playerId: string }
  | { type: 'noise_collapse'; playerId: string };
