import { CYKLUS_CARDS } from '../content';
import {
  CYKLUS_CARD_ART_IDS,
  DEFAULT_CARD_CHOICE_ORDER,
  getCardChoiceOrder,
  getChoiceForPhysicalSide,
} from '../cyklusCardPresentation';

describe('Cyklus card presentation', () => {
  it('registers every available poster against a real card', () => {
    expect(CYKLUS_CARD_ART_IDS).toHaveLength(66);
    expect(new Set(CYKLUS_CARD_ART_IDS).size).toBe(CYKLUS_CARD_ART_IDS.length);

    for (const id of CYKLUS_CARD_ART_IDS) {
      const card = CYKLUS_CARDS[id]!;
      expect(card).toBeDefined();
      expect(card.presentation).toMatchObject({
        mode: 'poster-then-text',
        artSrc: `/cards/cyklus/${id}.webp`,
        choiceOrder: ['yes', 'no'],
      });
    }
  });

  it('leaves cards without art in their original text-first order', () => {
    const card = CYKLUS_CARDS.first_boot!;
    expect(card.presentation).toBeUndefined();
    expect(getCardChoiceOrder(card)).toEqual(DEFAULT_CARD_CHOICE_ORDER);
    expect(getChoiceForPhysicalSide(card, 'left')).toBe('no');
    expect(getChoiceForPhysicalSide(card, 'right')).toBe('yes');
  });

  it('maps poster choices to their explicit physical sides without changing semantics', () => {
    const card = CYKLUS_CARDS.noise_filter!;
    expect(getChoiceForPhysicalSide(card, 'left')).toBe('yes');
    expect(getChoiceForPhysicalSide(card, 'right')).toBe('no');
  });
});
