"use client";

import React, { useEffect, useMemo, useState, useRef } from 'react';
import TypewriterReader from '../../src/components/TypewriterReader';
import styles from './ReaderContent.module.css';
import { readBooleanStorage, writeStorage } from '../../src/lib/browser';
import { attachGlitchHeading } from '../../src/lib/glitchHeading';
import { saveLastChapterPath, saveReadingProgress } from '../../src/lib/readerState';
import { useRouter, useSearchParams } from 'next/navigation';

// Duplicated transform and reveal logic removed in favor of TypewriterReader

export default function ReaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultUrl = "/books/SYNTHOMA-NULL/0-∞ [RESTART].html";
  const effectiveUrl = searchParams?.get("u") || defaultUrl;

  const [showHelp, setShowHelp] = useState(false);
  const [prevChapter, setPrevChapter] = useState<{ title: string; path: string } | null>(null);
  const [nextChapter, setNextChapter] = useState<{ title: string; path: string } | null>(null);
  const [instantMode, setInstantMode] = useState(() => readBooleanStorage('instantReadMode', false));
  const [scrollPercent, setScrollPercent] = useState(0);

  // Keyboard shortcuts: Shift+/ ("?") toggles help, Esc closes, Arrow keys nav
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      try {
        // Toggle help on Shift+/
        if ((e.key === '?' || (e.key === '/' && e.shiftKey)) && !e.altKey && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setShowHelp(prev => !prev);
          return;
        }
        // Close on Escape
        if (e.key === 'Escape') {
          setShowHelp(false);
          return;
        }
      } catch {}
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prevChapter, nextChapter, router]);

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

  useEffect(() => {
    try {
      saveLastChapterPath(effectiveUrl);
    } catch {}
  }, [effectiveUrl]);

  // Recommended track modal + persistent mini badge
  const [recModal, setRecModal] = useState<{ visible: boolean; track?: string; title?: string }>({ visible: false });
  const [recTrack, setRecTrack] = useState<{ track: string; trackName: string } | null>(null);

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
        // Store track info for persistent mini badge
        const trackName = track.split('/').pop()?.replace(/\.[^.]+$/, '') || 'Track';
        if (!cancelled) setRecTrack({ track, trackName });
        // Respect user block: if blocked or audio not playing, show prompt
        const blocked = readBooleanStorage('audioAutoplayBlocked', false);
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

  // Glitch heading setup
  const TITLE = "Č T E Č K A";
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const root = glitchRootRef.current as HTMLElement | null;
    if (!root) return;
    const detach = attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 });
    return () => { try { detach && detach(); } catch {} };
  }, []);

  // Fetch chapter neighbors (prev/next) from manifest
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/books/manifest.json', { cache: 'no-store' });
        if (!res.ok) return;
        const manifest = await res.json();
        const col = (manifest?.collections || []).find((c: any) => (c.slug || '').toLowerCase() === (bookId || '').toLowerCase());
        if (!col?.chapters?.length) return;
        const idx = col.chapters.findIndex((ch: any) => ch.path === chapterPath);
        if (idx < 0) return;
        if (cancelled) return;
        setPrevChapter(idx > 0 ? { title: col.chapters[idx - 1].title, path: col.chapters[idx - 1].path } : null);
        setNextChapter(idx < col.chapters.length - 1 ? { title: col.chapters[idx + 1].title, path: col.chapters[idx + 1].path } : null);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [bookId, chapterPath]);

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
      saveReadingProgress({ bookId, path: chapterPath, percent: rounded, updatedAt: Date.now() });
    };
    const compute = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(total, window.scrollY || window.pageYOffset || 0));
      const pct = (y / total) * 100;
      save(pct);
      setScrollPercent(Math.round(pct));
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
    <>
      {/* Reading progress indicator (fixed at top) */}
      <div className={styles.readingProgress} aria-hidden="true">
        <div className={styles.readingProgressBar} style={{ width: `${scrollPercent}%` }} />
      </div>

      {recModal.visible ? (
        <div role="dialog" aria-modal="true" aria-label="Doporučená skladba" className={styles.recModalOverlay}>
          <div className={`panel glass ${styles.recModalPanel}`}>
            <h3 className={styles.recModalTitle}>Doporučená skladba</h3>
            <p>
              Pro kapitolu {recModal.title ? <strong>{recModal.title}</strong> : 'této knihy'} je doporučena hudba. Chceš ji přehrát?
            </p>
            <div className={styles.recModalActions}>
              <button className="btn btn-lg" onClick={() => {
                writeStorage('audioAutoplayBlocked', 'false');
                try { (window as any).audioPanelPlay?.(recModal.track); } catch {}
                setRecModal({ visible: false });
              }}>▶ Přehrát doporučenou</button>
              <button className="btn btn-lg" onClick={() => {
                writeStorage('audioAutoplayBlocked', 'true');
                setRecModal({ visible: false });
              }}>Pokračovat potichu</button>
            </div>
          </div>
        </div>
      ) : null}

      <main className="story" aria-label="Čtečka">
        <section className="story-block">
          <h1 id="glitch-reader" className="glitch-master title" ref={glitchRootRef as any} aria-label={TITLE}>
            <span className="glitch-fake1">{TITLE}</span>
            <span className="glitch-fake2">{TITLE}</span>
            <span className="glitch-real" aria-hidden="true">
              {TITLE.split("").map((ch, idx) => (
                <span key={idx} className="glitch-char">{ch}</span>
              ))}
            </span>
            <span className="sr-only">{TITLE}</span>
          </h1>
        </section>

        <section>
          <div className={styles.readerToolbar}>
            {recTrack ? (
              <button
                className={`btn btn-sm ${styles.audioBadge}`}
                onClick={() => {
                  try { (window as any).audioPanelPlay?.(recTrack.track); } catch {}
                }}
                title={`Přehrát doporučenou: ${recTrack.trackName}`}
                aria-label={`Přehrát doporučenou skladbu: ${recTrack.trackName}`}
              >
                🎵 {recTrack.trackName}
              </button>
            ) : null}
            <button
              className={`btn btn-sm ${styles.instantToggle} ${instantMode ? styles.instantToggleActive : ''}`}
              onClick={() => {
                const next = !instantMode;
                setInstantMode(next);
                try { writeStorage('instantReadMode', String(next)); } catch {}
              }}
              aria-pressed={instantMode}
              title={instantMode ? 'Rychlé čtení: Zapnuto' : 'Rychlé čtení: Vypnuto'}
            >
              {instantMode ? '⚡ Instant' : '✍️ Typewriter'}
            </button>
          </div>
          <TypewriterReader
            id="hero-info"
            srcUrl={effectiveUrl}
            className={`readerOverlay-35 readerOverlay-blur ${styles.readerMain}`}
            ariaLabel="Čtečka"
            autoStart
            instantMode={instantMode}
          />
        </section>

      </main>

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
                <p>
                  Tlačítko <strong>⚡ Instant</strong> přepne režim rychlého čtení — text se zobrazí okamžitě bez typewriter efektu. Preference se ukládá.
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
    </>
  );
}
