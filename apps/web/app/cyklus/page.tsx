import type { Metadata } from 'next';
import Link from 'next/link';
import CyklusClient from '../../src/components/cyklus/CyklusClient';

export const metadata: Metadata = {
  title: 'SYNTHOMA: CYKLUS',
  description: 'Diagnostická karetní hra SYNTHOMA. Dvanáct voleb, čtyři nestabilní hodnoty a záznam toho, jak ses rozhodoval.',
  alternates: {
    canonical: 'https://www.synthoma.cz/cyklus',
    types: { 'application/json': '/api/public/v1/cyklus/rules' },
  },
};

export default function CyklusPage() {
  return (
    <main className="cyklus-page">
      <section className="cyklus-public-intro" aria-labelledby="cyklus-public-intro-title">
        <p className="cyklus-public-intro__kicker">CYKLUS // DIAGNOSTICKÁ KARETNÍ HRA</p>
        <h1 id="cyklus-public-intro-title">Dvanáct voleb. Čtyři nestabilní hodnoty. Jeden záznam o tom, jak ses rozhodoval.</h1>
        <p>V každém běhu volíš mezi dvěma reakcemi a držíš Energii, Paměť, Vazbu a Kontrolu mimo krajní hodnoty. Cílem není mít všechno vysoko. Cílem je nespadnout z obou stran.</p>
        <p>První běh je zdarma a nevyžaduje přihlášení. Výsledek ukáže konec cyklu, hlavní příčiny a další stopu v Prázdnotě.</p>
      </section>
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
