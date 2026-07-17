import Link from 'next/link';
import { CHAPTER_CATALOG, type ChapterCatalogEntry } from '../../../src/content/catalog';
import { getChapterPresentation } from '../../../src/content/chapterPresentation';
import ChapterBackground from '../../../src/components/reader/ChapterBackground';
import ChapterReadingProgress from '../../../src/components/reader/ChapterReadingProgress';
import ReaderCommandUtilities from '../../../src/components/reader/ReaderCommandUtilities';
import type { ChapterLocale } from '../../../src/server/chapters/chapterDocument';

interface Props {
  chapter: ChapterCatalogEntry;
  locale: ChapterLocale;
  sourceLocale: ChapterLocale;
  bodyHtml: string;
  publicMachineLinks?: boolean;
}

function localizedRoute(chapter: ChapterCatalogEntry, locale: ChapterLocale): string {
  return `${chapter.route}${locale === 'en' ? '?locale=en' : ''}`;
}

export default function ChapterReaderArticle({
  chapter,
  locale,
  sourceLocale,
  bodyHtml,
  publicMachineLinks = false,
}: Props) {
  const published = CHAPTER_CATALOG.filter((entry) => entry.availability === 'published');
  const index = published.findIndex((entry) => entry.id === chapter.id);
  const previous = index > 0 ? published[index - 1] : undefined;
  const next = index >= 0 ? published[index + 1] : undefined;
  const presentation = getChapterPresentation(chapter.id);
  const title = locale === 'en' ? chapter.titleEn ?? chapter.title : chapter.title;

  return (
    <main className="chapter-reader" id="main-content">
      {presentation ? <ChapterBackground presentation={presentation} /> : null}
      <ChapterReadingProgress
        chapterId={chapter.id}
        chapterTitle={title}
        collection={chapter.collection}
        chapterPath={chapter.route}
      />
      <header className="chapter-reader__command-bar">
        <div className="chapter-reader__route-commands">
          <Link className="chapter-reader__command" href="/books">KNIHOVNA</Link>
          {previous ? <Link className="chapter-reader__command" rel="prev" href={localizedRoute(previous, locale)}>PŘEDCHOZÍ</Link> : null}
          {next ? <Link className="chapter-reader__command" rel="next" href={localizedRoute(next, locale)}>DALŠÍ</Link> : null}
        </div>
        <span className="chapter-reader__identity" aria-current="page">
          <span className="chapter-reader__sequence">{String((chapter.order ?? 0) + 1).padStart(2, '0')}</span>
          <span>{title}</span>
        </span>
        <div className="chapter-reader__command-end">
          <Link className="chapter-reader__command" href={`${chapter.route}${locale === 'en' ? '' : '?locale=en'}`} hrefLang={locale === 'en' ? 'cs' : 'en'}>
            {locale === 'en' ? 'CS' : 'EN'}
          </Link>
          <ReaderCommandUtilities articleId="chapter-reader-article" locale={locale} />
        </div>
      </header>

      <article
        className="chapter-reader__article SYNTHOMAREADER choices-shown typewriter-instant"
        id="chapter-reader-article"
        aria-label={title}
        lang={sourceLocale}
        tabIndex={-1}
      >
        <div className="chapter-content" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </article>

      <nav className="chapter-reader__navigation" aria-label={locale === 'en' ? 'Chapter navigation' : 'Navigace kapitolami'}>
        {previous ? (
          <Link rel="prev" href={localizedRoute(previous, locale)}>
            <span>{locale === 'en' ? 'Previous' : 'Předchozí'}</span>
            <strong>{locale === 'en' ? previous.titleEn ?? previous.title : previous.title}</strong>
          </Link>
        ) : <span />}
        {next ? (
          <Link rel="next" href={localizedRoute(next, locale)}>
            <span>{locale === 'en' ? 'Next' : 'Další'}</span>
            <strong>{locale === 'en' ? next.titleEn ?? next.title : next.title}</strong>
          </Link>
        ) : <span />}
      </nav>

      {publicMachineLinks ? (
        <p className="chapter-reader__machine-links">
          <a href={`/ai/${locale}/chapters/${chapter.id}.md`}>MARKDOWN</a>
          {' // '}
          <a href={`/api/public/v1/chapters/${chapter.id}?locale=${locale}`}>JSON</a>
        </p>
      ) : null}
    </main>
  );
}
