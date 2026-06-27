"use client";

import { useVideoVisibility } from "../../src/lib/useVideoVisibility";

export default function BgVideo({ src }: { src: string }) {
  const videoRef = useVideoVisibility();
  return (
    <div aria-hidden className="video-background">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="active"
      />
    </div>
  );
}
