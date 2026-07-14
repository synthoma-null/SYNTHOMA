import type { Metadata } from 'next';
import Link from 'next/link';
import '../../src/styles/public-ai.css';

export const metadata: Metadata = { title: 'AI access policy | SYNTHOMA', alternates: { canonical: 'https://www.synthoma.cz/ai-policy' } };

export default function AiPolicyPage() {
  return <main className="public-ai-page"><article>
    <p className="public-ai-kicker">SYNTHOMA // AI ACCESS POLICY</p><h1>Pravidla automatizovaného přístupu</h1>
    <p>Veřejné HTML, Markdown, JSON, katalog karet a dokumentované API jsou určeny pro automatizované čtení v mezích robots.txt a provozních limitů.</p>
    <h2>Veřejný rozsah</h2><p>Veřejné jsou free kapitoly, public záznamy Archivu, stránka Autor, bezpečná metadata zamčeného obsahu a karty označené centrálním public kontraktem. Placené texty, hidden obsah, profily, šeptoty uživatelů, nákupy, entitlementy, MNEM ledger a session data veřejné nejsou.</p>
    <h2>Indexace a retrieval</h2><p>Vyhledávače a systémy pro retrieval nebo inference mohou načítat veřejné cesty. Dostupnost pro indexaci sama o sobě nemění autorská práva ani nevytváří novou licenci.</p>
    <h2>Training</h2><p>Tato stránka neuděluje Creative Commons ani jinou trénovací licenci. Práva k trénování modelů nejsou tímto veřejným technickým přístupem rozšířena.</p>
    <h2>Automatické hraní</h2><p>Public Cyklus je anonymní izolovaný sandbox. Nepracuje s účtem, MNEM, vlastnictvím, sbírkou ani produkční progresí a nezapisuje do databáze.</p>
    <h2>Citace</h2><p>Uveď SYNTHOMA, název položky, stabilní ID a její canonical URL. U českého fallbacku v anglickém exportu respektuj pole <code>sourceLocale</code>.</p>
    <h2>Technické potíže</h2><p>Aktuální kontrakt je v <Link href="/ai/api">API dokumentaci</Link>. Kontakt a veřejné informace o autorovi jsou na stránce <Link href="/autor">Autor</Link>.</p>
  </article></main>;
}
