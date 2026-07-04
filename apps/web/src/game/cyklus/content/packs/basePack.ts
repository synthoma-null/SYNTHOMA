import type { CyklusContentPack, SwipeCard } from '../contentTypes';
import { CYKLUS_CARDS as rawCards } from '../../cyklusCards';
import { CYKLUS_ITEMS as rawItems } from '../../cyklusItems';
import { CYKLUS_IMPRINTS as rawImprints } from '../../cyklusImprints';
import { CYKLUS_UNLOCKS } from '../../cyklusUnlocks';

function inferBaseRole(card: SwipeCard): NonNullable<SwipeCard['role']> {
  if (card.id.startsWith('restart_')) return 'echo';
  if (card.category === 'object' || card.tags.includes('item')) return 'object';
  if (card.category === 'crisis') return 'escalation';
  if (card.category === 'entity') return 'temptation';
  if (card.tags.includes('contract') || card.tags.includes('collect')) return 'bill';
  if (card.tags.includes('stabilize') || card.tags.includes('system')) return 'resolution';
  return 'entry';
}

const cards = Object.fromEntries(
  Object.entries(rawCards).map(([id, card]) => [
    id,
    { ...card, packId: 'base', role: card.role ?? inferBaseRole(card), tone: card.tone ?? ['tragic'] },
  ])
);

const items = Object.fromEntries(
  Object.entries(rawItems).map(([id, item]) => [id, { ...item, tags: [...item.tags, 'base'] }])
);

const imprints = Object.fromEntries(
  Object.entries(rawImprints).map(([id, imprint]) => [id, { ...imprint, tags: [...imprint.tags, 'base'] }])
);

export const basePack: CyklusContentPack = {
  id: 'base',
  title: 'Základní cyklus',
  description: 'Původní jádro SYNTHOMA: CYKLUS. Prázdnota, entity, itemy a stabilizační cesty.',
  tone: ['tragic', 'horror', 'tender'],
  sectors: ['void', 'archive', 'mirror', 'glitchka_nest', 'form_office', 'residuum', 'market', 'acid_yellow'],
  cards,
  items,
  imprints,
  unlocks: CYKLUS_UNLOCKS,
};
