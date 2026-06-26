'use client';

import { useState } from 'react';
import { PACKAGES } from '../../content/booksManifest';

interface Props {
  mnemBalance: number;
}

export default function MnemAccessPanel({ mnemBalance }: Props) {
  const [code, setCode] = useState('');
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [redeemMsg, setRedeemMsg] = useState('');

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemStatus('loading');
    try {
      const res = await fetch('/api/mnems/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        setRedeemStatus('ok');
        setRedeemMsg(`Fragment odemčen. Balíček: ${data.packageId}`);
        setCode('');
      } else {
        setRedeemStatus('error');
        setRedeemMsg(data.error ?? 'Chyba redeem.');
      }
    } catch {
      setRedeemStatus('error');
      setRedeemMsg('Chyba sítě.');
    }
  };

  const handlePurchase = async (packageId: string) => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Chyba platebního terminálu.');
    }
  };

  return (
    <section className="mnem-panel">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [MNEM_LEDGER]:</span>
        <span className="psyche-log-msg">&#8222;Paměťový účet subjektu byl načten.&#8220;</span>
      </div>

      <div className="mnem-balance">
        <span className="mnem-balance-label">ARCHIVNÍ STOPA</span>
        <span className="mnem-balance-value">{mnemBalance} mnemů</span>
      </div>

      <div className="mnem-packages">
        <h2 className="mnem-section-title">PAMĚŤOVÝ TERMINÁL</h2>
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="mnem-package">
            <div className="mnem-package-header">
              <span className="mnem-package-name">{pkg.name}</span>
              <span className="mnem-package-mnems">{pkg.mnems} mnemů</span>
            </div>
            <p className="mnem-package-desc">{pkg.description}</p>
            <div className="mnem-package-price">
              {pkg.priceCzk} Kč / {pkg.priceUsd} USD
            </div>
            <button
              className="mnem-package-btn btn"
              onClick={() => handlePurchase(pkg.id)}
            >
              ODEMKNOUT PAMĚŤOVÝ FRAGMENT
            </button>
          </div>
        ))}
      </div>

      <div className="mnem-redeem">
        <h2 className="mnem-section-title">REDEEMOVAT PŘÍSTUPOVÝ KÓD</h2>
        <form onSubmit={handleRedeem} className="mnem-redeem-form">
          <input
            className="auth-input"
            type="text"
            placeholder="MNEM-XXXX-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={redeemStatus === 'loading'}
          />
          <button
            className="btn mnem-redeem-btn"
            type="submit"
            disabled={redeemStatus === 'loading' || !code}
          >
            {redeemStatus === 'loading' ? 'OVĚŘUJI...' : 'REDEEMOVAT'}
          </button>
        </form>
        {redeemStatus === 'ok' && <p className="mnem-redeem-ok">{redeemMsg}</p>}
        {redeemStatus === 'error' && <p className="mnem-redeem-error">{redeemMsg}</p>}
      </div>
    </section>
  );
}
