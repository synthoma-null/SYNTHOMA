import "../src/styles/base.css";
import "../src/styles/components.css";
import "../src/styles/components-dialog.css";
import "../src/styles/components-choice.css";
import "../src/styles/effects.css";
import "../src/styles/themes.css";
import "../src/styles/synthoma-os/index.css";
import "../src/styles/synthoma-wordmark.css";
import "../src/styles/reader.css";
import "../src/styles/book-reader-base.css";
import "../src/styles/auth.css";
import "../src/styles/profile.css";
import "../src/styles/paywall.css";
import "../src/styles/game.css";
import "../src/styles/game-v1.css";
import "../src/styles/cyklus.css";
import "../src/styles/control-panel-os.css";
import "../src/styles/audio-panel.css";
import "../src/styles/motion-contract.css";
import "../src/styles/pwa.css";

import GlobalAudioClient from "./components/GlobalAudioClient";
import SynthomaAudioPanel from "./components/SynthomaAudioPanel";

import RetroPixelCanvasClient from "./components/RetroPixelCanvasClient";
import ControlCenterClient from "./components/ControlCenterClient";

import ScrollGuardClient from "./components/ScrollGuardClient";

import MBTIProviderClient from "./components/MBTIProviderClient";

import SessionProviderClient from "./components/SessionProviderClient";

import SubjectProfilePanelClient from "./components/SubjectProfilePanelClient";
import WhisperFloat from "../src/components/whispers/WhisperFloat";

import CookieConsent from "../src/components/consent/CookieConsent";
import SynthomaShell from "../src/components/synthoma-os/SynthomaShell";
import SynthomaSkipLink from "../src/components/synthoma-os/SynthomaSkipLink";
import SynthomaPortalRoot from "../src/components/synthoma-os/SynthomaPortalRoot";
import { HeaderProvider } from "../src/components/synthoma-os/HeaderContext";

import MBTIHudClient from "./components/MBTIHudClient";

import { LangProvider } from "../src/lib/LangContext";
import { AccessProvider } from "../src/components/access/AccessProvider";


import PwaProvider from "../src/components/pwa/PwaProvider";
import UiPreferencesRuntime from "../src/components/preferences/UiPreferencesRuntime";
import { UI_PREFERENCE_BOOTSTRAP } from "../src/lib/uiPreferenceBootstrap";
import { SYNTHOMA_DESCRIPTOR } from "../src/lib/publicMetadata";
import { SYNTHOMA_ASSETS } from "../src/lib/brandAssets";
import FirstVisitRedirectClient from "./components/FirstVisitRedirectClient";

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";

import type { PropsWithChildren } from "react";



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

  description: SYNTHOMA_DESCRIPTOR.cs,

  icons: {

    icon: SYNTHOMA_ASSETS.favicon,

    apple: SYNTHOMA_ASSETS.generated.appleTouchIcon180,

  },

  manifest: "/manifest.webmanifest",

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

    description: SYNTHOMA_DESCRIPTOR.cs,

    siteName: "SYNTHOMA",

    images: [

      {

        url: SYNTHOMA_ASSETS.openGraph,

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

    description: SYNTHOMA_DESCRIPTOR.cs,

    images: [SYNTHOMA_ASSETS.openGraph],

  },

};

export const generateViewport = (): Viewport => ({
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000d1a" },
    { media: "(prefers-color-scheme: light)", color: "#000d1a" },
  ],
});

function buildSiteJsonLd(locale: 'cs' | 'en') { return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.synthoma.cz/#website",
      "name": "SYNTHOMA",
      "url": "https://www.synthoma.cz",
      "inLanguage": ["cs", "en"],
      "description": SYNTHOMA_DESCRIPTOR[locale],
    },
    {
      "@type": "CreativeWorkSeries",
      "@id": "https://www.synthoma.cz/#series",
      "name": "SYNTHOMA",
      "url": "https://www.synthoma.cz",
      "author": { "@id": "https://www.synthoma.cz/#author" },
      "inLanguage": ["cs", "en"],
      "genre": ["Cyberpunk", "Interactive Fiction", "Glitch Noir"],
      "isAccessibleForFree": true,
      "image": "https://www.synthoma.cz/assets/og-synthoma.png",
      "hasPart": [
        { "@type": "Book", "name": "SYNTHOMA-NULL", "url": "https://www.synthoma.cz/books" },
        { "@type": "CollectionPage", "name": "Archiv SYNTHOMA", "url": "https://www.synthoma.cz/archive" },
        { "@type": "Game", "name": "Cyklus", "url": "https://www.synthoma.cz/cyklus" }
      ]
    },
    {
      "@type": "Person",
      "@id": "https://www.synthoma.cz/#author",
      "name": "Tomáš Valíček",
      "alternateName": "WalliCzech",
      "url": "https://www.synthoma.cz/autor"
    }
  ]
}; }



export default async function RootLayout({ children }: PropsWithChildren) {

  const requestHeaders = await headers();
  const initialLang = requestHeaders.get('x-synthoma-locale') === 'en' ? 'en' : 'cs';
  const jsonLd = buildSiteJsonLd(initialLang);

  return (

    <html lang={initialLang} data-theme="synthoma" suppressHydrationWarning>

      <head>

        <Script
          id="synthoma-ui-preferences-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: UI_PREFERENCE_BOOTSTRAP }}
        />

        <link rel="service-desc" type="application/vnd.oai.openapi+json" href="/api/public/openapi.json" />

        <link rel="alternate" type="application/json" href="/api/public/v1/cyklus/rules" />

        <link rel="help" href="/ai/api" />

        <script

          type="application/ld+json"

          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}

        />

      </head>

      <body suppressHydrationWarning>

        <UiPreferencesRuntime />

        <SynthomaSkipLink label={initialLang === 'en' ? 'Skip to content' : 'Přeskočit na obsah'} />

        <noscript>

          <div className="noscript-fallback">

            <h1>SYNTHOMA</h1>

            <p>{initialLang === 'en' ? 'The interactive novel, card game and living archive require JavaScript for the full experience.' : 'Interaktivní román, karetní hra a živý archiv vyžadují JavaScript pro plný zážitek.'}</p>

            <p>{initialLang === 'en' ? <>Enable JavaScript or visit the <a href="/books?locale=en">library</a> for static content.</> : <>Zapněte JavaScript nebo navštivte <a href="/books">knihovnu</a> pro statický obsah.</>}</p>

          </div>

        </noscript>

        <SessionProviderClient>

        <LangProvider initialLang={initialLang}>
        <FirstVisitRedirectClient />

        <AccessProvider>

        <PwaProvider>

        <MBTIProviderClient>

          {/* Retro Arcade pixelation canvas overlay (controlled by CSS vars in themes.css) */}

          <RetroPixelCanvasClient />

          <HeaderProvider>
            <SynthomaShell>
              <div id="main-content">{children}</div>
            </SynthomaShell>
          </HeaderProvider>

          <SynthomaPortalRoot>

          <ControlCenterClient />

          <SynthomaAudioPanel />

          <SubjectProfilePanelClient />

          </SynthomaPortalRoot>

          <GlobalAudioClient />

          <ScrollGuardClient />

          <DebugPanel />

          {/* MBTI HUD (fixed, non-intrusive) */}

          <MBTIHudClient />

          <WhisperFloat />

          <CookieConsent />

        </MBTIProviderClient>

        </PwaProvider>

        </AccessProvider>

        </LangProvider>

        </SessionProviderClient>

      </body>

    </html>

  );

}

