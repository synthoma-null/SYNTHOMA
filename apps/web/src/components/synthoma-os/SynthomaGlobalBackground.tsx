'use client';

import { usePathname } from 'next/navigation';
import { SYNTHOMA_ASSETS } from '../../lib/brandAssets';
import SynthomaMediaLayer from './SynthomaMediaLayer';

type BackgroundConfig = {
  module: string;
  src?: string;
  poster?: string;
};

function getBackground(pathname: string): BackgroundConfig | null {
  if (
    pathname === '/landing-intro'
    || pathname === '/reader'
    || pathname.startsWith('/chapter/')
    || pathname.startsWith('/cyklus')
    || pathname === '/game'
    || pathname.startsWith('/game/')
  ) {
    return null;
  }
  if (pathname.startsWith('/books')) return { module: 'library', src: '/video/SYNTHOMA7.webm', poster: SYNTHOMA_ASSETS.background };
  if (pathname.startsWith('/archive') || pathname.startsWith('/cards')) return { module: 'archive', src: '/video/SYNTHOMA10.webm', poster: SYNTHOMA_ASSETS.background };
  if (pathname.startsWith('/autor')) return { module: 'author', src: '/video/SYNTHOMA12.webm', poster: SYNTHOMA_ASSETS.background };
  return { module: 'node', src: '/video/SYNTHOMA32.webm', poster: SYNTHOMA_ASSETS.background };
}

export default function SynthomaGlobalBackground() {
  const pathname = usePathname() ?? '/';
  const config = getBackground(pathname);
  if (!config) return null;

  return (
    <SynthomaMediaLayer
      src={config.src}
      poster={config.poster}
      className="synthoma-global-background"
    >
      <span className="synthoma-global-background__grid" />
      <span className="synthoma-global-background__noise" />
      <span className="synthoma-global-background__vignette" />
      <span className="synthoma-global-background__scrim" />
    </SynthomaMediaLayer>
  );
}
