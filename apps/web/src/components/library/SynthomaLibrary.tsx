'use client';

import { useEffect, useMemo, useState } from 'react';
import SynthomaMediaLayer from '../synthoma-os/SynthomaMediaLayer';
import LibraryCollectionHeader from './LibraryCollectionHeader';
import LibraryChapterList from './LibraryChapterList';
import LibraryResume from './LibraryResume';
import LibraryCoverDialog from './LibraryCoverDialog';
import LibraryCollectionGrid from './LibraryCollectionGrid';
import { getResumeChapter, useLibraryProgress } from '../../lib/synthoma/library/useLibraryProgress';
import type { LibraryCatalog, LibraryChapter } from '../../lib/synthoma/library/libraryTypes';
import ChapterLockModal from '../../../app/components/ChapterLockModal';
import { useAccess } from '../access/AccessProvider';
import { useLang } from '../../lib/LangContext';
import { formatCollectionCount } from '../../lib/synthoma/library/libraryGrammar';

export interface SynthomaLibraryProps {
  catalog: LibraryCatalog;
}

export default function SynthomaLibrary({ catalog }: SynthomaLibraryProps) {
  const { t, lang } = useLang();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [coverSlug, setCoverSlug] = useState<string | null>(null);
  const [lockedChapter, setLockedChapter] = useState<LibraryChapter | null>(null);
  const progress = useLibraryProgress(catalog.collections);
  const { resolve, getCachedAccess } = useAccess();

  useEffect(() => {
    const requests = catalog.collections.flatMap((collection) =>
      collection.chapters.map((chapter) => ({ contentType: 'chapter' as const, contentId: chapter.id })),
    );
    if (requests.length) void resolve(requests);
  }, [catalog.collections, resolve]);

  const effectiveCatalog = useMemo<LibraryCatalog>(() => ({
    collections: catalog.collections.map((collection) => {
      const chapters = collection.chapters.map((chapter) => {
        const access = getCachedAccess('chapter', chapter.id);
        return access ? { ...chapter, access: access.state } : chapter;
      });
      return {
        ...collection,
        chapters,
        availableCount: chapters.filter((chapter) => chapter.access === 'free' || chapter.access === 'owned').length,
      };
    }),
  }), [catalog.collections, getCachedAccess]);

  const selected = useMemo(() => {
    if (!selectedSlug) return null;
    return effectiveCatalog.collections.find((c) => c.slug === selectedSlug) ?? null;
  }, [selectedSlug, effectiveCatalog.collections]);

  const cover = useMemo(() => {
    if (!coverSlug) return null;
    return effectiveCatalog.collections.find((c) => c.slug === coverSlug) ?? null;
  }, [coverSlug, effectiveCatalog.collections]);

  const resume = useMemo(() => {
    const found = getResumeChapter(effectiveCatalog.collections, progress.byCollection);
    return found ? { collection: found.collection, chapter: found.chapter, percent: progress.byCollection[found.collection.slug]?.percent ?? 0 } : null;
  }, [effectiveCatalog.collections, progress.byCollection]);

  return (
    <main className="synthoma-library" id="main-content">
      <SynthomaMediaLayer src="/video/SYNTHOMA7.webm" className="synthoma-library__media" />
      <div className="synthoma-library__content">
        <header className="synthoma-library__header">
          <span className="os-status__code">{t('home.library.title').toLocaleUpperCase()} {'//'} {t('books.available').toLocaleUpperCase()}</span>
          <h1 className="synthoma-library__title">
            {t('books.collections.available')}: {formatCollectionCount(catalog.collections.length, lang)}
          </h1>
        </header>

        {resume && !selected && (
          <LibraryResume
            collection={resume.collection}
            chapter={resume.chapter}
            percent={resume.percent}
          />
        )}

        {!selected ? (
          <LibraryCollectionGrid
            collections={effectiveCatalog.collections}
            progress={progress}
            onSelect={setSelectedSlug}
          />
        ) : (
          <section className="synthoma-library__collection-detail">
            <LibraryCollectionHeader
              collection={selected}
              onBack={() => setSelectedSlug(null)}
              onCoverClick={() => setCoverSlug(selected.slug)}
            />
            <LibraryChapterList
              collection={selected}
              progressByChapterId={progress.byChapterId}
              onLockedClick={setLockedChapter}
            />
          </section>
        )}
      </div>
      {lockedChapter && (
        <ChapterLockModal
          chapterId={lockedChapter.id}
          chapterTitle={lockedChapter.title}
          onClose={() => setLockedChapter(null)}
          onPurchased={() => setLockedChapter(null)}
        />
      )}
      {cover && (
        <LibraryCoverDialog
          collection={cover}
          onClose={() => setCoverSlug(null)}
          onEnter={selectedSlug ? undefined : () => { setSelectedSlug(cover.slug); setCoverSlug(null); }}
        />
      )}
    </main>
  );
}
