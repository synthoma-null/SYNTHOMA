import publicBooksManifest from '../../../../public/books/manifest.json';
import { CHAPTER_CATALOG } from '../../../content/catalog';
import type { LibraryCatalog, LibraryChapter, LibraryCollection } from './libraryTypes';

export async function getLibraryCatalog(): Promise<LibraryCatalog> {
  const manifestCollection = publicBooksManifest.collections[0];
  const chapters: LibraryChapter[] = CHAPTER_CATALOG.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    path: chapter.publicPath,
    filename: chapter.filename,
    collectionSlug: chapter.collection,
    order: chapter.order ?? 0,
    access:
      chapter.availability === 'unavailable'
        ? 'unavailable'
        : chapter.accessPolicy === 'free'
          ? 'free'
          : 'locked',
    mnemCost: chapter.mnemCost,
    packageIds: chapter.packageIds,
    backgroundVideo: chapter.backgroundVideo,
    track: chapter.track,
    summary: chapter.summary,
    status: chapter.status,
    estimatedMinutes:
      typeof chapter.metadata?.estimatedMinutes === 'number'
        ? chapter.metadata.estimatedMinutes
        : undefined,
    teaser: typeof chapter.metadata?.teaser === 'string' ? chapter.metadata.teaser : undefined,
    unlocks: typeof chapter.metadata?.unlocks === 'string' ? chapter.metadata.unlocks : undefined,
  }));

  const collection: LibraryCollection = {
    slug: manifestCollection?.slug ?? 'SYNTHOMA-NULL',
    title: manifestCollection?.title ?? 'SYNTHOMA-NULL',
    cover: manifestCollection?.cover,
    chapters,
    availableCount: chapters.filter((chapter) => chapter.access === 'free').length,
    totalCount: chapters.length,
  };

  return { collections: [collection] };
}

export async function getLibraryCollectionBySlug(slug: string): Promise<LibraryCollection | undefined> {
  const catalog = await getLibraryCatalog();
  return catalog.collections.find((collection) => collection.slug.toLowerCase() === slug.toLowerCase());
}
