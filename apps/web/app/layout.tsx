import "../src/styles/base.css";
import "../src/styles/components.css";
import "../src/styles/components-dialog.css";
import "../src/styles/components-choice.css";
import "../src/styles/effects.css";
import "../src/styles/themes.css";
import "../src/styles/synthoma-os/index.css";
import "../src/styles/synthoma-wordmark.css";
import "../src/styles/reader.css";
import "../src/styles/auth.css";
import "../src/styles/profile.css";
import "../src/styles/paywall.css";
import "../src/styles/game.css";
import "../src/styles/game-v1.css";
import "../src/styles/cyklus.css";
import "../src/styles/control-panel-os.css";
import "../src/styles/audio-panel.css";

import GlobalAudioClient from "./components/GlobalAudioClient";
import SynthomaAudioPanel from "./components/SynthomaAudioPanel";

import RetroPixelCanvasClient from "./components/RetroPixelCanvasClient";
import ThemeShopClient from "./components/ThemeShopClient";

import ScrollGuardClient from "./components/ScrollGuardClient";

import MBTIProviderClient from "./components/MBTIProviderClient";

import SessionProviderClient from "./components/SessionProviderClient";

import SubjectProfilePanelClient from "./components/SubjectProfilePanelClient";
import WhisperFloat from "../src/components/whispers/WhisperFloat";

import CookieConsent from "../src/components/consent/CookieConsent";
import SynthomaShell from "../src/components/synthoma-os/SynthomaShell";
import SynthomaPortalRoot from "../src/components/synthoma-os/SynthomaPortalRoot";
import { HeaderProvider } from "../src/components/synthoma-os/HeaderContext";

import MBTIHudClient from "./components/MBTIHudClient";

import { LangProvider } from "../src/lib/LangContext";
import LangSwitcher from "../src/components/LangSwitcher";
import { AccessProvider } from "../src/components/access/AccessProvider";


import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

import type { Metadata, Viewport } from "next";

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

  description: "SYNTHOMA je interaktivní psychologický román, diagnostická karetní hra a živý archiv v rozbitém terapeutickém systému.",

  icons: {

    icon: "/assets/favicon.ico",

    apple: "/assets/icon-152x152.png",

  },

  manifest: "/manifest.json",

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

    description: "Interaktivní psychologický román, diagnostická karetní hra a živý archiv v rozbitém terapeutickém systému.",

    siteName: "SYNTHOMA",

    images: [

      {

        url: "/assets/og-synthoma.png",

        width: 1200,

        height: 630,

        alt: "SYNTHOMA — interaktivní román, karetní hra a živý archiv",

      },

    ],

    locale: "cs_CZ",

  },

  twitter: {

    card: "summary_large_image",

    title: "SYNTHOMA",

    description: "Interaktivní psychologický román, diagnostická karetní hra a živý archiv v rozbitém terapeutickém systému.",

    images: ["/assets/og-synthoma.png"],

  },

};

export const generateViewport = (): Viewport => ({
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#0b0b0c" },
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.synthoma.cz/#website",
      "name": "SYNTHOMA",
      "url": "https://www.synthoma.cz",
      "inLanguage": ["cs", "en"],
      "description": "Glitch-noir interaktivní literatura, archiv a diagnostická karetní hra.",
    },
    {
      "@type": "CreativeWorkSeries",
      "@id": "https://www.synthoma.cz/#series",
      "name": "SYNTHOMA",
      "url": "https://www.synthoma.cz",
      "author": { "@type": "Person", "name": "Tomáš Valíček", "url": "https://www.synthoma.cz/autor" },
      "inLanguage": ["cs", "en"],
      "genre": ["Cyberpunk", "Interactive Fiction", "Glitch Noir"],
      "isAccessibleForFree": true,
      "image": "https://www.synthoma.cz/assets/og-synthoma.png",
      "hasPart": [
        { "@type": "Book", "name": "SYNTHOMA-NULL", "url": "https://www.synthoma.cz/books" },
        { "@type": "CollectionPage", "name": "Archiv SYNTHOMA", "url": "https://www.synthoma.cz/archive" },
        { "@type": "Game", "name": "Cyklus", "url": "https://www.synthoma.cz/cyklus" }
      ]
    }
  ]
};



export default function RootLayout({ children }: PropsWithChildren) {

  return (

    <html lang="cs" data-theme="synthoma">

      <head>

        <link rel="service-desc" type="application/vnd.oai.openapi+json" href="/api/public/openapi.json" />

        <link rel="alternate" type="application/json" href="/api/public/v1/cyklus/rules" />

        <link rel="help" href="/ai/api" />

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

            <p>Interaktivní román, karetní hra a živý archiv vyžadují JavaScript pro plný zážitek.</p>

            <p>Zapněte JavaScript nebo navštivte <a href="/books">knihovnu</a> pro statický obsah.</p>

          </div>

        </noscript>

        <SessionProviderClient>

        <LangProvider>

        <AccessProvider>

        <MBTIProviderClient>

          {/* Retro Arcade pixelation canvas overlay (controlled by CSS vars in themes.css) */}

          <RetroPixelCanvasClient />

          <HeaderProvider>
            <SynthomaShell>
              <div id="main-content">{children}</div>
            </SynthomaShell>
          </HeaderProvider>

          {/* Global Control Panel trigger and container */}

          <SynthomaPortalRoot>

          <div id="control-panel" className="control-panel" role="region" aria-labelledby="cp-title" aria-hidden="true">
            <div className="cp-header">
              <div className="cp-heading">
                <span className="cp-kicker">SYS / CTRL</span>
                <h2 id="cp-title" className="cp-title">OVLÁDACÍ PANEL</h2>
                <p className="cp-status">SYNTHOMA OS // USER CHANNEL</p>
              </div>
              <button id="cp-close-btn" className="cp-close" type="button" aria-label="Zavřít ovládací panel">×</button>
            </div>

            <div className="controls-grid">
              <section className="cp-section" aria-labelledby="cp-interface-title">
                <header className="cp-section-header">
                  <span aria-hidden="true">01</span>
                  <h3 id="cp-interface-title">ROZHRANÍ</h3>
                </header>
                <fieldset className="group" aria-label="Nastavení rozhraní">
                  <label className="slider-label">
                    <span className="slider-label-text">Velikost textu</span>
                    <input id="font-size-slider" type="range" min="0.8" max="1.4" step="0.05" defaultValue="1" />
                    <output id="font-size-value" className="slider-value">100%</output>
                  </label>
                  <label className="slider-label">
                    <span className="slider-label-text" id="opacity-slider-label">Průhlednost</span>
                    <input id="opacity-slider" type="range" min="0" max="1" step="0.01" defaultValue="0.8" aria-labelledby="opacity-slider-label" />
                    <output id="opacity-slider-value" className="slider-value">80%</output>
                  </label>
                </fieldset>
              </section>

              <section className="cp-section" aria-labelledby="cp-language-title">
                <header className="cp-section-header">
                  <span aria-hidden="true">02</span>
                  <h3 id="cp-language-title">JAZYK</h3>
                </header>
                <LangSwitcher />
              </section>

              <section className="cp-section cp-section--themes" aria-labelledby="cp-theme-title">
                <header className="cp-section-header">
                  <span aria-hidden="true">03</span>
                  <h3 id="cp-theme-title">MOTIV</h3>
                </header>
                <ThemeShopClient />
              </section>

              <section className="cp-section" aria-labelledby="cp-effects-title">
                <header className="cp-section-header">
                  <span aria-hidden="true">04</span>
                  <h3 id="cp-effects-title">VIZUÁLNÍ EFEKTY</h3>
                </header>
                <div className="cp-btn-col">
                  <button id="toggle-animations" className="panel-button btn btn-sm" aria-pressed="true">Animace: Zapnuty</button>
                  <button id="toggle-glass" className="panel-button btn btn-sm" aria-pressed="false">Sklo: Vypnuto</button>
                </div>
              </section>

              <section className="cp-section" aria-labelledby="cp-accessibility-title">
                <header className="cp-section-header">
                  <span aria-hidden="true">05</span>
                  <h3 id="cp-accessibility-title">PŘÍSTUPNOST</h3>
                </header>
                <button id="toggle-tts" className="panel-button btn btn-sm" aria-pressed="false">Čtení textu: Vypnuto</button>
              </section>
            </div>
          </div>

          <SynthomaAudioPanel />

          <ControlPanelWrapper />

          <SubjectProfilePanelClient />

          </SynthomaPortalRoot>

          <GlobalAudioClient />

          <ScrollGuardClient />

          <ServiceWorkerRegister />

          <DebugPanel />

          {/* MBTI HUD (fixed, non-intrusive) */}

          <MBTIHudClient />

          <WhisperFloat />

          <CookieConsent />

        </MBTIProviderClient>

        </AccessProvider>

        </LangProvider>

        </SessionProviderClient>

      </body>

    </html>

  );

}

