'use client';

import { useEffect, useState } from 'react';
import { getConsent, saveConsent, type ConsentState } from '../../lib/consent';

type Prefs = {
  preferences: boolean;
  analytics: boolean;
  readerTrace: boolean;
};

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [detail, setDetail] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ preferences: true, analytics: false, readerTrace: false });

  useEffect(() => {
    if (!getConsent()) {
      setShow(true);
    }
  }, []);

  const accept = (state: Prefs) => {
    saveConsent(state);
    setShow(false);
    setDetail(false);
  };

  if (!show) return null;

  return (
    <div className="cc-overlay" role="dialog" aria-modal="true" aria-label="Paměťové stopy – souhlas">
      <div className="cc-panel">
        <div className="cc-log">
          <span className="cc-log-prefix">LOG [CONSENT_REQUEST]:</span>
          <span className="cc-log-msg">
            &#8222;SYNTHOMA žádá o povolení uložit paměťové stopy.&#8220;
          </span>
        </div>

        {!detail ? (
          <>
            <p className="cc-body">
              <strong>Nezbytné stopy</strong> drží přihlášení, bezpečnost a základní funkce čtečky.{' '}
              <strong>Volitelné stopy</strong> pomáhají ukládat nastavení, postup čtení a anonymní statistiky.
            </p>
            <p className="cc-body cc-flavor">
              Systém tvrdí, že je to pro tvé dobro.<br />
              Systém to tvrdí často.
            </p>
            <div className="cc-actions">
              <button
                className="cc-btn cc-btn-primary"
                onClick={() => accept({ preferences: true, analytics: true, readerTrace: true })}
              >
                POVOLIT VŠECHNO
              </button>
              <button
                className="cc-btn cc-btn-secondary"
                onClick={() => accept({ preferences: false, analytics: false, readerTrace: false })}
              >
                POUZE NEZBYTNÉ
              </button>
              <button
                className="cc-btn cc-btn-ghost"
                onClick={() => setDetail(true)}
              >
                NASTAVIT STOPY
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cc-categories">
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">NEZBYTNÉ STOPY</span>
                  <span className="cc-cat-badge cc-always">VŽDY AKTIVNÍ</span>
                </div>
                <p className="cc-cat-desc">Přihlášení, bezpečnost, základní běh systému. Nelze vypnout.</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">KONFIGURAČNÍ STOPY</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.preferences}
                      onChange={e => setPrefs(p => ({ ...p, preferences: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">Rychlost psaní, animace, audio, vzhled a výkon vrstvy.</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">ANALYTICKÉ STOPY</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.analytics}
                      onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">Pomáhají poznat, kde se SYNTHOMA rozpadá, seká nebo bolí správným způsobem.</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">ČTENÁŘSKÝ OTISK</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.readerTrace}
                      onChange={e => setPrefs(p => ({ ...p, readerTrace: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">Volby, postup čtení, psychomapa. Pouze lokálně, pokud nemáš účet.</p>
              </div>
            </div>
            <div className="cc-actions">
              <button className="cc-btn cc-btn-primary" onClick={() => accept(prefs)}>
                ULOŽIT NASTAVENÍ
              </button>
              <button
                className="cc-btn cc-btn-ghost"
                onClick={() => setDetail(false)}
              >
                ← ZPĚT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
