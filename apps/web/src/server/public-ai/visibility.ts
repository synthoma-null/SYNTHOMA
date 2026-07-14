import type { ChapterCatalogEntry } from '../../content/catalog';
import type { ArchiveCard } from '../../lib/synthoma/archive/archiveTypes';
import { hasCyklusCardArt } from '../../game/cyklus/cyklusCardPresentation';
import type { SwipeCard } from '../../game/cyklus/cyklusTypes';

export type PublicVisibility = 'publicFull' | 'publicMetadata' | 'private';
export type PublicCardVisibility = 'publicFull' | 'publicMetadata' | 'hidden';

export function resolveChapterPublicVisibility(chapter: ChapterCatalogEntry): PublicVisibility {
  if (chapter.availability === 'published' && chapter.accessPolicy === 'free') return 'publicFull';
  return 'publicMetadata';
}

export function resolveArchivePublicVisibility(card: ArchiveCard): PublicVisibility {
  const access = card.access;
  if (!access || (access.mode === 'free' && access.visibility === 'full')) return 'publicFull';
  if (access.visibility === 'hidden') return 'private';
  return 'publicMetadata';
}

export function resolveCardPublicVisibility(card: SwipeCard): PublicCardVisibility {
  if (card.category === 'tutorial') return 'hidden';
  if (hasCyklusCardArt(card.id)) return 'publicFull';
  return 'publicMetadata';
}

export function isPublicFull(value: PublicVisibility | PublicCardVisibility): boolean {
  return value === 'publicFull';
}
