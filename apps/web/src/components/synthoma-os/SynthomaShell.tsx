'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type PropsWithChildren } from 'react';
import SynthomaCommandHeader from './SynthomaCommandHeader';
import SynthomaMobileNavigation from './SynthomaMobileNavigation';
import { useHeader, type HeaderMode } from './HeaderContext';

function getHeaderMode(pathname: string): HeaderMode {
  if (pathname === '/landing-intro') return 'site';
  if (pathname === '/reader' || pathname.startsWith('/chapter/') || pathname === '/autor') return 'reader';
  if (pathname.startsWith('/cyklus')) return 'cyklus';
  if (pathname.startsWith('/admin') || pathname === '/game' || pathname.startsWith('/game/')) return 'utility';
  return 'site';
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

  return (
    <div className={`synthoma-shell${quiet ? ' synthoma-shell--quiet' : ''}${utility ? ' synthoma-shell--utility' : ''}${cyklus ? ' synthoma-shell--cyklus' : ''}${cyklusGame ? ' synthoma-shell--cyklus-game' : ''}`}>
      <div className="synthoma-shell__content">{children}</div>
      {!cyklus && <SynthomaCommandHeader />}
      {!quiet && !utility && !cyklus && <SynthomaMobileNavigation />}
    </div>
  );
}
