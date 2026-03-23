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

    const readNumberVar = (name: string, fallback: number) => {
      try {
        const v = getComputedStyle(root).getPropertyValue(name).trim();
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
      } catch {
        return fallback;
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const draw = () => {
      if (!running) return;
      if (document.visibilityState === "hidden") {
        rafId = requestAnimationFrame(draw);
        return;
      }
      const enabled = readNumberVar("--retro-canvas-pixelate", 0);
      if (!enabled) {
        // Hide canvas and continue checking (theme can change)
        canvas.style.display = "none";
        rafId = requestAnimationFrame(draw);
        return;
      }
      canvas.style.display = "";

      // Apply global filters on the raw video element if present
      try {
        // These are already applied by CSS .themed-video usually; keep here for safety if needed
        const opacity = readNumberVar("--video-opacity", 1);
        if (video) {
          (video.style as any).opacity = String(opacity);
        }
      } catch {}

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

    rafId = requestAnimationFrame(draw);

    // Observe DOM changes to retarget when page video switches
    const mo = new MutationObserver(() => {
      const next = findPreferredVideo();
      if (next && next !== video) {
        video = next;
      }
    });
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });

    return () => {
      running = false;
      try { cancelAnimationFrame(rafId); } catch {}
      try { mo.disconnect(); } catch {}
      window.removeEventListener("resize", onResize);
      try { ctx.clearRect(0, 0, canvas.width, canvas.height); } catch {}
    };
  }, []);

  return <canvas id="retro-video-canvas" ref={canvasRef} aria-hidden />;
}
