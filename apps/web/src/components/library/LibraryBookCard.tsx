'use client';

import type { LibraryCollection } from '../../lib/synthoma/library/libraryTypes';
import { useLang } from '../../lib/LangContext';

export interface LibraryBookCardProps {
  collection: LibraryCollection;
  progressRecord?: { percent: number; completed?: boolean } | undefined;
  onClick: (slug: string) => void;
}

export default function LibraryBookCard({ collection, progressRecord, onClick }: LibraryBookCardProps) {
  const { t } = useLang();
  const completed = progressRecord ? (progressRecord.completed ?? progressRecord.percent >= 100) : false;
  const hasProgress = progressRecord && progressRecord.percent > 0 && !completed;
  const description = collection.description || `${t('books.available.capital')} ${collection.availableCount} / ${collection.totalCount} ${t('books.chapters')}`;
  const cta = hasProgress ? t('action.continue') : t('action.open');
  const status = hasProgress
    ? `${t('books.continue').toLocaleLowerCase()} ${Math.round(progressRecord.percent)}%`
    : `${collection.availableCount} / ${collection.totalCount} ${t('books.chapters')}`;

  return (
    <button
      className="library-book-card os-surface"
      type="button"
      onClick={() => onClick(collection.slug)}
      aria-label={`${cta}: ${collection.title}`}
    >
      <span className="library-book-card__cover">
        {collection.cover ? (
          <img src={collection.cover} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="library-book-card__cover-placeholder" aria-hidden="true" />
        )}
      </span>
      <span className="library-book-card__body">
        <span className="library-book-card__title">{collection.title}</span>
        <span className="library-book-card__description">{description}</span>
        <span className="library-book-card__status">{status}</span>
        <span className="library-book-card__cta">{cta}</span>
      </span>
    </button>
  );
}
