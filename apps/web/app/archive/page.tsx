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

export const dynamic = 'force-dynamic';

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
      <noscript>
        <div className="archive-public-fallback">
          <h1>{locale === 'en' ? 'Living Archive' : 'Živý archiv'}</h1>
          <p>{locale === 'en' ? 'The complete public archive is included in this page.' : 'Kompletní veřejný archiv je součástí této stránky.'}</p>
          <p><a href={locale === 'en' ? '/books?locale=en' : '/books'}>{locale === 'en' ? 'Open the library' : 'Otevřít knihovnu'}</a></p>
        </div>
      </noscript>
      <SynthomaArchive initialCards={normalized} library={library} />
    </>
  );
}
