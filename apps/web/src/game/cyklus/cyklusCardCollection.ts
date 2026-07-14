import { CYKLUS_CARD_ART_IDS } from './cyklusCardPresentation';
import { getCardById } from './cyklusEngine';
import type { CyklusDiscovery } from './cyklusDiscovery';
import type { CardCategory, CardPresentation } from './cyklusTypes';

export interface CyklusCardCollectionEntry {
  cardId: string;
  title: string;
  category: CardCategory;
  presentation: CardPresentation;
  discovered: boolean;
  firstSeenAt: number | null;
  lastSeenAt: number | null;
  seenCount: number | null;
}

export function getCyklusCardArtworkCatalog(discovery: CyklusDiscovery): CyklusCardCollectionEntry[] {
  const discovered = new Set(discovery.cards);
  return CYKLUS_CARD_ART_IDS.flatMap((cardId) => {
    const card = getCardById(cardId);
    if (!card?.presentation?.artSrc) return [];
    const record = discovery.cardRecords?.[cardId];
    return [{
      cardId,
      title: card.title,
      category: card.category,
      presentation: card.presentation,
      discovered: discovered.has(cardId),
      firstSeenAt: record?.firstSeenAt ?? null,
      lastSeenAt: record?.lastSeenAt ?? null,
      seenCount: record?.seenCount ?? null,
    }];
  });
}
