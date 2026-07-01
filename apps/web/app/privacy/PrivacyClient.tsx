'use client';

import Link from 'next/link';
import { useLang } from '../../src/lib/LangContext';

const LAST_UPDATED_CS = '30. června 2026';
const LAST_UPDATED_EN = '30 June 2026';
const LAST_UPDATED_ISO = '2026-06-30';

export default function PrivacyClient() {
  const { lang } = useLang();
  const en = lang === 'en';

  if (en) {
    return (
      <div className="glitch-bg">
        <main className="story legal-page" role="main" aria-label="Privacy Policy">
          <section className="story-block">
            <h1 className="title">PRIVACY POLICY</h1>
            <div className="paywall-log" role="note" aria-label="System notice">
              <p>
                <span className="paywall-log-prefix">LOG [GDPR_COMPLIANCE]:</span>{' '}
                <span className="paywall-log-msg">
                  &#8220;The system processes memory traces. Transparently.&#8221;
                </span>
              </p>
            </div>
            <p className="text">
              This Privacy Policy explains how <strong>SYNTHOMA.cz</strong> processes personal data of
              visitors, registered users and users of the interactive reader, archive, mnem system and
              any digital content made available through the project.
            </p>
            <p className="text">
              The purpose of this Policy is to clearly explain what personal data we process, why we
              process it, how long we keep it, who may have access to it and what rights you have.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">1. Data Controller</h2>
            <p className="text">The controller of personal data is the operator of <strong>SYNTHOMA.cz</strong>.</p>
            <ul className="text legal-list">
              <li><strong>Contact e-mail:</strong> null1@synthoma.cz</li>
            </ul>
            <p className="text">
              For questions regarding personal data protection or to exercise your rights, use the contact e-mail listed above.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">2. What Personal Data We Process</h2>
            <h3 className="subtitle">2.1 When visiting the website</h3>
            <ul className="text legal-list">
              <li>technical request data (IP address, request time, page address),</li>
              <li>device and browser information transmitted by a standard web request,</li>
              <li>server and security logs for operation, protection and diagnostics.</li>
            </ul>
            <h3 className="subtitle">2.2 During registration</h3>
            <ul className="text legal-list">
              <li><strong>e-mail address</strong> – account creation, login, access recovery,</li>
              <li><strong>nickname</strong> – user identifier within the system,</li>
              <li><strong>password</strong> – stored only as a cryptographic hash, never in readable form,</li>
              <li><strong>account identifier</strong> – technical identifier for account management.</li>
            </ul>
            <h3 className="subtitle">2.3 When using the reader</h3>
            <ul className="text legal-list">
              <li><strong>reading progress</strong> – completed chapters, completion percentage,</li>
              <li><strong>user choices</strong> – interactive choices, unlocked branches, state elements,</li>
              <li><strong>mnem wallet</strong> – records of assigned, earned or spent mnems,</li>
              <li><strong>unlocked content</strong> – which chapters or features the account can access,</li>
              <li><strong>interface settings</strong> – theme, text size, effects, audio.</li>
            </ul>
            <h3 className="subtitle">2.4 During payment</h3>
            <ul className="text legal-list">
              <li>information about purchased digital content, package or mnem access,</li>
              <li>technical payment identifier, status and time,</li>
              <li>e-mail or account identifier required to assign access.</li>
            </ul>
            <p className="text">
              Payment card details are not processed by the website operator directly. Such data is processed
              by the payment provider (e.g. Stripe) under its own terms and privacy policy.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">3. Purposes and Legal Bases</h2>
            <div className="legal-table-wrap" role="region" aria-label="Purposes and legal bases of processing">
              <table className="legal-table">
                <thead><tr><th>Purpose</th><th>Data Type</th><th>Legal Basis</th></tr></thead>
                <tbody>
                  <tr><td>Website operation and security</td><td>technical logs, IP, request data</td><td>legitimate interest</td></tr>
                  <tr><td>Account creation and management</td><td>e-mail, nickname, password hash</td><td>performance of a contract</td></tr>
                  <tr><td>Saving reader progress</td><td>progress, choices, mnems</td><td>performance of a contract</td></tr>
                  <tr><td>Payment processing and content access</td><td>payment ID, status, content</td><td>performance of a contract</td></tr>
                  <tr><td>Accounting and tax obligations</td><td>payment and billing data</td><td>legal obligation</td></tr>
                  <tr><td>Optional analytics</td><td>anonymised traffic and interaction data</td><td>consent</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="story-block">
            <h2 className="title">4. Reader Choices and Mnem Traces</h2>
            <p className="text">
              Terms such as psychological profile, MBTI trace, subject, fragment or mnem trace are part of the
              fictional SYNTHOMA system. They do not constitute professional psychological diagnosis or
              automated decision-making with legal effects.
            </p>
            <p className="text">These data are not sold to third parties and are not used for advertising profiling.</p>
          </section>

          <section className="story-block">
            <h2 className="title">5. Cookies and Local Storage</h2>
            <p className="text">
              <strong>Strictly necessary cookies</strong> are used without consent (login, security, session).
              Optional cookies (analytics, personalisation) require consent.
              Settings may also be stored in <strong>localStorage</strong> in your browser – not sent to the server.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">6. Who May Access the Data</h2>
            <ul className="text legal-list">
              <li><strong>Hosting and infrastructure</strong> – e.g. Vercel (hosting, CDN, server functions),</li>
              <li><strong>Payment gateway</strong> – e.g. Stripe for digital content and mnem purchases,</li>
              <li><strong>E-mail services</strong> – for registration confirmations, password resets, receipts,</li>
              <li><strong>Analytics services</strong> – only if deployed and within consent scope,</li>
              <li><strong>Public authorities</strong> – if required by law.</li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">7. Transfers Outside the EU</h2>
            <p className="text">
              Some service providers may process data outside the EU/EEA. Where such transfers occur, they
              take place using appropriate safeguards under the GDPR (adequacy decision or standard contractual clauses).
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">8. How Long We Keep the Data</h2>
            <ul className="text legal-list">
              <li><strong>Account data</strong> – for the duration of the account,</li>
              <li><strong>Reading progress, choices and mnems</strong> – for the duration of the account,</li>
              <li><strong>Technical and security logs</strong> – for the period necessary for security and diagnostics,</li>
              <li><strong>Accounting and payment records</strong> – for the period required by law,</li>
              <li>After account deletion, personal data will generally be removed within <strong>30 days</strong>.</li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">9. Your Rights</h2>
            <ul className="text legal-list">
              <li><strong>right of access</strong> – request a copy of your personal data,</li>
              <li><strong>right to rectification</strong> – correct inaccurate or incomplete data,</li>
              <li><strong>right to erasure</strong> – request deletion when data is no longer needed,</li>
              <li><strong>right to restriction</strong> – request temporary restriction of processing,</li>
              <li><strong>right to data portability</strong> – receive your data in machine-readable format,</li>
              <li><strong>right to object</strong> – against processing based on legitimate interest,</li>
              <li><strong>right to withdraw consent</strong> – at any time,</li>
              <li><strong>right to lodge a complaint</strong> – with the Czech Office for Personal Data Protection.</li>
            </ul>
            <ul className="text legal-list">
              <li><Link href="/profile" className="auth-link">Profile → Data export</Link></li>
              <li><Link href="/profile" className="auth-link">Profile → Delete account</Link></li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">10. Security</h2>
            <ul className="text legal-list">
              <li>all communication over HTTPS,</li>
              <li>passwords stored as cryptographic hashes only,</li>
              <li>database access restricted to authorised persons,</li>
              <li>payment details processed by the payment provider, not SYNTHOMA.cz directly.</li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">11. Children and Young Users</h2>
            <p className="text">
              The website is primarily intended for users over 15. If you are under 15, use it only with
              your guardian&apos;s consent. If the content causes distress, stop and talk to a trusted adult.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">12. Changes to This Policy</h2>
            <p className="text">
              We may update this Policy as the project evolves. Significant changes will be announced on
              the website or by e-mail.
              Last updated: <time dateTime={LAST_UPDATED_ISO}><strong>{LAST_UPDATED_EN}</strong></time>.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">13. Contact and Supervisory Authority</h2>
            <ul className="text legal-list">
              <li><strong>Czech Office for Personal Data Protection</strong></li>
              <li><a href="https://uoou.gov.cz" className="auth-link">uoou.gov.cz</a></li>
            </ul>
          </section>

          <section className="story-block">
            <div className="hero-cta">
              <Link href="/" className="btn">← Back to homepage</Link>
              <Link href="/terms" className="btn btn-outline">Terms of Use</Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="glitch-bg">
      <main className="story legal-page" role="main" aria-label="Ochrana osobních údajů">
        <section className="story-block">
          <h1 className="title">OCHRANA OSOBNÍCH ÚDAJŮ</h1>
          <div className="paywall-log" role="note" aria-label="Systémová poznámka">
            <p>
              <span className="paywall-log-prefix">LOG [GDPR_COMPLIANCE]:</span>{' '}
              <span className="paywall-log-msg">
                &#8222;Systém zpracovává paměťové stopy. Transparentně.&#8220;
              </span>
            </p>
          </div>
          <p className="text">
            Tyto zásady vysvětlují, jak web <strong>SYNTHOMA.cz</strong> zpracovává osobní údaje
            návštěvníků, registrovaných uživatelů a uživatelů interaktivní čtečky, archivu,
            mnemového systému a případného digitálního obsahu.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">1. Správce osobních údajů</h2>
          <p className="text">Správcem osobních údajů je provozovatel webu <strong>SYNTHOMA.cz</strong>.</p>
          <ul className="text legal-list">
            <li><strong>Kontaktní e-mail:</strong> null1@synthoma.cz</li>
          </ul>
          <p className="text">Pro dotazy nebo uplatnění práv použij kontaktní e-mail uvedený výše.</p>
        </section>

        <section className="story-block">
          <h2 className="title">2. Jaké osobní údaje zpracováváme</h2>
          <h3 className="subtitle">2.1 Při návštěvě webu</h3>
          <ul className="text legal-list">
            <li>technické údaje o požadavku (IP adresa, čas, adresa stránky),</li>
            <li>informace o zařízení a prohlížeči v rozsahu předávaném webovým požadavkem,</li>
            <li>serverové a bezpečnostní logy pro provoz, ochranu a diagnostiku.</li>
          </ul>
          <h3 className="subtitle">2.2 Při registraci</h3>
          <ul className="text legal-list">
            <li><strong>e-mailová adresa</strong> – přihlášení, obnova přístupu, komunikace,</li>
            <li><strong>přezdívka</strong> – identifikátor uživatele v systému,</li>
            <li><strong>heslo</strong> – je ukládáno pouze jako kryptografický hash,</li>
            <li><strong>identifikátor účtu</strong> – technický identifikátor pro správu účtu.</li>
          </ul>
          <h3 className="subtitle">2.3 Při čtení</h3>
          <ul className="text legal-list">
            <li><strong>postup čtení</strong> – dokončené kapitoly, procento dokončení,</li>
            <li><strong>volby</strong> – interaktivní volby, odemčené větve, stavové prvky,</li>
            <li><strong>mnemová peněženka</strong> – záznamy o mnemech,</li>
            <li><strong>odemčený obsah</strong> – kapitoly a funkce zpřístupněné účtu,</li>
            <li><strong>nastavení rozhraní</strong> – motiv, velikost textu, efekty, zvuk.</li>
          </ul>
          <h3 className="subtitle">2.4 Při platbě</h3>
          <ul className="text legal-list">
            <li>informace o zakoupeném obsahu nebo balíčku,</li>
            <li>technický identifikátor platby, stav a čas,</li>
            <li>e-mail nebo identifikátor účtu pro přiřazení přístupu.</li>
          </ul>
          <p className="text">
            Údaje o platební kartě zpracovává platební poskytovatel (např. Stripe), nikoli provozovatel.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">3. Účely a právní základy zpracování</h2>
          <div className="legal-table-wrap" role="region" aria-label="Účely a právní základy zpracování">
            <table className="legal-table">
              <thead><tr><th>Účel</th><th>Typ údajů</th><th>Právní základ</th></tr></thead>
              <tbody>
                <tr><td>Provoz webu a bezpečnost</td><td>technické logy, IP, požadavky</td><td>oprávněný zájem</td></tr>
                <tr><td>Správa účtu</td><td>e-mail, přezdívka, hash hesla</td><td>plnění smlouvy</td></tr>
                <tr><td>Ukládání postupu ve čtečce</td><td>postup, volby, mnemy</td><td>plnění smlouvy</td></tr>
                <tr><td>Zpracování plateb</td><td>identifikátor platby, zakoupený obsah</td><td>plnění smlouvy</td></tr>
                <tr><td>Účetní a daňové povinnosti</td><td>platební a fakturační údaje</td><td>plnění právní povinnosti</td></tr>
                <tr><td>Volitelná analytika</td><td>anonymizovaná data o návštěvnosti</td><td>souhlas</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="story-block">
          <h2 className="title">4. Čtenářské volby a mnemové stopy</h2>
          <p className="text">
            Označení jako psychologický profil, MBTI stopa, subjekt nebo mnemová stopa jsou součástí fikčního
            systému SYNTHOMA. Nejde o odbornou psychologickou diagnostiku ani automatizované rozhodování s právními účinky.
          </p>
          <p className="text">Tyto údaje nejsou prodávány třetím stranám ani používány pro reklamní profilování.</p>
        </section>

        <section className="story-block">
          <h2 className="title">5. Cookies a localStorage</h2>
          <p className="text">
            <strong>Nezbytné cookies</strong> slouží k přihlášení a bezpečnosti (bez souhlasu).
            Volitelné cookies (analytika, personalizace) se používají pouze na základě souhlasu.
            Nastavení může být ukládáno v <strong>localStorage</strong> ve tvém prohlížeči – neodesíláno na server.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">6. Komu mohou být údaje zpřístupněny</h2>
          <ul className="text legal-list">
            <li><strong>Hosting a infrastruktura</strong> – např. Vercel (hosting, CDN, serverové funkce),</li>
            <li><strong>Platební brána</strong> – např. Stripe pro nákup mnemů a obsahu,</li>
            <li><strong>E-mailové služby</strong> – potvrzení registrace, obnova hesla, účtenky,</li>
            <li><strong>Analytické služby</strong> – pouze pokud jsou nasazeny a v rozsahu souhlasu,</li>
            <li><strong>Orgány veřejné moci</strong> – pokud to vyžaduje právní předpis.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">7. Předávání mimo EU</h2>
          <p className="text">
            Někteří poskytovatelé mohou zpracovávat údaje mimo EU/EHP. Taková předání probíhají pouze
            se zárukami podle GDPR (rozhodnutí o odpovídající ochraně nebo standardní smluvní doložky).
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">8. Jak dlouho data uchováváme</h2>
          <ul className="text legal-list">
            <li><strong>Údaje účtu</strong> – po dobu existence účtu,</li>
            <li><strong>Postup čtení, volby a mnemy</strong> – po dobu existence účtu,</li>
            <li><strong>Technické a bezpečnostní logy</strong> – po dobu nezbytnou pro ochranu webu,</li>
            <li><strong>Účetní a platební záznamy</strong> – po dobu vyžadovanou právními předpisy,</li>
            <li>Po smazání účtu budou osobní údaje odstraněny zpravidla do <strong>30 dní</strong>.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">9. Tvá práva</h2>
          <ul className="text legal-list">
            <li><strong>právo na přístup</strong> – vyžádat kopii svých osobních údajů,</li>
            <li><strong>právo na opravu</strong> – opravit nepřesné nebo neúplné údaje,</li>
            <li><strong>právo na výmaz</strong> – smazat údaje, pokud už nejsou potřebné,</li>
            <li><strong>právo na omezení zpracování</strong> – dočasně omezit zpracování,</li>
            <li><strong>právo na přenositelnost</strong> – obdržet data ve strojově čitelném formátu,</li>
            <li><strong>právo vznést námitku</strong> – proti zpracování na základě oprávněného zájmu,</li>
            <li><strong>právo odvolat souhlas</strong> – kdykoli,</li>
            <li><strong>právo podat stížnost</strong> – u Úřadu pro ochranu osobních údajů.</li>
          </ul>
          <ul className="text legal-list">
            <li><Link href="/profile" className="auth-link">Profil → Export dat</Link></li>
            <li><Link href="/profile" className="auth-link">Profil → Smazat účet</Link></li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">10. Bezpečnost</h2>
          <ul className="text legal-list">
            <li>komunikace přes HTTPS,</li>
            <li>hesla ukládána výhradně jako kryptografický hash,</li>
            <li>přístup k databázi omezen na oprávněné osoby,</li>
            <li>platební údaje zpracovává platební poskytovatel, nikoli SYNTHOMA.cz přímo.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">11. Děti a mladiství</h2>
          <p className="text">
            Web je určen především osobám starším 15 let. Pokud je ti méně, používej web se souhlasem
            zákonného zástupce. Pokud tě obsah rozruší, přeruš čtení a obrať se na dospělou osobu.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">12. Změny zásad</h2>
          <p className="text">
            O podstatných změnách budeme informovat na webu nebo e-mailem.
            Poslední aktualizace: <time dateTime={LAST_UPDATED_ISO}><strong>{LAST_UPDATED_CS}</strong></time>.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">13. Kontakt a dozorový úřad</h2>
          <ul className="text legal-list">
            <li><strong>Úřad pro ochranu osobních údajů</strong></li>
            <li><a href="https://uoou.gov.cz" className="auth-link">uoou.gov.cz</a></li>
          </ul>
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
