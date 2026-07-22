import type { MetadataRoute } from 'next';

type SynthomaManifest = MetadataRoute.Manifest & {
  id: string;
  display_override: string[];
  screenshots: Array<{
    src: string;
    sizes: string;
    type: string;
    form_factor?: 'wide' | 'narrow';
    label: string;
  }>;
};

export default function manifest(): SynthomaManifest {
  return {
    id: '/',
    name: 'SYNTHOMA',
    short_name: 'SYNTHOMA',
    description: 'Interaktivní glitch-noir psychologický svět, knihovna, živý Archiv a diagnostický Cyklus.',
    lang: 'cs',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['fullscreen', 'standalone'],
    orientation: 'any',
    background_color: '#020509',
    theme_color: '#000d1a',
    categories: ['books', 'entertainment', 'games'],
    prefer_related_applications: false,
    icons: [
      { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/pwa-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/pwa-monochrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'monochrome' },
    ],
    shortcuts: [
      { name: 'KNIHOVNA', short_name: 'KNIHOVNA', description: 'Otevřít knihovnu SYNTHOMY', url: '/books', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
      { name: 'ARCHIV', short_name: 'ARCHIV', description: 'Otevřít živý Archiv', url: '/archive', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
      { name: 'CYKLUS', short_name: 'CYKLUS', description: 'Spustit diagnostický Cyklus', url: '/cyklus', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
      { name: 'POKRAČOVAT', short_name: 'POKRAČOVAT', description: 'Vrátit se k poslední rozečtené kapitole', url: '/resume', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
    ],
    screenshots: [
      { src: '/screenshots/pwa-home-wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'Hlavní rozhraní SYNTHOMY' },
      { src: '/screenshots/pwa-reader-wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'Interaktivní čtečka SYNTHOMY' },
      { src: '/screenshots/pwa-archive-wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'Živý Archiv SYNTHOMY' },
    ],
  };
}
