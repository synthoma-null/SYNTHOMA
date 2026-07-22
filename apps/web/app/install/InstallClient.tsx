'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PWA_VERSION } from '../../src/lib/pwa';
import { usePwa } from '../../src/components/pwa/PwaProvider';

export default function InstallClient() {
  const pwa = usePwa();
  return <main className="pwa-page" aria-labelledby="pwa-install-page-title">
    <section className="pwa-page__panel">
      <Image className="pwa-page__icon" src="/icons/pwa-192x192.png" width={144} height={144} alt="Symbol aplikace SYNTHOMA" priority />
      <span className="pwa-page__code">SYS // PWA CHANNEL</span>
      <h1 id="pwa-install-page-title">SYNTHOMA V CELÉM DISPLEJI</h1>
      <p>Otevři knihovnu, Archiv i Cyklus bez běžného rámu prohlížeče. Navštívené kapitoly a základní rozhraní zůstanou po načtení dostupné také bez spojení.</p>
      <ul>
        <li>rychlý návrat k poslední rozečtené kapitole</li>
        <li>samostatné okno a bezpečné využití celé obrazovky</li>
        <li>řízené aktualizace bez věčně staré cache</li>
      </ul>
      <div className="pwa-page__status" aria-live="polite">
        <span>STAV</span><strong>{pwa.installed ? 'NAINSTALOVÁNO' : pwa.canPromptInstall ? 'PŘIPRAVENO K INSTALACI' : 'INSTALACE PŘES PROHLÍŽEČ'}</strong>
        <span>REŽIM</span><strong>{pwa.online ? 'ONLINE' : 'OFFLINE'}</strong>
        <span>VERZE</span><strong>{PWA_VERSION}</strong>
      </div>
      {!pwa.installed && pwa.canPromptInstall ? <button className="os-command os-command--primary" type="button" onClick={() => void pwa.install()}>NAINSTALOVAT SYNTHOMU</button> : null}
      {!pwa.installed && !pwa.canPromptInstall ? <div className="pwa-page__instructions"><h2>ANDROID</h2><p>V Chrome nebo Edge otevři nabídku prohlížeče a zvol <strong>Nainstalovat aplikaci</strong> nebo <strong>Přidat na plochu</strong>.</p></div> : null}
      {pwa.installed ? <p className="pwa-page__installed">Aplikace už běží v nainstalovaném režimu. Webové instalační pokyny se proto nebudou dál zobrazovat.</p> : null}
      <Link className="os-command" href="/">ZPĚT DO SYNTHOMY</Link>
    </section>
  </main>;
}
