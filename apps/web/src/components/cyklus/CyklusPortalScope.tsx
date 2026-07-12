'use client';

import { useEffect, useState, type CSSProperties, type PropsWithChildren } from 'react';

function readDocumentTheme() {
  if (typeof document === 'undefined') return 'synthoma';
  return document.body.dataset.theme || document.documentElement.dataset.theme || 'synthoma';
}

function readDocumentTextScale() {
  if (typeof document === 'undefined') return '1';
  return document.body.style.getPropertyValue('--font-size-multiplier').trim()
    || document.documentElement.style.getPropertyValue('--font-size-multiplier').trim()
    || getComputedStyle(document.documentElement).getPropertyValue('--font-size-multiplier').trim()
    || '1';
}

function readPortalContext() {
  return { theme: readDocumentTheme(), textScale: readDocumentTextScale() };
}

export default function CyklusPortalScope({ children }: PropsWithChildren) {
  const [{ theme, textScale }, setContext] = useState(readPortalContext);

  useEffect(() => {
    const syncContext = () => setContext(readPortalContext());
    syncContext();
    const observer = new MutationObserver(syncContext);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="cyklus-poster-portal"
      data-theme={theme}
      data-cyklus-theme={theme}
      data-cyklus-text-scale={textScale}
      style={{ '--font-size-multiplier': textScale } as CSSProperties}
    >
      {children}
    </div>
  );
}
