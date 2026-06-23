"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { attachGlitchHeading } from "../../src/lib/glitchHeading";

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
};

export type ArchiveCategory = {
  id: string;
  title: string;
  description: string;
};

export default function ArchiveClient({ cards: initialCards }: { cards: ArchiveCardData[] }) {
  const TITLE = "A R C H I V";
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);

  
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

  const [cards] = useState<ArchiveCardData[]>(initialCards || []);
  const [openId, setOpenId] = useState<string | null>(null);
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
              {cards.map((c) => (
                <article
                  key={c.id}
                  className={`archive-card ${openId === c.id ? 'is-open' : ''}`.trim()}
                  role="listitem"
                  tabIndex={openId === c.id ? -1 : undefined}
                  style={c.display?.accent ? { '--card-accent': c.display.accent } as React.CSSProperties : undefined}
                  onClick={(e) => {
                    if (openId === c.id) {
                      const target = e.target as HTMLElement;
                      if (target.closest('.related-chip')) return; // nezasahovat do kliků na chipy
                      toggle(c.id);
                    }
                  }}
                >
                  <button
                    type="button"
                    className="card-overlay"
                    aria-expanded={openId === c.id}
                    aria-controls={`card-${c.id}`}
                    aria-label={openId === c.id ? `Zavřít kartu: ${c.title}` : `Otevřít kartu: ${c.title}`}
                    onClick={() => toggle(c.id)}
                  />
                  <header className="card-header">
                    <div className="card-title-row">
                      {c.display?.icon && <span className="card-icon">{c.display.icon}</span>}
                      <h3 id={`title-${c.id}`} className="card-title">{c.title}</h3>
                    </div>
                    <p className="card-teaser">{c.teaser}</p>
                    {c.quote && <blockquote className="card-quote">{c.quote}</blockquote>}
                  </header>
                  {c.images && c.images.length > 0 ? (
                    <div className="card-media" hidden={openId !== c.id}>
                      {c.images.map((img, i) => (
                        <figure key={i} className="media">
                          <img src={img.src} alt={img.alt} loading="lazy" />
                          <figcaption className="text">{img.alt}</figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : null}
                  <div id={`card-${c.id}`} className="card-content" hidden={openId !== c.id}>
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
                              <span key={idx} className="tag-chip">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
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
