import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import BooksClient, { type Manifest } from './BooksClient';

export const revalidate = 3600; // ISR: 1 hodina

export const metadata: Metadata = {
  title: 'Knihovna | SYNTHOMA',
  description: 'Knihovna interaktivních glitch-noir příběhů v univerzu SYNTHOMA.',
  alternates: {
    canonical: 'https://synthoma.cz/books',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function BooksPage() {
  const manifestPath = path.join(process.cwd(), 'public', 'books', 'manifest.json');
  let manifest: Manifest = { collections: [] };
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    manifest = JSON.parse(raw) as Manifest;
  } catch (e) {
    manifest = { collections: [] };
  }
  return <BooksClient manifest={manifest} />;
}
