import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import BooksClient, { type Manifest } from './BooksClient';

export const revalidate = 3600; // ISR: 1 hodina

export const metadata: Metadata = {
  title: 'Knihovna | SYNTHOMA',
  description: 'Knihovna interaktivnĂ­ch glitch-noir pĹ™Ă­bÄ›hĹŻ v univerzu SYNTHOMA.',
  alternates: {
    canonical: 'https://www.synthoma.cz/books',
  },
  robots: {
    index: true,
    follow: true,
  },
};

function buildBookJsonLd(manifest: Manifest) {
  const collections = manifest?.collections || [];
  return collections.map((col) => ({
    "@context": "https://schema.org",
    "@type": "Book",
    "name": col.title || col.slug,
    "url": `https://www.synthoma.cz/books`,
    "inLanguage": "cs",
    "isAccessibleForFree": true,
    "hasPart": (col.chapters || []).map((ch: any, idx: number) => ({
      "@type": "Chapter",
      "name": ch.title,
      "position": idx + 1,
      "url": `https://www.synthoma.cz/reader?u=${encodeURIComponent(ch.path)}`,
    })),
  }));
}

export default async function BooksPage() {
  const manifestPath = path.join(process.cwd(), 'public', 'books', 'manifest.json');
  let manifest: Manifest = { collections: [] };
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    manifest = JSON.parse(raw) as Manifest;
  } catch (e) {
    manifest = { collections: [] };
  }

  const jsonLd = buildBookJsonLd(manifest);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BooksClient manifest={manifest} />
    </>
  );
}
