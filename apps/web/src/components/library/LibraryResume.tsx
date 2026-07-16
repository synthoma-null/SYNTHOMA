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
  const { t } = useLang();
  const href = `/chapter/${encodeURIComponent(chapter.id)}`;
  return (
    <section className="library-resume os-surface" aria-label={t('books.resume.aria')}>
      <div className="library-resume__meta">
        <span className="os-status__code">RESUME // {collection.title}</span>
        <h2 className="library-resume__title">{chapter.title}</h2>
        <span className="library-resume__percent">{Math.max(0, Math.min(100, Math.round(percent)))}%</span>
      </div>
      <Link className="os-command" href={href}>
        <span className="os-command__label">{t('action.continue')}</span>
      </Link>
    </section>
  );
}
