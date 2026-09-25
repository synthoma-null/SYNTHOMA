'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { normalizeSearch } from '../../lib/contentSearch';
import { formatCollectionCount } from '../../lib/synthoma/library/libraryGrammar';

export interface SynthomaLibraryProps {
  catalog: LibraryCatalog;
}

export default function SynthomaLibrary({ catalog }: SynthomaLibraryProps) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  useEffect(() => {
    const readSelection = () => setSelectedSlug(new URL(window.location.href).searchParams.get('book'));
    readSelection();
    window.addEventListener('popstate', readSelection);
    return () => window.removeEventListener('popstate', readSelection);
  }, []);
  const selectCollection = (slug: string | null) => {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set('book', slug); else url.searchParams.delete('book');
    window.history.pushState(window.history.state, '', url);
    setSelectedSlug(slug);
  };
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

  const filteredCollections = useMemo(() => effectiveCatalog.collections.map(collection => {
    const term = normalizeSearch(query);
    const bookMatches = normalizeSearch(`${collection.title} ${collection.description ?? ''}`).includes(term);
    const chapters = collection.chapters.filter(chapter => {
      const state = progress.byChapterId[chapter.id];
      const textMatches = !term || bookMatches || normalizeSearch(`${chapter.title} ${chapter.fullTitle ?? ''} ${chapter.summary ?? ''}`).includes(term);
      const statusMatches = filter === 'all' || (filter === 'available' && ['free', 'owned'].includes(chapter.access))
        || (filter === 'reading' && (state?.percent ?? 0) > 0 && !state?.completed && (state?.percent ?? 0) < 100)
        || (filter === 'completed' && (state?.completed || state?.percent === 100));
      return textMatches && statusMatches;
    });
    return { ...collection, chapters };
  }), [effectiveCatalog.collections, query, filter, progress.byChapterId]);
  const matchingCollections = filteredCollections.filter(collection => collection.chapters.length > 0);

  const selected = useMemo(() => {
    if (!selectedSlug) return null;
    return filteredCollections.find((c) => c.slug === selectedSlug) ?? null;
  }, [selectedSlug, filteredCollections]);

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
      <div className="synthoma-library__content">
        <header className="synthoma-library__header">
          <span className="os-status__code">{t('home.library.title').toLocaleUpperCase()} {'//'} {t('books.available').toLocaleUpperCase()}</span>
          <h1 className="synthoma-library__title">
            {t('books.collections.available')}: {formatCollectionCount(catalog.collections.length, lang)}
          </h1>
        </header>

        <div className="content-search">
          <label>{lang === 'en' ? 'Search books, chapters and topics' : 'Hledat knihy, kapitoly a témata'}
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} />
          </label>
          <label>{lang === 'en' ? 'Show' : 'Zobrazit'}
            <select value={filter} onChange={event => setFilter(event.target.value)}>
              <option value="all">{lang === 'en' ? 'All' : 'Vše'}</option>
              <option value="available">{lang === 'en' ? 'Available' : 'Dostupné'}</option>
              <option value="reading">{lang === 'en' ? 'In progress' : 'Rozečtené'}</option>
              <option value="completed">{lang === 'en' ? 'Completed' : 'Dočtené'}</option>
            </select>
          </label>
        </div>
        {matchingCollections.length === 0 && <p role="status">{lang === 'en' ? 'No matches. Try another search or filter.' : 'Nic nenalezeno. Zkus jiné hledání nebo filtr.'}</p>}
        {resume && !selected && (
          <LibraryResume
            collection={resume.collection}
            chapter={resume.chapter}
            percent={resume.percent}
          />
        )}

        {!selected ? (
          <LibraryCollectionGrid
            collections={query || filter !== 'all' ? matchingCollections : effectiveCatalog.collections}
            progress={progress}
            onSelect={selectCollection}
          />
        ) : (
          <section className="synthoma-library__collection-detail">
            <LibraryCollectionHeader
              collection={selected}
              onBack={() => selectCollection(null)}
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
          onEnter={selectedSlug ? undefined : () => { selectCollection(cover.slug); setCoverSlug(null); }}
        />
      )}
    </main>
  );
}
