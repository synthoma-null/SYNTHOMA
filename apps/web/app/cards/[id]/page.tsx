import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicCard } from '../../../src/server/public-ai/contentService';
import '../../../src/styles/public-ai.css';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const card = getPublicCard((await params).id, 'cs');
  if (!card) return {};
  return { title: `${card.title} | Cyklus`, alternates: { canonical: card.canonicalUrl }, description: card.scene ?? `Metadata karty ${card.title}.` };
}

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const card = getPublicCard((await params).id, 'cs');
  if (!card) notFound();
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'CreativeWork', name: card.title, identifier: card.id,
    url: card.canonicalUrl, inLanguage: card.sourceLocale, isPartOf: { '@type': 'Game', name: 'Cyklus', url: 'https://www.synthoma.cz/cyklus' },
    ...(card.posterUrl ? { image: card.posterUrl } : {}),
    ...(card.scene ? { description: card.scene } : {}),
  };
  return <main className="public-ai-page public-card-detail">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <p><Link href="/cards">← Katalog karet</Link></p>
    <article>
      <p className="public-ai-kicker">{card.category}{' // '}{card.id}</p>
      <h1>{card.title}</h1>
      {card.visibility === 'publicFull' ? <>
        {card.posterUrl ? <Image src={new URL(card.posterUrl).pathname} alt={card.posterAlt ?? card.title} width={768} height={1152} priority /> : null}
        <p>{card.scene}</p>
        <h2>Volby</h2>
        <ul>{card.choices.map((choice) => <li key={choice.id}><code>{choice.id}</code> {choice.label}</li>)}</ul>
      </> : <p>Veřejná jsou pouze metadata této karty. Scéna, volby ani poster se nevydávají.</p>}
      <nav aria-label="Strojové verze"><a href={`/ai/cs/cards/${card.id}.md`}>Markdown</a><a href={`/api/public/v1/cards/${card.id}`}>JSON</a></nav>
    </article>
  </main>;
}
