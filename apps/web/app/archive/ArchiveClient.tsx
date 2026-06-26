"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from 'next/dynamic';

const WhisperCard = dynamic(() => import('../../src/components/whispers/WhisperCard'), { ssr: false });
const WhisperForm = dynamic(() => import('../../src/components/whispers/WhisperForm'), { ssr: false });
import Link from "next/link";
import { attachGlitchHeading } from "../../src/lib/glitchHeading";

export type ArchiveCardAccess = {
  mode: 'free' | 'chapter' | 'mnems' | 'chapter_or_mnems';
  visibility: 'full' | 'teaser' | 'hidden';
  requiredChapterId: string | null;
  requiredChapterTitle: string | null;
  mnemCost: number;
  label: string;
  lockedText?: string;
};

export type ArchiveCardData = {
  id: string;
  category: string;
  title: string;
  teaser: string;
  quote?: string;
  body: string[];
  tags?: string[];
  spoilerLevel?: number;
  display?: {
    icon?: string;
    accent?: string;
    variant?: string;
  };
  related?: string[];
  images?: { src: string; alt: string }[];
  access?: ArchiveCardAccess;
  order?: number;
  isLockedByDefault?: boolean;
  lockKind?: string;
};

export type ArchiveCategory = {
  id: string;
  title: string;
  description: string;
};

const CHAPTER_ID_MAP: Record<string, string> = {
  restart: '0-inf-restart',
  null: '0-0-null',
  start: '0-1-start',
  run: '0-2-run',
  discontinuum: '0-3-discontinuum',
  defragmentation: '0-4-defragmentation',
  pause: '0-5-pause',
  searching: '0-6-searching',
  ruins: '0-7-ruins',
  reziduum: '0-8-reziduum',
  sector: '0-9-sector',
  rest: '0-10-rest',
  orgie: '0-11-orgie',
};

function resolveCardLock(
  card: ArchiveCardData,
  completedChapterIds: Set<string>,
  mnemBalance: number,
): 'full' | 'teaser' | 'hidden' {
  const acc = card.access;
  if (!acc || acc.mode === 'free') return 'full';

  const manifestId = acc.requiredChapterId ? (CHAPTER_ID_MAP[acc.requiredChapterId] ?? acc.requiredChapterId) : null;
  const chapterDone = manifestId ? completedChapterIds.has(manifestId) : false;
  const canAfford = mnemBalance >= acc.mnemCost && acc.mnemCost > 0;

  if (acc.mode === 'chapter') {
    return chapterDone ? 'full' : acc.visibility;
  }
  if (acc.mode === 'mnems') {
    return canAfford || mnemBalance >= acc.mnemCost ? acc.visibility : acc.visibility;
  }
  if (acc.mode === 'chapter_or_mnems') {
    return chapterDone ? 'full' : acc.visibility;
  }
  return acc.visibility;
}

export default function ArchiveClient({ cards: initialCards }: { cards: ArchiveCardData[] }) {
  const TITLE = "A R C H I V";
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);
  const [completedChapterIds, setCompletedChapterIds] = useState<Set<string>>(new Set());
  const [mnemBalance, setMnemBalance] = useState<number>(0);
  const [accessLoaded, setAccessLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/me/progress').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/me/profile').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([progressData, profileData]) => {
      if (progressData?.progress) {
        const completed = new Set<string>(
          (progressData.progress as { chapterId: string; completed: boolean }[])
            .filter(p => p.completed)
            .map(p => p.chapterId)
        );
        setCompletedChapterIds(completed);
      }
      if (typeof profileData?.mnemBalance === 'number') {
        setMnemBalance(profileData.mnemBalance);
      }
      setAccessLoaded(true);
    }).catch(() => setAccessLoaded(true));
  }, []);

  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const root = glitchRootRef.current as HTMLElement | null;
    if (!root) return;
    const detach = attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 });
    return () => { try { detach && detach(); } catch {} };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenId(null); }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', onKey);
    }
    return () => { if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey); };
  }, []);

  const [cards] = useState<ArchiveCardData[]>(
    [...(initialCards || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [whispers, setWhispers] = useState<import('../../src/components/whispers/WhisperCard').WhisperData[]>([]);
  const [whisperFilter, setWhisperFilter] = useState<string>('all');
  const [whisperSort, setWhisperSort] = useState<string>('random');
  const [showWhisperForm, setShowWhisperForm] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({ placement: 'archive', sort: whisperSort, limit: '30' });
    if (whisperFilter !== 'all') params.set('type', whisperFilter);
    fetch(`/api/whispers?${params}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setWhispers(data); })
      .catch(() => {});
  }, [whisperFilter, whisperSort]);
  const toggle = (id: string) => setOpenId((curr) => (curr === id ? null : id));

  const titleById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of cards) map[c.id] = c.title;
    return map;
  }, [cards]);

  // Focus trap inside open card for accessibility
  useEffect(() => {
    if (!openId) return;
    const container = document.querySelector('article.archive-card.is-open') as HTMLElement | null;
    if (!container) return;
    const q = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(container.querySelectorAll<HTMLElement>(q)).filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
    (focusables[0] || container).focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          if (last) last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          if (first) first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openId]);

  return (
    <div className={`glitch-bg archive-page ${openId ? 'is-modal' : ''}`.trim()}>
      {/* Background video layer for Archive */}
      <div aria-hidden className="video-background">
        <video
          src="/video/SYNTHOMA10.webm"
          autoPlay
          loop
          muted
          playsInline
          className="active"
        />
      </div>
      <a id="top" aria-hidden="true" className="top-anchor" />
      <main className="story archive-story">
        <section className="story-block" data-theme="synthoma">
          <h1 id="glitch-archive" className="glitch-master title" ref={glitchRootRef as any} aria-label={TITLE}>
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

        <section className="story-block">
          <>
            {openId ? (
              <button
                type="button"
                className="archive-backdrop-button"
                aria-label="Zavřít otevřenou kartu (klik mimo)"
                onClick={() => setOpenId(null)}
              />
            ) : null}
            <div className="archive-grid" role="list">
              {cards.map((c) => {
                const lockState = accessLoaded ? resolveCardLock(c, completedChapterIds, mnemBalance) : (c.access?.mode === 'free' ? 'full' : c.access?.visibility ?? 'full');
                if (lockState === 'hidden') return null;
                const isLocked = lockState === 'teaser';
                const isOpen = openId === c.id;
                return (
                  <article
                    key={c.id}
                    className={[
                      'archive-card',
                      isOpen ? 'is-open' : '',
                      isLocked ? 'is-locked' : '',
                    ].filter(Boolean).join(' ')}
                    role="listitem"
                    tabIndex={isOpen ? -1 : undefined}
                    style={c.display?.accent ? { '--card-accent': c.display.accent } as React.CSSProperties : undefined}
                    onClick={(e) => {
                      if (isOpen && !isLocked) {
                        const target = e.target as HTMLElement;
                        if (target.closest('.related-chip')) return;
                        toggle(c.id);
                      }
                    }}
                  >
                    <button
                      type="button"
                      className="card-overlay"
                      aria-expanded={isOpen}
                      aria-controls={`card-${c.id}`}
                      aria-label={isLocked ? `Zamčená karta: ${c.title}` : isOpen ? `Zavřít kartu: ${c.title}` : `Otevřít kartu: ${c.title}`}
                      onClick={() => { if (!isLocked) toggle(c.id); }}
                      aria-disabled={isLocked}
                    />
                    <header className="card-header">
                      <div className="card-title-row">
                        {c.display?.icon && <span className="card-icon">{isLocked ? '⬡' : c.display.icon}</span>}
                        <h3 id={`title-${c.id}`} className="card-title">{c.title}</h3>
                        {isLocked && <span className="card-lock-icon" aria-hidden="true">⬡</span>}
                      </div>
                      <p className="card-teaser">{c.teaser}</p>
                    </header>
                    {isLocked ? (
                      <div className="card-locked-panel">
                        <p className="card-locked-text">
                          {c.access?.lockedText ?? 'Tento záznam zatím leží za zdí Archivu.'}
                        </p>
                        <p className="card-locked-label">{c.access?.label}</p>
                      </div>
                    ) : (
                      <>
                        {c.quote && <blockquote className="card-quote">{c.quote}</blockquote>}
                        {c.images && c.images.length > 0 ? (
                          <div className="card-media" hidden={!isOpen}>
                            {c.images.map((img, i) => (
                              <figure key={i} className="media">
                                <img src={img.src} alt={img.alt} loading="lazy" />
                                <figcaption className="text">{img.alt}</figcaption>
                              </figure>
                            ))}
                          </div>
                        ) : null}
                        <div id={`card-${c.id}`} className="card-content" hidden={!isOpen}>
                          <div className="card-body">
                            {Array.isArray(c.body) && c.body.map((p, idx) => (
                              <p key={idx} className="text">{p}</p>
                            ))}
                            {Array.isArray(c.related) && c.related.length > 0 ? (
                              <div className="card-related">
                                <p className="label">Související:</p>
                                <div className="related-list">
                                  {c.related.map(rid => (
                                    <button
                                      key={rid}
                                      type="button"
                                      className="related-chip"
                                      onClick={(e) => { e.stopPropagation?.(); setOpenId(rid); }}
                                      aria-label={`Otevřít související kartu: ${titleById[rid] || rid}`}
                                    >
                                      {titleById[rid] || `#${rid}`}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                            {Array.isArray(c.tags) && c.tags.length > 0 ? (
                              <div className="card-tags">
                                <p className="label">Tagy:</p>
                                <div className="tags-list">
                                  {c.tags.map((tag, idx) => (
                                    <span key={idx} className="tag-chip">{tag}</span>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        </section>
        <section className="story-block whisper-archive-section" aria-label="Šepoty Archivu">
          <h2 className="whisper-archive-title">ŠEPOTY ARCHIVU</h2>
          <p className="whisper-archive-intro">
            Některé věty nebyly nikdy odeslány. Ne proto, že nebyly důležité. Ale protože by změnily příliš mnoho.
          </p>

          <div className="whisper-archive-controls">
            <div className="whisper-archive-filters">
              {['all','unsent','memory','fear','regret','wish','warning','log'].map((f) => (
                <button
                  key={f}
                  className={`whisper-chip${whisperFilter === f ? ' whisper-chip--active' : ''}`}
                  onClick={() => setWhisperFilter(f)}
                >
                  {f === 'all' ? 'Vše' : f.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="whisper-archive-sorts">
              {(['random','resonance','new'] as const).map((v) => {
                const labels: Record<string, string> = { random: 'Náhodné', resonance: 'Nejvíc rezonovalo', new: 'Nové' };
                return (
                  <button
                    key={v}
                    className={`whisper-chip whisper-chip--sort${whisperSort === v ? ' whisper-chip--active' : ''}`}
                    onClick={() => setWhisperSort(v)}
                  >
                    {labels[v]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="whisper-archive-grid">
            {whispers.length === 0 && (
              <p className="whisper-archive-empty">LOG [ARCHIVE_EMPTY]: Žádné schválené stopy zatím neexistují.</p>
            )}
            {whispers.map((w) => (
              <WhisperCard key={w.id} whisper={w} />
            ))}
          </div>

          <div className="whisper-archive-cta">
            {!showWhisperForm ? (
              <button className="btn" onClick={() => setShowWhisperForm(true)}>ZANECHAT ŠEPOT</button>
            ) : (
              <WhisperForm onSuccess={() => setShowWhisperForm(false)} />
            )}
          </div>
        </section>

        <section className="story-block" aria-label="Navigace zpět">
          <div className="hero-cta">
            <Link className="btn btn-lg" href="/">⟵ Hlavní stránka</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
