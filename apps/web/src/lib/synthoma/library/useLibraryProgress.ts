import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { readReadingProgress, readChapterProgress } from '../../readerState';
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

export function useLibraryProgress(collections: LibraryCollection[]) {
  const { status, data: session } = useSession();
  const userId = session?.user?.id;
  const [serverProgress, setServerProgress] = useState<Array<{ chapterId: string; completed: boolean; progressPercent?: number; updatedAt?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [loadedUserId, setLoadedUserId] = useState<string>();

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      setServerProgress([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setServerProgress([]);
    setLoadedUserId(undefined);
    setLoading(true);
    fetch('/api/me/progress', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        setServerProgress(Array.isArray(data?.progress) ? data.progress : []);
        setLoadedUserId(userId);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [status, userId]);

  const snapshot = useMemo<LibraryProgressSnapshot>(() => {
    const byChapterId: Record<string, LibraryProgressRecord> = {};
    const byCollection: Record<string, LibraryReadingProgress> = {};

    for (const col of collections) {
      const recent = readReadingProgress(col.slug);
      for (const ch of col.chapters) {
        const stored = readChapterProgress(col.slug, ch.id) ?? (recent?.path === ch.path ? recent : null);
        const local = stored?.userId && stored.userId !== userId ? null : stored;
        const server = status === 'authenticated' && loadedUserId === userId
          ? serverProgress.find(p => p.chapterId === ch.id)
          : undefined;
        const completed = Boolean(server?.completed || local?.completed);
        const percent = completed ? 100 : Math.max(local?.percent ?? 0, server?.progressPercent ?? 0);
        const updatedAt = Math.max(local?.updatedAt ?? 0, server?.updatedAt ? new Date(server.updatedAt).getTime() : 0);
        byChapterId[ch.id] = { chapterId: ch.id, path: ch.path, percent, completed, updatedAt };
        if ((local || server) && (!byCollection[col.slug] || updatedAt > (byCollection[col.slug]?.updatedAt ?? 0))) {
          byCollection[col.slug] = { collectionSlug: col.slug, path: ch.path, percent, updatedAt };
        }
      }
    }

    return { byChapterId, byCollection, loading };
  }, [collections, serverProgress, loading, userId, loadedUserId, status]);

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
