import Link from 'next/link';
import type { PublicChapterDocument } from '../../../src/server/public-ai/contentService';

export default function PublicChapterArticle({ chapter }: { chapter: PublicChapterDocument }) {
  return (
    <main className="story public-chapter-page" id="main-content">
      <article
        aria-label={chapter.title}
        className="story-block public-chapter-article"
        lang={chapter.sourceLocale}
        dangerouslySetInnerHTML={{ __html: chapter.bodyHtml ?? '' }}
      />
      <nav className="public-chapter-navigation" aria-label="Navigace kapitolami">
        {chapter.previousId ? <Link href={`/chapter/${chapter.previousId}${chapter.locale === 'en' ? '?locale=en' : ''}`}>PŘEDCHOZÍ KAPITOLA</Link> : <span />}
        <Link href="/books">KNIHOVNA</Link>
        {chapter.nextId ? <Link href={`/chapter/${chapter.nextId}${chapter.locale === 'en' ? '?locale=en' : ''}`}>DALŠÍ KAPITOLA</Link> : <span />}
      </nav>
      <p className="public-machine-links">
        <a href={`/ai/${chapter.locale}/chapters/${chapter.id}.md`}>MARKDOWN</a>
        {' // '}
        <a href={`/api/public/v1/chapters/${chapter.id}?locale=${chapter.locale}`}>JSON</a>
      </p>
    </main>
  );
}
