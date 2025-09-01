"use client";

import React, { useEffect, useRef, useState } from "react";
import { attachGlitchHeading } from "../../src/lib/glitchHeading";
import Link from "next/link";

interface Chapter {
  title: string;
  path: string; // absolute under public/
  free?: boolean;
}
interface Collection {
  slug: string;
  title: string;
  chapters: Chapter[];
}
interface Manifest { collections: Collection[] }

export default function BooksPage() {
  const TITLE = "K N I H O V N A";
  const [data, setData] = useState<Manifest>({ collections: [] });
  const [err, setErr] = useState<string | null>(null);
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const glitchRootRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // Ensure global background audio keeps playing on pages without assigned music
    try { (window as any).audioPanelEnsurePlaying?.(); } catch {}
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
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/books/manifest.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Load failed");
      }
    })();
    return () => { cancelled = true; };
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

      // sample video to small canvas
      try {
        offCtx.imageSmoothingEnabled = false;
        offCtx.clearRect(0, 0, sw, sh);
        offCtx.drawImage(video, 0, 0, sw, sh);
        // upscale to main canvas without smoothing
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
          src="/video/SYNTHOMA7.webm"
          autoPlay
          loop
          muted
          playsInline
          className="themed-video lib-bg-video"
        />
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

        {err && <p className="library-error">Manifest selhal: {err}</p>}

        {!data.collections.length ? (
          <p className="library-empty">Prázdnota. Přidej kapitoly ať máme co žrát. 📚</p>
        ) : (
          <div className="lib-grid">
            {data.collections.map((col, idx) => (
              <section key={idx} className="lib-section">
                <h2 className="lib-section-title">{col.title}</h2>
                <ul className="lib-list">
                  {col.chapters?.map((ch, cidx) => (
                    <li key={cidx}>
                      <Link
                        className="lib-link"
                        href={`/reader?u=${encodeURIComponent(ch.path)}`}
                        data-echo={ch.title}
                      >
                        {ch.title} {!ch.free ? <span className="lib-badge">Nedostupné</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
        <section className="story-block" aria-label="Navigace zpět">
          <div className="hero-cta">
            <Link className="btn btn-lg" href="/">⟵ Hlavní stránka</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
