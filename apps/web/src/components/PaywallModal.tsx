'use client';

import { useState } from 'react';
import { PACKAGES } from '../content/booksManifest';
import { useLang } from '../lib/LangContext';

interface Props {
  chapterId: string;
  chapterTitle: string;
  mnemCost: number;
  onClose: () => void;
}

export default function PaywallModal({ chapterId, chapterTitle, mnemCost, onClose }: Props) {
  const { t } = useLang();
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
      alert(t('paywall.network.terminal'));
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
        setCodeMsg(t('paywall.code.ok2'));
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setCodeStatus('error');
        setCodeMsg(data.error ?? t('paywall.code.invalid'));
      }
    } catch {
      setCodeStatus('error');
      setCodeMsg(t('paywall.network'));
    }
  };

  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true" aria-label={t('paywall.aria')}>
      <div className="paywall-modal os-surface">
        <button className="paywall-close" onClick={onClose} aria-label={t('paywall.close')}>✕</button>

        <div className="paywall-log">
          <p>
            <span className="paywall-log-prefix">LOG [ACCESS_DENIED]:</span>
            <span className="paywall-log-msg">&#8222;{t('paywall.log.denied2')}&#8220;</span>
          </p>
          <p>
            <span className="paywall-log-prefix">LOG [MEMORY_TOLL]:</span>
            <span className="paywall-log-msg">&#8222;{t('paywall.log.denied')}&#8220;</span>
          </p>
        </div>

        <div className="paywall-chapter">
          <span className="paywall-chapter-label">{t('paywall.fragment.label')}</span>
          <span className="paywall-chapter-title">{chapterTitle}</span>
          <span className="paywall-chapter-cost">{mnemCost} mnems</span>
        </div>

        <div className="paywall-packages">
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} className="paywall-package os-surface">
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
                  ? t('paywall.unlock.fragment')
                  : pkg.id === 'act-1'
                  ? t('paywall.unlock.act1')
                  : t('paywall.unlock.archive')}
              </button>
            </div>
          ))}
        </div>

        <div className="paywall-code">
          <form onSubmit={handleRedeem} className="paywall-code-form">
            <input
              className="auth-input"
              type="text"
              placeholder={t('paywall.code.placeholder')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={codeStatus === 'loading'}
              aria-label={t('paywall.code.aria')}
            />
            <button
              className="btn"
              type="submit"
              disabled={codeStatus === 'loading' || !code}
            >
              {codeStatus === 'loading' ? t('paywall.code.verifying') : t('paywall.code.use')}
            </button>
          </form>
          {codeStatus === 'ok' && <p className="paywall-code-ok">{codeMsg}</p>}
          {codeStatus === 'error' && <p className="paywall-code-error">{codeMsg}</p>}
        </div>

        <div className="paywall-auth">
          <a href="/login" className="auth-link">{t('paywall.auth.login')}</a>
          {' · '}
          <a href="/register" className="auth-link">{t('paywall.auth.register')}</a>
        </div>
      </div>
    </div>
  );
}
