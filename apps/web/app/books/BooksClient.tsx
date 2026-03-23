"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./books.module.css";
import { attachGlitchHeading } from "../../src/lib/glitchHeading";
import { readReadingProgress } from "../../src/lib/readerState";

export interface Chapter {
  title: string;
  path: string; // absolute under public/
  free?: boolean;
}
export interface Collection {
  slug: string;
  title: string;
  cover?: string;
  chapters: Chapter[];
}
export interface Manifest { collections: Collection[] }

export default function BooksClient({ manifest }: { manifest: Manifest }) {
  const TITLE = "K N I H O V N A ";
  const [selected, setSelected] = useState<Collection | null>(null);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [progress, setProgress] = useState<Record<string, { path: string; percent: number; updatedAt: number }>>({});
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    try { (window as any).audioPanelEnsurePlaying?.(); } catch {}
  }, []);

  // Load reading progress from localStorage for all collections
  useEffect(() => {
    try {
      const map: Record<string, { path: string; percent: number; updatedAt: number }> = {};
      for (const col of manifest.collections || []) {
        try {
          const p = readReadingProgress(col.slug);
          if (p && typeof p.path === 'string') {
            map[col.slug] = { path: p.path, percent: Number(p.percent) || 0, updatedAt: Number(p.updatedAt) || 0 };
          }
        } catch {}
      }
      setProgress(map);
    } catch {}
  }, [manifest.collections]);

  useEffect(() => {
    const root = glitchRootRef.current as HTMLElement | null;
    if (!root) return;
    const detach = attachGlitchHeading(root, TITLE, {
      intervalMs: 320,
      chance: 0.06,
      perCharChance: 0.08,
      perTickMax: 1,
      glitchMinMs: 110,
      glitchMaxMs: 220,
      respectReducedMotion: false,
    });
    return () => { try { detach && detach(); } catch {} };
  }, []);

  // slow down background video
  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v) return;
    try {
      const setRate = () => { try { v.playbackRate = 0.5; } catch {} };
      setRate();
      const onLoaded = () => setRate();
      const onPlay = () => setRate();
      v.addEventListener('loadedmetadata', onLoaded);
      v.addEventListener('play', onPlay);
      return () => { v.removeEventListener('loadedmetadata', onLoaded); v.removeEventListener('play', onPlay); };
    } catch {}
  }, []);

  // pixelate video when retro theme requests it
  useEffect(() => {
    const video = bgVideoRef.current;
    const canvas = pixelCanvasRef.current;
    if (!video || !canvas) return;

    const root = document.documentElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');
    if (!offCtx) return;

    let running = true;

    const readVar = (name: string, fallback: number) => {
      const v = getComputedStyle(root).getPropertyValue(name).trim();
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? n : fallback;
    };

    const updateSizes = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSizes();
    const onResize = () => updateSizes();
    window.addEventListener('resize', onResize);

    const draw = () => {
      if (!running) return;
      const enabled = readVar('--retro-canvas-pixelate', 0);
      if (!enabled) {
        canvas.style.display = 'none';
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      canvas.style.display = '';

      const scale = readVar('--pixelate-scale', 8);
      const sw = Math.max(1, Math.floor(canvas.width / scale));
      const sh = Math.max(1, Math.floor(canvas.height / scale));
      if (off.width !== sw || off.height !== sh) {
        off.width = sw; off.height = sh;
      }

      try {
        offCtx.imageSmoothingEnabled = false;
        offCtx.clearRect(0, 0, sw, sh);
        offCtx.drawImage(video, 0, 0, sw, sh);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(off, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);
      } catch {}

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <div className="glitch-bg library-page">
      {/* Background video layer */}
      <div aria-hidden className="lib-bg">
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="themed-video lib-bg-video"
          data-pixel-source
        >
          <source src="/video/SYNTHOMA7.webm" type="video/webm" />
          <source src="/video/SYNTHOMA7.mp4" type="video/mp4" />
        </video>
        {/* subtle dark overlay for readability */}
        <div className="lib-bg-vignette" />
      </div>

      {/* Pixelation canvas (over video, under content) */}
      <canvas ref={pixelCanvasRef} className="lib-pixel-canvas" aria-hidden />

      <div className="library-container">
        <h1 id="glitch-library" className="glitch-master title" ref={glitchRootRef as any} aria-label={TITLE}>
          <span className="glitch-fake1">{TITLE}</span>
          <span className="glitch-fake2">{TITLE}</span>
          <span className="glitch-real" aria-hidden="true">
            {TITLE.split("").map((ch, idx) => (
              <span key={idx} className="glitch-char">{ch}</span>
            ))}
          </span>
          <span className="sr-only">{TITLE}</span>
        </h1>

        {!manifest.collections.length ? (
          <article className="panel glass">
            <p className="library-empty">Knihovna se načítá...</p>
          </article>
        ) : (
          <>
            {!selected ? (
              <article className="panel glass">
                <div className="lib-grid">
                  {manifest.collections.map((col, idx) => (
                    <article key={idx} className="lib-section">
                      <div className={styles.bookCard}>
                        <button
                          className={`lib-link ${styles.cardButton}`}
                          onClick={() => setSelected(col)}
                          aria-label={`Otevřít kolekci ${col.title}`}
                        >
                          <div className={`lib-cover ${styles.coverThumb} ${!col.cover ? styles.noCover : ''}`} aria-hidden>
                            {col.cover ? (
                              <img className={styles.coverImg} src={col.cover} alt="" loading="lazy" decoding="async" />
                            ) : null}
                          </div>
                          <div className={styles.cardBody}>
                            <h2 className={`lib-section-title ${styles.sectionTitleReset}`}>{col.title}</h2>
                            {progress[col.slug] ? (
                              <p className="lib-note" aria-live="polite">
                                Pokračovat: {(() => {
                                  const p = progress[col.slug];
                                  if (!p) return 'Poslední kapitola';
                                  const ch = col.chapters?.find(c => c.path === p.path);
                                  return ch ? ch.title : 'Poslední kapitola';
                                })()} ({Math.max(0, Math.min(100, Math.round(progress[col.slug]?.percent ?? 0)))}%)
                              </p>
                            ) : null}
                          </div>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            ) : (
              <article className="panel glass">
                <div className="lib-grid">
                  <section className={`lib-section ${styles.fullWidthSection}`}>
                    <div className={`lib-cover ${styles.coverHero} ${!selected.cover ? styles.noCover : ''}`} aria-hidden>
                      {selected.cover ? (
                        <img className={styles.coverImg} src={selected.cover} alt="" loading="lazy" decoding="async" />
                      ) : null}
                    </div>
                    <div className={`lib-section-title ${styles.sectionHeader}`}>
                      <h2 className={styles.sectionTitleReset}>{selected.title}</h2>
                      <div className={`hero-cta ${styles.ctaRow}`}>
                        {progress[selected.slug] ? (
                          <Link className="btn btn-lg" href={`/reader?u=${encodeURIComponent(progress[selected.slug]!.path)}`} aria-label="Pokračovat ve čtení">
                            ▶ Pokračovat ({Math.max(0, Math.min(100, Math.round(progress[selected.slug]?.percent ?? 0)))}%)
                          </Link>
                        ) : null}
                        <button className="btn btn-lg" onClick={() => setSelected(null)} aria-label="Zpět na seznam knih">⟵ Zpět</button>
                      </div>
                    </div>

                    {/* Book description with excerpt/collapsible */}
                    {(() => {
                      const DESCRIPTIONS: Record<string, string> = {
                        'synthoma-null': `Vítejte v Synthomě. Virtuální terapii, která se zbláznila. Ve světě, kde je těžší zapomenout než přežít.<br/><br/>
NULL-1. Nemá jméno, paměť ani minulost. Je jen chyba v kódu, prázdná schránka naplněná fragmenty cizích traumat a ztracených snů. Probudil se v digitálním labyrintu, kde každá vzpomínka je past a každá emoce je systémový glitch.<br/><br/>
Jeho jedinou společností jsou dva protichůdné hlasy v jeho hlavě. <span class="accent">Sarkasma</span> – cynická a brutálně upřímná AI, která ho provází peklem s ironickým úsměvem. A <span class="fx-neon">Glitchka</span> – ztělesnění nevinnosti, hravosti a potlačených tužeb, která nabízí naději, jež může být tou nejnebezpečnější pastí ze všech.<br/><br/>
SYNTHOMA-NULL není kniha, kterou jen čtete. Je to interaktivní psychologický román, který čte vás. Každé vaše rozhodnutí, inspirované vaší vlastní osobností, odhaluje nejen další část příběhu, ale i kousek vaší vlastní duše. Vaše volby mezi logikou a citem, řádem a chaosem, nadějí a cynismem určí, zda v tomto světě najdete své já, nebo se navždy ztratíte v šumu.<br/><br/>
Ponořte se do glitch-noir světa, kde se budete brodit archivy neodeslaných omluv, čelit příšerám zhmotněným z potlačených vzpomínek a prožívat touhu tak intenzivní, že hrozí pádem celého systému.<br/><br/>
Dokážete najít své skutečné já, nebo se navždy stanete jen dalším poškozeným souborem v archivu Synthomy?<br/>
Přežijete další restart?`,
                      };

                      // Match by collection slug; fallback na synthoma-null
                      const key = (selected?.slug || '').trim().toLowerCase();
                      const full = DESCRIPTIONS[key] || DESCRIPTIONS['synthoma-null'];
                      if (!full) return null;

                      const plain = full.replace(/<br\s*\/?>(\s*)/gi, ' ').replace(/<[^>]+>/g, '');
                      const excerpt = plain.slice(0, 260) + (plain.length > 260 ? '…' : '');

                      return (
                        <section className={`story-block ${styles.descBlock}`} aria-label="Popis knihy">
                          {!showMore ? (
                            <>
                              <p className={`text ${styles.descExcerpt}`}>{excerpt}</p>
                              <div className={`hero-cta ${styles.descActions}`}>
                                <button className="btn btn-sm" onClick={() => setShowMore(true)} aria-expanded={showMore} aria-controls="book-desc">Zobrazit více</button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p id="book-desc" className="text" dangerouslySetInnerHTML={{ __html: full }} />
                              <div className={`hero-cta ${styles.descActions}`}>
                                <button className="btn btn-sm" onClick={() => setShowMore(false)} aria-expanded={showMore} aria-controls="book-desc">Skrýt</button>
                              </div>
                            </>
                          )}
                        </section>
                      );
                    })()}
                    <ul className={`lib-list ${styles.libListReset}`}>
                      {selected.chapters?.map((ch, cidx) => (
                        <li key={cidx}>
                          <Link
                            className="lib-link"
                            href={`/reader?u=${encodeURIComponent(ch.path)}`}
                            data-echo={ch.title}
                          >
                            {ch.title}
                            {progress[selected.slug]?.path === ch.path ? (
                              <span className={`lib-badge ${styles.badgeSpace}`}>Pokračovat {Math.max(0, Math.min(100, Math.round(progress[selected.slug]!.percent)))}%</span>
                            ) : null}
                            {!ch.free ? <span className={`lib-badge ${styles.badgeSpace}`}>Nedostupné</span> : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </article>
            )}
          </>
        )}
        <article className="panel glass" aria-label="Navigace zpět">
          <section className="story-block">
            <div className="hero-cta">
              <Link className="btn btn-lg" href="/">⟵ Hlavní stránka</Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
