'use client';

import { useMemo, useState } from 'react';
import SynthomaMediaLayer from '../synthoma-os/SynthomaMediaLayer';
import LibraryCollectionHeader from './LibraryCollectionHeader';
import LibraryChapterList from './LibraryChapterList';
import LibraryResume from './LibraryResume';
import { getResumeChapter, useLibraryProgress } from '../../lib/synthoma/library/useLibraryProgress';
import type { LibraryCatalog, LibraryChapter } from '../../lib/synthoma/library/libraryTypes';
import ChapterLockModal from '../../../app/components/ChapterLockModal';

export interface SynthomaLibraryProps {
  catalog: LibraryCatalog;
}

export default function SynthomaLibrary({ catalog }: SynthomaLibraryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [lockedChapter, setLockedChapter] = useState<LibraryChapter | null>(null);
  const progress = useLibraryProgress(catalog.collections);

  const selected = useMemo(() => {
    if (!selectedSlug) return null;
    return catalog.collections.find((c) => c.slug === selectedSlug) ?? null;
  }, [selectedSlug, catalog.collections]);

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
          <section className="synthoma-library__collections" aria-label="Seznam sbírek">
            {catalog.collections.map((col) => {
              const progressRecord = progress.byCollection[col.slug];
              return (
                <button
                  key={col.slug}
                  className="library-collection-card os-surface"
                  type="button"
                  onClick={() => setSelectedSlug(col.slug)}
                  aria-label={`Otevřít sbírku ${col.title}`}
                >
                  <div className="library-collection-card__cover">
                    {col.cover ? (
                      <img src={col.cover} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <div className="library-collection-card__cover-placeholder" aria-hidden="true" />
                    )}
                  </div>
                  <div className="library-collection-card__body">
                    <h2 className="library-collection-card__title">{col.title}</h2>
                    <p className="library-collection-card__status">
                      {col.availableCount} / {col.totalCount} kapitol
                    </p>
                    {progressRecord ? (
                      <p className="library-collection-card__resume">
                        pokračovat {Math.round(progressRecord.percent)}%
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </section>
        ) : (
          <section className="synthoma-library__collection-detail">
            <LibraryCollectionHeader collection={selected} onBack={() => setSelectedSlug(null)} />
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
    </main>
  );
}
