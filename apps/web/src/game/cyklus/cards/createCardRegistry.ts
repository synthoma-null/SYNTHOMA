import type { SwipeCard } from '../cyklusTypes';

export interface CardRegistryGroup {
  name: string;
  cards: Readonly<Record<string, SwipeCard>>;
}

export function createCardRegistry(
  order: readonly string[],
  ...groups: readonly CardRegistryGroup[]
): Record<string, SwipeCard> {
  const cardsById = new Map<string, { card: SwipeCard; group: string }>();

  for (const group of groups) {
    for (const [key, card] of Object.entries(group.cards)) {
      if (!key.trim() || !card.id.trim()) throw new Error(`[cyklus cards] empty card id in ${group.name}`);
      if (key !== card.id) throw new Error(`[cyklus cards] registry key ${key} does not match card.id ${card.id} in ${group.name}`);
      const previous = cardsById.get(key);
      if (previous) throw new Error(`[cyklus cards] duplicate card id ${key} in ${previous.group} and ${group.name}`);
      cardsById.set(key, { card, group: group.name });
    }
  }

  const result: Record<string, SwipeCard> = {};
  const orderedIds = new Set<string>();
  for (const id of order) {
    if (orderedIds.has(id)) throw new Error(`[cyklus cards] duplicate card id ${id} in registry order`);
    const entry = cardsById.get(id);
    if (!entry) throw new Error(`[cyklus cards] registry order references missing card ${id}`);
    orderedIds.add(id);
    result[id] = entry.card;
  }

  const unordered = [...cardsById.keys()].filter((id) => !orderedIds.has(id));
  if (unordered.length > 0) throw new Error(`[cyklus cards] cards missing from registry order: ${unordered.join(', ')}`);

  return result;
}
