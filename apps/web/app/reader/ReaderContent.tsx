"use client";

import React, { useEffect, useMemo, useState } from 'react';
import TypewriterReader from '../../src/components/TypewriterReader';
import styles from './ReaderContent.module.css';
import { useSearchParams } from 'next/navigation';

interface BackgroundSettings {
  image: string;
  color: string;
  opacity: number;
  blur: number;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <div className="animate-pulse text-2xl">Příprava obsahu...</div>
    </div>
  );
}

// Duplicated transform and reveal logic removed in favor of TypewriterReader

export default function ReaderContent() {
  const searchParams = useSearchParams();
  const defaultUrl = "/books/SYNTHOMA-NULL/0-∞ [RESTART].html";
  const effectiveUrl = searchParams?.get("u") || defaultUrl;

  // State management
  const [showHelp, setShowHelp] = useState(false);
  const [background, setBackground] = useState<BackgroundSettings>({
    image: '',
    color: '#000000',
    opacity: 0.9,
    blur: 0
  });

  // Handle background changes
  const handleBackgroundChange = (property: string, value: string | number) => {
    setBackground(prev => ({
      ...prev,
      [property]: value
    }));
  };

  // Derive bookId from effectiveUrl: /books/<bookId>/...
  const { bookId, chapterPath } = useMemo(() => {
    try {
      const u = effectiveUrl || '';
      const m = u.match(/^\/books\/([^\/]+)\/(.+)$/);
      if (m) {
        const captured = m[1] ?? '';
        return { bookId: decodeURIComponent(String(captured)), chapterPath: u };
      }
    } catch {}
    return { bookId: 'default', chapterPath: effectiveUrl };
  }, [effectiveUrl]);

  // Recommended track modal
  const [recModal, setRecModal] = useState<{ visible: boolean; track?: string; title?: string }>({ visible: false });

  useEffect(() => {
    let cancelled = false;
    async function maybeShowTrackPrompt(){
      try {
        // Load manifest and find this chapter's recommended track
        const res = await fetch('/books/manifest.json', { cache: 'no-store' });
        if (!res.ok) return;
        const manifest = await res.json();
        const col = (manifest?.collections || []).find((c: any) => c.slug === bookId);
        const ch = col?.chapters?.find((x: any) => x.path === chapterPath);
        const track = ch?.track as string | undefined;
        if (!track) return;
        // Respect user block: if blocked or audio not playing, show prompt
        const blocked = (typeof localStorage !== 'undefined') && localStorage.getItem('audioAutoplayBlocked') === 'true';
        const audio: HTMLAudioElement | undefined = (window as any).__synthomaAudio;
        const isPlaying = !!(audio && !audio.paused && !audio.ended && audio.currentTime > 0);
        if (cancelled) return;
        if (blocked || !isPlaying) {
          setRecModal({ visible: true, track, title: ch?.title });
        }
      } catch {}
    }
    maybeShowTrackPrompt();
    return () => { cancelled = true; };
  }, [bookId, chapterPath]);

  const containerStyle = useMemo(() => {
    const clampedOpacity = Math.max(0, Math.min(1, Number(background.opacity)));
    return {
      ['--bg-image' as any]: background.image ? `url(${background.image})` : 'none',
      ['--bg-color' as any]: background.color,
      ['--bg-opacity' as any]: String(clampedOpacity),
      ['--bg-blur' as any]: background.blur > 0 ? `blur(${background.blur}px)` : 'none',
    } as React.CSSProperties;
  }, [background]);

  // Persist reading progress continuously based on scroll (consolidated)
  useEffect(() => {
    if (!bookId) return;
    const key = `readingProgress:${bookId}`;
    let rafId: number | null = null;
    let lastSaved = -1;
    const save = (percent: number) => {
      const rounded = Math.max(0, Math.min(100, Math.round(percent)));
      if (rounded === lastSaved) return;
      lastSaved = rounded;
      const payload = { bookId, path: chapterPath, percent: rounded, updatedAt: Date.now() };
      try { localStorage.setItem(key, JSON.stringify(payload)); } catch {}
    };
    const compute = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(total, window.scrollY || window.pageYOffset || 0));
      const pct = (y / total) * 100;
      save(pct);
      rafId = null;
    };
    const onScroll = () => { if (rafId == null) rafId = requestAnimationFrame(compute); };
    // init and listeners
    try { compute(); } catch {}
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('beforeunload', compute);
    return () => {
      window.removeEventListener('scroll', onScroll as any);
      window.removeEventListener('beforeunload', compute as any);
      try { compute(); } catch {}
    };
  }, [bookId, chapterPath]);

  // Render content
  return (
    <div 
      className={`${styles.readerContainer}`}
      style={containerStyle}
      data-testid="reader-container"
    >
      {recModal.visible ? (
        <div role="dialog" aria-modal="true" aria-label="Doporučená skladba" className={styles.recModalOverlay}>
          <div className={`panel glass ${styles.recModalPanel}`}>
            <h3 className={styles.recModalTitle}>Doporučená skladba</h3>
            <p>
              Pro kapitolu {recModal.title ? <strong>{recModal.title}</strong> : 'této knihy'} je doporučena hudba. Chceš ji přehrát?
            </p>
            <div className={styles.recModalActions}>
              <button className="btn btn-lg" onClick={() => {
                try { localStorage.setItem('audioAutoplayBlocked', 'false'); } catch {}
                try { (window as any).audioPanelPlay?.(recModal.track); } catch {}
                setRecModal({ visible: false });
              }}>▶ Přehrát doporučenou</button>
              <button className="btn btn-lg" onClick={() => {
                try { localStorage.setItem('audioAutoplayBlocked', 'true'); } catch {}
                setRecModal({ visible: false });
              }}>Pokračovat potichu</button>
            </div>
          </div>
        </div>
      ) : null}
      <div className={styles.readerContent}>
        <TypewriterReader id="hero-info" srcUrl={effectiveUrl} className={`${styles.readerMain}`} ariaLabel="Čtečka" autoStart />
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className={styles.helpModalOverlay}>
          <div className={styles.helpModal}>
            <div className={styles.helpModalContent}>
              <div className={styles.helpModalHeader}>
                <h2 className={styles.helpModalTitle}>Nápověda</h2>
                <button 
                  onClick={() => setShowHelp(false)}
                  className={styles.helpModalCloseButton}
                  aria-label="Zavřít"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className={styles.helpModalSection}>
                <h3 className={styles.helpModalSectionTitle}>Klávesové zkratky</h3>
                <ul className={styles.helpModalList}>
                  <li className={styles.helpModalListItem}>
                    <kbd className={styles.helpModalKey}>?</kbd>
                    <span>Zobrazit/skrýt nápovědu</span>
                  </li>
                  <li className={styles.helpModalListItem}>
                    <kbd className={styles.helpModalKey}>Esc</kbd>
                    <span>Zavřít okno</span>
                  </li>
                </ul>
              </div>
              
              <div className={styles.helpModalSection}>
                <h3 className={styles.helpModalSectionTitle}>Ovládání</h3>
                <p>
                  Klikněte na jakoukoliv možnost pro pokračování příběhu. 
                  Všechny volby jsou zobrazeny najednou.
                </p>
              </div>
              
              <div className={styles.helpModalFooter}>
                <button 
                  onClick={() => setShowHelp(false)}
                  className={styles.helpModalButton}
                >
                  Zavřít nápovědu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
