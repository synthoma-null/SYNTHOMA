import type { Metadata } from 'next';
import { getLibraryCatalog } from '../../src/lib/synthoma/library/getLibraryCatalog';
import SynthomaLibrary from '../../src/components/library/SynthomaLibrary';
import '../../src/styles/library-archive.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Knihovna | SYNTHOMA',
  description: 'Knihovna interaktivních glitch-noir příběhů v univerzu SYNTHOMA.',
  alternates: {
    canonical: 'https://www.synthoma.cz/books',
  },
  robots: {
    index: true,
    follow: true,
  },
};

function buildBookJsonLd(catalog: Awaited<ReturnType<typeof getLibraryCatalog>>) {
  return catalog.collections.map((col) => ({
    '@context': 'https://schema.org',
    '@type': 'Book',
    'name': col.title || col.slug,
    'url': 'https://www.synthoma.cz/books',
    'inLanguage': 'cs',
    'author': { '@type': 'Person', 'name': 'Tomáš Valíček' },
    'publisher': { '@type': 'Organization', 'name': 'SYNTHOMA', 'url': 'https://www.synthoma.cz' },
    'hasPart': col.chapters.map((ch, idx) => ({
      '@type': 'Chapter',
      'name': ch.title,
      'position': idx + 1,
      'url': `https://www.synthoma.cz/chapter/${encodeURIComponent(ch.id)}`,
      'isAccessibleForFree': ch.access === 'free',
    })),
  }));
}

export default async function BooksPage() {
  const catalog = await getLibraryCatalog();
  const jsonLd = buildBookJsonLd(catalog);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <noscript>
        <div className="books-fallback">
          <h1>Knihovna SYNTHOMA</h1>
          {catalog.collections.map((col) => (
            <section key={col.slug}>
              <h2>{col.title}</h2>
              <ul>
                {col.chapters.map((ch) => (
                  <li key={ch.path}>
                    <a href={`/chapter/${encodeURIComponent(ch.id)}`}>
                      {ch.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </noscript>
      <SynthomaLibrary catalog={catalog} />
    </>
  );
}
