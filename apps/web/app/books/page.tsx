import type { Metadata } from 'next';
import { getLibraryCatalog } from '../../src/lib/synthoma/library/getLibraryCatalog';
import { buildPublicMetadata, requestLocale } from '../../src/lib/publicMetadata';
import SynthomaLibrary from '../../src/components/library/SynthomaLibrary';
import '../../src/styles/library-archive.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return buildPublicMetadata({
    locale,
    path: '/books',
    title: locale === 'en' ? 'SYNTHOMA Library' : 'Knihovna SYNTHOMA',
    description: locale === 'en' ? 'Read the interactive psychological books of SYNTHOMA. Free chapters are available without registration.' : 'Čti interaktivní psychologické knihy SYNTHOMA. Bezplatné kapitoly jsou dostupné bez registrace.',
    imageAlt: locale === 'en' ? 'SYNTHOMA interactive book library' : 'Knihovna interaktivních knih SYNTHOMA',
  });
}

function buildBookJsonLd(catalog: Awaited<ReturnType<typeof getLibraryCatalog>>) {
  return catalog.collections.map((col) => ({
    '@context': 'https://schema.org',
    '@type': 'Book',
    'name': col.title || col.slug,
    'url': 'https://www.synthoma.cz/books',
    'inLanguage': col.language ?? 'cs',
    'author': { '@type': 'Person', 'name': 'Tomáš Valíček' },
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
  const locale = await requestLocale();
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
          <h1>{locale === 'en' ? 'SYNTHOMA Library' : 'Knihovna SYNTHOMA'}</h1>
          <p>{locale === 'en' ? 'Start with the first free chapter. No registration is required.' : 'Začni první bezplatnou kapitolou. Registrace není nutná.'}</p>
          {catalog.collections.map((col) => (
            <section key={col.slug}>
              <h2>{col.title}</h2>
              <ul>
                {col.chapters.map((ch) => (
                  <li key={ch.path}>
                    <a href={`/chapter/${encodeURIComponent(ch.id)}${locale === 'en' ? '?locale=en' : ''}`}>
                      {ch.title}
                    </a>
                    {' — '}{ch.access === 'free' ? (locale === 'en' ? 'FREE' : 'ZDARMA') : (locale === 'en' ? 'LOCKED' : 'UZAMČENO')}
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
