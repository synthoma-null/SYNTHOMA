import type { LibraryCollection } from '../../lib/synthoma/library/libraryTypes';

export interface LibraryCollectionHeaderProps {
  collection: LibraryCollection;
  onBack: () => void;
  onCoverClick?: (() => void) | undefined;
}

export default function LibraryCollectionHeader({ collection, onBack, onCoverClick }: LibraryCollectionHeaderProps) {
  const cover = collection.cover ? (
    <img src={collection.cover} alt="" loading="lazy" decoding="async" />
  ) : (
    <div className="library-collection-header__cover-placeholder" aria-hidden="true" />
  );

  return (
    <header className="library-collection-header">
      <button className="os-command" onClick={onBack} type="button" aria-label="Zpět na přehled sbírek">
        <span className="os-command__label">⟵ ZPĚT</span>
      </button>
      {onCoverClick ? (
        <button className="library-collection-header__cover" type="button" onClick={onCoverClick} aria-label={`Zobrazit přebal ${collection.title}`}>
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
          {collection.availableCount} / {collection.totalCount} dostupných
        </p>
      </div>
    </header>
  );
}
