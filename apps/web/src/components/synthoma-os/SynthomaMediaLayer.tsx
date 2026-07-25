'use client';

import { useState } from 'react';
import { useBackgroundMotionAllowed } from '../../hooks/useBackgroundMotionAllowed';

export default function SynthomaMediaLayer({ src, poster, className = '', children }: { src: string; poster?: string; className?: string; children?: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  const motionAllowed = useBackgroundMotionAllowed();

  return (
    <div className={`synthoma-media-layer ${className}`.trim()} aria-hidden="true">
      <div className="synthoma-media-layer__fallback" style={poster ? { backgroundImage: `url("${poster}")` } : undefined} />
      {children}
      {motionAllowed && !failed ? <video className="synthoma-media-layer__video" src={src} autoPlay loop muted playsInline preload="metadata" tabIndex={-1} aria-hidden="true" onError={() => setFailed(true)} /> : null}
    </div>
  );
}
