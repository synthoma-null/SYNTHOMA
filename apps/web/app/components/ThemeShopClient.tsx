'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { UI_THEMES } from '../../src/lib/themes';
import { useAccess, type ClientAccessSnapshot } from '../../src/components/access/AccessProvider';

type Theme = { id: string; label: string; cost: number; description: string; palette: readonly [string, string, string]; unlocked: boolean };

const STORAGE_KEY = 'theme';

function readTheme(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'synthoma';
  } catch {
    return 'synthoma';
  }
}

function writeTheme(theme: string) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

function applyTheme(theme: string) {
  try {
    document.body.setAttribute('data-theme', theme);
  } catch {}
  try {
    document.documentElement.setAttribute('data-theme', theme);
  } catch {}
  try {
    if (typeof (window as any).startVideoRotation === 'function') {
      (window as any).startVideoRotation();
    }
  } catch {}
  try {
    document.querySelectorAll<HTMLVideoElement>('.video-background video, .bg-video, .bg-video video').forEach((v) => {
      try { v.play().catch(() => {}); } catch {}
    });
  } catch {}
}

export default function ThemeShopClient() {
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
        if (!res.ok) throw new Error('Nepodařilo se načíst motivy.');
        const data = await res.json();
        setThemes(data.themes || []);
        setBalance(typeof data.balance === 'number' ? data.balance : null);
      })
      .catch(() => {
        setThemes(UI_THEMES.map((t) => ({ ...t, unlocked: t.cost === 0 })));
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
        throw new Error(data.error || 'Nákup se nezdařil.');
      }
      if (data.snapshot) applySnapshot(data.snapshot as ClientAccessSnapshot, true);
      setThemes((prev) =>
        prev.map((t) => (t.id === theme.id ? { ...t, unlocked: true } : t))
      );
      setBalance((prev) => (prev !== null ? prev - theme.cost : null));
      activate(theme);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba');
    } finally {
      setBuying(null);
    }
  }, [buying, activate, applySnapshot]);

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
    if (theme.unlocked || theme.cost === 0) {
      activate(theme);
    } else {
      startPreview(theme);
      setConfirmTheme(theme);
      setError(null);
    }
  }, [activate, startPreview]);

  return (
    <fieldset id="theme-shop" className="group" aria-label="Barevný motiv">
      <legend className="panel-section-title">MOTIV</legend>
      {balance !== null && (
        <p className="theme-balance">Dostupné mnemy: <strong>{balance}</strong></p>
      )}
      {error && <p className="theme-error" role="alert">{error}</p>}
      {loading ? (
        <p className="theme-hint">Načítání…</p>
      ) : (
        <div className="theme-grid">
          {themes.map((theme) => {
            const isActive = currentTheme === theme.id;
            const locked = !theme.unlocked && theme.cost > 0;
            const cantAfford = locked && balance !== null && balance < theme.cost;
            return (
              <button
                key={theme.id}
                className={`theme-button ${isActive ? 'active' : ''} ${locked ? 'locked' : ''} ${cantAfford ? 'cant-afford' : ''}`}
                data-theme={theme.id}
                aria-pressed={isActive ? 'true' : 'false'}
                disabled={!!buying || cantAfford}
                onClick={() => handleClick(theme)}
                title={cantAfford ? `${theme.label} — potřebuješ ${theme.cost} mnemů` : locked ? `${theme.label} — koupit za ${theme.cost} mnemů` : theme.label}
              >
                <span className="theme-palette" aria-hidden="true">
                  {theme.palette.map((color, index) => <span key={color} className={`theme-palette__swatch theme-palette__swatch--${index + 1}`} />)}
                </span>
                <span className="theme-copy">
                  <span className="theme-label">{theme.label}</span>
                  <span className="theme-description">{theme.description}</span>
                </span>
                <span className="theme-state">
                  {isActive && <span className="theme-active">AKTIVNÍ</span>}
                  {!isActive && locked && <span className="theme-cost">{theme.cost} mn</span>}
                  {!isActive && !locked && theme.cost > 0 && <span className="theme-owned">ODEMČENO</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {confirmTheme && (
        <div className="theme-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="theme-dialog-title">
          <div className="theme-dialog os-surface">
            <p className="theme-dialog-log">LOG [THEME_PURCHASE]:</p>
            <h2 id="theme-dialog-title" className="theme-dialog-title">POTVRDIT NÁKUP</h2>
            <p className="theme-dialog-body">
              Chceš odemknout motiv <strong>{confirmTheme.label}</strong> za <strong>{confirmTheme.cost} mnemů</strong>?
            </p>
            {balance !== null && (
              <p className="theme-dialog-balance">Aktuální zůstatek: <strong>{balance}</strong> mnemů</p>
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
                Zrušit
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
                {buying === confirmTheme.id ? 'ZPRACOVÁNÍ…' : 'Koupit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}
