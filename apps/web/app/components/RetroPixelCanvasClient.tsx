"use client";

import React, { useEffect, useRef } from "react";

/**
 * RetroPixelCanvasClient
 * - Renders a fixed canvas above the global background video (.bg-video)
 * - When the Retro Arcade theme is active, reads CSS vars from :root:
 *   --retro-canvas-pixelate (0/1), --pixelate-scale, --pixelate-contrast, --pixelate-saturation, --video-opacity, --retro-canvas-opacity
 * - Samples the <video.bg-video> to a tiny offscreen canvas and upscales to this canvas with imageSmoothing disabled
 */
export default function RetroPixelCanvasClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Find preferred video to pixelate
    const findPreferredVideo = (): HTMLVideoElement | null => {
      // Priority: explicit pixel source, reader/landing background, any visible video
      const explicit = document.querySelector<HTMLVideoElement>('video[data-pixel-source]');
      if (explicit) return explicit;
      const pageBg = document.querySelector<HTMLVideoElement>('.video-background video, .lib-bg video');
      if (pageBg) return pageBg as HTMLVideoElement;
      const anyVisible = Array.from(document.querySelectorAll<HTMLVideoElement>('video')).find(v => v.offsetParent !== null);
      return anyVisible || null;
    };

    let video: HTMLVideoElement | null = findPreferredVideo();
    if (!video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    if (!offCtx) return;

    let running = true;
    let rafId = 0;
    let paused = false;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;

    // Cache computed style — refresh only every 500ms
    let cachedStyle = getComputedStyle(root);
    let styleAge = 0;
    const readNumberVar = (name: string, fallback: number) => {
      try {
        const now = Date.now();
        if (now - styleAge > 500) { cachedStyle = getComputedStyle(root); styleAge = now; }
        const v = cachedStyle.getPropertyValue(name).trim();
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
      } catch {
        return fallback;
      }
    };

    // Target 15fps for pixelation — no need for 60fps
    const TARGET_FPS = 15;
    const FRAME_MS = 1000 / TARGET_FPS;
    let lastFrame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const resumeLoop = () => {
      if (!running) return;
      paused = false;
      rafId = requestAnimationFrame(draw);
    };

    const draw = (ts: number = 0) => {
      if (!running) return;

      // Skip hidden tabs entirely — wake up every 2s to recheck
      if (document.visibilityState === "hidden") {
        paused = true;
        pauseTimer = setTimeout(resumeLoop, 2000);
        return;
      }

      const enabled = readNumberVar("--retro-canvas-pixelate", 0);
      if (!enabled) {
        // Retro not active — hide canvas and pause loop, recheck every 2s
        if (canvas.style.display !== "none") canvas.style.display = "none";
        paused = true;
        pauseTimer = setTimeout(resumeLoop, 2000);
        return;
      }

      // Throttle to TARGET_FPS
      if (ts - lastFrame < FRAME_MS) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = ts;
      canvas.style.display = "";

      const scale = Math.max(1, Math.floor(readNumberVar("--pixelate-scale", 8)));
      const sw = Math.max(1, Math.floor(canvas.width / scale));
      const sh = Math.max(1, Math.floor(canvas.height / scale));
      if (off.width !== sw || off.height !== sh) {
        off.width = sw; off.height = sh;
      }

      try {
        offCtx.imageSmoothingEnabled = false;
        offCtx.clearRect(0, 0, sw, sh);
        if (video) offCtx.drawImage(video, 0, 0, sw, sh);

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(off, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);
      } catch {
        // ignore frame errors (e.g., while switching sources)
      }

      rafId = requestAnimationFrame(draw);
    };

    // Start paused — will wake when retro theme activates
    paused = true;
    pauseTimer = setTimeout(resumeLoop, 100);

    // Observe DOM changes to retarget when page video switches
    const mo = new MutationObserver(() => {
      const next = findPreferredVideo();
      if (next && next !== video) {
        video = next;
      }
    });
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });

    // Wake up immediately when tab becomes visible again
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && paused && running) {
        if (pauseTimer) { clearTimeout(pauseTimer); pauseTimer = null; }
        resumeLoop();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      try { cancelAnimationFrame(rafId); } catch {}
      if (pauseTimer) { try { clearTimeout(pauseTimer); } catch {} }
      try { mo.disconnect(); } catch {}
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener("resize", onResize);
      try { ctx.clearRect(0, 0, canvas.width, canvas.height); } catch {}
    };
  }, []);

  return <canvas id="retro-video-canvas" ref={canvasRef} aria-hidden="true" />;
}
