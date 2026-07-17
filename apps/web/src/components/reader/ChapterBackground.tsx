'use client';

import Image from 'next/image';
import { useState, type CSSProperties } from 'react';
import type { ChapterPresentation } from '../../content/chapterPresentation';
import { useVideoVisibility } from '../../lib/useVideoVisibility';
import { useBackgroundMotionAllowed } from '../../hooks/useBackgroundMotionAllowed';

export default function ChapterBackground({ presentation }: { presentation: ChapterPresentation }) {
  const motionAllowed = useBackgroundMotionAllowed();
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useVideoVisibility();

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
      {motionAllowed && presentation.video && !videoFailed ? (
        <video
          ref={videoRef}
          className={`chapter-background__video${videoReady ? ' is-ready' : ''}`}
          poster={presentation.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          data-pixel-source
          onCanPlay={() => setVideoReady(true)}
          onError={(event) => {
            if (process.env.NODE_ENV !== 'production') {
              const media = event.currentTarget;
              console.warn('[ChapterBackground] media fallback', {
                chapterId: presentation.chapterId,
                asset: media.currentSrc,
                mediaErrorCode: media.error?.code ?? null,
                readyState: media.readyState,
                networkState: media.networkState,
              });
            }
            setVideoReady(false);
            setVideoFailed(true);
          }}
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
