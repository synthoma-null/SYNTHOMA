import { readLastChapterPath } from '../../readerState';
import type { LibraryResumeTarget } from './libraryTypes';

export function resolveResumeHref(path: string): string {
  if (!path) return '/books';
  const apiMatch = path.match(/^\/api\/chapter\/([^/?]+)/);
  if (apiMatch) {
    return `/chapter/${encodeURIComponent(decodeURIComponent(apiMatch[1] ?? ''))}`;
  }
  if (path.startsWith('/chapter/')) {
    return path;
  }
  if (path.startsWith('/books/')) {
    return `/reader?u=${encodeURIComponent(path)}`;
  }
  return path.startsWith('/') ? `/reader?u=${encodeURIComponent(path)}` : `/reader?u=${encodeURIComponent(path)}`;
}

export function getResumeTargetFromPath(path: string, chapterTitle = ''): LibraryResumeTarget {
  return {
    href: resolveResumeHref(path),
    label: 'POKRAČOVAT VE ČTENÍ',
    chapterId: '',
    chapterTitle: chapterTitle || '',
    collectionSlug: '',
    percent: 0,
  };
}

export function getResumeTarget(): LibraryResumeTarget | null {
  if (typeof window === 'undefined') return null;
  const path = readLastChapterPath();
  if (!path) return null;
  return getResumeTargetFromPath(path);
}
