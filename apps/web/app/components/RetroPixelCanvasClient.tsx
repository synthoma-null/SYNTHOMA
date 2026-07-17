"use client";

import { useEffect, useRef } from "react";
import {
  UI_PREFERENCES_CHANGED_EVENT,
  isBackgroundMotionAllowed,
  readUiPreferences,
} from '../../src/lib/uiPreferences';

export default function RetroPixelCanvasClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const offscreen = document.createElement('canvas');
    const offscreenContext = offscreen.getContext('2d');
    if (!offscreenContext) return;

    let frameId = 0;
    let lastFrame = 0;
    let video: HTMLVideoElement | null = null;

    const findVideo = () => document.querySelector<HTMLVideoElement>(
      'video[data-pixel-source], .video-background video, .lib-bg video',
    );

    const readNumber = (name: string, fallback: number) => {
      const value = Number(getComputedStyle(root).getPropertyValue(name).trim());
      return Number.isFinite(value) ? value : fallback;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      canvas.hidden = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const draw = (timestamp: number) => {
      frameId = 0;
      if (document.hidden || !isBackgroundMotionAllowed(readUiPreferences())) {
        stop();
        return;
      }
      if (readNumber('--retro-canvas-pixelate', 0) !== 1) {
        stop();
        return;
      }
      video = video?.isConnected ? video : findVideo();
      if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        stop();
        return;
      }

      if (timestamp - lastFrame >= 1000 / 15) {
        lastFrame = timestamp;
        canvas.hidden = false;
        const scale = Math.max(1, Math.floor(readNumber('--pixelate-scale', 8)));
        const width = Math.max(1, Math.floor(canvas.width / scale));
        const height = Math.max(1, Math.floor(canvas.height / scale));
        offscreen.width = width;
        offscreen.height = height;
        try {
          offscreenContext.imageSmoothingEnabled = false;
          offscreenContext.drawImage(video, 0, 0, width, height);
          ctx.imageSmoothingEnabled = false;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(offscreen, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
        } catch {}
      }
      frameId = requestAnimationFrame(draw);
    };

    const sync = () => {
      video = findVideo();
      const enabled = !document.hidden
        && isBackgroundMotionAllowed(readUiPreferences())
        && readNumber('--retro-canvas-pixelate', 0) === 1
        && Boolean(video);
      if (!enabled) {
        stop();
        return;
      }
      if (!frameId) frameId = requestAnimationFrame(draw);
    };

    resize();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-motion', 'data-background-motion', 'style'] });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', sync);
    document.addEventListener(UI_PREFERENCES_CHANGED_EVENT, sync);
    sync();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', sync);
      document.removeEventListener(UI_PREFERENCES_CHANGED_EVENT, sync);
    };
  }, []);

  return <canvas id="retro-video-canvas" ref={canvasRef} hidden aria-hidden="true" />;
}
