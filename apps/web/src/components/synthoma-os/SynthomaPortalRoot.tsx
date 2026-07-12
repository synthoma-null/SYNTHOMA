'use client';

import { useEffect, useState, type CSSProperties, type PropsWithChildren } from 'react';

export interface SynthomaPortalContextValue {
  theme: string;
  textScale: string;
  density: string;
  reducedEffects: boolean;
}

function readContext(): SynthomaPortalContextValue {
  if (typeof document === 'undefined') {
    return { theme: 'synthoma', textScale: '1', density: 'standard', reducedEffects: false };
  }
  const root = document.documentElement;
  const body = document.body;
  const textScale = body.style.getPropertyValue('--font-size-multiplier').trim()
    || root.style.getPropertyValue('--font-size-multiplier').trim()
    || getComputedStyle(root).getPropertyValue('--font-size-multiplier').trim()
    || '1';
  const reducedEffects = body.dataset.reducedEffects === 'true'
    || root.dataset.reducedEffects === 'true'
    || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    || false;
  return {
    theme: body.dataset.theme || root.dataset.theme || 'synthoma',
    textScale,
    density: body.dataset.density || root.dataset.density || 'standard',
    reducedEffects,
  };
}

export function useSynthomaPortalContext() {
  const [context, setContext] = useState(readContext);

  useEffect(() => {
    const sync = () => setContext(readContext());
    const observer = new MutationObserver(sync);
    const options: MutationObserverInit = {
      attributes: true,
      attributeFilter: ['data-theme', 'data-density', 'data-reduced-effects', 'style'],
    };
    observer.observe(document.documentElement, options);
    observer.observe(document.body, options);
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    motion?.addEventListener?.('change', sync);
    sync();
    return () => {
      observer.disconnect();
      motion?.removeEventListener?.('change', sync);
    };
  }, []);

  return context;
}

export function portalTextScaleStyle(textScale: string) {
  return { '--font-size-multiplier': textScale } as CSSProperties;
}

export default function SynthomaPortalRoot({ children }: PropsWithChildren) {
  const context = useSynthomaPortalContext();
  return (
    <div
      className="synthoma-portal-root"
      data-theme={context.theme}
      data-synthoma-theme={context.theme}
      data-synthoma-text-scale={context.textScale}
      data-synthoma-density={context.density}
      data-synthoma-reduced-effects={String(context.reducedEffects)}
      style={portalTextScaleStyle(context.textScale)}
    >
      {children}
    </div>
  );
}
