'use client';

import { useState } from 'react';
import { useBackgroundMotionAllowed } from '../../hooks/useBackgroundMotionAllowed';
import { useVideoVisibility } from '../../lib/useVideoVisibility';

export default function SynthomaMediaLayer({ src, poster, className = '', children }: { src?: string | undefined; poster?: string | undefined; className?: string; children?: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  const motionAllowed = useBackgroundMotionAllowed();
  const videoRef = useVideoVisibility();

  return (
    <div className={`synthoma-media-layer ${className}`.trim()} aria-hidden="true">
      <div className="synthoma-media-layer__fallback" style={poster ? { backgroundImage: `url("${poster}")` } : undefined} />
      {src && motionAllowed && !failed ? <video ref={videoRef} className="synthoma-media-layer__video" src={src} autoPlay loop muted playsInline preload="metadata" tabIndex={-1} aria-hidden="true" onError={() => setFailed(true)} /> : null}
      {children}
    </div>
  );
}
