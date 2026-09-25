'use client';

import { useEffect } from 'react';
import { useLang } from '../src/lib/LangContext';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useLang();
  const en = lang === 'en';
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="synthoma-system-state" aria-labelledby="global-error-title">
      <section className="synthoma-system-state__panel" role="alert">
        <p className="synthoma-system-state__code">SYSTEM // RENDER FAILURE</p>
        <h1 id="global-error-title">{en ? 'THE PAGE COULD NOT BE LOADED' : 'STRÁNKU SE NEPODAŘILO NAČÍST'}</h1>
        <p>{en ? 'Please try again or return to the home page.' : 'Zkus stránku načíst znovu nebo se vrať na úvod.'}</p>
        <div className="synthoma-system-state__actions"><button className="os-command" type="button" onClick={reset}>{en ? 'TRY AGAIN' : 'ZKUSIT ZNOVU'}</button><a className="os-command" href={en ? '/?locale=en' : '/'}>{en ? 'HOME' : 'ÚVOD'}</a></div>
      </section>
    </main>
  );
}
