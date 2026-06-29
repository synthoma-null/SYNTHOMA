'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { UI_THEMES } from '../../src/lib/themes';

type Theme = { id: string; label: string; cost: number; unlocked: boolean };

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
  const [themes, setThemes] = useState<Theme[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('synthoma');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState<string | null>(null);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId: theme.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Nákup se nezdařil.');
      }
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
  }, [buying, activate]);

  const handleClick = useCallback((theme: Theme) => {
    if (theme.unlocked || theme.cost === 0) {
      activate(theme);
    } else {
      buy(theme);
    }
  }, [activate, buy]);

  return (
    <fieldset id="theme-shop" className="group" role="radiogroup" aria-label="Barevný motiv">
      <legend className="panel-section-title">Motivy</legend>
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
                aria-pressed={isActive ? ('true' as const) : ('false' as const)}
                disabled={!!buying || cantAfford}
                onClick={() => handleClick(theme)}
                title={cantAfford ? `${theme.label} — potřebuješ ${theme.cost} mnemů` : locked ? `${theme.label} — koupit za ${theme.cost} mnemů` : theme.label}
              >
                <span className="theme-label">{theme.label}</span>
                {locked && <span className="theme-cost">{theme.cost} mn</span>}
                {!locked && theme.cost > 0 && <span className="theme-owned" aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
