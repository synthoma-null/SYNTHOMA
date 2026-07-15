import type { Metadata } from 'next';
import Link from 'next/link';
import CyklusClient from '../../src/components/cyklus/CyklusClient';

export const metadata: Metadata = {
  title: 'SYNTHOMA: CYKLUS',
  description: 'Swipe-based psychological roguelite. Balance stats, collect items, survive the cycles.',
  alternates: {
    canonical: 'https://www.synthoma.cz/cyklus',
    types: { 'application/json': '/api/public/v1/cyklus/rules' },
  },
};

export default function CyklusPage() {
  return (
    <main className="cyklus-page">
      <CyklusClient />
      <section className="cyklus-ai-discovery" aria-labelledby="cyklus-ai-discovery-title">
        <p className="cyklus-ai-discovery__kicker">CYKLUS // PUBLIC INTERFACE</p>
        <h2 id="cyklus-ai-discovery-title">AI A AUTOMATIZOVANÝ PŘÍSTUP</h2>
        <p>Cyklus lze hrát také prostřednictvím veřejného bezstavového API. Rozhraní nevyžaduje účet a nezapisuje uživatelský postup.</p>
        <nav aria-label="Veřejný AI přístup ke Cyklu">
          <a href="/api/public/v1/cyklus/rules">PRAVIDLA CYKLU</a>
          <Link href="/ai/api">DOKUMENTACE API</Link>
          <a href="/api/public/openapi.json">OPENAPI JSON</a>
          <a href="/llms.txt">VEŘEJNÝ OBSAH PRO AI</a>
        </nav>
      </section>
    </main>
  );
}
