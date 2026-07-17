"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { attachGlitchHeading } from "../../src/lib/glitchHeading";
import { useVideoVisibility } from "../../src/lib/useVideoVisibility";
import { useBackgroundMotionAllowed } from '../../src/hooks/useBackgroundMotionAllowed';

export default function AutorClient({ initialHtml }: { initialHtml: string }) {
  const TITLE = "A U T O R";
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);
  const videoRef = useVideoVisibility();
  const motionAllowed = useBackgroundMotionAllowed();

  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const root = glitchRootRef.current as HTMLElement | null;
    if (!root) return;
    const detach = attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 });
    return () => { try { detach && detach(); } catch {} };
  }, []);

  useEffect(() => {
    try {
      const playPanel = (window as any).audioPanelPlay as undefined | ((src: string) => void);
      if (typeof playPanel === 'function') {
        playPanel('/audio/Synthoma_landing.mp3');
      } else {
        (window as any).audioPanelEnsurePlaying?.();
      }
    } catch {}
  }, []);

  return (
    <div className={"glitch-bg autor-page"}>
      {/* Background video layer to match visual style with Archive */}
      <div aria-hidden className="video-background">
        {motionAllowed ? <video
          ref={videoRef}
          src="/video/SYNTHOMA12.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="active"
        /> : null}
      </div>
      <main className="story" aria-label="O autorovi">
        <section className="story-block" data-theme="synthoma">
          <h1 id="glitch-autor" className="glitch-master title" ref={glitchRootRef as any} aria-label={TITLE}>
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

        <article
          className="readerOverlay-35 readerOverlay-blur autor-semantic-content"
          aria-label="O autorovi"
          dangerouslySetInnerHTML={{ __html: initialHtml }}
        />

        <p className="public-machine-links">
          <a href="/ai/cs/author.md">MARKDOWN</a>
          {' // '}
          <a href="/api/public/v1/author?locale=cs">JSON</a>
        </p>

        <article className="autor-panel os-surface os-surface--glass" aria-label="Navigace zpět">
          <section className="story-block">
            <div className="hero-cta">
              <Link className="btn btn-lg" href="/">⟵ Hlavní stránka</Link>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
