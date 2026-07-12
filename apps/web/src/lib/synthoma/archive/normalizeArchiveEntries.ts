import type { ArchiveCardData } from '../../../../app/archive/ArchiveClient';
import type { ArchiveCard } from './archiveTypes';

export function normalizeArchiveCard(data: ArchiveCardData): ArchiveCard {
  return {
    id: data.id,
    category: data.category,
    title: data.title,
    teaser: data.teaser,
    quote: data.quote,
    body: Array.isArray(data.body) ? data.body : [],
    tags: data.tags,
    spoilerLevel: data.spoilerLevel,
    display: data.display,
    related: data.related,
    images: data.images,
    access: data.access
      ? {
          mode: data.access.mode,
          visibility: data.access.visibility,
          requiredChapterId: data.access.requiredChapterId,
          requiredChapterTitle: data.access.requiredChapterTitle,
          mnemCost: data.access.mnemCost,
          label: data.access.label,
          lockedText: data.access.lockedText,
          reason: data.access.reason,
        }
      : undefined,
    order: data.order,
    isLockedByDefault: data.isLockedByDefault,
    lockKind: data.lockKind,
  };
}

export function normalizeArchiveCards(cards: ArchiveCardData[]): ArchiveCard[] {
  return cards.map(normalizeArchiveCard).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
