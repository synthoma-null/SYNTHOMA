import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicCards } from '../../src/server/public-ai/contentService';
import '../../src/styles/public-ai.css';

export const metadata: Metadata = {
  title: 'Katalog karet Cyklus | SYNTHOMA',
  description: 'Veřejný katalog karet diagnostické hry Cyklus ze světa SYNTHOMA.',
  alternates: { canonical: 'https://www.synthoma.cz/cards' },
};

export default function CardsPage() {
  const cards = getPublicCards('cs');
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Katalog karet Cyklus',
    url: 'https://www.synthoma.cz/cards',
    mainEntity: { '@type': 'ItemList', itemListElement: cards.map((card, index) => ({
      '@type': 'ListItem', position: index + 1, url: card.canonicalUrl, name: card.title,
    })) },
  };
  return <main className="public-ai-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <header className="public-ai-header">
      <p className="public-ai-kicker">CYKLUS // PUBLIC REGISTRY</p>
      <h1>Katalog karet</h1>
      <p>Veřejné záznamy z kanonického registru. Některé vrstvy zatím zůstávají jen metadaty. Systém je překvapivě diskrétní, když se mu to hodí.</p>
      <nav aria-label="Strojové verze"><a href="https://www.synthoma.cz/ai/cs/cards/index.md">Markdown</a><a href="https://www.synthoma.cz/api/public/v1/cards">JSON</a></nav>
    </header>
    <ol className="public-card-grid">
      {cards.map((card) => <li key={card.id}>
        <Link href={`/cards/${card.id}`}>
          <span>{card.category}</span>
          <strong>{card.title}</strong>
          <small>{card.visibility === 'publicFull' ? 'Veřejná karta' : 'Veřejná metadata'}</small>
        </Link>
      </li>)}
    </ol>
  </main>;
}
