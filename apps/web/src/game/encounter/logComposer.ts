import type { PlayerActionId } from './encounterTypes';
import {
  ACTION_INTRO_TEXTS,
  ACTION_OUTCOME_TEXTS,
  ENEMY_FLAVOUR_TEXTS,
  pickFromPool,
} from './textPools';

// ── Action label map ──────────────────────────────────────────────────────────

const ACTION_LOG_LABELS: Record<PlayerActionId, string> = {
  attack:   'ACTION_ATTACK',
  dash:     'ACTION_DASH',
  hack:     'ACTION_HACK',
  defend:   'ACTION_DEFEND',
  sarcasm:  'ACTION_SARCASM',
};

// ── Log context ───────────────────────────────────────────────────────────────

export interface LogContext {
  actionId: PlayerActionId;
  playerName: string;
  enemyName?: string | undefined;
  damage?: number | undefined;
  blocked?: number | undefined;
  healAmount?: number | undefined;
  noiseGained?: number | undefined;
  laughGained?: number | undefined;
  roll?: number | undefined;
  outcome: 'success' | 'fail' | 'crit' | 'neutral' | 'partial';
  round: number;
  seed?: number | undefined;
  tags?: string[] | undefined;
}

// ── Main composer ─────────────────────────────────────────────────────────────

export function composeActionLog(ctx: LogContext): string {
  const seed = ctx.seed ?? ctx.round;
  const label = ACTION_LOG_LABELS[ctx.actionId];

  const introText = pickFromPool(ACTION_INTRO_TEXTS[ctx.actionId] ?? [], ctx.round, seed);

  let outcomeKey = '';
  if (ctx.actionId === 'attack') {
    outcomeKey = ctx.outcome === 'crit' ? 'attack_crit' : ctx.outcome === 'fail' ? 'attack_fail' : 'attack_success';
  } else if (ctx.actionId === 'dash') {
    outcomeKey = ctx.outcome === 'partial' ? 'dash_partial' : 'dash_success';
  } else if (ctx.actionId === 'hack') {
    outcomeKey = ctx.outcome === 'fail' ? 'hack_fail' : 'hack_success';
  } else if (ctx.actionId === 'defend') {
    outcomeKey = 'defend_success';
  } else if (ctx.actionId === 'sarcasm') {
    if (ctx.outcome === 'crit') outcomeKey = 'sarcasm_crit';
    else if (ctx.outcome === 'success') outcomeKey = 'sarcasm_good';
    else outcomeKey = 'sarcasm_bad';
  }

  const outcomeText = outcomeKey ? pickFromPool(ACTION_OUTCOME_TEXTS[outcomeKey] ?? [], ctx.round + 1, seed) : '';

  const stats: string[] = [];
  if (ctx.damage !== undefined && ctx.damage > 0) stats.push(`Poškození: ${ctx.damage}`);
  if (ctx.blocked !== undefined && ctx.blocked > 0) stats.push(`Blok: ${ctx.blocked}`);
  if (ctx.healAmount !== undefined && ctx.healAmount > 0) stats.push(`+${ctx.healAmount} HP`);
  if (ctx.laughGained !== undefined && ctx.laughGained > 0) stats.push(`+${ctx.laughGained} Smích`);
  if (ctx.noiseGained !== undefined && ctx.noiseGained > 0) stats.push(`+${ctx.noiseGained} Šum`);

  const lines: string[] = [`LOG [${label}]:`];
  if (introText) lines.push(introText);
  if (outcomeText) lines.push(outcomeText);
  if (stats.length > 0) lines.push(`» ${stats.join(' · ')}`);

  return lines.join('\n');
}

// ── Enemy intent log ──────────────────────────────────────────────────────────

export interface EnemyIntentContext {
  enemyId?: string | undefined;
  enemyName: string;
  intentLabel: string;
  damage?: number | undefined;
  outcome: 'hit' | 'blocked' | 'missed';
  blocked?: number | undefined;
  round?: number | undefined;
}

export function composeEnemyLog(ctx: EnemyIntentContext): string {
  const flavourPool = ctx.enemyId ? (ENEMY_FLAVOUR_TEXTS[ctx.enemyId] ?? []) : [];
  const flavour = flavourPool.length > 0
    ? pickFromPool(flavourPool, ctx.round ?? 0, ctx.round ?? 0)
    : '';

  const lines: string[] = [`LOG [ENTITY_ACTION]:`];

  if (ctx.outcome === 'hit') {
    lines.push(`${ctx.enemyName} provedl: ${ctx.intentLabel}`);
    if (ctx.damage) lines.push(`» Způsobeno ${ctx.damage} poškození.`);
  } else if (ctx.outcome === 'blocked') {
    lines.push(`${ctx.enemyName} zaútočil: ${ctx.intentLabel}`);
    lines.push(`» Blok absorboval ${ctx.blocked ?? 0}. Zbytek prošel.`);
  } else {
    lines.push(`${ctx.enemyName}: záměr minul.`);
    lines.push(`» ${ctx.intentLabel} — výsledek: nulový.`);
  }

  if (flavour) lines.push(`// ${flavour}`);

  return lines.join('\n');
}

// ── System log ────────────────────────────────────────────────────────────────

export function composeSystemLog(message: string): string {
  return message;
}
