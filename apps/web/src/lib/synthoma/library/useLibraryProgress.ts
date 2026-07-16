import { useEffect, useMemo, useState } from 'react';
import { readReadingProgress } from '../../readerState';
import type { LibraryChapter, LibraryCollection, LibraryReadingProgress } from './libraryTypes';

export interface LibraryProgressRecord {
  chapterId: string;
  path: string;
  percent: number;
  completed: boolean;
  updatedAt: number;
}

export interface LibraryProgressSnapshot {
  byChapterId: Record<string, LibraryProgressRecord>;
  byCollection: Record<string, LibraryReadingProgress>;
  loading: boolean;
}

function getFilenameFromPath(path: string): string {
  return decodeURIComponent(path.split('/').pop() || '');
}

export function useLibraryProgress(collections: LibraryCollection[]) {
  const [serverProgress, setServerProgress] = useState<Array<{ chapterId: string; completed: boolean; progressPercent?: number; updatedAt?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/me/progress', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setServerProgress(Array.isArray(data?.progress) ? data.progress : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const snapshot = useMemo<LibraryProgressSnapshot>(() => {
    const byChapterId: Record<string, LibraryProgressRecord> = {};
    const byCollection: Record<string, LibraryReadingProgress> = {};

    for (const col of collections) {
      const local = readReadingProgress(col.slug);
      if (local) {
        byCollection[col.slug] = {
          collectionSlug: col.slug,
          path: local.path,
          percent: local.percent,
          updatedAt: local.updatedAt,
        };
      }

      for (const ch of col.chapters) {
        const isLocal = local?.path === ch.path;
        const percent = isLocal ? local.percent : 0;
        const server = serverProgress.find((p) => p.chapterId === ch.id);
        const completed = server?.completed ?? false;
        const updatedAt = local?.updatedAt ? local.updatedAt : server?.updatedAt ? new Date(server.updatedAt).getTime() : 0;

        byChapterId[ch.id] = {
          chapterId: ch.id,
          path: ch.path,
          percent: completed ? 100 : percent,
          completed,
          updatedAt,
        };
      }
    }

    return { byChapterId, byCollection, loading };
  }, [collections, serverProgress, loading]);

  return snapshot;
}

export function getResumeChapter(collections: LibraryCollection[], byCollection: Record<string, LibraryReadingProgress>): { collection: LibraryCollection; chapter: LibraryChapter } | null {
  let latest: { collection: LibraryCollection; chapter: LibraryChapter; progress: LibraryReadingProgress } | null = null;
  for (const col of collections) {
    const p = byCollection[col.slug];
    if (!p) continue;
    const ch = col.chapters.find((c) => c.path === p.path);
    if (!ch) continue;
    if (!latest || (p.updatedAt && p.updatedAt > latest.progress.updatedAt)) {
      latest = { collection: col, chapter: ch, progress: p };
    }
  }
  return latest ? { collection: latest.collection, chapter: latest.chapter } : null;
}

export function pathToHref(path: string, chapterId: string): string {
  if (chapterId) return `/chapter/${encodeURIComponent(chapterId)}`;
  return '/books';
}
