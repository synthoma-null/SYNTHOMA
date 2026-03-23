import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import ArchiveClient, { type ArchiveCardData } from './ArchiveClient';

export const revalidate = 3600; // ISR: 1 hodina

export const metadata: Metadata = {
  title: 'Archiv | SYNTHOMA',
  description: 'Archiv lore, pojmů, entit a fragmentů univerza SYNTHOMA.',
  alternates: {
    canonical: 'https://synthoma.cz/archive',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ArchivePage() {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'archive.json');
  let cards: ArchiveCardData[] = [];
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    const json = JSON.parse(raw);
    cards = Array.isArray(json?.cards) ? (json.cards as ArchiveCardData[]) : [];
  } catch (e) {
    // eslint: nechceme padat na serveru; prázdný archiv je přijatelný
    cards = [];
  }

  return <ArchiveClient cards={cards} />;
}
