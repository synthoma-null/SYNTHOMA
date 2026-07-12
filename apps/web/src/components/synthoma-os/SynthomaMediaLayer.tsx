'use client';

import { useEffect, useRef, useState } from 'react';

export default function SynthomaMediaLayer({ src, className = '' }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    videoRef.current?.pause();
  }, []);

  return (
    <div className={`synthoma-media-layer ${className}`.trim()} aria-hidden="true">
      <div className="synthoma-media-layer__fallback" />
      {!failed && <video ref={videoRef} className="synthoma-media-layer__video" src={src} autoPlay loop muted playsInline preload="metadata" tabIndex={-1} aria-hidden="true" onError={() => setFailed(true)} />}
    </div>
  );
}
