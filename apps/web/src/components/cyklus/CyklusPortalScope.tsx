'use client';

import { useEffect, useState, type PropsWithChildren } from 'react';

function readDocumentTheme() {
  if (typeof document === 'undefined') return 'synthoma';
  return document.body.dataset.theme || document.documentElement.dataset.theme || 'synthoma';
}

export default function CyklusPortalScope({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(readDocumentTheme);

  useEffect(() => {
    const syncTheme = () => setTheme(readDocumentTheme());
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="cyklus-poster-portal" data-theme={theme} data-cyklus-theme={theme}>
      {children}
    </div>
  );
}
