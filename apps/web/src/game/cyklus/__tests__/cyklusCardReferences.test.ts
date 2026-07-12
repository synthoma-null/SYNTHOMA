import fs from 'node:fs';
import path from 'node:path';
import { CYKLUS_CARDS, CYKLUS_ITEMS, CYKLUS_IMPRINTS } from '../content';
import { CYKLUS_CARD_ART_IDS } from '../cards/presentation';

describe('Cyklus card reference integrity', () => {
  const effects = Object.values(CYKLUS_CARDS).flatMap((card) => [...card.yes.effects, ...card.no.effects]);

  it.each(['schedule', 'scheduleNextCycle', 'unlockCard'] as const)('resolves every %s card reference', (effectType) => {
    const referencedIds = effects.flatMap((effect) => (
      effect.type === effectType && 'cardId' in effect ? [effect.cardId] : []
    ));
    expect(referencedIds.filter((id) => !CYKLUS_CARDS[id])).toEqual([]);
  });

  it('resolves every item and imprint trigger card', () => {
    const itemReferences = Object.values(CYKLUS_ITEMS).flatMap((item) => item.triggerCards ?? []);
    const imprintReferences = Object.values(CYKLUS_IMPRINTS).flatMap((imprint) => imprint.triggerCards ?? []);
    expect(itemReferences.filter((id) => !CYKLUS_CARDS[id])).toEqual([]);
    expect(imprintReferences.filter((id) => !CYKLUS_CARDS[id])).toEqual([]);
  });

  it('keeps presentation IDs, cards, and optimized WebP assets in one-to-one sync', () => {
    const assetDir = path.join(process.cwd(), 'public', 'cards', 'cyklus');
    const assetIds = fs.readdirSync(assetDir)
      .filter((file) => file.endsWith('.webp'))
      .map((file) => path.basename(file, '.webp'))
      .sort();
    const presentationIds = [...CYKLUS_CARD_ART_IDS].sort();

    expect(CYKLUS_CARD_ART_IDS.filter((id) => !CYKLUS_CARDS[id])).toEqual([]);
    expect(presentationIds).toEqual(assetIds);
    for (const id of CYKLUS_CARD_ART_IDS) {
      expect(CYKLUS_CARDS[id]?.presentation?.artSrc).toBe(`/cards/cyklus/${id}.webp`);
    }
  });

  it('keeps every merged registry key equal to card.id', () => {
    expect(Object.entries(CYKLUS_CARDS).filter(([key, card]) => key !== card.id)).toEqual([]);
  });
});
