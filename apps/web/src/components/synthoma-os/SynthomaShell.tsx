'use client';

import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import SynthomaCommandHeader from './SynthomaCommandHeader';
import SynthomaMobileNavigation from './SynthomaMobileNavigation';

export default function SynthomaShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  if (pathname === '/landing-intro' || pathname === '/cyklus') return children;
  const quiet = pathname === '/reader' || pathname.startsWith('/chapter/');
  const utility = pathname.startsWith('/admin') || pathname === '/game' || pathname.startsWith('/game/');

  return (
    <div className={`synthoma-shell${quiet ? ' synthoma-shell--quiet' : ''}${utility ? ' synthoma-shell--utility' : ''}`}>
      <SynthomaCommandHeader quiet={quiet} />
      <div className="synthoma-shell__content">{children}</div>
      {!quiet && !utility && <SynthomaMobileNavigation />}
    </div>
  );
}
