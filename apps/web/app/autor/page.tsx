"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { attachGlitchHeading } from "../../src/lib/glitchHeading";
import TypewriterReader from "../../src/components/TypewriterReader";

export default function AutorPage() {
  const TITLE = "A U T O R";
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const root = glitchRootRef.current as HTMLElement | null;
    if (!root) return;
    const detach = attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 });
    return () => { try { detach && detach(); } catch {} };
  }, []);

  return (
    <div className={"glitch-bg autor-page"}>
      {/* Background video layer to match visual style with Archive */}
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

        <section>
          <TypewriterReader
            srcUrl="/data/SYNTHOMAAUTOR.html"
            ariaLabel="O autorovi"
            autoStart
            className="readerOverlay-35 readerOverlay-blur"
          />
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
