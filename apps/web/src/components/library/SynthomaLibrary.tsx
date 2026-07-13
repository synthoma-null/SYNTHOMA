'use client';

import { useMemo, useState } from 'react';
import SynthomaMediaLayer from '../synthoma-os/SynthomaMediaLayer';
import LibraryCollectionHeader from './LibraryCollectionHeader';
import LibraryChapterList from './LibraryChapterList';
import LibraryResume from './LibraryResume';
import LibraryCoverDialog from './LibraryCoverDialog';
import LibraryCollectionGrid from './LibraryCollectionGrid';
import { getResumeChapter, useLibraryProgress } from '../../lib/synthoma/library/useLibraryProgress';
import type { LibraryCatalog, LibraryChapter } from '../../lib/synthoma/library/libraryTypes';
import ChapterLockModal from '../../../app/components/ChapterLockModal';

export interface SynthomaLibraryProps {
  catalog: LibraryCatalog;
}

export default function SynthomaLibrary({ catalog }: SynthomaLibraryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [coverSlug, setCoverSlug] = useState<string | null>(null);
  const [lockedChapter, setLockedChapter] = useState<LibraryChapter | null>(null);
  const progress = useLibraryProgress(catalog.collections);

  const selected = useMemo(() => {
    if (!selectedSlug) return null;
    return catalog.collections.find((c) => c.slug === selectedSlug) ?? null;
  }, [selectedSlug, catalog.collections]);

  const cover = useMemo(() => {
    if (!coverSlug) return null;
    return catalog.collections.find((c) => c.slug === coverSlug) ?? null;
  }, [coverSlug, catalog.collections]);

  const resume = useMemo(() => {
    const found = getResumeChapter(catalog.collections, progress.byCollection);
    return found ? { collection: found.collection, chapter: found.chapter, percent: progress.byCollection[found.collection.slug]?.percent ?? 0 } : null;
  }, [catalog.collections, progress.byCollection]);

  return (
    <main className="synthoma-library" id="main-content">
      <SynthomaMediaLayer src="/video/SYNTHOMA7.webm" className="synthoma-library__media" />
      <div className="synthoma-library__content">
        <header className="synthoma-library__header">
          <span className="os-status__code">LIBRARY // AVAILABLE MEMORY</span>
          <h1 className="synthoma-library__title">K dispozici: {catalog.collections.length} sbírky</h1>
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
            collections={catalog.collections}
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
