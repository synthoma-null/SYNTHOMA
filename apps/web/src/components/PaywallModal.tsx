'use client';

import { useState } from 'react';
import { PACKAGES } from '../content/booksManifest';

interface Props {
  chapterId: string;
  chapterTitle: string;
  mnemCost: number;
  onClose: () => void;
}

export default function PaywallModal({ chapterId, chapterTitle, mnemCost, onClose }: Props) {
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [codeMsg, setCodeMsg] = useState('');

  const handlePurchase = async (packageId: string) => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, chapterId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Chyba platebního terminálu.');
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeStatus('loading');
    try {
      const res = await fetch('/api/mnems/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        setCodeStatus('ok');
        setCodeMsg('Přístup odemčen. Obnovuji fragment...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setCodeStatus('error');
        setCodeMsg(data.error ?? 'Kód neplatný.');
      }
    } catch {
      setCodeStatus('error');
      setCodeMsg('Chyba sítě.');
    }
  };

  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true" aria-label="Přístup odepřen">
      <div className="paywall-modal">
        <button className="paywall-close" onClick={onClose} aria-label="Zavřít">✕</button>

        <div className="paywall-log">
          <p>
            <span className="paywall-log-prefix">LOG [ACCESS_DENIED]:</span>
            <span className="paywall-log-msg">&#8222;Nedostatek mnemů. Paměťový fragment zůstává uzamčen.&#8220;</span>
          </p>
          <p>
            <span className="paywall-log-prefix">LOG [MEMORY_TOLL]:</span>
            <span className="paywall-log-msg">&#8222;Tento fragment neleží za zdí. Leží za cenou.&#8220;</span>
          </p>
        </div>

        <div className="paywall-chapter">
          <span className="paywall-chapter-label">ZAMČENÝ FRAGMENT</span>
          <span className="paywall-chapter-title">{chapterTitle}</span>
          <span className="paywall-chapter-cost">{mnemCost} mnemů</span>
        </div>

        <div className="paywall-packages">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className="paywall-package">
              <div className="paywall-package-info">
                <span className="paywall-package-name">{pkg.name}</span>
                <span className="paywall-package-price">{pkg.priceCzk} Kč</span>
              </div>
              <p className="paywall-package-desc">{pkg.description}</p>
              <button
                className="btn paywall-package-btn"
                onClick={() => handlePurchase(pkg.id)}
              >
                {pkg.id === 'single-fragment'
                  ? 'ODEMKNOUT PAMĚŤOVÝ FRAGMENT'
                  : pkg.id === 'act-1'
                  ? 'ODEMKNOUT AKT I'
                  : 'ODEMKNOUT ARCHIV 1024'}
              </button>
            </div>
          ))}
        </div>

        <div className="paywall-code">
          <form onSubmit={handleRedeem} className="paywall-code-form">
            <input
              className="auth-input"
              type="text"
              placeholder="MNEM-XXXX-XXXX-XXXX"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={codeStatus === 'loading'}
              aria-label="Přístupový kód"
            />
            <button
              className="btn"
              type="submit"
              disabled={codeStatus === 'loading' || !code}
            >
              {codeStatus === 'loading' ? 'OVĚŘUJI...' : 'POUŽÍT KÓD'}
            </button>
          </form>
          {codeStatus === 'ok' && <p className="paywall-code-ok">{codeMsg}</p>}
          {codeStatus === 'error' && <p className="paywall-code-error">{codeMsg}</p>}
        </div>

        <div className="paywall-auth">
          <a href="/login" className="auth-link">PŘIHLÁSIT SE</a>
          {' · '}
          <a href="/register" className="auth-link">REGISTROVAT IDENTITU</a>
        </div>
      </div>
    </div>
  );
}
