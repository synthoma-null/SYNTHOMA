'use client';

import Link from 'next/link';
import type { LibraryChapter, LibraryCollection } from '../../lib/synthoma/library/libraryTypes';
import type { LibraryProgressRecord } from '../../lib/synthoma/library/useLibraryProgress';
import { useLang } from '../../lib/LangContext';

export interface LibraryChapterListProps {
  collection: LibraryCollection;
  progressByChapterId: Record<string, LibraryProgressRecord>;
  onLockedClick?: (chapter: LibraryChapter) => void;
}

export default function LibraryChapterList({ collection, progressByChapterId, onLockedClick }: LibraryChapterListProps) {
  const { t } = useLang();
  return (
    <ol className="library-chapter-list" aria-label={`Kapitoly sbírky ${collection.title}`}>
      {collection.chapters.map((ch) => {
        const progress = progressByChapterId[ch.id];
        const isLocked = ch.access === 'locked';
        const isUnavailable = ch.access === 'unavailable';
        const href = ch.id ? `/chapter/${encodeURIComponent(ch.id)}` : `/reader?u=${encodeURIComponent(ch.path)}`;
        const isContinue = progress && !progress.completed && progress.percent > 0;
        const isCompleted = progress?.completed;

        const lockedLabel = ch.mnemCost ? `${ch.mnemCost} MNEM` : t('action.locked');

        return (
          <li key={ch.id || ch.path} className="library-chapter-list__item">
            {isLocked || isUnavailable ? (
              <button
                className="library-chapter-list__row library-chapter-list__row--locked"
                type="button"
                onClick={() => { if (isLocked) onLockedClick?.(ch); }}
                disabled={isUnavailable}
                aria-label={`${ch.title}, ${isUnavailable ? t('books.chapter.unavailable').toLocaleLowerCase() : t('action.locked').toLocaleLowerCase()}`}
              >
                <span className="library-chapter-list__index">{String(ch.order).padStart(2, '0')}</span>
                <span className="library-chapter-list__title">{ch.title}</span>
                <span className="library-chapter-list__badge">{isUnavailable ? t('books.chapter.unavailable') : lockedLabel}</span>
                {ch.summary ? <span className="library-chapter-list__summary">{ch.summary}</span> : null}
              </button>
            ) : (
              <Link className="library-chapter-list__row" href={href}>
                <span className="library-chapter-list__index">{String(ch.order).padStart(2, '0')}</span>
                <span className="library-chapter-list__title">{ch.title}</span>
                {isCompleted ? (
                  <span className="library-chapter-list__badge library-chapter-list__badge--done">{t('books.chapter.completed')}</span>
                ) : isContinue ? (
                  <span className="library-chapter-list__badge library-chapter-list__badge--resume">{Math.round(progress.percent)}%</span>
                ) : null}
                {ch.summary ? <span className="library-chapter-list__summary">{ch.summary}</span> : null}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
