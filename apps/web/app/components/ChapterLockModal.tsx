'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PACKAGES, CHAPTERS } from '../../src/content/booksManifest';
import { useLang } from '../../src/lib/LangContext';

interface Props {
  chapterId: string;
  chapterTitle: string;
  onClose: () => void;
}

const CANON_LABELS: Record<string, string> = {
  canon: 'KANONICKÉ',
  semi_canon: 'POLOKANONICKÉ',
  shadow_variant: 'MOŽNÁ LEŽ',
  system_corrupted: 'SYSTÉMOVĚ ZKRESLENO',
};

export default function ChapterLockModal({ chapterId, chapterTitle, onClose }: Props) {
  const { data: session, status: sessionStatus } = useSession();
  const { t } = useLang();
  const isLoggedIn = !!session?.user;
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [codeMsg, setCodeMsg] = useState('');

  const chapter = CHAPTERS.find((c) => c.id === chapterId);
  const mnemCost = chapter?.mnemCost ?? 64;

  const act1Pkg = PACKAGES.find((p) => p.id === 'act-1');
  const singlePkg = PACKAGES.find((p) => p.id === 'single-fragment');
  const archivPlusPkg = PACKAGES.find((p) => p.id === 'archiv-plus');

  const isAct1Chapter = act1Pkg?.chapterIds.includes(chapterId) ?? false;

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, chapterId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? t('paywall.network.terminal'));
        setPurchasing(null);
      }
    } catch {
      setError(t('paywall.network'));
      setPurchasing(null);
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
        setCodeMsg(t('paywall.code.ok'));
        setTimeout(() => {
          window.location.href = `/reader?chapter=${encodeURIComponent(chapterId)}`;
        }, 1200);
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
    <div
      className="paywall-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('paywall.aria')}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="paywall-modal">
        <button className="paywall-close" onClick={onClose} aria-label={t('paywall.close')}>✕</button>

        <div className="paywall-log">
          <p>
            <span className="paywall-log-prefix">LOG [ACCESS_DENIED]:</span>
            <span className="paywall-log-msg">&#8222;{t('paywall.log.denied')}&#8220;</span>
          </p>
          <p>
            <span className="paywall-log-prefix">LOG [MEMORY_TOLL]:</span>
            <span className="paywall-log-msg">&#8222;{t('paywall.log.toll')}&#8220;</span>
          </p>
        </div>

        <div className="paywall-chapter">
          <span className="paywall-chapter-label">{t('paywall.fragment.label')}</span>
          <span className="paywall-chapter-title">{chapterTitle}</span>
          {chapter?.estimatedMinutes && (
            <span className="paywall-chapter-meta">~ {chapter.estimatedMinutes} {t('paywall.fragment.meta')}</span>
          )}
          <span className="paywall-chapter-cost">{mnemCost} mnemů</span>
        </div>

        {chapter?.teaser && (
          <div className="paywall-teaser">
            <p className="paywall-teaser-text">{chapter.teaser}</p>
            {chapter.unlocks && (
              <div className="paywall-teaser-unlocks">
                <span className="paywall-teaser-unlocks-label">ODEMKNE:</span>
                <p className="paywall-teaser-unlocks-text">{chapter.unlocks}</p>
              </div>
            )}
          </div>
        )}

        {sessionStatus === 'loading' ? (
          <p className="paywall-loading-identity">{t('paywall.loading.identity')}</p>
        ) : !isLoggedIn ? (
          <>
            <div className="paywall-log">
              <p>
                <span className="paywall-log-prefix">LOG [AUTH_REQUIRED]:</span>
                <span className="paywall-log-msg">&#8222;{t('paywall.auth.log')}&#8220;</span>
              </p>
            </div>
            <div className="paywall-auth-gate">
              <a
                href={`/login?callbackUrl=${encodeURIComponent('/books')}`}
                className="btn paywall-gate-btn"
              >
                {t('paywall.auth.login')}
              </a>
              <a
                href={`/register?callbackUrl=${encodeURIComponent('/books')}`}
                className="btn btn-outline paywall-gate-btn"
              >
                {t('paywall.auth.register')}
              </a>
            </div>
            <p className="paywall-gate-hint">{t('paywall.auth.hint')}</p>
          </>
        ) : (
          <>
            <div className="paywall-packages paywall-packages--structured">

              {isAct1Chapter && act1Pkg && (
                <div className="paywall-package paywall-package--primary">
                  <div className="paywall-package-badge">{t('paywall.recommended')}</div>
                  <div className="paywall-package-info">
                    <span className="paywall-package-name">{act1Pkg.name}</span>
                    <span className="paywall-package-price">{act1Pkg.mnems} mnemů</span>
                  </div>
                  <p className="paywall-package-desc">{act1Pkg.description}</p>
                  <div className="paywall-package-pricing">
                    <span className="paywall-package-czk">{act1Pkg.priceCzk} Kč</span>
                    <span className="paywall-package-includes">{t('paywall.act1.includes')}</span>
                  </div>
                  <button
                    className="btn paywall-package-btn paywall-package-btn--primary"
                    onClick={() => handlePurchase(act1Pkg.id)}
                    disabled={purchasing !== null}
                  >
                    {purchasing === act1Pkg.id ? t('paywall.redirecting') : `${t('paywall.act1.btn.pre')}${act1Pkg.priceCzk} Kč`}
                  </button>
                </div>
              )}

              {singlePkg && (
                <div className="paywall-package paywall-package--secondary">
                  <div className="paywall-package-info">
                    <span className="paywall-package-name">{t('paywall.single.name')}</span>
                    <span className="paywall-package-price">{mnemCost} mnemů</span>
                  </div>
                  <div className="paywall-package-pricing">
                    <span className="paywall-package-czk">{singlePkg.priceCzk} Kč</span>
                    <span className="paywall-package-includes">{t('paywall.single.includes.pre')}{chapterTitle}</span>
                  </div>
                  <button
                    className="btn btn-outline paywall-package-btn"
                    onClick={() => handlePurchase(singlePkg.id)}
                    disabled={purchasing !== null}
                  >
                    {purchasing === singlePkg.id ? t('paywall.redirecting') : `${t('paywall.single.btn.pre')}${singlePkg.priceCzk} Kč`}
                  </button>
                </div>
              )}

              {archivPlusPkg && (
                <div className="paywall-package paywall-package--subscription">
                  <div className="paywall-package-badge paywall-package-badge--sub">ARCHIV+</div>
                  <div className="paywall-package-info">
                    <span className="paywall-package-name">{archivPlusPkg.name}</span>
                  </div>
                  <p className="paywall-package-desc">{archivPlusPkg.description}</p>
                  <div className="paywall-package-pricing">
                    <span className="paywall-package-czk">{archivPlusPkg.priceCzk}{t('paywall.archivplus.price.post')}</span>
                  </div>
                  <button
                    className="btn btn-outline paywall-package-btn"
                    onClick={() => handlePurchase(archivPlusPkg.id)}
                    disabled={purchasing !== null}
                  >
                    {purchasing === archivPlusPkg.id ? t('paywall.redirecting') : `${t('paywall.archivplus.btn.pre')}${archivPlusPkg.priceCzk} Kč`}
                  </button>
                </div>
              )}
            </div>

            <div className="paywall-back-row">
              <button className="btn btn-outline paywall-back-btn" onClick={onClose}>
                {t('paywall.back')}
              </button>
            </div>

            {error && <p className="paywall-code-error">{error}</p>}

            <div className="paywall-code">
              <form onSubmit={handleRedeem} className="paywall-code-form">
                <input
                  className="auth-input"
                  type="text"
                  placeholder="MNEM-XXXX-XXXX-XXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={codeStatus === 'loading' || codeStatus === 'ok'}
                  aria-label={t('paywall.code.aria')}
                />
                <button className="btn" type="submit" disabled={codeStatus === 'loading' || !code || codeStatus === 'ok'}>
                  {codeStatus === 'loading' ? t('paywall.code.verifying') : t('paywall.code.use')}
                </button>
              </form>
              {codeStatus === 'ok' && <p className="paywall-code-ok">{codeMsg}</p>}
              {codeStatus === 'error' && <p className="paywall-code-error">{codeMsg}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
