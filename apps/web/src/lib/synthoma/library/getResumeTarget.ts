import { readLastChapterPath } from '../../readerState';
import generatedLibraryCatalog from '../../../content/generated/libraryCatalog.json';
import type { LibraryResumeTarget } from './libraryTypes';

function decodePath(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function chapterIdFromLegacyPath(path: string): string | null {
  const normalized = decodePath(path);
  for (const collection of generatedLibraryCatalog.collections) {
    const chapter = collection.chapters.find((item) => item.path === normalized || item.filename === normalized.split('/').pop());
    if (chapter?.id) return chapter.id;
  }
  return null;
}

export function resolveResumeHref(path: string): string {
  if (!path) return '/books';
  const apiMatch = path.match(/^\/api\/chapter\/([^/?]+)/);
  if (apiMatch) {
    return `/chapter/${encodeURIComponent(decodeURIComponent(apiMatch[1] ?? ''))}`;
  }
  if (path.startsWith('/chapter/')) {
    return path;
  }
  const chapterId = chapterIdFromLegacyPath(path);
  return chapterId ? `/chapter/${encodeURIComponent(chapterId)}` : '/books';
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
