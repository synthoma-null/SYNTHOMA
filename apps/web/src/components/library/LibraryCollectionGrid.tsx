import type { LibraryCollection } from '../../lib/synthoma/library/libraryTypes';
import type { LibraryProgressSnapshot } from '../../lib/synthoma/library/useLibraryProgress';
import LibraryBookCard from './LibraryBookCard';

export interface LibraryCollectionGridProps {
  collections: LibraryCollection[];
  progress: LibraryProgressSnapshot;
  onSelect: (slug: string) => void;
}

export default function LibraryCollectionGrid({ collections, progress, onSelect }: LibraryCollectionGridProps) {
  return (
    <ul className="library-collection-grid" role="list" aria-label="Seznam sbírek">
      {collections.map((collection) => (
        <li key={collection.slug} className="library-collection-grid__item">
          <LibraryBookCard
            collection={collection}
            progressRecord={progress.byCollection[collection.slug]}
            onClick={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
