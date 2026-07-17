'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccess, type ClientAccessSnapshot } from '../../../src/components/access/AccessProvider';

type VerificationState = 'verifying' | 'completed' | 'delayed' | 'failed';

export default function PurchaseSuccessPage() {
  const { applySnapshot } = useAccess();
  const [state, setState] = useState<VerificationState>('verifying');

  useEffect(() => {
    const reference = new URL(window.location.href).searchParams.get('session_id');
    if (!reference) {
      setState('failed');
      return;
    }
    let cancelled = false;
    let attempts = 0;
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
      if (attempts < 15) window.setTimeout(verify, 1000);
      else setState('delayed');
    };
    void verify();
    return () => { cancelled = true; };
  }, [applySnapshot]);

  return (
    <main className="auth-page">
      <div className="auth-container os-surface os-surface--glass glitch-bg">
        <h1 className="auth-title glitch">
          {state === 'completed' ? 'PŘÍSTUP POTVRZEN' : 'OVĚŘUJI PLATBU'}
        </h1>
        <div className="auth-log">
          <span className="auth-log-prefix">LOG [{state.toUpperCase()}]:</span>
          <span className="auth-log-msg">
            {state === 'completed' && 'Webhook zapsal entitlement. Paměťový otisk je aktivní.'}
            {state === 'verifying' && 'Platební návrat přijat. Čekám na podepsaný Stripe webhook.'}
            {state === 'delayed' && 'Potvrzení trvá déle. Platbu neopakuj; stav se dokončí na serveru.'}
            {state === 'failed' && 'Grant nelze přiřadit. Kontaktuj podporu s ID Stripe session.'}
          </span>
        </div>
        <div className="purchase-success-links">
          <Link href="/profile" className="btn">PROFIL</Link>
          <Link href="/books" className="btn">KNIHOVNA</Link>
          {state === 'completed' ? <Link href="/books" className="btn">ČÍST</Link> : null}
        </div>
      </div>
    </main>
  );
}
