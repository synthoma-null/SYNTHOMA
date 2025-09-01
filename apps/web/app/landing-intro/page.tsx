"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.css";

// Standalone Landing + Intro with background videos and simple control panel
// To use: place your MP4/WebM files into `public/landing-intro/` and update the videos array below if needed.

interface VideoSource {
  id: string;
  title: string;
  // Relative to Next.js public/ directory
  sources: {
    src: string; // e.g. "/landing-intro/your-video.mp4"
    type: string; // e.g. "video/mp4"
    label?: string; // e.g. "1080p"
  }[];
}

export default function LandingIntroPage() {
  // Demo list of videos. Replace with your own file names inside `public/landing-intro/`.
  const videos = useMemo<VideoSource[]>(
    () => [
      {
        id: "vid1",
        title: "City Night",
        sources: [
          { src: "/landing-intro/video/video1-1080p.mp4", type: "video/mp4", label: "1080p" },
          { src: "/landing-intro/video/video1-720p.mp4", type: "video/mp4", label: "720p" },
        ],
      },
      {
        id: "vid2",
        title: "Abstract Lights",
        sources: [
          { src: "/landing-intro/video/video2-1080p.mp4", type: "video/mp4", label: "1080p" },
          { src: "/landing-intro/video/video2-720p.mp4", type: "video/mp4", label: "720p" },
        ],
      },
    ],
    []
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sourceIndex, setSourceIndex] = useState(0); // quality/source variant
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showOverlay, setShowOverlay] = useState(true);
  const [theme, setTheme] = useState<"default" | "neon" | "glitch" | "void">("default");
  const [musicOn, setMusicOn] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.4);

  const currentVideo = videos[currentIndex];
  // current source resolved by key on <video> element via `sourceIndex`

  // Apply volume/mute changes
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    if (!isMuted) videoRef.current.volume = volume;
  }, [isMuted, volume]);

  // Music volume/on changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = musicVolume;
    if (musicOn) {
      el.play().catch(() => {/* ignore autoplay blocks until user interacts */});
    } else {
      el.pause();
    }
  }, [musicOn, musicVolume]);

  // Autoplay when source changes
  useEffect(() => {
    if (!videoRef.current) return;
    const el = videoRef.current;
    const play = async () => {
      try {
        if (isPlaying) {
          await el.play();
        } else {
          el.pause();
        }
      } catch (err) {
        // Browser blocked autoplay; keep paused and unmute on user interaction later
        console.warn("Autoplay blocked:", err);
        setIsPlaying(false);
      }
    };
    play();
  }, [currentIndex, sourceIndex, isPlaying]);

  const togglePlay = async () => {
    if (!videoRef.current) return;
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn("Playback error", e);
    }
  };

  const toggleMute = () => setIsMuted((m) => !m);

  const nextVideo = () => {
    setCurrentIndex((i) => (i + 1) % videos.length);
    setSourceIndex(0);
  };

  const prevVideo = () => {
    setCurrentIndex((i) => (i - 1 + videos.length) % videos.length);
    setSourceIndex(0);
  };

  const onSelectQuality = (idx: number) => {
    setSourceIndex(idx);
  };

  return (
    <div className={styles.liRoot} data-theme={theme}>
      {/* Background Video */}
      <video
        key={`${currentVideo.id}-${sourceIndex}`}
        ref={videoRef}
        className={styles.liVideo}
        playsInline
        autoPlay
        loop
        muted={isMuted}
        controls={false}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        {currentVideo.sources.map((s, idx) => (
          <source key={idx} src={s.src} type={s.type} />
        ))}
        {/* Silent fallback in case no video */}
      </video>

      {/* Gradient overlay for readability */}
      <div className={styles.liScrim} />

      {/* Background music element (hidden) */}
      <audio
        ref={audioRef}
        src="/landing-intro/music/background.mp3"
        loop
        preload="metadata"
        aria-hidden
      />

      {/* Intro Content */}
      {showOverlay && (
        <div className={styles.liIntro}>
          <h1>SYNTHOMA</h1>
          <p>Minimalistická intro stránka s videopozadím. Ano, bliká to krásně.</p>
          <div className={styles.liActions}>
            <a className={`${styles.liBtn} ${styles.liPrimary}`} href="#get-started">Začít</a>
            <a className={styles.liBtn} href="#learn-more">Více informací</a>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles.liControls}>
        <div className={styles.liControlsLeft}>
          <button className={styles.liCtl} onClick={prevVideo} title="Předchozí video">⟸</button>
          <div className={styles.liCurrent}>{currentVideo.title}</div>
          <button className={styles.liCtl} onClick={nextVideo} title="Další video">⟹</button>
        </div>
        <div className={styles.liControlsMid}>
          <button className={styles.liCtl} onClick={togglePlay} title={isPlaying ? "Pauza" : "Přehrát"}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className={styles.liCtl} onClick={toggleMute} title={isMuted ? "Zapnout zvuk" : "Ztlumit"}>
            {isMuted ? "🔇" : "🔊"}
          </button>
          <input
            className={styles.liRange}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            onMouseDown={() => !isMuted && videoRef.current && (videoRef.current.muted = false)}
            aria-label="Hlasitost videa"
            title="Hlasitost videa"
          />
          <button
            className={styles.liCtl}
            onClick={() => setMusicOn((m) => !m)}
            title={musicOn ? "Vypnout hudbu" : "Zapnout hudbu"}
            aria-pressed={musicOn ? "true" : "false"}
          >
            {musicOn ? "🎵" : "🎶"}
          </button>
          <input
            className={styles.liRange}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            aria-label="Hlasitost hudby"
            title="Hlasitost hudby"
          />
        </div>
        <div className={styles.liControlsRight}>
          <select
            className={styles.liSelect}
            value={sourceIndex}
            onChange={(e) => onSelectQuality(parseInt(e.target.value, 10))}
            title="Kvalita"
          >
            {currentVideo.sources.map((s, idx) => (
              <option key={idx} value={idx}>
                {s.label ?? `Zdroj ${idx + 1}`}
              </option>
            ))}
          </select>
          <select
            className={styles.liSelect}
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            title="Motiv"
            aria-label="Motiv stránky"
          >
            <option value="default">Default</option>
            <option value="neon">Neon</option>
            <option value="glitch">Glitch</option>
            <option value="void">Void</option>
          </select>
          <button className={styles.liCtl} onClick={() => setShowOverlay((v) => !v)} title="Zobrazit/skrýt intro">
            {showOverlay ? "🖼️" : "🗔"}
          </button>
        </div>
      </div>

      {/* Anchor targets just to avoid 404 on example links */}
      <div id="get-started" className={styles.liSpacer} />
      <div id="learn-more" className={styles.liSpacer} />
    </div>
  );
}
