'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PWA_BUILD_ID, PWA_VERSION } from '../../src/lib/pwa';
import { usePwa } from '../../src/components/pwa/PwaProvider';

export default function InstallClient() {
  const pwa = usePwa();
  const [debug, setDebug] = useState(false);
  const [manifestOk, setManifestOk] = useState<boolean | null>(null);
  const [controller, setController] = useState(false);

  useEffect(() => {
    const enabled = new URLSearchParams(window.location.search).get('debug') === '1';
    setDebug(enabled);
    if (!enabled) return;
    void fetch('/manifest.webmanifest', { cache: 'no-store' })
      .then((response) => setManifestOk(response.ok && response.headers.get('content-type')?.includes('manifest') === true))
      .catch(() => setManifestOk(false));
    setController(Boolean(navigator.serviceWorker?.controller));
  }, []);

  const installStatus = !pwa.hydrated
    ? 'OVĚŘUJI STAV APLIKACE'
    : pwa.installed
      ? 'APLIKACE JE JIŽ NAINSTALOVANÁ'
      : pwa.serviceWorkerState === 'error'
        ? 'PWA NENÍ PŘIPRAVENA – CHYBA SERVICE WORKERU'
        : pwa.canPromptInstall
          ? 'APLIKACI LZE NAINSTALOVAT'
          : 'INSTALACE NYNÍ NENÍ DOSTUPNÁ';
  const installReason = !pwa.hydrated
    ? 'Kontroluji manifest, worker a podporu prohlížeče.'
    : pwa.installed
      ? 'SYNTHOMA už běží v samostatném režimu.'
      : pwa.serviceWorkerState === 'error'
        ? 'Service worker se nepodařilo aktivovat. Obnov stránku nebo vyčisti pouze cache aplikace v Nastavení.'
        : pwa.serviceWorkerState === 'unsupported'
          ? 'Tento prohlížeč nenabízí vlastní instalační rozhraní. Použij jeho nabídku Aplikace nebo Přidat na plochu.'
          : pwa.serviceWorkerState === 'installing'
            ? 'Offline vrstva se právě připravuje. Po dokončení může prohlížeč nabídnout instalaci.'
            : pwa.canPromptInstall
              ? 'Manifest i service worker jsou připravené a prohlížeč nabídl instalaci.'
              : 'Service worker je aktivní, ale prohlížeč neposkytl vlastní instalační prompt. V Edge použij nabídku Aplikace, v Android Chrome nabídku Přidat na plochu.';
  return <main className="pwa-page" aria-labelledby="pwa-install-page-title">
    <section className="pwa-page__panel">
      <Image className="pwa-page__icon" src="/icons/pwa-192x192.png" width={144} height={144} alt="Symbol aplikace SYNTHOMA" priority />
      <span className="pwa-page__code">SYS // PWA CHANNEL</span>
      <h1 id="pwa-install-page-title">{installStatus}</h1>
      <p className="pwa-page__reason" role="status">{installReason}</p>
      <p>Otevři knihovnu, Archiv i Cyklus bez běžného rámu prohlížeče. Navštívené kapitoly a základní rozhraní zůstanou po načtení dostupné také bez spojení.</p>
      <ul>
        <li>rychlý návrat k poslední rozečtené kapitole</li>
        <li>samostatné okno a bezpečné využití celé obrazovky</li>
        <li>řízené aktualizace bez věčně staré cache</li>
      </ul>
      <div className="pwa-page__status" aria-live="polite">
        <span>STAV</span><strong>{pwa.installed ? 'NAINSTALOVÁNO' : pwa.canPromptInstall ? 'PŘIPRAVENO K INSTALACI' : 'WEB'}</strong>
        <span>REŽIM</span><strong>{pwa.online ? 'ONLINE' : 'OFFLINE'}</strong>
        <span>VERZE</span><strong>{PWA_VERSION}</strong>
      </div>
      {!pwa.installed && pwa.canPromptInstall ? <button className="os-command os-command--primary" type="button" onClick={() => void pwa.install()}>NAINSTALOVAT SYNTHOMU</button> : null}
      {!pwa.installed && !pwa.canPromptInstall ? <div className="pwa-page__instructions"><h2>ANDROID</h2><p>V Chrome nebo Edge otevři nabídku prohlížeče a zvol <strong>Nainstalovat aplikaci</strong> nebo <strong>Přidat na plochu</strong>.</p></div> : null}
      {pwa.installed ? <p className="pwa-page__installed">Aplikace už běží v nainstalovaném režimu. Webové instalační pokyny se proto nebudou dál zobrazovat.</p> : null}
      {debug ? <section className="pwa-debug" aria-labelledby="pwa-debug-title">
        <h2 id="pwa-debug-title">PWA DIAGNOSTIKA</h2>
        <dl>
          <div><dt>Manifest</dt><dd>{manifestOk === null ? 'KONTROLA' : manifestOk ? 'OK' : 'CHYBA'}</dd></div>
          <div><dt>Service worker</dt><dd>{pwa.serviceWorkerState.toUpperCase()}</dd></div>
          <div><dt>Controller</dt><dd>{controller ? 'ANO' : 'NE'}</dd></div>
          <div><dt>Standalone</dt><dd>{pwa.installed ? 'ANO' : 'NE'}</dd></div>
          <div><dt>Install prompt</dt><dd>{pwa.canPromptInstall ? 'DOSTUPNÝ' : 'NEDOSTUPNÝ'}</dd></div>
          <div><dt>Online</dt><dd>{pwa.online ? 'ANO' : 'NE'}</dd></div>
          <div><dt>Build</dt><dd>{PWA_BUILD_ID}</dd></div>
          <div><dt>Cache verze</dt><dd>{PWA_VERSION}</dd></div>
        </dl>
      </section> : null}
      <Link className="os-command" href="/">ZPĚT DO SYNTHOMY</Link>
    </section>
  </main>;
}
