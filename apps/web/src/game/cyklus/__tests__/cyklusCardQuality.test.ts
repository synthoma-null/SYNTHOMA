import { CYKLUS_CARDS } from '../content';
import type { SwipeCard, CyklusEffect } from '../cyklusTypes';

// ── CARD DEPTH CLASSIFIER ─────────────────────────────────────────────────────

type CardDepth = 'thin' | 'normal' | 'deep';

const SHALLOW_TYPES = new Set<CyklusEffect['type']>(['stat', 'profile', 'noImmediateEffect']);
const DEEP_TYPES = new Set<CyklusEffect['type']>([
  'schedule', 'scheduleNextCycle', 'unlockPool', 'unlockCard', 'imprint',
  'entityRelation', 'moveSector',
]);

function classifyCardDepth(card: SwipeCard): CardDepth {
  const allEffects = [...card.yes.effects, ...card.no.effects];
  const hasItem = allEffects.some((e) => e.type === 'item' || e.type === 'removeItem');
  const hasFlag = allEffects.some((e) => e.type === 'flag' || e.type === 'removeFlag');
  const hasDeep = allEffects.some((e) => DEEP_TYPES.has(e.type));
  const hasConditions = (card.conditions?.length ?? 0) > 0;
  const hasScheduledTrigger = card.triggerMode === 'scheduledOnly';

  if (hasDeep || hasItem) return 'deep';
  if (hasFlag || hasConditions || hasScheduledTrigger) return 'normal';
  if (allEffects.every((e) => SHALLOW_TYPES.has(e.type))) return 'thin';
  return 'normal';
}

// ── TESTS ─────────────────────────────────────────────────────────────────────

describe('Card quality lint', () => {
  const allCards = Object.values(CYKLUS_CARDS) as SwipeCard[];

  it('classifyCardDepth returns a valid depth for every card', () => {
    for (const card of allCards) {
      const depth = classifyCardDepth(card);
      expect(['thin', 'normal', 'deep']).toContain(depth);
    }
  });

  it('object/followup/rare/critical cards must not be thin unless qualityHint is set', () => {
    const sensitiveCategories = new Set(['object', 'followup', 'rare', 'crisis', 'item_trigger', 'unlock']);
    const violations: string[] = [];
    for (const card of allCards) {
      if (sensitiveCategories.has(card.category) || card.rarity === 'rare' || card.rarity === 'critical') {
        const depth = classifyCardDepth(card);
        if (depth === 'thin' && !card.qualityHint) violations.push(`${card.id} (${card.category}, ${card.rarity})`);
      }
    }
    if (violations.length > 0) {
      console.warn('[CARD QUALITY] Thin cards in sensitive categories (no qualityHint):', violations);
    }
    expect(violations).toHaveLength(0);
  });

  it('reports thin card count as a snapshot (informational, not blocking)', () => {
    const thinCards = allCards.filter((c) => classifyCardDepth(c) === 'thin');
    const thinIds = thinCards.map((c) => `${c.id} (${c.category})`);
    if (thinIds.length > 0) {
      console.warn(`[CARD QUALITY] Thin cards (${thinIds.length}/${allCards.length}):`, thinIds.join(', '));
    }
    expect(thinIds.length).toBeLessThan(allCards.length * 0.4);
  });

  it('every card has non-empty title, scene and logLabel', () => {
    const invalid: string[] = [];
    for (const card of allCards) {
      if (!card.title?.trim()) invalid.push(`${card.id}: missing title`);
      if (!card.scene?.trim()) invalid.push(`${card.id}: missing scene`);
      if (!card.logLabel?.trim()) invalid.push(`${card.id}: missing logLabel`);
    }
    expect(invalid).toHaveLength(0);
  });

  it('every card has non-empty yes/no labels', () => {
    const invalid: string[] = [];
    for (const card of allCards) {
      if (!card.yesLabel?.trim()) invalid.push(`${card.id}: missing yesLabel`);
      if (!card.noLabel?.trim()) invalid.push(`${card.id}: missing noLabel`);
    }
    expect(invalid).toHaveLength(0);
  });
});
