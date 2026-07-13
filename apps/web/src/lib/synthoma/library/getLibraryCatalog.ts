import generatedLibraryCatalog from '../../../content/generated/libraryCatalog.json';
import type { LibraryCatalog, LibraryChapter, LibraryCollection } from './libraryTypes';

export async function getLibraryCatalog(): Promise<LibraryCatalog> {
  return generatedLibraryCatalog as LibraryCatalog;
}

export async function getLibraryCollectionBySlug(slug: string): Promise<LibraryCollection | undefined> {
  const catalog = await getLibraryCatalog();
  return catalog.collections.find((collection) => collection.slug.toLowerCase() === slug.toLowerCase());
}
