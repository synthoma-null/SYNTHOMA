'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readLastChapterPath } from '../../src/lib/readerState';
import { resolveResumeHref } from '../../src/lib/synthoma/library/getResumeTarget';

export default function OfflineClient() {
  const [online, setOnline] = useState(true);
  const [cachedChapter, setCachedChapter] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);

    const raw = readLastChapterPath();
    const href = raw ? resolveResumeHref(raw) : '';
    if (href && 'caches' in window) {
      void window.caches.match(href).then((match) => setCachedChapter(match ? href : null)).catch(() => setCachedChapter(null));
    }
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  return <main className="synthoma-system-state pwa-offline" aria-labelledby="offline-title">
    <section className="synthoma-system-state__panel">
      <span className="pwa-offline__badge">{online ? 'SPOJENÍ OBNOVENO' : 'REŽIM OFFLINE'}</span>
      <p className="synthoma-system-state__code">LOG [CONNECTION_LOST]</p>
      <h1 id="offline-title">Spojení se systémem bylo přerušeno.</h1>
      <p>Lokální paměť zůstává dostupná. Některé dříve navštívené části lze stále otevřít.</p>
      <div className="synthoma-system-state__actions">
        <button className="os-command os-command--primary" type="button" onClick={() => window.location.reload()}>ZKUSIT ZNOVU</button>
        <Link className="os-command" href="/books">OTEVŘÍT KNIHOVNU</Link>
        {cachedChapter ? <Link className="os-command" href={cachedChapter}>POKRAČOVAT V CACHOVANÉ KAPITOLE</Link> : null}
      </div>
    </section>
  </main>;
}
