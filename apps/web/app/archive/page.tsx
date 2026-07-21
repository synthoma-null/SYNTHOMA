import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { type ArchiveCardData } from './ArchiveClient';
import SynthomaArchive from '../../src/components/archive/SynthomaArchive';
import { normalizeArchiveCards } from '../../src/lib/synthoma/archive/normalizeArchiveEntries';
import { getPublicArchive } from '../../src/server/public-ai/contentService';
import { buildPublicMetadata, requestLocale } from '../../src/lib/publicMetadata';
import { getLibraryCatalog } from '../../src/lib/synthoma/library/getLibraryCatalog';
import '../../src/styles/library-archive.css';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return buildPublicMetadata({
    locale,
    path: '/archive',
    title: locale === 'en' ? 'Living Archive | SYNTHOMA' : 'Živý archiv | SYNTHOMA',
    description: locale === 'en' ? 'Explore entities, memory laws and traces from the broken therapeutic system of SYNTHOMA.' : 'Prozkoumej entity, zákony paměti a stopy z rozbitého terapeutického systému SYNTHOMA.',
    imageAlt: locale === 'en' ? 'The living SYNTHOMA Archive' : 'Živý Archiv světa SYNTHOMA',
  });
}

export default async function ArchivePage() {
  const locale = await requestLocale();
  const dataPath = path.join(process.cwd(), 'public', 'data', 'archiveCards.json');
  let cards: ArchiveCardData[] = [];
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    const json = JSON.parse(raw);
    cards = Array.isArray(json?.cards) ? (json.cards as ArchiveCardData[]) : [];
  } catch {
    cards = [];
  }

  const normalized = normalizeArchiveCards(cards);
  const publicCards = getPublicArchive(locale);
  const library = await getLibraryCatalog();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Archiv SYNTHOMA',
    url: 'https://www.synthoma.cz/archive',
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: publicCards.map((card, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.synthoma.cz/archive/${card.id}`,
        name: card.title,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="archive-public-content" aria-labelledby="archive-books-title">
        <h2 id="archive-books-title">{locale === 'en' ? 'BOOKS IN THE ARCHIVE' : 'KNIHY V ARCHIVU'}</h2>
        {library.collections.map((collection) => (
          <article key={collection.slug}>
            <h3>{collection.title}</h3>
            <p>{collection.description}</p>
            <p>{collection.totalCount} {locale === 'en' ? 'chapters' : 'kapitol'} · {collection.status === 'complete' ? (locale === 'en' ? 'COMPLETE' : 'DOKONČENO') : (locale === 'en' ? 'ONGOING' : 'POKRAČUJE')}</p>
            <a href={`/chapter/${collection.chapters[0]?.id ?? ''}`}>
              {locale === 'en' ? 'OPEN BOOK' : 'OTEVŘÍT KNIHU'}
            </a>
          </article>
        ))}
      </section>
      <section className="archive-public-content" aria-labelledby="archive-public-title">
        <h2 id="archive-public-title">{locale === 'en' ? 'PUBLIC ARCHIVE RECORDS' : 'VEŘEJNÉ ZÁZNAMY ARCHIVU'}</h2>
        {publicCards.map((card) => (
          <article key={card.id} id={`public-${card.id}`}>
            <h3><a href={`/archive/${card.id}`}>{card.title}</a></h3>
            <p>{card.teaser}</p>
            {card.visibility === 'publicFull' ? card.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : (
              <p>{locale === 'en' ? 'LOCKED' : 'UZAMČENO'}: {card.access?.label ?? (locale === 'en' ? 'Further access required.' : 'Vyžaduje další přístup.')}</p>
            )}
          </article>
        ))}
      </section>
      <SynthomaArchive initialCards={normalized} />
    </>
  );
}
