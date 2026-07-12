import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { type ArchiveCardData } from './ArchiveClient';
import SynthomaArchive from '../../src/components/archive/SynthomaArchive';
import { normalizeArchiveCards } from '../../src/lib/synthoma/archive/normalizeArchiveEntries';
import '../../src/styles/library-archive.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Archiv | SYNTHOMA',
  description: 'Archiv lore, pojmů, entit a fragmentů univerza SYNTHOMA.',
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

  return (
    <>
      <noscript>
        <div className="archive-fallback">
          <h1>Archiv SYNTHOMA</h1>
          {normalized.slice(0, 20).map((c) => (
            <article key={c.id}>
              <h2>{c.title}</h2>
              <p>{c.teaser}</p>
            </article>
          ))}
        </div>
      </noscript>
      <SynthomaArchive initialCards={normalized} />
    </>
  );
}
