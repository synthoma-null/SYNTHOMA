'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { readReadingProgress, saveLastChapterPath, saveReadingProgress } from '../../lib/readerState';

interface Props {
  chapterId: string;
  chapterTitle: string;
  collection: string;
  chapterPath: string;
}

function pageProgress(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((window.scrollY / scrollable) * 100)));
}

export default function ChapterReadingProgress({ chapterId, chapterTitle, collection, chapterPath }: Props) {
  const [progress, setProgress] = useState(0);
  const lastServerProgress = useRef(-5);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const stored = readReadingProgress(collection);
    const initial = stored?.path === chapterPath ? stored.percent : 0;
    setProgress(initial);
    saveLastChapterPath(chapterPath);

    let frame = 0;
    const persist = (next: number) => {
      const previous = readReadingProgress(collection);
      const monotonic = previous?.path === chapterPath ? Math.max(previous.percent, next) : next;
      saveReadingProgress({
        bookId: collection,
        path: chapterPath,
        percent: monotonic,
        updatedAt: Date.now(),
      });
      setProgress(monotonic);

      const completed = monotonic >= 98;
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

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [chapterId, chapterPath, chapterTitle, collection]);

  const style = { '--chapter-progress': `${progress}%` } as CSSProperties;
  return (
    <div
      className="chapter-reader__progress"
      role="progressbar"
      aria-label="Průběh čtení kapitoly"
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
