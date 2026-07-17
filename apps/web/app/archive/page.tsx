import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { type ArchiveCardData } from './ArchiveClient';
import SynthomaArchive from '../../src/components/archive/SynthomaArchive';
import { normalizeArchiveCards } from '../../src/lib/synthoma/archive/normalizeArchiveEntries';
import { getPublicArchive } from '../../src/server/public-ai/contentService';
import '../../src/styles/library-archive.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Archiv | SYNTHOMA',
  description: 'Živý archiv světa SYNTHOMA: entity, zákony paměti a stopy rozbitého terapeutického systému.',
  alternates: {
    canonical: 'https://www.synthoma.cz/archive',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ArchivePage() {
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
  const publicCards = getPublicArchive('cs');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Archiv SYNTHOMA',
    url: 'https://www.synthoma.cz/archive',
    inLanguage: 'cs',
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
      <SynthomaArchive initialCards={normalized} />
      <section className="archive-public-content" aria-labelledby="archive-public-title">
        <h2 id="archive-public-title">VEŘEJNÉ ZÁZNAMY ARCHIVU</h2>
        {publicCards.map((card) => (
          <article key={card.id} id={`public-${card.id}`}>
            <h3><a href={`/archive/${card.id}`}>{card.title}</a></h3>
            <p>{card.teaser}</p>
            {card.visibility === 'publicFull' ? card.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : (
              <p>UZAMČENO: {card.access?.label ?? 'Vyžaduje další přístup.'}</p>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
