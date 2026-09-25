"use client";

import { useEffect, useState, type CSSProperties } from 'react';
import { useSession } from 'next-auth/react';
import { useLang } from '../../lib/LangContext';
import { READER_FLOW_EVENT, type ReaderFlowEventDetail } from '../../lib/readerDecisionController';
import { readChapterProgress, readReadingProgress, saveLastChapterPath, saveReadingProgress } from '../../lib/readerState';
import { flushReadingProgress, queueReadingProgress, type ProgressWrite } from '../../lib/readingSync';

interface Props { chapterId: string; chapterTitle: string; collection: string; chapterPath: string; hasDecisions?: boolean; }
type SyncState = 'loading' | 'local' | 'saving' | 'saved' | 'pending' | 'unavailable';

function pageProgress(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  return scrollable <= 0 ? 100 : Math.max(0, Math.min(100, Math.round(window.scrollY / scrollable * 100)));
}

export default function ChapterReadingProgress({ chapterId, chapterTitle, collection, chapterPath, hasDecisions = false }: Props) {
  const { t, lang } = useLang();
  const { status: sessionStatus, data: session } = useSession();
  const userId = session?.user?.id;
  const [progress, setProgress] = useState(0);
  const [syncState, setSyncState] = useState<SyncState>('loading');

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    let disposed = false;
    let ready = false;
    let frame = 0;
    let highest = 0;
    let completed = false;
    let decisionComplete = !hasDecisions;
    let lastQueued = -5;
    let lastCompleted = false;
    let pending = false;
    let latest: ProgressWrite | null = null;
    const startedAt = Date.now();
    const authenticated = sessionStatus === 'authenticated' && Boolean(userId);
    const setStatus = (state: SyncState) => { if (!disposed) setSyncState(state); };

    const flush = async () => {
      if (!authenticated || !userId || !pending) return;
      setStatus('saving');
      try {
        await flushReadingProgress(userId);
        pending = false;
        setStatus('saved');
      } catch { setStatus('pending'); }
    };
    const queue = () => {
      if (!latest || !authenticated || !userId) return;
      if (!queueReadingProgress(userId, latest)) { setStatus('unavailable'); return; }
      pending = true;
      void flush();
    };
    const persist = (next: number, forceComplete = false) => {
      if (!ready || disposed) return;
      const canComplete = !hasDecisions || decisionComplete || completed || forceComplete;
      highest = Math.max(highest, hasDecisions && !canComplete ? Math.min(next, 97) : next);
      completed = completed || forceComplete || (!hasDecisions && highest >= 98);
      if (completed) highest = 100;
      const saved = saveReadingProgress({ bookId: collection, chapterId, path: chapterPath,
        percent: highest, completed, updatedAt: Date.now(), ...(userId ? { userId } : {}) });
      setProgress(highest);
      latest = { collection, chapterId, chapterTitle, progressPercent: highest, completed, readMs: Date.now() - startedAt };
      if (!saved) { setStatus('unavailable'); return; }
      if (!authenticated) { setStatus('local'); return; }
      if (highest - lastQueued >= 5 || completed !== lastCompleted) {
        lastQueued = highest; lastCompleted = completed; queue();
      }
    };
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => persist(pageProgress())); };
    const onFlow = (event: Event) => {
      const detail = (event as CustomEvent<ReaderFlowEventDetail>).detail;
      if (detail?.chapterId !== chapterId || !detail.complete) return;
      decisionComplete = true;
      persist(100, true);
    };
    const initialize = async () => {
      const recent = readReadingProgress(collection);
      const stored = readChapterProgress(collection, chapterId) ?? (recent?.path === chapterPath ? recent : null);
      const local = stored?.userId && stored.userId !== userId ? null : stored;
      highest = local?.percent ?? 0;
      completed = Boolean(local?.completed);
      if (authenticated) {
        try {
          const response = await fetch('/api/me/progress', { cache: 'no-store', credentials: 'same-origin' });
          if (!response.ok) throw new Error('PROGRESS_UNAVAILABLE');
          const data = await response.json();
          if (disposed) return;
          const remote = data.progress?.find((item: { chapterId: string; collection: string }) => item.chapterId === chapterId && item.collection === collection);
          if (remote) { highest = Math.max(highest, remote.progressPercent); completed ||= remote.completed; }
        } catch { /* Local progress stays usable while disconnected. */ }
      }
      if (disposed) return;
      if (completed) highest = 100;
      decisionComplete ||= completed;
      setProgress(highest);
      saveLastChapterPath(chapterPath);
      await (document.fonts?.ready ?? Promise.resolve());
      if (disposed) return;
      if (highest > 1 && highest < 98) {
        window.scrollTo({ top: Math.max(0, (document.documentElement.scrollHeight - window.innerHeight) * highest / 100), behavior: 'auto' });
      }
      const root = document.querySelector<HTMLElement>(`[data-reader-chapter-id="${CSS.escape(chapterId)}"]`);
      if (root?.dataset.readerFlowState === 'CHAPTER_COMPLETE') { decisionComplete = true; completed = true; }
      ready = true;
      persist(Math.max(highest, pageProgress()), completed);
    };
    void initialize();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('online', flush);
    window.addEventListener('pagehide', queue);
    document.addEventListener(READER_FLOW_EVENT, onFlow);
    const retry = window.setInterval(() => { if (pending) void flush(); }, 15000);
    return () => {
      queue(); disposed = true; cancelAnimationFrame(frame); window.clearInterval(retry);
      window.removeEventListener('scroll', update); window.removeEventListener('resize', update);
      window.removeEventListener('online', flush); window.removeEventListener('pagehide', queue);
      document.removeEventListener(READER_FLOW_EVENT, onFlow);
    };
  }, [chapterId, chapterPath, chapterTitle, collection, hasDecisions, sessionStatus, userId]);

  const messages = lang === 'en'
    ? { loading: 'Loading reading position…', local: 'Saved on this device', saving: 'Saving…', saved: 'Saved to your account', pending: 'Saved on this device · waiting to sync', unavailable: 'Unable to save progress on this device' }
    : { loading: 'Načítám místo ve čtení…', local: 'Uloženo v tomto zařízení', saving: 'Ukládám…', saved: 'Uloženo v účtu', pending: 'Uloženo v tomto zařízení · čeká na synchronizaci', unavailable: 'Postup se nepodařilo uložit v tomto zařízení' };
  return <>
    <div className="chapter-reader__progress" role="progressbar" aria-label={t('reader.progress.aria')}
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} style={{ '--chapter-progress': `${progress}%` } as CSSProperties}>
      <span className="chapter-reader__progress-bar" /><span className="chapter-reader__progress-label">{progress}%</span>
    </div>
    <p className="chapter-reader__save-status" role="status" aria-live="polite">{messages[syncState]}</p>
  </>;
}
