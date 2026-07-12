'use client';

import type { PropsWithChildren } from 'react';
import { portalTextScaleStyle, useSynthomaPortalContext } from '../synthoma-os/SynthomaPortalRoot';

export default function CyklusPortalScope({ children }: PropsWithChildren) {
  const context = useSynthomaPortalContext();

  return (
    <div
      className="cyklus-poster-portal"
      data-theme={context.theme}
      data-cyklus-theme={context.theme}
      data-cyklus-text-scale={context.textScale}
      data-synthoma-density={context.density}
      data-synthoma-reduced-effects={String(context.reducedEffects)}
      style={portalTextScaleStyle(context.textScale)}
    >
      {children}
    </div>
  );
}
