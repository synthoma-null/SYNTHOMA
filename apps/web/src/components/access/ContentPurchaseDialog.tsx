'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PACKAGES } from '../../content/booksManifest';
import type { ContentType } from '../../content/catalog';
import { useAccess, useContentAccess } from './AccessProvider';
import { useUiLayer } from '../ui-layer/UiLayerProvider';

interface ContentPurchaseDialogProps {
  contentType: ContentType;
  contentId: string;
  title: string;
  onClose: () => void;
  onPurchased?: () => void;
}

function createAttemptKey(contentType: ContentType, contentId: string): string {
  const suffix = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `purchase:${contentType}:${contentId}:${suffix}`;
}

export default function ContentPurchaseDialog({
  contentType,
  contentId,
  title,
  onClose,
  onPurchased,
}: ContentPurchaseDialogProps) {
  const { data: session, status: sessionStatus } = useSession();
  const { access, balance, loading, error: accessError, purchase } = useContentAccess(contentType, contentId);
  const { refresh } = useAccess();
  const [busy, setBusy] = useState(false);
  const [stripeBusy, setStripeBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [codeBusy, setCodeBusy] = useState(false);
  const attemptKeyRef = useRef(createAttemptKey(contentType, contentId));
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { closeLayer } = useUiLayer({
    id: `purchase:${contentType}:${contentId}`,
    type: 'purchase-dialog',
    open: true,
    onClose,
  });

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    attemptKeyRef.current = createAttemptKey(contentType, contentId);
    setError('');
  }, [contentId, contentType]);

  const packages = useMemo(() => {
    if (!access) return [];
    const ids = new Set(access.purchasePackageIds);
    if (contentType === 'chapter') ids.add('single-fragment');
    return PACKAGES.filter((item) => ids.has(item.id));
  }, [access, contentType]);

  const handleMnemPurchase = async () => {
    setBusy(true);
    setError('');
    try {
      await purchase(attemptKeyRef.current);
      onPurchased?.();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Nákup se nepodařilo dokončit.');
    } finally {
      setBusy(false);
    }
  };

  const handleStripe = async (packageId: string) => {
    setStripeBusy(packageId);
    setError('');
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `stripe:${attemptKeyRef.current}:${packageId}`,
        },
        body: JSON.stringify({
          packageId,
          ...(contentType === 'chapter' ? { chapterId: contentId } : {}),
        }),
      });
      const payload = await response.json() as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error || 'Platební brána odmítla přechod.');
      window.location.assign(payload.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Platební brána není dostupná.');
      setStripeBusy(null);
    }
  };

  const handleRedeem = async (event: React.FormEvent) => {
    event.preventDefault();
    setCodeBusy(true);
    setError('');
    try {
      const response = await fetch('/api/mnems/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Kód se nepodařilo ověřit.');
      await refresh();
      onPurchased?.();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Kód se nepodařilo ověřit.');
    } finally {
      setCodeBusy(false);
    }
  };

  const cost = access?.mnemCost ?? null;
  const canAfford = typeof cost === 'number' && cost > 0 && balance >= cost;
  const loggedIn = Boolean(session?.user);
  const callbackUrl = typeof window === 'undefined'
    ? '/books'
    : `${window.location.pathname}${window.location.search}`;

  return (
    <div
      className="paywall-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-purchase-title"
      onMouseDown={(event) => { if (event.target === event.currentTarget) closeLayer(); }}
    >
      <div className="paywall-modal os-surface">
        <button ref={closeRef} className="paywall-close" type="button" onClick={closeLayer} aria-label="Zavřít">✕</button>
        <div className="paywall-log">
          <p><span className="paywall-log-prefix">LOG [ACCESS_GATE]:</span></p>
          <p className="paywall-log-msg">Obsah existuje. Přístup zatím ne. Systém tentokrát rozlišuje obě skutečnosti.</p>
        </div>
        <div className="paywall-chapter">
          <span className="paywall-chapter-label">{contentType.replace('_', ' ')}</span>
          <h2 id="content-purchase-title" className="paywall-chapter-title">{title}</h2>
          {cost !== null && cost > 0 ? <span className="paywall-chapter-cost">{cost} MNEM</span> : null}
        </div>

        {loading ? <p>Ověřuji paměťový otisk…</p> : null}
        {accessError ? <p className="paywall-code-error">{accessError}</p> : null}
        {access?.canAccess ? (
          <div className="paywall-mnem-row paywall-mnem-row--primary">
            <p>Přístup je aktivní.</p>
            <button className="btn" type="button" onClick={() => { onPurchased?.(); onClose(); }}>POKRAČOVAT</button>
          </div>
        ) : sessionStatus === 'loading' ? (
          <p>Ověřuji identitu…</p>
        ) : !loggedIn ? (
          <div className="paywall-auth-gate">
            <a className="btn" href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>PŘIHLÁSIT</a>
            <a className="btn btn-outline" href="/register">REGISTROVAT</a>
          </div>
        ) : (
          <>
            <div className={`paywall-mnem-row ${canAfford ? 'paywall-mnem-row--primary' : 'paywall-mnem-row--insufficient'}`}>
              <p>Dostupné: <strong>{balance} MNEM</strong>{cost ? ` / potřeba: ${cost}` : ''}</p>
              {access?.canPurchase && cost ? (
                <button className="btn paywall-package-btn--primary" type="button" disabled={busy || !canAfford} onClick={handleMnemPurchase}>
                  {busy ? 'TRANSAKCE…' : canAfford ? `ODEMKNOUT ZA ${cost} MNEM` : 'NEDOSTATEK MNEM'}
                </button>
              ) : null}
            </div>

            {packages.length ? (
              <div className="paywall-packages paywall-packages--structured">
                {packages.map((item) => (
                  <div key={item.id} className="paywall-package os-surface">
                    <div className="paywall-package-info">
                      <span className="paywall-package-name">{item.name}</span>
                      <span className="paywall-package-price">{item.priceCzk} Kč</span>
                    </div>
                    <p className="paywall-package-desc">{item.description}</p>
                    <button className="btn btn-outline" type="button" disabled={stripeBusy !== null} onClick={() => handleStripe(item.id)}>
                      {stripeBusy === item.id ? 'PŘESMĚROVÁNÍ…' : 'KOUPIT PŘES STRIPE'}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="paywall-code">
              <form className="paywall-code-form" onSubmit={handleRedeem}>
                <input className="auth-input" value={code} onChange={(event) => setCode(event.target.value)} placeholder="MNEM-…" aria-label="Přístupový kód" />
                <button className="btn" type="submit" disabled={codeBusy || !code.trim()}>{codeBusy ? 'OVĚŘUJI…' : 'POUŽÍT KÓD'}</button>
              </form>
            </div>
          </>
        )}
        {error ? <p className="paywall-code-error" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}
