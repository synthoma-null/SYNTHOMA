'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLang } from '../../lib/LangContext';
import { READER_FLOW_EVENT, type ReaderFlowEventDetail } from '../../lib/readerDecisionController';
import { readReadingProgress, saveLastChapterPath, saveReadingProgress } from '../../lib/readerState';

interface Props {
  chapterId: string;
  chapterTitle: string;
  collection: string;
  chapterPath: string;
  hasDecisions?: boolean;
}

function pageProgress(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((window.scrollY / scrollable) * 100)));
}

export default function ChapterReadingProgress({ chapterId, chapterTitle, collection, chapterPath, hasDecisions = false }: Props) {
  const { t } = useLang();
  const [progress, setProgress] = useState(0);
  const lastServerProgress = useRef(-5);
  const startedAt = useRef(Date.now());
  const decisionComplete = useRef(!hasDecisions);

  useEffect(() => {
    const stored = readReadingProgress(collection);
    const initial = stored?.path === chapterPath ? stored.percent : 0;
    decisionComplete.current = !hasDecisions || Boolean(stored?.path === chapterPath && stored.completed);
    setProgress(initial);
    saveLastChapterPath(chapterPath);

    if (initial > 1 && initial < 98 && typeof window.scrollTo === 'function') {
      const restore = () => requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: Math.max(0, scrollable * (initial / 100)), behavior: 'auto' });
      });
      void (document.fonts?.ready ?? Promise.resolve()).then(restore);
    }

    let frame = 0;
    const persist = (next: number, forceComplete = false) => {
      const previous = readReadingProgress(collection);
      const previousCompleted = Boolean(previous?.path === chapterPath && previous.completed);
      const canComplete = !hasDecisions || decisionComplete.current || previousCompleted || forceComplete;
      const bounded = hasDecisions && !canComplete ? Math.min(next, 97) : next;
      const monotonic = previous?.path === chapterPath ? Math.max(previous.percent, bounded) : bounded;
      const completed = previousCompleted || forceComplete || (!hasDecisions && monotonic >= 98);
      saveReadingProgress({
        bookId: collection,
        chapterId,
        path: chapterPath,
        percent: monotonic,
        completed,
        updatedAt: Date.now(),
      });
      setProgress(monotonic);

      if (!completed && monotonic - lastServerProgress.current < 5) return;
      lastServerProgress.current = monotonic;
      void fetch('/api/me/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        keepalive: true,
        body: JSON.stringify({
          collection,
          chapterId,
          chapterTitle,
          progressPercent: completed ? 100 : monotonic,
          completed,
          readMs: Date.now() - startedAt.current,
        }),
      }).catch(() => {});
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => persist(pageProgress()));
    };

    const onReaderFlow = (event: Event) => {
      const detail = (event as CustomEvent<ReaderFlowEventDetail>).detail;
      if (!detail || detail.chapterId !== chapterId || !detail.complete) return;
      decisionComplete.current = true;
      persist(100, true);
    };

    update();
    document.addEventListener(READER_FLOW_EVENT, onReaderFlow);
    const flowRoot = document.querySelector<HTMLElement>(
      `[data-reader-chapter-id="${CSS.escape(chapterId)}"]`,
    );
    if (flowRoot?.dataset.readerFlowState === 'CHAPTER_COMPLETE') {
      decisionComplete.current = true;
      persist(100, true);
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.removeEventListener(READER_FLOW_EVENT, onReaderFlow);
    };
  }, [chapterId, chapterPath, chapterTitle, collection, hasDecisions]);

  const style = { '--chapter-progress': `${progress}%` } as CSSProperties;
  return (
    <div
      className="chapter-reader__progress"
      role="progressbar"
      aria-label={t('reader.progress.aria')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      style={style}
    >
      <span className="chapter-reader__progress-bar" />
      <span className="chapter-reader__progress-label">{progress}%</span>
    </div>
  );
}
