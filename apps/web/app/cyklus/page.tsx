import type { Metadata } from 'next';
import Link from 'next/link';
import CyklusClient from '../../src/components/cyklus/CyklusClient';
import { buildPublicMetadata, requestLocale } from '../../src/lib/publicMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const metadata = buildPublicMetadata({
    locale,
    path: '/cyklus',
    title: locale === 'en' ? 'Cyklus diagnostic card game | SYNTHOMA' : 'Diagnostická karetní hra Cyklus | SYNTHOMA',
    description: locale === 'en' ? 'Play twelve choices across four unstable values and see what your decisions leave behind.' : 'Projdi dvanáct voleb, čtyři nestabilní hodnoty a zjisti, co po tvých rozhodnutích zůstane.',
    imageAlt: locale === 'en' ? 'Cyklus diagnostic card game' : 'Diagnostická karetní hra Cyklus',
  });
  return { ...metadata, alternates: { ...metadata.alternates, types: { 'application/json': '/api/public/v1/cyklus/rules' } } };
}

export default async function CyklusPage() {
  const locale = await requestLocale();
  const copy = locale === 'en' ? {
    kicker: 'CYKLUS // DIAGNOSTIC CARD GAME',
    title: 'Twelve choices. Four unstable values. One record of how you decided.',
    rules: 'In each run, choose between two reactions and keep Energy, Memory, Bond and Control away from the edges. The goal is not to push everything high. The goal is to avoid falling off either side.',
    guest: 'The first run is free and requires no login. The result shows your ending, its main causes and the next trace in the Void.',
    aiTitle: 'AI AND AUTOMATED ACCESS',
    aiBody: 'Cyklus is also available through a public stateless API. It requires no account and stores no user progression.',
    aiAria: 'Public AI access to Cyklus',
    rulesLink: 'CYKLUS RULES', api: 'API DOCUMENTATION', publicContent: 'PUBLIC AI CONTENT',
  } : {
    kicker: 'CYKLUS // DIAGNOSTICKÁ KARETNÍ HRA',
    title: 'Dvanáct voleb. Čtyři nestabilní hodnoty. Jeden záznam o tom, jak ses rozhodoval.',
    rules: 'V každém běhu volíš mezi dvěma reakcemi a držíš Energii, Paměť, Vazbu a Kontrolu mimo krajní hodnoty. Cílem není mít všechno vysoko. Cílem je nespadnout z obou stran.',
    guest: 'První běh je zdarma a nevyžaduje přihlášení. Výsledek ukáže konec cyklu, hlavní příčiny a další stopu v Prázdnotě.',
    aiTitle: 'AI A AUTOMATIZOVANÝ PŘÍSTUP',
    aiBody: 'Cyklus lze hrát také prostřednictvím veřejného bezstavového API. Rozhraní nevyžaduje účet a nezapisuje uživatelský postup.',
    aiAria: 'Veřejný AI přístup ke Cyklu',
    rulesLink: 'PRAVIDLA CYKLU', api: 'DOKUMENTACE API', publicContent: 'VEŘEJNÝ OBSAH PRO AI',
  };
  return (
    <main className="cyklus-page">
      <section className="cyklus-public-intro" aria-labelledby="cyklus-public-intro-title">
        <p className="cyklus-public-intro__kicker">{copy.kicker}</p>
        <h1 id="cyklus-public-intro-title">{copy.title}</h1>
        <p>{copy.rules}</p>
        <p>{copy.guest}</p>
      </section>
      <CyklusClient />
      <section className="cyklus-ai-discovery" aria-labelledby="cyklus-ai-discovery-title">
        <p className="cyklus-ai-discovery__kicker">CYKLUS // PUBLIC INTERFACE</p>
        <h2 id="cyklus-ai-discovery-title">{copy.aiTitle}</h2>
        <p>{copy.aiBody}</p>
        <nav aria-label={copy.aiAria}>
          <a href={`/api/public/v1/cyklus/rules${locale === 'en' ? '?locale=en' : ''}`}>{copy.rulesLink}</a>
          <Link href="/ai/api">{copy.api}</Link>
          <a href="/api/public/openapi.json">OPENAPI JSON</a>
          <a href="/llms.txt">{copy.publicContent}</a>
        </nav>
      </section>
    </main>
  );
}
