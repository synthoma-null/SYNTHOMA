"use client";

import { useVideoVisibility } from "../../src/lib/useVideoVisibility";
import { useBackgroundMotionAllowed } from '../../src/hooks/useBackgroundMotionAllowed';

export default function BgVideo({ src }: { src: string }) {
  const videoRef = useVideoVisibility();
  const motionAllowed = useBackgroundMotionAllowed();
  return (
    <div aria-hidden className="video-background">
      {motionAllowed ? <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="active"
      /> : null}
    </div>
  );
}
