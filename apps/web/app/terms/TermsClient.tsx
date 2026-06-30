'use client';

import Link from 'next/link';
import { useLang } from '../../src/lib/LangContext';

const LAST_UPDATED_CS = '30. června 2026';
const LAST_UPDATED_EN = '30 June 2026';

export default function TermsClient() {
  const { lang } = useLang();
  const en = lang === 'en';

  if (en) {
    return (
      <div className="glitch-bg">
        <main className="story legal-page" role="main" aria-label="Terms of Use">
          <section className="story-block">
            <h1 className="title">TERMS OF USE</h1>
            <div className="paywall-log" role="note" aria-label="System notice">
              <p>
                <span className="paywall-log-prefix">LOG [TERMS_INIT]:</span>{' '}
                <span className="paywall-log-msg">
                  &#8220;Rules of the system. Read before you enter. The system remembers.&#8221;
                </span>
              </p>
            </div>
            <p className="text">
              These Terms govern the use of <strong>SYNTHOMA.cz</strong>, the interactive reader,
              archive, user account, mnems and any digital content available as part of the SYNTHOMA project.
            </p>
            <p className="text">
              By using the website you confirm that you have read these Terms and agree to them.
              If you do not agree, please do not use the website.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">1. Operator</h2>
            <p className="text">
              <strong>SYNTHOMA.cz</strong> is operated by its author as a personal creative digital project.
              All content – texts, graphics, music, sound, interactive elements, system logic, lore,
              character names and the SYNTHOMA world – is protected by copyright.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">2. Nature of the Project</h2>
            <p className="text">
              SYNTHOMA is a fictional creative project combining literature, an interactive reader,
              a world archive, system elements, music, visual aesthetics and optional user progression.
              The content is artistic, literary and fictional. It is not a psychological, medical, legal,
              financial or any other professional service.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">3. Access to Content</h2>
            <ul className="text legal-list">
              <li>Some content (selected chapters, archive entries) may be available free of charge without registration.</li>
              <li>Some content is available only after registration, after unlocking through progression, or after purchasing digital access.</li>
              <li>Registration is voluntary and serves to save progress, choices, the user profile, mnem wallet and access to unlocked content.</li>
              <li>The operator reserves the right to change the scope of free and paid content as the project develops.</li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">4. Age Restriction and Sensitive Content</h2>
            <p className="text">
              SYNTHOMA may contain psychologically demanding themes including pain, trauma, loneliness,
              systemic failure, identity, inner conflict, relational wounds, loss and other sensitive motifs.
            </p>
            <ul className="text legal-list">
              <li>The website is primarily intended for users over the age of 15.</li>
              <li>If you are under 15, use the website only with the consent of your legal guardian.</li>
              <li>If the content significantly distresses you or you are going through a difficult time, stop reading and reach out to a trusted person or professional help.</li>
            </ul>
            <p className="text">SYNTHOMA may name pain. That does not mean you have to carry it alone.</p>
          </section>

          <section className="story-block">
            <h2 className="title">5. User Account</h2>
            <ul className="text legal-list">
              <li>At registration you provide accurate and current information as required by the registration form.</li>
              <li>You are responsible for the security of your password. Do not share it and use reasonably strong credentials.</li>
              <li>One e-mail may be used for one user account only, unless the operator specifies otherwise.</li>
              <li>Your nickname must not be offensive, misleading, infringe on the rights of others or imply that you are the operator, administrator or other authorised person.</li>
              <li>The operator may temporarily restrict or terminate an account that violates these Terms, affects website security or harms other users or the project.</li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">6. Mnems, Digital Access and Payments</h2>
            <p className="text">
              SYNTHOMA may use <strong>mnems</strong> – internal units of the system used to unlock selected
              digital content, features or progression elements.
            </p>
            <ul className="text legal-list">
              <li>Mnems are an internal digital unit of the SYNTHOMA project.</li>
              <li>Mnems are not electronic money, cryptocurrency, an investment instrument or a payment method outside SYNTHOMA.</li>
              <li>Mnems cannot be exchanged back for money or transferred outside the system.</li>
              <li>Payments may be processed via Stripe or another payment provider.</li>
              <li>The operator does not process payment card details directly.</li>
              <li>Digital content access is normally granted after a successful payment.</li>
            </ul>
            <p className="text">
              If a technical error occurs during payment or mnems are not delivered, contact the operator.
              The situation will be verified using the payment record and account technical state.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">7. Withdrawal from Digital Content Purchase</h2>
            <p className="text">
              For digital content delivered online, access may be granted immediately after payment.
              If you explicitly agree to immediate access before the statutory withdrawal period expires,
              you acknowledge that you may lose the right to withdraw from the contract.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">8. Complaints and Technical Support</h2>
            <ul className="text legal-list">
              <li>If purchased content, mnems or an access package do not work correctly, contact the operator by e-mail.</li>
              <li>Include the account e-mail, approximate payment time and description of the problem.</li>
              <li>Never send your full card number or security codes.</li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">9. Copyright</h2>
            <p className="text">Without the prior consent of the author, it is prohibited in particular to:</p>
            <ul className="text legal-list">
              <li>copy, distribute or publish paid content,</li>
              <li>pass off SYNTHOMA content as your own,</li>
              <li>use the content for commercial purposes,</li>
              <li>automatically download, scrape or bulk-archive website content,</li>
              <li>circumvent the paywall, access restrictions or technical security measures,</li>
              <li>train artificial intelligence models on SYNTHOMA content without the author&apos;s consent.</li>
            </ul>
            <p className="text">
              Personal reading, sharing a link to the website and brief quotations with attribution are
              permitted, provided they do not harm the project or circumvent paid access.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">10. Fan Content</h2>
            <p className="text">Fan art, fan fiction, remixes and community creativity inspired by SYNTHOMA are welcome provided:</p>
            <ul className="text legal-list">
              <li>they are non-commercial (unless agreed otherwise with the author),</li>
              <li>SYNTHOMA.cz is credited as the source of inspiration,</li>
              <li>they are not presented as official project content,</li>
              <li>they do not harm the reputation of the project or the author,</li>
              <li>they do not infringe third-party rights.</li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">11. Prohibited Conduct</h2>
            <ul className="text legal-list">
              <li>disrupting the operation, security or availability of the website,</li>
              <li>attempting to gain unauthorised access to accounts, databases or non-public content,</li>
              <li>circumventing technical restrictions, the paywall, access layers or the mnem system,</li>
              <li>exploiting or deliberately triggering system errors,</li>
              <li>uploading or sending malicious code, spam or automated requests.</li>
            </ul>
          </section>

          <section className="story-block">
            <h2 className="title">12. Availability and Changes</h2>
            <p className="text">
              The operator endeavours to keep the website available and functional but does not guarantee
              uninterrupted operation. The operator reserves the right to modify, expand, restrict,
              suspend or discontinue parts of the website, features or user accounts at any time.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">13. Liability</h2>
            <p className="text">
              SYNTHOMA is provided as a creative digital project. The operator is not liable for damages
              arising from improper use, unavailability of the service, data loss caused by technical error
              or events outside the operator&apos;s reasonable control.
            </p>
            <p className="text">
              The content may deal with psychologically demanding themes but is not a substitute for
              professional help. If you are in crisis, contact a professional, a crisis line or a trusted person.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">14. Privacy</h2>
            <p className="text">
              Information about how the website processes personal data is available in the separate{' '}
              <Link href="/privacy" className="auth-link">Privacy Policy</Link>.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">15. Changes to These Terms</h2>
            <p className="text">
              The operator may update these Terms as the project evolves. Significant changes will be announced
              on the website or by e-mail. Last updated: <strong>{LAST_UPDATED_EN}</strong>.
            </p>
          </section>

          <section className="story-block">
            <h2 className="title">16. Governing Law</h2>
            <p className="text">
              These Terms are governed by the law of the Czech Republic. Any disputes shall be resolved
              by the competent courts of the Czech Republic.
            </p>
          </section>

          <section className="story-block">
            <div className="hero-cta">
              <Link href="/" className="btn">← Back to homepage</Link>
              <Link href="/privacy" className="btn btn-outline">Privacy Policy</Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="glitch-bg">
      <main className="story legal-page" role="main" aria-label="Podmínky použití">
        <section className="story-block">
          <h1 className="title">PODMÍNKY POUŽITÍ</h1>
          <div className="paywall-log" role="note" aria-label="Systémová poznámka">
            <p>
              <span className="paywall-log-prefix">LOG [TERMS_INIT]:</span>{' '}
              <span className="paywall-log-msg">
                &#8222;Pravidla systému. Čti, než vstoupíš. Systém si pamatuje.&#8220;
              </span>
            </p>
          </div>
          <p className="text">
            Tyto podmínky upravují používání webu <strong>SYNTHOMA.cz</strong>, interaktivní čtečky,
            archivu, uživatelského účtu, mnemů a dalšího digitálního obsahu projektu SYNTHOMA.
          </p>
          <p className="text">
            Používáním webu potvrzuješ, že ses s těmito podmínkami seznámil/a a souhlasíš s nimi.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">1. Provozovatel</h2>
          <p className="text">
            Web <strong>SYNTHOMA.cz</strong> provozuje autor projektu jako osobní autorský digitální projekt.
            Obsah webu – texty, grafika, hudba, zvuk, interaktivní prvky, systémová logika, lore,
            názvy postav a svět SYNTHOMA – je chráněn autorským právem.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">2. Charakter projektu</h2>
          <p className="text">
            SYNTHOMA je autorský fikční projekt kombinující literaturu, interaktivní čtečku, archiv světa,
            systémové prvky, hudbu a vizuální estetiku. Obsah je umělecký, literární a fikční.
            Nejedná se o psychologickou, lékařskou, právní, finanční ani jinou odbornou službu.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">3. Přístup k obsahu</h2>
          <ul className="text legal-list">
            <li>Část obsahu (vybrané kapitoly, archivní položky) může být dostupná zdarma bez registrace.</li>
            <li>Některý obsah je dostupný pouze po registraci, odemčení nebo zakoupení digitálního přístupu.</li>
            <li>Registrace je dobrovolná a slouží k ukládání postupu, voleb, profilu a mnemové peněženky.</li>
            <li>Provozovatel si vyhrazuje právo měnit rozsah bezplatného a placeného obsahu.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">4. Věkové omezení a náročný obsah</h2>
          <p className="text">
            SYNTHOMA může obsahovat psychologicky náročná témata včetně bolesti, traumatu, osamění,
            systémového selhání, identity, vnitřního konfliktu, vztahových zranění a ztráty.
          </p>
          <ul className="text legal-list">
            <li>Web je určen především osobám starším 15 let.</li>
            <li>Pokud je ti méně než 15 let, používej web pouze se souhlasem zákonného zástupce.</li>
            <li>Pokud tě obsah výrazně rozruší, přeruš čtení a obrať se na blízkou osobu nebo odbornou pomoc.</li>
          </ul>
          <p className="text">SYNTHOMA může bolest pojmenovávat. To ale neznamená, že ji máš nést sám/sama.</p>
        </section>

        <section className="story-block">
          <h2 className="title">5. Uživatelský účet</h2>
          <ul className="text legal-list">
            <li>Při registraci uvádíš pravdivé a aktuální údaje.</li>
            <li>Za bezpečnost svého hesla odpovídáš ty. Heslo nikomu nesděluj.</li>
            <li>Jeden e-mail může být použit pouze pro jeden účet.</li>
            <li>Přezdívka nesmí být urážlivá, klamavá ani porušovat práva jiných osob.</li>
            <li>Provozovatel může účet omezit nebo zrušit při porušení těchto podmínek.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">6. Mnemy, digitální přístup a platby</h2>
          <p className="text">
            V rámci SYNTHOMY mohou být používány <strong>mnemy</strong> – interní jednotky systému
            sloužící k odemykání vybraného digitálního obsahu nebo funkcí.
          </p>
          <ul className="text legal-list">
            <li>Mnemy jsou interní digitální jednotka projektu SYNTHOMA.</li>
            <li>Mnemy nejsou elektronické peníze, kryptoměna ani platební prostředek mimo SYNTHOMA.</li>
            <li>Mnemy nelze směnit zpět za peníze ani převést mimo systém.</li>
            <li>Platby mohou být zpracovávány přes Stripe nebo jiného platebního poskytovatele.</li>
            <li>Provozovatel přímo nezpracovává údaje o platební kartě.</li>
            <li>Přístup k digitálnímu obsahu je zpravidla zpřístupněn po úspěšné platbě.</li>
          </ul>
          <p className="text">
            V případě technické chyby při platbě nebo nedoručení mnemů kontaktuj provozovatele.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">7. Autorská práva</h2>
          <p className="text">Bez předchozího souhlasu autora je zakázáno zejména:</p>
          <ul className="text legal-list">
            <li>kopírovat, šířit nebo zveřejňovat placený obsah,</li>
            <li>vydávat obsah SYNTHOMA za vlastní,</li>
            <li>používat obsah ke komerčním účelům,</li>
            <li>automatizovaně stahovat nebo hromadně archivovat obsah webu,</li>
            <li>obcházet paywall, přístupová omezení nebo mnemový systém,</li>
            <li>trénovat AI modely na obsahu SYNTHOMA bez souhlasu autora.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">8. Fanouškovský obsah</h2>
          <p className="text">Fan art, fan fiction a komunitní tvorba inspirovaná SYNTHOMOU jsou vítány, pokud:</p>
          <ul className="text legal-list">
            <li>jsou nekomerční (pokud není s autorem domluveno jinak),</li>
            <li>uvádí SYNTHOMA.cz jako zdroj inspirace,</li>
            <li>neprezentují se jako oficiální obsah projektu,</li>
            <li>nepoškozují dobré jméno projektu nebo autora.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">9. Zakázané chování</h2>
          <ul className="text legal-list">
            <li>narušování provozu, bezpečnosti nebo dostupnosti webu,</li>
            <li>pokusy o neoprávněný přístup k účtům nebo neveřejnému obsahu,</li>
            <li>obcházení technických omezení nebo paywallů,</li>
            <li>zneužívání nebo úmyslné vyvolávání chyb systému,</li>
            <li>odesílání škodlivého kódu, spamu nebo automatizovaných požadavků.</li>
          </ul>
        </section>

        <section className="story-block">
          <h2 className="title">10. Dostupnost a změny</h2>
          <p className="text">
            Provozovatel se snaží udržovat web dostupný, ale nezaručuje nepřetržitý provoz.
            Vyhrazuje si právo kdykoli upravit, omezit nebo pozastavit části webu.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">11. Odpovědnost</h2>
          <p className="text">
            SYNTHOMA je autorský digitální projekt. Provozovatel neodpovídá za škody vzniklé
            nesprávným používáním, nedostupností nebo technickou chybou.
          </p>
          <p className="text">
            Obsah není náhradou za odbornou pomoc. Pokud se nacházíš v krizi, obrať se na odborníka
            nebo krizovou linku.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">12. Ochrana osobních údajů</h2>
          <p className="text">
            Informace o zpracování osobních údajů najdeš v samostatném dokumentu{' '}
            <Link href="/privacy" className="auth-link">Ochrana osobních údajů</Link>.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">13. Změny podmínek</h2>
          <p className="text">
            O podstatných změnách bude provozovatel informovat na webu nebo e-mailem.
            Poslední aktualizace: <strong>{LAST_UPDATED_CS}</strong>.
          </p>
        </section>

        <section className="story-block">
          <h2 className="title">14. Rozhodné právo</h2>
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
