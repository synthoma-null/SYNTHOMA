import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SYNTHOMA – Podmínky použití',
  description: 'Podmínky použití interaktivní čtečky a archivu SYNTHOMA.',
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return (
    <div className="glitch-bg">
      <main className="story legal-page" role="main" aria-label="Podmínky použití">
        <section className="story-block">
          <h1 className="title">PODMÍNKY POUŽITÍ</h1>
          <div className="paywall-log">
            <p>
              <span className="paywall-log-prefix">LOG [TERMS_INIT]:</span>
              <span className="paywall-log-msg">&#8222;Pravidla systému. Čti, než vstoupíš.&#8220;</span>
            </p>
          </div>
        </section>

        <section className="story-block">
          <h2 className="title">1. Provozovatel</h2>
          <p className="text">
            Web SYNTHOMA.cz provozuje jeho autor jako osobní autorský projekt. Obsah webu – texty, grafika, zvuk,
            interaktivní prvky a systémová logika – je chráněn autorským právem.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">2. Přístup k obsahu</h2>
          <ul className="text legal-list">
            <li>Část obsahu (vybrané kapitoly, archivní položky) je dostupná zdarma bez registrace.</li>
            <li>Prémiový obsah vyžaduje zakoupení mnemů nebo balíčku přístupu.</li>
            <li>Registrace je dobrovolná a slouží k ukládání postupu, voleb a mnemové peněženky.</li>
            <li>Obsah je určen osobám starším 15 let. Obsahuje psychologicky náročná témata (trauma, bolest, systémové selhání).</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">3. Uživatelský účet</h2>
          <ul className="text legal-list">
            <li>Za bezpečnost svého hesla odpovídáš sám.</li>
            <li>Přezdívka musí být jedinečná a nesmí obsahovat vulgarity, jména jiných osob ani zavádějící identifikátory.</li>
            <li>Jeden e-mail = jeden účet.</li>
            <li>Provozovatel si vyhrazuje právo zrušit účet, který porušuje tyto podmínky.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">4. Mnemy a platby</h2>
          <ul className="text legal-list">
            <li>Mnemy jsou interní jednotka systému SYNTHOMA bez reálné peněžní hodnoty a nejsou směnitelné zpět za peníze.</li>
            <li>Platby za balíčky mnemů jsou nevratné, pokud nebylo dohodnuté jinak.</li>
            <li>Platby zpracovává Stripe. Platební údaje nezpracovává provozovatel přímo.</li>
            <li>V případě technické chyby při platbě kontaktuj správce pro ruční přiřazení přístupu.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">5. Autorská práva</h2>
          <p className="text">
            Veškerý obsah SYNTHOMA (texty, hudba, grafika, kód, systémová logika, lore) je chráněn autorským právem.
            Je zakázáno:
          </p>
          <ul className="text legal-list">
            <li>reprodukovat obsah bez souhlasu autora,</li>
            <li>vydávat obsah za vlastní,</li>
            <li>používat obsah ke komerčním účelům bez písemného souhlasu.</li>
          </ul>
          <p className="text">
            Fanouškovský obsah (fan art, fan fiction) je vítán za podmínky uvedení zdroje a nekomerčního využití.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">6. Dostupnost a změny</h2>
          <p className="text">
            Provozovatel si vyhrazuje právo kdykoli upravit, doplnit nebo pozastavit části webu.
            O podstatných změnách podmínek bude informováno na webu nebo e-mailem.
            Poslední aktualizace: <strong>červen 2025</strong>.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">7. Odpovědnost</h2>
          <p className="text">
            SYNTHOMA je autorský fikční projekt. Obsah – includuji psychologická témata, systémové metafory
            a interaktivní narativ – není náhradou za odbornou psychologickou nebo lékařskou pomoc.
            Pokud procházíš těžkým obdobím, prosím obrať se na odborníka.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">8. Rozhodné právo</h2>
          <p className="text">
            Tyto podmínky se řídí právem České republiky. Spory budou řešeny příslušnými soudy ČR.
          </p>
        </section>

        <section className="story-block">
          <div className="hero-cta">
            <Link href="/" className="btn">← Zpět na hlavní stránku</Link>
            <Link href="/privacy" className="btn btn-outline">Ochrana osobních údajů</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
