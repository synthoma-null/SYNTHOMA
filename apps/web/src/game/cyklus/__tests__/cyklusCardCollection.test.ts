import { CYKLUS_CARD_ART_IDS } from '../cyklusCardPresentation';
import { getCyklusCardArtworkCatalog } from '../cyklusCardCollection';
import { getEmptyDiscovery, loadDiscovery } from '../cyklusDiscovery';

describe('Cyklus card artwork collection', () => {
  beforeEach(() => localStorage.clear());

  it('is generated from the canonical poster mapping and real card registry', () => {
    const catalog = getCyklusCardArtworkCatalog(getEmptyDiscovery());
    expect(catalog).toHaveLength(CYKLUS_CARD_ART_IDS.length);
    expect(catalog.every((entry) => entry.presentation.artSrc?.endsWith(`${entry.cardId}.webp`))).toBe(true);
    expect(new Set(catalog.map((entry) => entry.cardId)).size).toBe(catalog.length);
  });

  it('does not discover a card by importing or listing the registry', () => {
    const catalog = getCyklusCardArtworkCatalog(loadDiscovery());
    expect(catalog.every((entry) => !entry.discovered)).toBe(true);
    expect(loadDiscovery().cards).toEqual([]);
  });

  it('uses existing discovery IDs without changing internal card IDs', () => {
    const discovery = { ...getEmptyDiscovery(), cards: ['restart_0'] };
    const entry = getCyklusCardArtworkCatalog(discovery).find((card) => card.cardId === 'restart_0');
    expect(entry).toMatchObject({ cardId: 'restart_0', discovered: true });
  });
});
