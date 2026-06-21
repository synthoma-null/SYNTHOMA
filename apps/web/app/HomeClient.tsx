"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./menu.module.css";
import { attachGlitchHeading } from "../src/lib/glitchHeading";
import { readLastChapterPath, readReadingProgress } from "../src/lib/readerState";

const TITLE = "SYNTHOMA";
const SUBTITLE = "Interaktivní čtečka o paměti, identitě a systému, který se naučil bolet.";

export default function HomeClient() {
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);
  const [showBgVideo, setShowBgVideo] = useState(true);
  const [lastChapter, setLastChapter] = useState<string | null>(null);
  const [lastChapterTitle, setLastChapterTitle] = useState<string | null>(null);
  const [lastChapterPercent, setLastChapterPercent] = useState<number | null>(null);

  // Aktivuj glitch efekt 1:1 jako na landing-intro
  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const root = glitchRootRef.current as HTMLElement | null;
    if (!root) return;
    const detach = attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 });
    return () => { try { detach && detach(); } catch {} };
  }, []);

  // iOS Safari: disable background video (prevents native Play overlay)
  useEffect(() => {
    try {
      const ua = navigator.userAgent || "";
      const isiOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
      if (isiOS) setShowBgVideo(false);
    } catch {}
  }, []);

  // Detect reading progress for "Continue reading" badge
  useEffect(() => {
    try {
      const last = readLastChapterPath();
      if (last) {
        setLastChapter(last);
        // Try to get title and progress from manifest
        fetch('/books/manifest.json', { cache: 'no-store' })
          .then(r => r.ok ? r.json() : null)
          .then(manifest => {
            if (!manifest) return;
            for (const col of manifest.collections || []) {
              const ch = (col.chapters || []).find((c: any) => c.path === last);
              if (ch) {
                setLastChapterTitle(ch.title);
                // Read progress for this book
                try {
                  const progress = readReadingProgress(col.slug || col.title || '');
                  if (progress && progress.percent > 0) {
                    setLastChapterPercent(Math.round(progress.percent));
                  }
                } catch {}
                break;
              }
            }
          }).catch(() => {});
      }
    } catch {}
  }, []);

  return (
    <div className={"glitch-bg home-page"}>
      {/* Background video layer (disabled on iOS) */}
      {showBgVideo ? (
        <div aria-hidden className="video-background">
          <video
            src="/video/SYNTHOMA32.webm"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="metadata"
            className="active"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      ) : null}
      <main className={styles.home} role="main" aria-label="Hlavní menu">
        {/* Nadpis musí být mimo panel sekci, 1:1 jako na landing-intro */}
        <h1 id="glitch-synthoma" className={`glitch-master`} ref={glitchRootRef as any} aria-label={TITLE}>
          <span className="glitch-fake1">{TITLE}</span>
          <span className="glitch-fake2">{TITLE}</span>
          <span className="glitch-real" aria-hidden="true">
            {TITLE.split("").map((ch, idx) => (
              <span key={idx} className="glitch-char">{ch}</span>
            ))}
          </span>
          <span className="sr-only">{TITLE}</span>
        </h1>
        <section className={`${styles.menu} panel ${styles.menuOffset}`} aria-label="Menu">
          <nav aria-label="Primární navigace">
            <ul className={styles.menuList}>
              {lastChapter ? (
                <li className={styles.fullWidth}>
                  <article className={`${styles.card} ${styles.cardPrimary}`}>
                    <Link className={styles.cardLink} href={`/reader?u=${encodeURIComponent(lastChapter)}`}>
                      <h2 className={styles.cardTitle}>Pokračovat ve čtení</h2>
                      <p className={styles.cardTeaser}>
                        {lastChapterTitle || 'Pokračovat tam, kde jsi skončil'}
                        {lastChapterPercent ? <span className={styles.progressBadge}>{lastChapterPercent} %</span> : null}
                      </p>
                    </Link>
                  </article>
                </li>
              ) : null}
              <li>
                <article className={styles.card}>
                  <Link className={styles.cardLink} href="/landing-intro">
                    <h2 className={styles.cardTitle}>Intro</h2>
                    <p className={styles.cardTeaser}>Vstupní manifest a glitch show.</p>
                  </Link>
                </article>
              </li>
              <li>
                <article className={`${styles.card} ${!lastChapter ? styles.cardPrimary : ''}`}>
                  <Link className={styles.cardLink} href="/books">
                    <h2 className={styles.cardTitle}>Knihovna</h2>
                    <p className={styles.cardTeaser}>Otevřít seznam kapitol.</p>
                  </Link>
                </article>
              </li>
              <li>
                <article className={styles.card}>
                  <Link className={styles.cardLink} href="/archive">
                    <h2 className={styles.cardTitle}>Archiv</h2>
                    <p className={styles.cardTeaser}>Lore, pojmy, frakce.</p>
                  </Link>
                </article>
              </li>
              <li>
                <article className={styles.card}>
                  <Link className={styles.cardLink} href="/autor">
                    <h2 className={styles.cardTitle}>Autor</h2>
                    <p className={styles.cardTeaser}>Kdo to celé spáchal a proč.</p>
                  </Link>
                </article>
              </li>
            </ul>
          </nav>
        </section>
      </main>
    </div>
  );
}
