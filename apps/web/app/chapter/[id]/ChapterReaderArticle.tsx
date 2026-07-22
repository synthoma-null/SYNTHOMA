import Link from 'next/link';
import { CHAPTER_CATALOG, getBookCollection, type ChapterCatalogEntry } from '../../../src/content/catalog';
import { getChapterPresentation } from '../../../src/content/chapterPresentation';
import ChapterBackground from '../../../src/components/reader/ChapterBackground';
import ChapterReadingProgress from '../../../src/components/reader/ChapterReadingProgress';
import ReaderCommandUtilities from '../../../src/components/reader/ReaderCommandUtilities';
import ReaderDecisionController from '../../../src/components/reader/ReaderDecisionController';
import ChapterRail from '../../../src/components/reader/ChapterRail';
import ReaderDialogController from '../../../src/components/reader/ReaderDialogController';
import ReaderOnboarding from '../../../src/components/reader/ReaderOnboarding';
import { getReaderDecisionContract } from '../../../src/content/readerDecisionCatalog';
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
  const published = CHAPTER_CATALOG.filter((entry) =>
    entry.availability === 'published' && entry.collection === chapter.collection,
  );
  const index = published.findIndex((entry) => entry.id === chapter.id);
  const previous = index > 0 ? published[index - 1] : undefined;
  const next = index >= 0 ? published[index + 1] : undefined;
  const presentation = getChapterPresentation(chapter.id);
  const collection = getBookCollection(chapter.collection);
  const isKonecPodpory = collection?.slug === 'konec-podpory';
  const chapterCode = chapter.ordinal;
  const hasDecisions = getReaderDecisionContract(chapter.id).length > 0;
  const title = locale === 'en' ? chapter.titleEn ?? chapter.displayTitle : chapter.displayTitle;
  const accessibleTitle = locale === 'en' ? chapter.titleEn ?? chapter.fullTitle : chapter.fullTitle;
  const copy = locale === 'en'
    ? { back: 'BACK', library: 'LIBRARY', previous: 'PREVIOUS', next: 'NEXT' }
    : { back: 'ZPĚT', library: 'KNIHOVNA', previous: 'PŘEDCHOZÍ', next: 'DALŠÍ' };

  return (
    <main className="chapter-reader" id="main-content" data-book={collection?.publicId ?? 'synthoma-null'}>
      {collection?.stylesheet ? <link rel="stylesheet" href={collection.stylesheet} /> : null}
      {presentation ? <ChapterBackground presentation={presentation} /> : null}
      <ChapterReadingProgress
        chapterId={chapter.id}
        chapterTitle={title}
        collection={chapter.collection}
        chapterPath={chapter.route}
        hasDecisions={hasDecisions}
      />
      <ChapterRail
        book={collection?.shortTitle ?? collection?.title ?? 'SYNTHOMA'}
        ordinal={chapter.ordinal}
        position={index + 1}
        total={published.length}
      />
      <header className="chapter-reader__command-bar">
        <div className="chapter-reader__route-commands">
          <Link className="chapter-reader__command chapter-reader__back" href={locale === 'en' ? '/books?locale=en' : '/books'}>
            <span className="chapter-reader__back-mobile">{copy.back}</span>
            <span className="chapter-reader__back-desktop">{copy.library}</span>
          </Link>
          <span className="chapter-reader__brand" aria-hidden="true">SYNTHOMA</span>
          {previous ? <Link className="chapter-reader__command" rel="prev" href={localizedRoute(previous, locale)}>{copy.previous}</Link> : null}
          {next ? <Link className="chapter-reader__command" rel="next" href={localizedRoute(next, locale)}>{copy.next}</Link> : null}
        </div>
        <span className="chapter-reader__identity" aria-current="page">
          <span className="chapter-reader__identity-meta">{collection?.shortTitle ?? collection?.title ?? 'SYNTHOMA'} · <span className="chapter-reader__sequence">{chapter.ordinal}</span></span>
          <span className="chapter-reader__identity-title">{title}</span>
        </span>
        <div className="chapter-reader__command-end">
          {chapter.filenameEn ? (
            <Link className="chapter-reader__command" href={`${chapter.route}${locale === 'en' ? '' : '?locale=en'}`} hrefLang={locale === 'en' ? 'cs' : 'en'}>
              {locale === 'en' ? 'CS' : 'EN'}
            </Link>
          ) : null}
          <ReaderCommandUtilities
            articleId="chapter-reader-article"
            locale={locale}
            chapterId={chapter.id}
            collection={chapter.collection}
            hasDecisions={hasDecisions}
          />
        </div>
      </header>

      <article
        className="chapter-reader__article SYNTHOMAREADER choices-shown typewriter-instant"
        id="chapter-reader-article"
        aria-label={accessibleTitle}
        lang={sourceLocale}
        tabIndex={-1}
      >
        <div
          className={`chapter-content reader-decisions-pending${isKonecPodpory ? ' kp-chapter' : ''}`}
          id="chapter-reader-decisions"
          data-book={isKonecPodpory ? 'konec-podpory' : 'synthoma-null'}
          data-chapter={chapterCode}
          data-reader-decisions="pending"
          aria-busy="true"
          {...({ inert: '' } as Record<string, string>)}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        <ReaderDecisionController
          rootId="chapter-reader-decisions"
          chapterId={chapter.id}
          collection={chapter.collection}
          locale={locale}
        />
      </article>
      <ReaderDialogController rootId="chapter-reader-decisions" />
      <ReaderOnboarding locale={locale} />

      <nav className="chapter-reader__navigation" aria-label={locale === 'en' ? 'Chapter navigation' : 'Navigace kapitolami'}>
        {previous ? (
          <Link rel="prev" href={localizedRoute(previous, locale)}>
            <span>{locale === 'en' ? 'Previous' : 'Předchozí'}</span>
            <strong>{locale === 'en' ? previous.titleEn ?? previous.displayTitle : previous.displayTitle}</strong>
          </Link>
        ) : <span />}
        {next ? (
          <Link rel="next" href={localizedRoute(next, locale)}>
            <span>{locale === 'en' ? 'Next' : 'Další'}</span>
            <strong>{locale === 'en' ? next.titleEn ?? next.displayTitle : next.displayTitle}</strong>
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
