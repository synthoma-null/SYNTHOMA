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
        const href = `/chapter/${encodeURIComponent(ch.id)}`;
        const isContinue = progress && !progress.completed && progress.percent > 0;
        const isCompleted = progress?.completed;

        const lockedLabel = ch.mnemCost ? `${ch.mnemCost} MNEM` : t('action.locked');

        return (
          <li key={ch.id || ch.path} className="library-chapter-list__item">
            {isUnavailable ? (
              <button
                className="library-chapter-list__row library-chapter-list__row--locked"
                type="button"
                disabled
                aria-label={`${ch.title}, ${t('books.chapter.unavailable').toLocaleLowerCase()}`}
              >
                <span className="library-chapter-list__index">{ch.ordinal ?? String(ch.order).padStart(2, '0')}</span>
                <span className="library-chapter-list__title">{ch.title}</span>
                <span className="library-chapter-list__badge">{t('books.chapter.unavailable')}</span>
                {ch.summary ? <span className="library-chapter-list__summary">{ch.summary}</span> : null}
              </button>
            ) : isLocked ? (
              <Link
                className="library-chapter-list__row library-chapter-list__row--locked"
                href={href}
                onClick={(event) => {
                  if (!onLockedClick) return;
                  event.preventDefault();
                  onLockedClick(ch);
                }}
                aria-label={`${ch.title}, ${t('action.locked').toLocaleLowerCase()}`}
              >
                <span className="library-chapter-list__index">{ch.ordinal ?? String(ch.order).padStart(2, '0')}</span>
                <span className="library-chapter-list__title">{ch.title}</span>
                <span className="library-chapter-list__badge">{lockedLabel}</span>
                {ch.summary ? <span className="library-chapter-list__summary">{ch.summary}</span> : null}
              </Link>
            ) : (
              <Link className="library-chapter-list__row" href={href}>
                <span className="library-chapter-list__index">{ch.ordinal ?? String(ch.order).padStart(2, '0')}</span>
                <span className="library-chapter-list__title">{ch.title}</span>
                {isCompleted ? (
                  <span className="library-chapter-list__badge library-chapter-list__badge--done">{t('books.chapter.completed')}</span>
                ) : isContinue ? (
                  <span className="library-chapter-list__badge library-chapter-list__badge--resume">{t('action.continue')} · {Math.round(progress.percent)}%</span>
                ) : (
                  <span className="library-chapter-list__badge">{t('action.read')}</span>
                )}
                {ch.summary ? <span className="library-chapter-list__summary">{ch.summary}</span> : null}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
