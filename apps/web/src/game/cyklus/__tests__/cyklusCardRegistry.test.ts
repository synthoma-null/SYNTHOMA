import { CYKLUS_CARDS, CYKLUS_CARD_ORDER } from '../cards';
import { CHOICE_CARDS } from '../cards/choice.cards';
import { CRISIS_CARDS } from '../cards/crisis.cards';
import { createCardRegistry } from '../cards/createCardRegistry';
import { ENTITY_CARDS } from '../cards/entity.cards';
import { FOLLOWUP_CARDS } from '../cards/followup.cards';
import { MEMORY_CARDS } from '../cards/memory.cards';
import { OBJECT_CARDS } from '../cards/object.cards';
import { PATH_CARDS } from '../cards/path.cards';
import { RESTART_CARDS } from '../cards/restart.cards';
import { SPECIAL_CARDS } from '../cards/special.cards';
import { SYSTEM_CARDS } from '../cards/system.cards';
import { TUTORIAL_CARDS } from '../cards/tutorial.cards';

describe('Cyklus raw card registry', () => {
  it('preserves the audited count, exact order, and category module sizes', () => {
    expect(Object.keys(CYKLUS_CARDS)).toEqual([...CYKLUS_CARD_ORDER]);
    expect(CYKLUS_CARD_ORDER).toHaveLength(241);
    expect({
      system: Object.keys(SYSTEM_CARDS).length,
      choice: Object.keys(CHOICE_CARDS).length,
      memory: Object.keys(MEMORY_CARDS).length,
      object: Object.keys(OBJECT_CARDS).length,
      followup: Object.keys(FOLLOWUP_CARDS).length,
      path: Object.keys(PATH_CARDS).length,
      entity: Object.keys(ENTITY_CARDS).length,
      crisis: Object.keys(CRISIS_CARDS).length,
      restart: Object.keys(RESTART_CARDS).length,
      tutorial: Object.keys(TUTORIAL_CARDS).length,
      special: Object.keys(SPECIAL_CARDS).length,
    }).toEqual({ system: 32, choice: 4, memory: 17, object: 20, followup: 53, path: 19, entity: 24, crisis: 18, restart: 6, tutorial: 17, special: 31 });
    expect(Object.entries(CYKLUS_CARDS).every(([key, card]) => key === card.id)).toBe(true);
  });

  it('rejects duplicate IDs with both group names', () => {
    const card = SYSTEM_CARDS.first_boot!;
    expect(() => createCardRegistry([card.id], { name: 'alpha', cards: { [card.id]: card } }, { name: 'beta', cards: { [card.id]: card } }))
      .toThrow('duplicate card id first_boot in alpha and beta');
  });

  it('rejects mismatched, empty, missing, or unordered card IDs', () => {
    const card = SYSTEM_CARDS.first_boot!;
    expect(() => createCardRegistry(['alias'], { name: 'system', cards: { alias: card } })).toThrow('registry key alias does not match card.id first_boot');
    expect(() => createCardRegistry([''], { name: 'system', cards: { '': { ...card, id: '' } } })).toThrow('empty card id');
    expect(() => createCardRegistry(['missing'], { name: 'system', cards: { [card.id]: card } })).toThrow('registry order references missing card missing');
    expect(() => createCardRegistry([], { name: 'system', cards: { [card.id]: card } })).toThrow('cards missing from registry order: first_boot');
  });
});
