import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SYNTHOMA – Ochrana osobních údajů',
  description: 'Zásady ochrany osobních údajů a zpracování dat v systému SYNTHOMA.',
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="glitch-bg">
      <main className="story legal-page" role="main" aria-label="Ochrana osobních údajů">
        <section className="story-block">
          <h1 className="title">OCHRANA OSOBNÍCH ÚDAJŮ</h1>
          <div className="paywall-log">
            <p>
              <span className="paywall-log-prefix">LOG [GDPR_COMPLIANCE]:</span>
              <span className="paywall-log-msg">&#8222;Systém zpracovává paměťové stopy. Transparentně.&#8220;</span>
            </p>
          </div>
        </section>

        <section className="story-block">
          <h2 className="title">1. Správce osobních údajů</h2>
          <p className="text">
            Provozovatel webu SYNTHOMA.cz je správcem osobních údajů ve smyslu nařízení GDPR (EU) 2016/679.
            Pro dotazy ohledně zpracování dat použij kontakt dostupný v záhlaví nebo zápatí webu.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">2. Jaká data sbíráme a proč</h2>
          <p className="text">
            Při registraci sbíráme <strong>e-mailovou adresu</strong>, <strong>přezdívku</strong> a <strong>heslo</strong>.
          </p>
          <ul className="text legal-list">
            <li><strong>E-mail</strong> – slouží k přihlášení a případné obnově přístupu. Není sdílen s třetími stranami.</li>
            <li><strong>Přezdívka</strong> – veřejná identita v systému (pokud povolíš veřejný profil).</li>
            <li><strong>Heslo</strong> – ukládáme <em>výhradně jako hashovanou hodnotu</em> (bcrypt). Nikdo, včetně správce, ho nemůže číst.</li>
          </ul>
          <p className="text">
            Právním základem zpracování je <strong>plnění smlouvy</strong> (čl. 6 odst. 1 písm. b GDPR) – bez těchto dat nemůžeme spravovat tvůj účet.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">3. Co se ukládá při čtení</h2>
          <ul className="text legal-list">
            <li><strong>Postup čtení a procenta dokončení kapitol</strong> – ukládáno do databáze k tvému účtu pro funkci &#8222;pokračovat&#8220;.</li>
            <li><strong>Volby v kapitolách (MBTI stopy)</strong> – statistická data pro psychologický profil subjektu. Žádná volba není sdílena bez souhlasu.</li>
            <li><strong>Mnemová peněženka</strong> – záznamy o udělení a výdeji mnemů (interní měna systému).</li>
            <li><strong>Nastavení vzhledu</strong> – uloženo lokálně v prohlížeči (localStorage), nikoli na serveru.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">4. Cookies a lokální uložiště</h2>
          <p className="text">
            SYNTHOMA používá <strong>session cookie</strong> pro přihlášení (nezbytné, bez souhlasu).
            Volitelné kategorie (nastavení, analytika, čtenářský otisk) jsou aktivovány až po tvém souhlasu v cookie liště.
          </p>
          <p className="text">
            Nastavení a postup čtení bez účtu se ukládají pouze v <strong>localStorage tvého prohlížeče</strong> – data nejsou odesílána na server.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">5. Sdílení dat</h2>
          <p className="text">
            Tvá data <strong>neprodáváme, nesdílíme s třetími stranami ani nepoužíváme pro reklamu</strong>.
            Výjimku tvoří:
          </p>
          <ul className="text legal-list">
            <li><strong>Stripe</strong> – platební brána pro nákup mnemů. Platební údaje (číslo karty) nezpracováváme my, ale Stripe přímo. Na Stripe se vztahují jejich vlastní zásady ochrany dat.</li>
            <li><strong>Hostingová infrastruktura</strong> – Vercel (serverová platforma) může zpracovávat metadata požadavků dle vlastních podmínek.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">6. Jak dlouho data uchováváme</h2>
          <ul className="text legal-list">
            <li>Data účtu jsou uchovávána po dobu existence účtu.</li>
            <li>Po smazání účtu jsou data <strong>nevratně odstraněna</strong> z naší databáze do 30 dní.</li>
            <li>Záznamy o platbách (Stripe) mohou být uchovávány z právních důvodů déle.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">7. Tvá práva</h2>
          <p className="text">Podle GDPR máš právo:</p>
          <ul className="text legal-list">
            <li><strong>Na přístup</strong> – kdykoli si vyžádat export svých dat (<Link href="/profile" className="auth-link">Profil → Export dat</Link>).</li>
            <li><strong>Na opravu</strong> – opravit nesprávné údaje v nastavení profilu.</li>
            <li><strong>Na výmaz</strong> – smazat účet a všechna data (<Link href="/profile" className="auth-link">Profil → Smazat účet</Link>).</li>
            <li><strong>Na přenositelnost</strong> – export dat ve strojově čitelném formátu.</li>
            <li><strong>Na námitku</strong> – vznést námitku proti zpracování kontaktováním správce.</li>
            <li><strong>Podat stížnost</strong> – u Úřadu pro ochranu osobních údajů (uoou.cz).</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">8. Bezpečnost</h2>
          <p className="text">
            Hesla jsou hashována algoritmem bcrypt. Komunikace probíhá výhradně přes HTTPS.
            Přístup k databázi je omezen na provozovatele systému.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">9. Změny těchto zásad</h2>
          <p className="text">
            O podstatných změnách budeme informovat na webu nebo e-mailem (pokud ho máš u nás uložen).
            Poslední aktualizace: <strong>červen 2025</strong>.
          </p>
        </section>

        <section className="story-block">
          <div className="hero-cta">
            <Link href="/" className="btn">← Zpět na hlavní stránku</Link>
            <Link href="/terms" className="btn btn-outline">Podmínky použití</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
