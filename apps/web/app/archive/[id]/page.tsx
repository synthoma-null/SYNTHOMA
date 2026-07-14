import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicArchiveEntry } from '../../../src/server/public-ai/contentService';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entry = getPublicArchiveEntry(id, 'cs');
  if (!entry) notFound();
  return {
    title: `${entry.title} | Archiv SYNTHOMA`,
    description: entry.teaser,
    alternates: { canonical: `https://www.synthoma.cz/archive/${entry.id}` },
    robots: { index: true, follow: true },
  };
}

export default async function ArchiveEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getPublicArchiveEntry(id, 'cs');
  if (!entry) notFound();
  return (
    <main className="story archive-public-detail" id="main-content">
      <article>
        <p>ARCHIV // {entry.category.toLocaleUpperCase('cs')}</p>
        <h1>{entry.title}</h1>
        <p>{entry.teaser}</p>
        {entry.visibility === 'publicFull' ? (
          <>
            {entry.quote ? <blockquote>{entry.quote}</blockquote> : null}
            {entry.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </>
        ) : <p>UZAMČENO: {entry.access?.label ?? 'Vyžaduje další přístup.'}</p>}
      </article>
      <nav aria-label="Strojové verze">
        <a href={`/ai/cs/archive.md#${entry.id}`}>MARKDOWN</a>
        {' // '}
        <a href={`/api/public/v1/archive/${entry.id}?locale=cs`}>JSON</a>
        {' // '}
        <a href="/archive">ZPĚT DO ARCHIVU</a>
      </nav>
    </main>
  );
}
