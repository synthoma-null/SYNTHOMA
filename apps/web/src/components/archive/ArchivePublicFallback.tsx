import type { ArchiveCard } from '../../lib/synthoma/archive/archiveTypes';
import type { PublicVisibility } from '../../server/public-ai/visibility';
import { getArchiveCategoryLabel } from '../../lib/synthoma/archive/archiveCategoryLabel';

type PublicArchiveCard = ArchiveCard & { visibility: PublicVisibility };

export interface ArchivePublicFallbackProps {
  cards: PublicArchiveCard[];
  locale: 'cs' | 'en';
}

export default function ArchivePublicFallback({ cards, locale }: ArchivePublicFallbackProps) {
  const grouped = cards.reduce<Map<string, PublicArchiveCard[]>>((groups, card) => {
    const entries = groups.get(card.category) ?? [];
    entries.push(card);
    groups.set(card.category, entries);
    return groups;
  }, new Map());

  return (
    <div className="archive-public-fallback">
      <h1>{locale === 'en' ? 'Living Archive' : 'Živý archiv'}</h1>
      {[...grouped.entries()].map(([category, entries]) => (
        <section key={category} className="archive-public-fallback__category">
          <h2>{getArchiveCategoryLabel(category, locale)}</h2>
          <div className="archive-public-fallback__grid">
            {entries.map((card) => {
              const locked = card.visibility !== 'publicFull';
              return (
                <article key={card.id} className={`archive-public-card${locked ? ' archive-public-card--locked' : ''}`}>
                  <span>{locked ? (locale === 'en' ? 'LOCKED RECORD' : 'UZAMČENÝ ZÁZNAM') : card.category}</span>
                  <h3><a href={`/archive/${card.id}`}>{card.title}</a></h3>
                  <p>{card.teaser}</p>
                  {locked ? (
                    <p>{card.access?.label ?? (locale === 'en' ? 'Further access required.' : 'Vyžaduje další přístup.')}</p>
                  ) : (
                    card.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
