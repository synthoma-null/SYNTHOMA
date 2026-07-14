'use client';

import type { LibraryCollection } from '../../lib/synthoma/library/libraryTypes';
import { useLang } from '../../lib/LangContext';

export interface LibraryCollectionHeaderProps {
  collection: LibraryCollection;
  onBack: () => void;
  onCoverClick?: (() => void) | undefined;
}

export default function LibraryCollectionHeader({ collection, onBack, onCoverClick }: LibraryCollectionHeaderProps) {
  const { t } = useLang();
  const cover = collection.cover ? (
    <img src={collection.cover} alt="" loading="lazy" decoding="async" />
  ) : (
    <div className="library-collection-header__cover-placeholder" aria-hidden="true" />
  );

  return (
    <header className="library-collection-header">
      <button className="os-command" onClick={onBack} type="button" aria-label={t('books.back.collections')}>
        <span className="os-command__label">⟵ {t('books.back').replace(/^.*?\s/, '').toLocaleUpperCase()}</span>
      </button>
      {onCoverClick ? (
        <button className="library-collection-header__cover" type="button" onClick={onCoverClick} aria-label={`${t('books.cover.show')} ${collection.title}`}>
          {cover}
        </button>
      ) : (
        <div className="library-collection-header__cover">
          {cover}
        </div>
      )}
      <div className="library-collection-header__info">
        <h2 className="library-collection-header__title">{collection.title}</h2>
        <p className="library-collection-header__status">
          {collection.availableCount} / {collection.totalCount} {t('books.available')}
        </p>
      </div>
    </header>
  );
}
