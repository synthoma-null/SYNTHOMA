'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type PropsWithChildren } from 'react';
import SynthomaCommandHeader from './SynthomaCommandHeader';
import SynthomaFooter from './SynthomaFooter';
import SynthomaGlobalBackground from './SynthomaGlobalBackground';
import SynthomaMobileNavigation from './SynthomaMobileNavigation';
import { useHeader, type HeaderMode } from './HeaderContext';

function getHeaderMode(pathname: string): HeaderMode {
  if (pathname === '/landing-intro') return 'site';
  if (pathname === '/reader' || pathname.startsWith('/chapter/') || pathname === '/autor') return 'reader';
  if (pathname.startsWith('/cyklus')) return 'cyklus';
  if (pathname.startsWith('/admin') || pathname === '/game' || pathname.startsWith('/game/')) return 'utility';
  return 'site';
}

function getModule(pathname: string): string {
  if (pathname.startsWith('/books')) return 'library';
  if (pathname.startsWith('/archive') || pathname.startsWith('/cards')) return 'archive';
  if (pathname === '/reader' || pathname.startsWith('/chapter/')) return 'reader';
  if (pathname.startsWith('/cyklus')) return 'cyklus';
  if (pathname.startsWith('/autor')) return 'author';
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) return 'auth';
  if (pathname.startsWith('/terms') || pathname.startsWith('/privacy')) return 'protocol';
  if (pathname.startsWith('/ai')) return 'public-interface';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'node';
}

export default function SynthomaShell({ children }: PropsWithChildren) {
  const pathname = usePathname() ?? '/';
  const { setMode, reset } = useHeader();

  useEffect(() => {
    if (pathname === '/landing-intro') {
      reset();
      return;
    }
    setMode(getHeaderMode(pathname));
    return () => {
      // reset();
    };
  }, [pathname, setMode, reset]);

  if (pathname === '/landing-intro') return children;

  const quiet = pathname === '/reader' || pathname.startsWith('/chapter/') || pathname === '/autor';
  const utility = pathname.startsWith('/admin') || pathname === '/game' || pathname.startsWith('/game/');
  const cyklus = pathname === '/cyklus' || pathname.startsWith('/cyklus/');
  const cyklusGame = pathname === '/cyklus';
  const reading = pathname === '/reader' || pathname.startsWith('/chapter/');
  const game = pathname === '/game' || pathname.startsWith('/game/');
  const immersive = reading || cyklus || game;

  return (
    <div data-module={getModule(pathname)} className={`synthoma-shell${quiet ? ' synthoma-shell--quiet' : ''}${utility ? ' synthoma-shell--utility' : ''}${cyklus ? ' synthoma-shell--cyklus' : ''}${cyklusGame ? ' synthoma-shell--cyklus-game' : ''}`}>
      <SynthomaGlobalBackground />
      <div className="synthoma-shell__content">{children}</div>
      <SynthomaCommandHeader />
      {!cyklusGame && <SynthomaMobileNavigation />}
      {!immersive && <SynthomaFooter />}
    </div>
  );
}
