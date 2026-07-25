'use client';

import { useEffect } from 'react';

export const PWA_SPLASH_MIN_VISIBLE_MS = 750;
export const PWA_SPLASH_MAX_VISIBLE_MS = 2000;

export default function PwaBootSplash() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.pwaLaunch !== 'true') return;

    const image = document.querySelector<HTMLImageElement>('#pwa-boot-splash img');
    let minimumElapsed = false;
    let imageReady = !image;
    let finished = false;

    const revealApp = () => {
      if (finished || !minimumElapsed || !imageReady) return;
      finished = true;
      root.classList.add('pwa-ready');
    };
    const forceRevealApp = () => {
      if (finished) return;
      finished = true;
      root.classList.add('pwa-ready');
    };

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      revealApp();
    }, PWA_SPLASH_MIN_VISIBLE_MS);
    const safetyTimer = window.setTimeout(forceRevealApp, PWA_SPLASH_MAX_VISIBLE_MS);

    const markImageReady = () => {
      imageReady = true;
      revealApp();
    };

    if (image) {
      if (typeof image.decode === 'function') {
        void image.decode().catch(() => undefined).then(markImageReady);
      } else if (image.complete) {
        markImageReady();
      } else {
        image.addEventListener('load', markImageReady, { once: true });
        image.addEventListener('error', markImageReady, { once: true });
      }
    }

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      image?.removeEventListener('load', markImageReady);
      image?.removeEventListener('error', markImageReady);
    };
  }, []);

  return null;
}
