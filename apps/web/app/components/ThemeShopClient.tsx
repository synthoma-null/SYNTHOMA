'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { UI_THEMES, isThemeUnlocked } from '../../src/lib/themes';
import type { UiTheme } from '../../src/lib/themes';
import { useLang } from '../../src/lib/LangContext';
import { readUiPreferences, updateUiPreferences } from '../../src/lib/uiPreferences';
import { useAccess, type ClientAccessSnapshot } from '../../src/components/access/AccessProvider';

type Theme = UiTheme & { unlocked: boolean };

const COPY = {
  cs: { aria: 'Barevný motiv', legend: 'MOTIV', balance: 'Dostupné mnemy', load: 'Načítání…', active: 'AKTIVNÍ', owned: 'ODEMČENO', need: 'potřebuješ', buyFor: 'koupit za', purchaseError: 'Nákup se nezdařil.', error: 'Chyba', confirmLog: 'LOG [THEME_PURCHASE]:', confirmTitle: 'POTVRDIT NÁKUP', confirmLead: 'Chceš odemknout motiv', for: 'za', mnems: 'mnemů', currentBalance: 'Aktuální zůstatek', cancel: 'Zrušit', processing: 'ZPRACOVÁNÍ…', buy: 'Koupit' },
  en: { aria: 'Color theme', legend: 'THEME', balance: 'Available mnems', load: 'Loading…', active: 'ACTIVE', owned: 'UNLOCKED', need: 'requires', buyFor: 'buy for', purchaseError: 'Purchase failed.', error: 'Error', confirmLog: 'LOG [THEME_PURCHASE]:', confirmTitle: 'CONFIRM PURCHASE', confirmLead: 'Unlock theme', for: 'for', mnems: 'mnems', currentBalance: 'Current balance', cancel: 'Cancel', processing: 'PROCESSING…', buy: 'Buy' },
} as const;

function readTheme(): string {
  return readUiPreferences().theme;
}

function writeTheme(theme: string) {
  updateUiPreferences({ theme });
}

function applyTheme(theme: string) {
  try {
    document.body.setAttribute('data-theme', theme);
  } catch {}
  try {
    document.documentElement.setAttribute('data-theme', theme);
  } catch {}
}

export default function ThemeShopClient() {
  const { lang } = useLang();
  const copy = COPY[lang];
  const { applySnapshot } = useAccess();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('synthoma');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [confirmTheme, setConfirmTheme] = useState<Theme | null>(null);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewOriginalRef = useRef<string>(currentTheme);

  useEffect(() => {
    const saved = readTheme();
    applyTheme(saved);
    setCurrentTheme(saved);

    fetch('/api/me/themes')
      .then(async (res) => {
        if (!res.ok) throw new Error('THEME_LOAD_FAILED');
        const data = await res.json();
        setThemes(data.themes || []);
        setBalance(typeof data.balance === 'number' ? data.balance : null);
      })
      .catch(() => {
        setThemes(UI_THEMES.map((t) => ({ ...t, unlocked: isThemeUnlocked(t) })));
        setBalance(null);
      })
      .finally(() => setLoading(false));

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  const activate = useCallback((theme: Theme) => {
    applyTheme(theme.id);
    writeTheme(theme.id);
    setCurrentTheme(theme.id);
  }, []);

  const buy = useCallback(async (theme: Theme) => {
    if (buying) return;
    setBuying(theme.id);
    setError(null);
    try {
      const res = await fetch('/api/me/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `theme:${theme.id}:${crypto.randomUUID()}`,
        },
        body: JSON.stringify({ themeId: theme.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(copy.purchaseError);
      }
      if (data.snapshot) applySnapshot(data.snapshot as ClientAccessSnapshot, true);
      setThemes((prev) =>
        prev.map((t) => (t.id === theme.id ? { ...t, unlocked: true } : t))
      );
      setBalance((prev) => (prev !== null ? prev - theme.cost : null));
      activate(theme);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.error);
    } finally {
      setBuying(null);
    }
  }, [buying, activate, applySnapshot, copy.error, copy.purchaseError]);

  const startPreview = useCallback((theme: Theme) => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    previewOriginalRef.current = currentTheme;
    applyTheme(theme.id);
    setCurrentTheme(theme.id);
    previewTimeoutRef.current = setTimeout(() => {
      applyTheme(previewOriginalRef.current);
      setCurrentTheme(previewOriginalRef.current);
    }, 15000);
  }, [currentTheme]);

  const cancelPreview = useCallback(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    applyTheme(previewOriginalRef.current);
    setCurrentTheme(previewOriginalRef.current);
  }, []);

  const handleClick = useCallback((theme: Theme) => {
    if (theme.unlocked || !theme.premium) {
      activate(theme);
    } else {
      startPreview(theme);
      setConfirmTheme(theme);
      setError(null);
    }
  }, [activate, startPreview]);

  return (
    <fieldset id="theme-shop" className="group" aria-label={copy.aria}>
      <legend className="panel-section-title">{copy.legend}</legend>
      {balance !== null && (
        <p className="theme-balance">{copy.balance}: <strong>{balance}</strong></p>
      )}
      {error && <p className="theme-error" role="alert">{error}</p>}
      {loading ? (
        <p className="theme-hint">{copy.load}</p>
      ) : (
        <div className="theme-grid">
          {themes.map((theme) => {
            const isActive = currentTheme === theme.id;
            const locked = theme.premium && !theme.unlocked;
            const cantAfford = locked && balance !== null && balance < theme.cost;
            const label = theme.name[lang];
            const description = theme.description[lang];
            return (
              <button
                key={theme.id}
                className={`theme-button ${isActive ? 'active' : ''} ${locked ? 'locked' : ''} ${cantAfford ? 'cant-afford' : ''}`}
                data-theme={theme.id}
                aria-pressed={isActive ? 'true' : 'false'}
                disabled={!!buying || cantAfford}
                onClick={() => handleClick(theme)}
                title={cantAfford ? `${label} — ${copy.need} ${theme.cost} ${copy.mnems}` : locked ? `${label} — ${copy.buyFor} ${theme.cost} ${copy.mnems}` : label}
              >
                <span className="theme-palette" aria-hidden="true">
                  {theme.palette.map((color, index) => <span key={color} className={`theme-palette__swatch theme-palette__swatch--${index + 1}`} />)}
                </span>
                <span className="theme-copy">
                  <span className="theme-label">{label}</span>
                  <span className="theme-description">{description}</span>
                </span>
                <span className="theme-state">
                  {isActive && <span className="theme-active">{copy.active}</span>}
                  {!isActive && locked && <span className="theme-cost">{theme.cost} mn</span>}
                  {!isActive && theme.premium && !locked && <span className="theme-owned">{copy.owned}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {confirmTheme && (
        <div className="theme-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="theme-dialog-title">
          <div className="theme-dialog os-surface">
            <p className="theme-dialog-log">{copy.confirmLog}</p>
            <h2 id="theme-dialog-title" className="theme-dialog-title">{copy.confirmTitle}</h2>
            <p className="theme-dialog-body">
              {copy.confirmLead} <strong>{confirmTheme.name[lang]}</strong> {copy.for} <strong>{confirmTheme.cost} {copy.mnems}</strong>?
            </p>
            {balance !== null && (
              <p className="theme-dialog-balance">{copy.currentBalance}: <strong>{balance}</strong> {copy.mnems}</p>
            )}
            <div className="theme-dialog-actions">
              <button
                className="btn theme-dialog-btn theme-dialog-btn--cancel"
                onClick={() => {
                  cancelPreview();
                  setConfirmTheme(null);
                }}
                disabled={!!buying}
              >
                {copy.cancel}
              </button>
              <button
                className="btn theme-dialog-btn theme-dialog-btn--confirm"
                onClick={() => {
                  if (previewTimeoutRef.current) {
                    clearTimeout(previewTimeoutRef.current);
                    previewTimeoutRef.current = null;
                  }
                  buy(confirmTheme);
                  setConfirmTheme(null);
                }}
                disabled={!!buying}
              >
                {buying === confirmTheme.id ? copy.processing : copy.buy}
              </button>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}
