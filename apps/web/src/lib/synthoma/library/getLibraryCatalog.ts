import generatedLibraryCatalog from '../../../content/generated/libraryCatalog.json';
import type { LibraryCatalog, LibraryCollection } from './libraryTypes';

export async function getLibraryCatalog(): Promise<LibraryCatalog> {
  if (process.env.NODE_ENV === 'test') return generatedLibraryCatalog as LibraryCatalog;
  const { getManagedLibraryCatalog } = await import('../../../server/content/managedContent');
  return getManagedLibraryCatalog();
}

export async function getLibraryCollectionBySlug(slug: string): Promise<LibraryCollection | undefined> {
  const catalog = await getLibraryCatalog();
  return catalog.collections.find((collection) => collection.slug.toLowerCase() === slug.toLowerCase());
}
