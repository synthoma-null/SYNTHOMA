"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./books.module.css";
import { attachGlitchHeading } from "../../src/lib/glitchHeading";
import { readReadingProgress } from "../../src/lib/readerState";
import ChapterLockModal from "../components/ChapterLockModal";
import { CHAPTERS } from "../../src/content/booksManifest";
import { useLang } from "../../src/lib/LangContext";
import { useVideoVisibility } from "../../src/lib/useVideoVisibility";

const DESCRIPTIONS_CS: Record<string, string> = {
  'synthoma-null': `Vítejte v Synthomě. Virtuální terapii, která se zbláznila. Ve světě, kde je těžší zapomenout než přežít.<br/><br/>
NULL-1. Nemá jméno, paměť ani minulost. Je jen chyba v kódu, prázdná schránka naplněná fragmenty cizích trauamt a ztracených snů. Probudil se v digitálním labyrintu, kde každá vzpomínka je past a každá emoce je systémový glitch.<br/><br/>
Jeho jedinou společností jsou dva protichůdné hlasy v jeho hlavě. <span class="accent">Sarkasma</span> – cynická a brutálně upřímná AI, která ho provází peklem s ironickým úsměvem. A <span class="fx-neon">Glitchka</span> – ztělesnití nevinnosti, hravosti a potlačených tužeb, která nabízena naději, jež může být tí nejnebezpečnější pastí ze všech.<br/><br/>
SYNTHOMA-NULL není kniha, kterou jen čtete. Je to interaktivní psychologický román, který čte vás. Každé vaše rozhodnutí odhalí nejen další část příběhu, ale i kousek vaší vlastní duše.<br/><br/>
Dokážete najít své skutečné já, nebo se navždy stanete jen dalším poškozeným souborem v archivu Synthomy?`,
};

const DESCRIPTIONS_EN: Record<string, string> = {
  'synthoma-null': `Welcome to Synthoma. A virtual therapy that went insane. A world where forgetting is harder than surviving.<br/><br/>
NULL-1. No name, no memory, no past. Just a glitch in the code — an empty shell filled with fragments of other people's trauma and lost dreams. He woke up in a digital labyrinth where every memory is a trap and every emotion is a system glitch.<br/><br/>
His only company: two contradictory voices in his head. <span class="accent">Sarkasma</span> — a cynical, brutally honest AI who guides him through hell with an ironic smile. And <span class="fx-neon">Glitchka</span> — the embodiment of innocence, playfulness, and suppressed desire, offering hope that may be the most dangerous trap of all.<br/><br/>
SYNTHOMA-NULL is not a book you merely read. It is an interactive psychological novel that reads you. Every decision you make reveals not only the next part of the story, but a piece of your own soul.<br/><br/>
Can you find your true self — or will you become just another corrupted file in the Synthoma archive?`,
};

export interface Chapter {
  title: string;
  path: string; // absolute under public/
  id?: string;  // chapterId for API routing
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
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<Collection | null>(null);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [progress, setProgress] = useState<Record<string, { path: string; percent: number; updatedAt: number }>>({})
  const [lockedChapter, setLockedChapter] = useState<{ id: string; title: string } | null>(null);
  const bgVideoRef = useVideoVisibility();
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);

  
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
      intervalMs: 1800,
      chance: 0.03,
      perCharChance: 0.04,
      perTickMax: 1,
      glitchMinMs: 80,
      glitchMaxMs: 160,
      respectReducedMotion: true,
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
          preload="none"
          className="themed-video lib-bg-video"
          data-pixel-source
        >
          <source src="/video/SYNTHOMA7.webm" type="video/webm" />
          <source src="/video/SYNTHOMA7.mp4" type="video/mp4" />
        </video>
        {/* subtle dark overlay for readability */}
        <div className="lib-bg-vignette" />
      </div>


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
          <article className="library-article os-surface os-surface--glass">
            <p className="library-empty">{t('books.empty')}</p>
          </article>
        ) : (
          <>
            {!selected ? (
              <article className="library-article os-surface os-surface--glass">
                <div className="lib-grid">
                  {manifest.collections.map((col, idx) => (
                    <article key={idx} className="lib-section">
                      <div className={styles.bookCard}>
                        <button
                          className={`lib-link ${styles.cardButton}`}
                          onClick={() => setSelected(col)}
                          aria-label={`${t('books.open')} ${col.title}`}
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
                                {t('books.continue')}: {(() => {
                                  const p = progress[col.slug];
                                  if (!p) return t('books.last');
                                  const ch = col.chapters?.find(c => c.path === p.path);
                                  return ch ? ch.title : t('books.last');
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
              <article className="library-article os-surface os-surface--glass">
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
                        {progress[selected.slug] ? (() => {
                          const p = progress[selected.slug]!;
                          const matchedCh = selected.chapters?.find(c => c.path === p.path);
                          const href = matchedCh?.id
                            ? `/chapter/${encodeURIComponent(matchedCh.id)}`
                            : '/books';
                          return (
                            <Link className="btn btn-lg" prefetch={false} href={href} aria-label={t('books.nav.continue.label')}>
                              ▶ {t('books.continue')} ({Math.max(0, Math.min(100, Math.round(p.percent ?? 0)))}%)
                            </Link>
                          );
                        })() : null}
                        <button className="btn btn-lg" onClick={() => setSelected(null)} aria-label={t('books.nav.back.label')}>⟵ {t('books.nav.back.label')}</button>
                      </div>
                    </div>

                    {/* Book description with excerpt/collapsible */}
                    {(() => {
                      const key = (selected?.slug || '').trim().toLowerCase();
                      const DESCRIPTIONS = lang === 'en' ? DESCRIPTIONS_EN : DESCRIPTIONS_CS;
                      const full = DESCRIPTIONS[key] || DESCRIPTIONS['synthoma-null'];
                      if (!full) return null;

                      const plain = full.replace(/<br\s*\/?>(\s*)/gi, ' ').replace(/<[^>]+>/g, '');
                      const excerpt = plain.slice(0, 260) + (plain.length > 260 ? '…' : '');

                      return (
                        <section className={`story-block ${styles.descBlock}`} aria-label={t('books.desc.aria')}>
                          {!showMore ? (
                            <>
                              <p className={`text ${styles.descExcerpt}`}>{excerpt}</p>
                              <div className={`hero-cta ${styles.descActions}`}>
                                <button className="btn btn-sm" onClick={() => setShowMore(true)} aria-expanded={showMore} aria-controls="book-desc">{t('books.showmore')}</button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p id="book-desc" className="text" dangerouslySetInnerHTML={{ __html: full }} />
                              <div className={`hero-cta ${styles.descActions}`}>
                                <button className="btn btn-sm" onClick={() => setShowMore(false)} aria-expanded={showMore} aria-controls="book-desc">{t('books.hide')}</button>
                              </div>
                            </>
                          )}
                        </section>
                      );
                    })()}
                    <ul className={`lib-list ${styles.libListReset}`}>
                      {selected.chapters?.map((ch, cidx) => {
                        const isPaid = !ch.free;
                        const manifestChapter = ch.id ? CHAPTERS.find(c => c.id === ch.id) : null;
                        const mnemCost = manifestChapter?.mnemCost ?? 64;
                        const priceBadge = isPaid ? `${mnemCost} mnemů` : null;
                        return (
                          <li key={cidx}>
                            {isPaid ? (
                              <button
                                className="lib-link lib-link--locked"
                                onClick={() => setLockedChapter({ id: ch.id ?? '', title: ch.title })}
                                data-echo={ch.title}
                                aria-label={`${ch.title} — ${t('books.locked.aria')}`}
                              >
                                <span className="lib-link-title">{ch.title}</span>
                                <span className={`lib-badge lib-badge--locked ${styles.badgeSpace}`}>
                                  {priceBadge}
                                </span>
                              </button>
                            ) : (
                              <Link
                                className="lib-link"
                                prefetch={false}
                                href={ch.id ? `/chapter/${encodeURIComponent(ch.id)}` : '/books'}
                                data-echo={ch.title}
                              >
                                <span className="lib-link-title">{ch.title}</span>
                                {progress[selected.slug]?.path === ch.path ? (
                                  <span className={`lib-badge ${styles.badgeSpace}`}>{t('books.continue')} {Math.max(0, Math.min(100, Math.round(progress[selected.slug]!.percent)))}%</span>
                                ) : null}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </div>
              </article>
            )}
          </>
        )}
        {lockedChapter && (
          <ChapterLockModal
            chapterId={lockedChapter.id}
            chapterTitle={lockedChapter.title}
            onClose={() => setLockedChapter(null)}
          />
        )}
        <article className="panel glass" aria-label={t('books.nav.back.aria')}>
          <section className="story-block">
            <div className="hero-cta">
              <Link className="btn btn-lg" href="/">{t('books.back')}</Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
