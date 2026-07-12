'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="synthoma-system-state" aria-labelledby="global-error-title">
      <section className="synthoma-system-state__panel" role="alert">
        <p className="synthoma-system-state__code">SYSTEM // RENDER FAILURE</p>
        <h1 id="global-error-title">ROZHRANÍ ZTRATILO SOUVISLOST</h1>
        <p>Obsah zůstal někde pod chybou. Zkusíme ho vytáhnout znovu.</p>
        <div className="synthoma-system-state__actions"><button className="os-command" type="button" onClick={reset}>OBNOVIT KANÁL</button></div>
      </section>
    </main>
  );
}
