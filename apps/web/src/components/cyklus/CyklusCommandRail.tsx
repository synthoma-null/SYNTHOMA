'use client';

import type { ReactNode } from 'react';

interface CyklusCommandRailProps {
  pocketControl?: ReactNode;
}

export default function CyklusCommandRail({ pocketControl }: CyklusCommandRailProps) {
  if (!pocketControl) return null;

  return (
    <div
      className="cyklus-game-header cyklus-game-header--context"
      data-testid="cyklus-command-rail"
      role="toolbar"
      aria-label="Kontextové ovládání Cyklu"
    >
      {pocketControl}
    </div>
  );
}
