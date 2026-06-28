'use client';

import { useState } from 'react';
import { PACKAGES } from '../../content/booksManifest';
import { useLang } from '../../lib/LangContext';

interface Props {
  mnemBalance: number;
}

export default function MnemAccessPanel({ mnemBalance }: Props) {
  const { t, lang } = useLang();
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
        setRedeemMsg(`${t('mnems.redeemed')} ${data.packageId}`);
        setCode('');
      } else {
        setRedeemStatus('error');
        setRedeemMsg(data.error ?? t('mnems.error'));
      }
    } catch {
      setRedeemStatus('error');
      setRedeemMsg(t('paywall.network'));
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
      alert(t('paywall.network.terminal'));
    }
  };

  return (
    <section className="mnem-panel">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [MNEM_LEDGER]:</span>
        <span className="psyche-log-msg">&#8222;{t('mnems.log')}&#8220;</span>
      </div>

      <div className="mnem-balance">
        <span className="mnem-balance-label">{t('mnems.balance.label')}</span>
        <span className="mnem-balance-value">{mnemBalance} mnems</span>
      </div>

      <div className="mnem-packages">
        <h2 className="mnem-section-title">{t('mnems.terminal.title')}</h2>
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="mnem-package">
            <div className="mnem-package-header">
              <span className="mnem-package-name">{lang === 'en' && pkg.name_en ? pkg.name_en : pkg.name}</span>
              <span className="mnem-package-mnems">{pkg.mnems} {t('paywall.unit.mnems')}</span>
            </div>
            <p className="mnem-package-desc">{lang === 'en' && pkg.description_en ? pkg.description_en : pkg.description}</p>
            <div className="mnem-package-price">
              {pkg.priceCzk} {t('paywall.unit.czk')} / {pkg.priceUsd} USD
            </div>
            <button
              className="mnem-package-btn btn"
              onClick={() => handlePurchase(pkg.id)}
            >
              {t('mnems.unlock')}
            </button>
          </div>
        ))}
      </div>

      <div className="mnem-redeem">
        <h2 className="mnem-section-title">{t('mnems.redeem.title')}</h2>
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
            {redeemStatus === 'loading' ? t('paywall.code.verifying') : t('mnems.redeem.btn')}
          </button>
        </form>
        {redeemStatus === 'ok' && <p className="mnem-redeem-ok">{redeemMsg}</p>}
        {redeemStatus === 'error' && <p className="mnem-redeem-error">{redeemMsg}</p>}
      </div>
    </section>
  );
}
