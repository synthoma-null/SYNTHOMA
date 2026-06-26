'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PACKAGES, CHAPTERS } from '../../src/content/booksManifest';

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
        setError(data.error ?? 'Chyba platebního terminálu.');
        setPurchasing(null);
      }
    } catch {
      setError('Chyba sítě. Zkus to znovu.');
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
        setCodeMsg('Přístup odemčen. Přechod na fragment...');
        setTimeout(() => {
          window.location.href = `/reader?chapter=${encodeURIComponent(chapterId)}`;
        }, 1200);
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
    <div
      className="paywall-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Uzamčený fragment"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="paywall-modal">
        <button className="paywall-close" onClick={onClose} aria-label="Zavřít">✕</button>

        <div className="paywall-log">
          <p>
            <span className="paywall-log-prefix">LOG [ACCESS_DENIED]:</span>
            <span className="paywall-log-msg">&#8222;Tento fragment neleží za zdí. Leží za cenou.&#8220;</span>
          </p>
          <p>
            <span className="paywall-log-prefix">LOG [MEMORY_TOLL]:</span>
            <span className="paywall-log-msg">&#8222;Příběh máš celý. Za dveřmi je ještě něco, co chceš vidět.&#8220;</span>
          </p>
        </div>

        <div className="paywall-chapter">
          <span className="paywall-chapter-label">ZAMČENÝ FRAGMENT</span>
          <span className="paywall-chapter-title">{chapterTitle}</span>
          {chapter?.estimatedMinutes && (
            <span className="paywall-chapter-meta">~ {chapter.estimatedMinutes} min čtení</span>
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
          <p className="paywall-loading-identity">OVĚŘUJI IDENTITU...</p>
        ) : !isLoggedIn ? (
          <>
            <div className="paywall-log">
              <p>
                <span className="paywall-log-prefix">LOG [AUTH_REQUIRED]:</span>
                <span className="paywall-log-msg">&#8222;Pro zakoupení mnemů je nutná ověřená identita. Mnemy se připíší na účet a jimi odemykáš fragmenty. SYNTHOMA si pamatuje každý tvůj běh.&#8220;</span>
              </p>
            </div>
            <div className="paywall-auth-gate">
              <a
                href={`/login?callbackUrl=${encodeURIComponent('/books')}`}
                className="btn paywall-gate-btn"
              >
                PŘIHLÁSIT SE
              </a>
              <a
                href={`/register?callbackUrl=${encodeURIComponent('/books')}`}
                className="btn btn-outline paywall-gate-btn"
              >
                REGISTROVAT IDENTITU
              </a>
            </div>
            <p className="paywall-gate-hint">Po přihlášení se vrátíš zpět do knihovny.</p>
          </>
        ) : (
          <>
            <div className="paywall-packages paywall-packages--structured">

              {isAct1Chapter && act1Pkg && (
                <div className="paywall-package paywall-package--primary">
                  <div className="paywall-package-badge">DOPORUČENO</div>
                  <div className="paywall-package-info">
                    <span className="paywall-package-name">{act1Pkg.name}</span>
                    <span className="paywall-package-price">{act1Pkg.mnems} mnemů</span>
                  </div>
                  <p className="paywall-package-desc">{act1Pkg.description}</p>
                  <div className="paywall-package-pricing">
                    <span className="paywall-package-czk">{act1Pkg.priceCzk} Kč</span>
                    <span className="paywall-package-includes">✓ Kapitoly 0-4 až 0-8</span>
                  </div>
                  <button
                    className="btn paywall-package-btn paywall-package-btn--primary"
                    onClick={() => handlePurchase(act1Pkg.id)}
                    disabled={purchasing !== null}
                  >
                    {purchasing === act1Pkg.id ? 'PŘESMĚROVÁVÁM...' : `ODEMKNOUT AKT I — ${act1Pkg.priceCzk} Kč`}
                  </button>
                </div>
              )}

              {singlePkg && (
                <div className="paywall-package paywall-package--secondary">
                  <div className="paywall-package-info">
                    <span className="paywall-package-name">ODEMKNOUT JEN TENTO FRAGMENT</span>
                    <span className="paywall-package-price">{mnemCost} mnemů</span>
                  </div>
                  <div className="paywall-package-pricing">
                    <span className="paywall-package-czk">{singlePkg.priceCzk} Kč</span>
                    <span className="paywall-package-includes">✓ Pouze {chapterTitle}</span>
                  </div>
                  <button
                    className="btn btn-outline paywall-package-btn"
                    onClick={() => handlePurchase(singlePkg.id)}
                    disabled={purchasing !== null}
                  >
                    {purchasing === singlePkg.id ? 'PŘESMĚROVÁVÁM...' : `ODEMKNOUT FRAGMENT — ${singlePkg.priceCzk} Kč`}
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
                    <span className="paywall-package-czk">{archivPlusPkg.priceCzk} Kč / měsíc</span>
                  </div>
                  <button
                    className="btn btn-outline paywall-package-btn"
                    onClick={() => handlePurchase(archivPlusPkg.id)}
                    disabled={purchasing !== null}
                  >
                    {purchasing === archivPlusPkg.id ? 'PŘESMĚROVÁVÁM...' : `VSTOUPIT DO ARCHIVU+ — ${archivPlusPkg.priceCzk} Kč/měs`}
                  </button>
                </div>
              )}
            </div>

            <div className="paywall-back-row">
              <button className="btn btn-outline paywall-back-btn" onClick={onClose}>
                ZPĚT DO KNIHOVNY
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
                  aria-label="Přístupový kód"
                />
                <button className="btn" type="submit" disabled={codeStatus === 'loading' || !code || codeStatus === 'ok'}>
                  {codeStatus === 'loading' ? 'OVĚŘUJI...' : 'POUŽÍT KÓD'}
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
