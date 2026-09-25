'use client';

import Link from 'next/link';
import type { LibraryChapter, LibraryCollection } from '../../lib/synthoma/library/libraryTypes';
import { useLang } from '../../lib/LangContext';

export interface LibraryResumeProps {
  collection: LibraryCollection;
  chapter: LibraryChapter;
  percent: number;
}

export default function LibraryResume({ collection, chapter, percent }: LibraryResumeProps) {
  const { t, lang } = useLang();
  const index = collection.chapters.findIndex((item) => item.id === chapter.id);
  const next = collection.chapters[index + 1];
  const target = percent >= 100 && next && ['free', 'owned'].includes(next.access) ? next : chapter;
  const href = `/chapter/${encodeURIComponent(target.id)}${lang === 'en' ? '?locale=en' : ''}`;
  return (
    <section className="library-resume os-surface" aria-label={t('books.resume.aria')}>
      <div className="library-resume__meta">
        <span className="os-status__code">RESUME // {collection.title}</span>
        <h2 className="library-resume__title">{chapter.title}</h2>
        <span className="library-resume__percent">{Math.max(0, Math.min(100, Math.round(percent)))}%</span>
      </div>
      <Link className="os-command" href={href}>
        <span className="os-command__label">{target !== chapter ? (lang === 'en' ? 'NEXT CHAPTER' : 'DALŠÍ KAPITOLA') : percent >= 100 ? (lang === 'en' ? 'READ AGAIN' : 'ČÍST ZNOVU') : t('action.continue')}</span>
      </Link>
    </section>
  );
}
