import Link from 'next/link';
import type { LibraryCollection } from '../../lib/synthoma/library/libraryTypes';

export interface ArchiveBookGridProps {
  collections: LibraryCollection[];
  locale: 'cs' | 'en';
}

export default function ArchiveBookGrid({ collections, locale }: ArchiveBookGridProps) {
  return (
    <section className="synthoma-archive__section" aria-labelledby="archive-books-title">
      <h2 id="archive-books-title" className="synthoma-archive__section-title">
        {locale === 'en' ? 'BOOKS IN THE ARCHIVE' : 'KNIHY ARCHIVU'}
      </h2>
      <ul className="archive-book-grid" role="list">
        {collections.map((collection) => {
          const firstChapter = collection.chapters[0];
          return (
            <li key={collection.slug} className="archive-book-grid__item">
              <article className="archive-book-card os-surface" data-testid="archive-book-card">
                <span className="archive-book-card__status">
                  {collection.status === 'complete'
                    ? (locale === 'en' ? 'COMPLETE' : 'DOKONČENO')
                    : (locale === 'en' ? 'ONGOING' : 'POKRAČUJE')}
                </span>
                <h3 className="archive-book-card__title">{collection.title}</h3>
                {collection.description ? <p className="archive-book-card__description">{collection.description}</p> : null}
                <p className="archive-book-card__meta">{collection.totalCount} {locale === 'en' ? 'chapters' : 'kapitol'}</p>
                {firstChapter ? (
                  <Link className="os-command archive-book-card__cta" href={`/chapter/${encodeURIComponent(firstChapter.id)}`}>
                    {locale === 'en' ? 'OPEN BOOK' : 'OTEVŘÍT KNIHU'}
                  </Link>
                ) : null}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
