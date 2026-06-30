'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { readLastChapterPath } from '../../src/lib/readerState';
import { useVideoVisibility } from '../../src/lib/useVideoVisibility';
import { useLang } from '../../src/lib/LangContext';
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
  const { lang } = useLang();
  const defaultUrl = "/books/SYNTHOMA-NULL/0-∞ [RESTART].html";
  const chapterId = searchParams?.get('chapter') ?? null;
  const legacyU = searchParams?.get('u') ?? null;
  // Resolve chapterPath for manifest/video lookup
  const chapterPath = useMemo(() => {
    if (chapterId) {
      const meta = getChapterById(chapterId);
      if (meta) return `/books/${meta.collection}/${meta.filename}`;
    }
    return legacyU || defaultUrl;
  }, [chapterId, legacyU]);
  const [bgSrc, setBgSrc] = useState<string>("");
  const videoRef = useVideoVisibility();

  // If no chapter params, try to continue from lastChapterPath in localStorage
  useEffect(() => {
    try {
      const hasChapter = !!searchParams?.get('chapter');
      const hasU = !!searchParams?.get('u');
      if (hasChapter || hasU) return;
      const last = readLastChapterPath();
      if (!last) return;
      // lastChapterPath can be /api/chapter/<id> or legacy /books/... URL
      const apiMatch = last.match(/^\/api\/chapter\/([^/?]+)/);
      if (apiMatch) {
        router.replace(`/reader?chapter=${encodeURIComponent(apiMatch[1] ?? '')}`);
      } else {
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
        // chapterPath is always /books/<collection>/<filename> (resolved above from chapterId or legacyU)
        const m = chapterPath.match(/^\/books\/([^\/]+)\//);
        const bookId = m ? decodeURIComponent(String(m[1] ?? '')) : '';
        const col = (manifest?.collections || []).find((c: any) => (c.slug || '').toLowerCase() === (bookId || '').toLowerCase());
        const ch = col?.chapters?.find((x: any) => x.path === chapterPath);
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
        <ReaderContent key={lang} />
      </Suspense>
    </div>
  );
}
