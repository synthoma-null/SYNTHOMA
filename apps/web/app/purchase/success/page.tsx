'use client';

import Link from 'next/link';
import { useLang } from '../../../src/lib/LangContext';
import { useEffect, useState } from 'react';
import { useAccess, type ClientAccessSnapshot } from '../../../src/components/access/AccessProvider';

type VerificationState = 'verifying' | 'completed' | 'delayed' | 'failed';

export default function PurchaseSuccessPage() {
  const { applySnapshot } = useAccess();
  const { lang } = useLang();
  const en = lang === 'en';
  const href = (path: string) => en ? `${path}?locale=en` : path;
  const headings = en ? { completed: 'ACCESS CONFIRMED', verifying: 'VERIFYING PAYMENT', delayed: 'CONFIRMATION DELAYED', failed: 'WE COULD NOT VERIFY ACCESS' } : { completed: 'PŘÍSTUP POTVRZEN', verifying: 'OVĚŘUJI PLATBU', delayed: 'POTVRZENÍ SE ZDRŽELO', failed: 'PŘÍSTUP SE NEPODAŘILO OVĚŘIT' };
  const [state, setState] = useState<VerificationState>('verifying');

  useEffect(() => {
    const reference = new URL(window.location.href).searchParams.get('session_id');
    if (!reference) {
      setState('failed');
      return;
    }
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const verify = async () => {
      attempts += 1;
      try {
        const response = await fetch(`/api/me/grants/status?reference=${encodeURIComponent(reference)}`, { cache: 'no-store' });
        const payload = await response.json() as {
          status?: string;
          snapshot?: ClientAccessSnapshot | null;
        };
        if (cancelled) return;
        if (response.ok && payload.status === 'completed') {
          if (payload.snapshot) applySnapshot(payload.snapshot, true);
          setState('completed');
          return;
        }
        if (response.ok && ['rejected', 'unresolved'].includes(payload.status ?? '')) {
          setState('failed');
          return;
        }
      } catch {
        // The webhook may still be in flight. Keep the state honest and retry briefly.
      }
      if (attempts < 15) timer = setTimeout(verify, 1000);
      else setState('delayed');
    };
    void verify();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [applySnapshot]);

  return (
    <main className="auth-page">
      <div className="auth-container os-surface os-surface--glass glitch-bg">
        <h1 className="auth-title glitch">
          {headings[state]}
        </h1>
        <div className="auth-log">
          <span className="auth-log-prefix">LOG [{state.toUpperCase()}]:</span>
          <span className="auth-log-msg">
            {state === 'completed' && (en ? 'Your access is active. You can start reading.' : 'Přístup je aktivní. Můžeš začít číst.')}
            {state === 'verifying' && (en ? 'Waiting for payment confirmation.' : 'Čekáme na potvrzení platby.')}
            {state === 'delayed' && (en ? 'Confirmation is taking longer. Do not pay again.' : 'Potvrzení trvá déle. Platbu neopakuj.')}
            {state === 'failed' && (en ? 'Contact support and include the payment reference.' : 'Kontaktuj podporu a přilož referenci platby.')}
          </span>
        </div>
        {(state === 'failed' || state === 'delayed') && <p><a href="mailto:null1@synthoma.cz">null1@synthoma.cz</a></p>}
        <div className="purchase-success-links">
          <Link href={href("/profile")} className="btn">{en ? "PROFILE" : "PROFIL"}</Link>
          <Link href={href("/books")} className="btn">{en ? "LIBRARY" : "KNIHOVNA"}</Link>
          {state === 'completed' ? <Link href={href("/books")} className="btn">{en ? "READ" : "ČÍST"}</Link> : null}
        </div>
      </div>
    </main>
  );
}
