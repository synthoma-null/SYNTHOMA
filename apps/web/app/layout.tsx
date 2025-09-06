import "../src/styles/base.css";
import "../src/styles/components.css";
import "../src/styles/effects.css";
import "../src/styles/themes.css";
import "../src/styles/reader.css";
import ControlPanelClient from "./components/ControlPanelClient";
import GlobalAudioClient from "./components/GlobalAudioClient";
import RetroPixelCanvasClient from "./components/RetroPixelCanvasClient";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "SYNTHOMA",
  description: "Cyberpunková interaktivní čtečka a knihovna.",
  icons: {
    icon: "/assets/favicon.ico",
  },
  metadataBase: new URL("https://synthoma.cz"),
  alternates: {
    canonical: "https://synthoma.cz/",
  },
  openGraph: {
    type: "website",
    url: "https://synthoma.cz/",
    title: "SYNTHOMA",
    description: "Cyberpunková interaktivní čtečka a knihovna.",
    siteName: "SYNTHOMA",
    images: [
      {
        url: "/assets/og-synthoma.jpg",
        width: 1200,
        height: 630,
        alt: "SYNTHOMA – cyberpunková interaktivní čtečka",
      },
    ],
    locale: "cs_CZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "SYNTHOMA",
    description: "Cyberpunková interaktivní čtečka a knihovna.",
    images: ["/assets/og-synthoma.jpg"],
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="cs" data-theme="default">
      <body>
        {/* Retro Arcade pixelation canvas overlay (controlled by CSS vars in themes.css) */}
        <RetroPixelCanvasClient />
        {/* Global background video so it persists across routes */}
        <video className="bg-video" autoPlay muted loop playsInline preload="metadata" aria-hidden>
          <source src="/video/SYNTHOMA1.webm" type="video/webm" />
        </video>
        {children}
        {/* Global Control Panel trigger and container */}
        <div>
          <button id="toggle-panel-btn" aria-expanded="false" aria-controls="control-panel">⚙️</button>
        </div>
        <div id="control-panel" className="control-panel">
          <div className="controls-grid">
            <div className="group">
              <button id="toggle-animations" className="panel-button btn btn-sm" aria-pressed="true">Animace: Zapnuty</button>
              <button id="toggle-glass" className="panel-button btn btn-sm" aria-pressed="false">Sklo: Vypnuto</button>
            </div>
            <div className="group">
              <label>Velikost písma <input id="font-size-slider" type="range" min="0.8" max="1.4" step="0.05" defaultValue="1" /></label>
              <label>Průhlednost/Blur <input id="opacity-slider" type="range" min="0" max="1" step="0.01" defaultValue="0.8" /></label>
            </div>
            <div className="group">
              <button className="theme-button" data-theme="synthoma" aria-pressed="false" aria-label="Switch to Synthoma theme">Synthoma</button>
              <button className="theme-button" data-theme="green-matrix" aria-pressed="false" aria-label="Switch to Green Matrix theme">Green Matrix</button>
              <button className="theme-button" data-theme="neon-hellfire" aria-pressed="false" aria-label="Switch to Neon Hellfire theme">Neon Hellfire</button>
              <button className="theme-button" data-theme="cyber-dystopia" aria-pressed="false" aria-label="Switch to Cyber Dystopia theme">Cyber Dystopia</button>
              <button className="theme-button" data-theme="acid-glitch" aria-pressed="false" aria-label="Switch to Acid Glitch theme">Acid Glitch</button>
              <button className="theme-button" data-theme="retro-arcade" aria-pressed="false" aria-label="Switch to Retro Arcade theme">Retro Arcade</button>
            </div>
            <div className="group">
              <div id="progress-bar-container" className="progress"><div id="progress-bar" /></div>
              <div className="audio-buttons">
                <button id="play-pause-btn" className="btn btn-sm" aria-pressed="false">▶️</button>
                <button id="stop-btn" className="btn btn-sm">⏹️</button>
                <button id="toggle-tts" className="btn btn-sm" aria-pressed="false">TTS: Vypnuto 🔇</button>
              </div>
              <div id="playlist-container" className="playlist" />
            </div>
          </div>
        </div>
        <ControlPanelClient />
        <GlobalAudioClient />
      </body>
    </html>
  );
}
