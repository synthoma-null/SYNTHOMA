'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { readLastChapterPath } from '../../src/lib/readerState';
import { useVideoVisibility } from '../../src/lib/useVideoVisibility';
import { getChapterById } from '../../src/content/booksManifest';

// Dynamic import to avoid SSR issues with useSearchParams
const ReaderContent = dynamic(
  () => import('./ReaderContent'),
  { 
    loading: () => (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl">Načítání čtečky...</div>
      </div>
    ),
    ssr: false
  }
);

export default function ReaderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultUrl = "/books/SYNTHOMA-NULL/0-∞ [RESTART].html";
  const chapterPath = useMemo(() => searchParams?.get('u') || defaultUrl, [searchParams]);
  const [bgSrc, setBgSrc] = useState<string>("");
  const videoRef = useVideoVisibility();

  // If no ?u is provided, try to continue from lastChapterPath stored in localStorage
  useEffect(() => {
    try {
      const hasU = !!searchParams?.get('u');
      if (hasU) return;
      const last = readLastChapterPath();
      if (last) {
        router.replace(`/reader?u=${encodeURIComponent(last)}`);
      }
    } catch {}
  // run only on mount / when searchParams updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Load backgroundVideo for current chapter from manifest.json
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/books/manifest.json', { cache: 'no-store' });
        if (!res.ok) return;
        const manifest = await res.json();
        // Map /api/chapter/<id> to the corresponding /books/<collection>/<filename> path
        // so manifest.json can resolve backgroundVideo for the new API chapter URLs.
        const apiMatch = chapterPath.match(/^\/api\/chapter\/([^/?]+)/);
        const manifestPath = (() => {
          if (apiMatch) {
            const chapter = getChapterById(decodeURIComponent(apiMatch[1] ?? ''));
            if (chapter) return `/books/${chapter.collection}/${chapter.filename}`;
          }
          return chapterPath;
        })();
        // Extract bookId from chapterPath: /books/<bookId>/...
        const m = manifestPath.match(/^\/books\/([^\/]+)\//);
        const bookId = m ? decodeURIComponent(String(m[1] ?? '')) : '';
        const col = (manifest?.collections || []).find((c: any) => (c.slug || '').toLowerCase() === (bookId || '').toLowerCase());
        const ch = col?.chapters?.find((x: any) => x.path === manifestPath);
        const src = (ch?.backgroundVideo || '').trim();
        if (!cancelled) setBgSrc(src);
      } catch {
        /* ignore */
      }
    })();
    return () => { cancelled = true; };
  }, [chapterPath]);

  return (
    <div className={`glitch-bg reader-page ${!bgSrc ? 'no-video-bg' : ''}`.trim()}>
      {/* Background video layer (source driven by manifest.json) */}
      {bgSrc ? (
        <div aria-hidden className="video-background">
          <video
            ref={videoRef}
            key={bgSrc}
            src={bgSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="active"
            data-pixel-source
          />
        </div>
      ) : null}
      <Suspense fallback={
        <div className="min-h-screen text-white flex items-center justify-center">
          <div className="animate-pulse text-2xl">Příprava čtečky...</div>
        </div>
      }>
        <ReaderContent />
      </Suspense>
    </div>
  );
}
