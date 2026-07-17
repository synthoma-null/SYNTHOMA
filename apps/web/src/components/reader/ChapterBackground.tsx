'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';
import type { ChapterPresentation } from '../../content/chapterPresentation';
import { useVideoVisibility } from '../../lib/useVideoVisibility';

interface NetworkInformationLike {
  saveData?: boolean;
}

function movingBackgroundAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const animationsDisabled = window.localStorage.getItem('animationsDisabled') === 'true';
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return !reducedMotion && !animationsDisabled && connection?.saveData !== true;
}

export default function ChapterBackground({ presentation }: { presentation: ChapterPresentation }) {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useVideoVisibility();

  useEffect(() => {
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => setShowVideo(Boolean(presentation.video) && movingBackgroundAllowed());
    update();
    motion?.addEventListener?.('change', update);
    document.addEventListener('synthoma:animations-changed', update);
    return () => {
      motion?.removeEventListener?.('change', update);
      document.removeEventListener('synthoma:animations-changed', update);
    };
  }, [presentation.video]);

  const style = {
    '--chapter-overlay-color': presentation.overlay.color,
    '--chapter-overlay-opacity': String(presentation.overlay.opacity),
  } as CSSProperties;

  return (
    <div className="chapter-background" style={style} aria-hidden="true">
      <Image
        className="chapter-background__poster"
        src={presentation.poster || presentation.fallbackImage}
        alt=""
        fill
        sizes="100vw"
        priority
      />
      {showVideo && presentation.video ? (
        <video
          ref={videoRef}
          className="chapter-background__video"
          poster={presentation.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          data-pixel-source
        >
          {presentation.video.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ) : null}
      <span className="chapter-background__overlay" />
    </div>
  );
}
