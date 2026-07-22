'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PWA_VERSION } from '../../lib/pwa';
import { usePwa } from './PwaProvider';

export default function PwaSettings({ lang }: { lang: 'cs' | 'en' }) {
  const pwa = usePwa();
  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState(false);
  const cs = lang === 'cs';

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try { await action(); } finally { setBusy(false); }
  };

  return <div className="pwa-settings">
    <dl className="pwa-status-grid">
      <div><dt>{cs ? 'REŽIM' : 'MODE'}</dt><dd>{pwa.installed ? (cs ? 'NAINSTALOVANÁ APLIKACE' : 'INSTALLED APP') : 'WEB'}</dd></div>
      <div><dt>{cs ? 'VERZE' : 'VERSION'}</dt><dd>{PWA_VERSION}</dd></div>
      <div><dt>{cs ? 'PŘIPOJENÍ' : 'CONNECTION'}</dt><dd>{pwa.online ? 'ONLINE' : 'OFFLINE'}</dd></div>
      <div><dt>{cs ? 'OFFLINE PAMĚŤ' : 'OFFLINE MEMORY'}</dt><dd>{pwa.serviceWorkerState === 'error' ? (cs ? 'CHYBA' : 'ERROR') : pwa.cacheStatus === 'ready' ? (cs ? 'PŘIPRAVENA' : 'READY') : pwa.cacheStatus === 'partial' ? (cs ? 'ČÁSTEČNÁ' : 'PARTIAL') : (cs ? 'NEDOSTUPNÁ' : 'UNAVAILABLE')}</dd></div>
    </dl>
    <div className="pwa-settings__actions">
      {!pwa.installed ? pwa.canPromptInstall
        ? <button type="button" disabled={busy} onClick={() => void pwa.install()}>{cs ? 'NAINSTALOVAT SYNTHOMU' : 'INSTALL SYNTHOMA'}</button>
        : <Link href="/install">{cs ? 'NAINSTALOVAT SYNTHOMU' : 'INSTALL SYNTHOMA'}</Link>
        : null}
      <button type="button" disabled={busy} onClick={() => void run(pwa.checkForUpdate)}>{cs ? 'ZKONTROLOVAT AKTUALIZACI' : 'CHECK FOR UPDATE'}</button>
      <button type="button" disabled={busy} onClick={() => void run(pwa.refreshOfflineData)}>{cs ? 'OBNOVIT OFFLINE DATA' : 'REFRESH OFFLINE DATA'}</button>
      <button type="button" disabled={busy} onClick={() => setConfirmClear(true)}>{cs ? 'VYČISTIT CACHE APLIKACE' : 'CLEAR APP CACHE'}</button>
    </div>
    {pwa.updateAvailable ? <p className="pwa-settings__notice" role="status">{cs ? 'Nová verze čeká na bezpečný okamžik.' : 'A new version is waiting for a safe moment.'}</p> : null}
    {confirmClear ? <div className="pwa-settings__confirm" role="alertdialog" aria-modal="true" aria-labelledby="pwa-clear-title">
      <div><h3 id="pwa-clear-title">{cs ? 'Vymazat offline cache?' : 'Clear offline cache?'}</h3><p>{cs ? 'Postup čtení, volby, nastavení, Cyklus ani přihlášení zůstanou zachované.' : 'Reading progress, choices, settings, Cyklus and sign-in remain untouched.'}</p><div><button type="button" onClick={() => setConfirmClear(false)}>{cs ? 'ZRUŠIT' : 'CANCEL'}</button><button type="button" onClick={() => { setConfirmClear(false); void run(pwa.clearOfflineCache); }}>{cs ? 'VYMAZAT' : 'CLEAR'}</button></div></div>
    </div> : null}
  </div>;
}
