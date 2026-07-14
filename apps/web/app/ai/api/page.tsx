import type { Metadata } from 'next';
import Link from 'next/link';
import '../../../src/styles/public-ai.css';

export const metadata: Metadata = { title: 'Public AI API | SYNTHOMA', alternates: { canonical: 'https://www.synthoma.cz/ai/api' } };

export default function PublicApiPage() {
  return <main className="public-ai-page">
    <header className="public-ai-header"><p className="public-ai-kicker">SYNTHOMA // PUBLIC AI</p><h1>Veřejné rozhraní</h1><p>Strojově čitelné veřejné lore a izolovaný dvanáctitahový Cyklus. Bez účtu, cookies, MNEM, entitlementů a zápisu do progrese.</p></header>
    <section><h2>Specifikace</h2><p><a href="/api/public/openapi.json">OpenAPI JSON</a> · <a href="/api/public/openapi.yaml">OpenAPI YAML</a> · <Link href="/ai-policy">Pravidla přístupu</Link></p></section>
    <section><h2>Obsah</h2><pre><code>{`GET /api/public/v1/site?locale=cs
GET /api/public/v1/chapters?locale=en&limit=20
GET /api/public/v1/cards?locale=cs
GET /api/public/v1/cyklus/rules?locale=en`}</code></pre></section>
    <section><h2>Spustit Cyklus</h2><pre><code>{`const run = await fetch('/api/public/v1/cyklus/run', {
  method: 'POST',
  credentials: 'omit',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ locale: 'cs', seed: 'example-seed' })
}).then(response => response.json());`}</code></pre><p>Další volbu pošli na <code>/api/public/v1/cyklus/choice</code> se získaným <code>stateToken</code> a <code>choiceId</code>.</p></section>
    <section><h2>Limity</h2><p>Čtení 300 požadavků / 10 minut / IP, start 30 / hodinu / IP a volby 500 / hodinu / IP. Odpověď 429 obsahuje <code>Retry-After</code>.</p></section>
  </main>;
}
