import "../src/styles/base.css";
import "../src/styles/components.css";
import "../src/styles/effects.css";
import "../src/styles/themes.css";
import "../src/styles/reader.css";
import { tracks } from "../src/data/playlist";
import GlobalAudioClient from "./components/GlobalAudioClient";
import RetroPixelCanvasClient from "./components/RetroPixelCanvasClient";
import ScrollGuardClient from "./components/ScrollGuardClient";
import MBTIProviderClient from "./components/MBTIProviderClient";
import MBTIHudClient from "./components/MBTIHudClient";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

// Client Component wrapper for dynamic ControlPanelClient
function ControlPanelWrapper() {
  "use client";
  const ControlPanelClient = require("./components/ControlPanelClient").default;
  return <ControlPanelClient />;
}

// Dynamic import for debug panel (development only)
const DebugPanel = () => {
  if (process.env.NODE_ENV === 'development') {
    const DebugPanelComp = require('./components/DebugPanel').default;
    return <DebugPanelComp />;
  }
  return null;
};

export const metadata: Metadata = {
  title: "SYNTHOMA",
  description: "Cyberpunková interaktivní čtečka a knihovna",
  icons: {
    icon: "/assets/favicon.ico",
    apple: "/assets/icon-152x152.png",
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#0b0b0c" },
  ],
  metadataBase: new URL("https://www.synthoma.cz"),
  alternates: {
    canonical: "https://www.synthoma.cz/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://www.synthoma.cz/",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "SYNTHOMA",
  "description": "Cyberpunková interaktivní čtečka a knihovna – glitch-noir narativní zážitek.",
  "url": "https://www.synthoma.cz",
  "inLanguage": "cs",
  "genre": ["Cyberpunk", "Interactive Fiction", "Glitch Noir"],
  "isAccessibleForFree": true,
  "image": "https://www.synthoma.cz/assets/og-synthoma.jpg",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="cs" data-theme="synthoma">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Přeskočit na obsah</a>
        <noscript>
          <div className="noscript-fallback">
            <h1>SYNTHOMA</h1>
            <p>Cyberpunková interaktivní čtečka vyžaduje JavaScript pro plný zážitek.</p>
            <p>Zapněte JavaScript nebo navštivte <a href="/books">knihovnu</a> pro statický obsah.</p>
          </div>
        </noscript>
        <MBTIProviderClient>
          {/* Retro Arcade pixelation canvas overlay (controlled by CSS vars in themes.css) */}
          <RetroPixelCanvasClient />
          <div id="main-content">{children}</div>
          {/* Global Control Panel trigger and container */}
          <div>
            <button id="toggle-panel-btn" aria-expanded="false" aria-controls="control-panel">🎛️</button>
          </div>
          <div id="control-panel" className="control-panel" role="region" aria-label="Ovládací panel" aria-hidden="true">
            <div className="controls-grid">
              {/* Sekce: Zobrazení */}
              <fieldset className="group" aria-label="Zobrazení">
                <legend className="panel-section-title">Zobrazení</legend>
                <button id="toggle-animations" className="panel-button btn btn-sm" aria-pressed="true">Animace: Zapnuty</button>
                <button id="toggle-glass" className="panel-button btn btn-sm" aria-pressed="false">Sklo: Vypnuto</button>
              </fieldset>
              {/* Sekce: Nastavení */}
              <fieldset className="group" aria-label="Nastavení zobrazení">
                <legend className="panel-section-title">Nastavení</legend>
                <label className="slider-label">
                  <span className="slider-label-text">Velikost písma</span>
                  <input id="font-size-slider" type="range" min="0.8" max="1.4" step="0.05" defaultValue="1" />
                  <output id="font-size-value" className="slider-value">100%</output>
                </label>
                <label className="slider-label">
                  <span className="slider-label-text" id="opacity-slider-label">Průhlednost</span>
                  <input id="opacity-slider" type="range" min="0" max="1" step="0.01" defaultValue="0.8" aria-labelledby="opacity-slider-label" />
                  <output id="opacity-slider-value" className="slider-value">80%</output>
                </label>
              </fieldset>
              {/* Sekce: Motivy */}
              <fieldset className="group" role="radiogroup" aria-label="Barevný motiv">
                <legend className="panel-section-title">Motivy</legend>
                <button className="theme-button" data-theme="synthoma" aria-pressed="false">Synthoma</button>
                <button className="theme-button" data-theme="green-matrix" aria-pressed="false">Green Matrix</button>
                <button className="theme-button" data-theme="neon-hellfire" aria-pressed="false">Neon Hellfire</button>
                <button className="theme-button" data-theme="cyber-dystopia" aria-pressed="false">Cyber Dystopia</button>
                <button className="theme-button" data-theme="acid-glitch" aria-pressed="false">Acid Glitch</button>
                <button className="theme-button" data-theme="retro-arcade" aria-pressed="false">Retro Arcade</button>
                <button className="theme-button" data-theme="mono" aria-pressed="false">Mono BW</button>
              </fieldset>
              {/* Sekce: Audio */}
              <fieldset className="group" aria-label="Audio přehrávač">
                <legend className="panel-section-title">Audio</legend>
                <div id="progress-bar-container" className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} aria-label="Průběh skladby"><div id="progress-bar" /></div>
                <div className="audio-buttons">
                  <button id="play-pause-btn" className="btn btn-sm" aria-pressed="false" aria-label="Přehrát / Pozastavit">▶️</button>
                  <button id="stop-btn" className="btn btn-sm" aria-label="Zastavit">⏹️</button>
                  <button id="toggle-tts" className="btn btn-sm" aria-pressed="false">TTS: Vypnuto 🔇</button>
                </div>
                <div
                  id="playlist-container"
                  className="playlist"
                  role="list"
                  aria-label="Seznam skladeb"
                >
                  {/* Fallback obsah – bude nahrazen ControlPanelClientem po bootu */}
                  {tracks.map((track, index) => (
                    <a key={index} href="#" data-src={track.src} role="listitem">
                      {track.title}
                    </a>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
          <ControlPanelWrapper />
          <GlobalAudioClient />
          <ScrollGuardClient />
          <ServiceWorkerRegister />
          <DebugPanel />
          {/* MBTI HUD (fixed, non-intrusive) */}
          <MBTIHudClient />
        </MBTIProviderClient>
      </body>
    </html>
  );
}
