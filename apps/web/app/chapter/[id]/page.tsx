import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '../../../auth';
import type { ContentAccess } from '../../../src/content/catalog';
import { getChapterPresentation } from '../../../src/content/chapterPresentation';
import { getContentAccess } from '../../../src/server/economy';
import { reportRuntimeDatabaseError } from '../../../src/server/runtimeDatabase';
import {
  getManagedChapterContext,
  readManagedChapterDocument,
} from '../../../src/server/content/managedContent';
import ChapterAccessGate from './ChapterAccessGate';
import ChapterReaderArticle from './ChapterReaderArticle';
import ChapterStructuredData from './ChapterStructuredData';

const BASE_URL = 'https://www.synthoma.cz';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/og-synthoma.png`;

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ locale?: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const locale = (await searchParams)?.locale === 'en' ? 'en' : 'cs';
  const context = await getManagedChapterContext(id);
  if (!context || context.managed.visibility === 'hidden' || context.book.visibility === 'hidden') notFound();
  const { chapter } = context.managed;
  const collection = context.book;

  const chapterTitle = locale === 'en' ? chapter.titleEn ?? chapter.title : chapter.title;
  const title = `${chapterTitle} | ${collection.title}`;
  const teaser = locale === 'en' ? chapter.metadata?.teaserEn : chapter.metadata?.teaser;
  const englishFallback = collection.publicId === 'synthoma-null'
    ? `Read ${chapterTitle}, a chapter of the interactive psychological novel SYNTHOMA-NULL.`
    : `Read ${chapterTitle}, a chapter of ${collection.title}.`;
  const description = typeof teaser === 'string'
    ? teaser.replace(/^„|"$/g, '').trim()
    : locale === 'en'
      ? englishFallback
      : chapter.summary ?? `Kapitola ${chapter.title} z interaktivního glitch-noir příběhu SYNTHOMA.`;
  const chapterUrl = `${BASE_URL}${chapter.route}`;
  const canonicalUrl = `${chapterUrl}${locale === 'en' ? '?locale=en' : ''}`;
  const presentation = getChapterPresentation(chapter.id);
  const image = presentation
    ? `${chapterUrl}/opengraph-image`
    : DEFAULT_OG_IMAGE;
  const indexable = chapter.availability === 'published';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: chapter.filenameEn || context.managed.bodyHtmlEn
        ? { cs: chapterUrl, en: `${chapterUrl}?locale=en`, 'x-default': chapterUrl }
        : { cs: chapterUrl, 'x-default': chapterUrl },
    },
    robots: { index: indexable, follow: indexable },
    openGraph: {
      type: 'article', url: canonicalUrl, title, description, siteName: 'SYNTHOMA',
      locale: locale === 'en' ? 'en_US' : 'cs_CZ',
      alternateLocale: chapter.filenameEn || context.managed.bodyHtmlEn ? (locale === 'en' ? ['cs_CZ'] : ['en_US']) : undefined,
      images: [{ url: image, alt: `${chapterTitle} — ${collection.title}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function ChapterPage(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ locale?: string }> },
) {
  const { id } = await params;
  const locale = (await searchParams)?.locale === 'en' ? 'en' : 'cs';
  let context;
  try {
    context = await getManagedChapterContext(id);
  } catch (error) {
    const report = reportRuntimeDatabaseError('chapter-page-catalog', error);
    return (
      <main className="story chapter-access-gate" id="main-content">
        <section className="panel glass os-surface">
          <p className="os-status__code">LOG [CHAPTER_CATALOG]</p>
          <h1>Katalog je dočasně nedostupný</h1>
          <p>Obsah zůstává bezpečně uzavřený. Zkus načtení zopakovat.</p>
          <p className="os-status__reference">REF {report.correlationId}</p>
          <a className="btn btn-outline" href="/books">ZPĚT DO KNIHOVNY</a>
        </section>
      </main>
    );
  }
  if (!context || context.managed.visibility === 'hidden' || context.book.visibility === 'hidden') notFound();
  const managed = context.managed;
  const chapter = managed.chapter;
  const collection = context.book;

  if (chapter.availability !== 'published') {
    const unavailableAccess: ContentAccess = {
      contentType: 'chapter', contentId: chapter.id, state: 'unavailable', reason: 'not_published',
      canAccess: false, canPurchase: false, mnemCost: null, title: chapter.title,
      purchasePackageIds: chapter.packageIds, prerequisiteChapterId: chapter.prerequisiteChapterId ?? null,
    };
    return (
      <>
        <ChapterStructuredData chapter={chapter} collection={collection} locale={locale} accessibleForFree={false} />
        <ChapterAccessGate chapterId={chapter.id} chapterTitle={locale === 'en' ? chapter.titleEn ?? chapter.title : chapter.title} access={unavailableAccess} unavailable locale={locale} />
      </>
    );
  }

  if (locale === 'en' && !chapter.filenameEn && !managed.bodyHtmlEn) {
    return (
      <main className="story chapter-access-gate" id="main-content">
        <section className="panel glass os-surface">
          <p className="os-status__code">LOG [TRANSLATION_UNAVAILABLE]</p>
          <h1>{chapter.titleEn ?? chapter.title}</h1>
          <p>English translation is not available yet.</p>
          <a className="btn btn-outline" href={chapter.route}>OPEN CZECH VERSION</a>
        </section>
      </main>
    );
  }

  if (chapter.accessPolicy === 'free') {
    const document = await readManagedChapterDocument(managed, locale).catch(() => null);
    if (!document?.bodyHtml) notFound();
    return (
      <>
        <ChapterStructuredData chapter={chapter} collection={collection} locale={locale} accessibleForFree wordCount={document.wordCount} />
        <ChapterReaderArticle
          chapter={chapter}
          collection={collection}
          collectionChapters={context.chapters}
          locale={locale}
          sourceLocale={document.sourceLocale}
          bodyHtml={document.bodyHtml}
          hasEnglish={Boolean(chapter.filenameEn || managed.bodyHtmlEn)}
          publicMachineLinks={!managed.isCustom && !managed.overridden && !collection.overridden}
        />
      </>
    );
  }

  const session = await auth();
  let access: ContentAccess;
  try {
    access = await getContentAccess(session?.user?.id ?? null, 'chapter', chapter.id);
  } catch (error) {
    const report = reportRuntimeDatabaseError('chapter-page-access', error);
    const closedAccess: ContentAccess = {
      contentType: 'chapter', contentId: chapter.id, state: 'locked', reason: 'catalog_error',
      canAccess: false, canPurchase: false, mnemCost: chapter.mnemCost, title: chapter.title,
      purchasePackageIds: chapter.packageIds, prerequisiteChapterId: chapter.prerequisiteChapterId ?? null,
    };
    return (
      <>
        <ChapterStructuredData chapter={chapter} collection={collection} locale={locale} accessibleForFree={false} />
        <ChapterAccessGate
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          access={closedAccess}
          unavailable={false}
          locale={locale}
          databaseErrorRef={report.correlationId}
        />
      </>
    );
  }

  if (access.canAccess) {
    const document = await readManagedChapterDocument(managed, locale);
    return (
      <>
        <ChapterStructuredData chapter={chapter} collection={collection} locale={locale} accessibleForFree={false} wordCount={document.wordCount} />
        <ChapterReaderArticle
          chapter={chapter}
          collection={collection}
          collectionChapters={context.chapters}
          locale={locale}
          sourceLocale={document.sourceLocale}
          bodyHtml={document.bodyHtml}
          hasEnglish={Boolean(chapter.filenameEn || managed.bodyHtmlEn)}
        />
      </>
    );
  }

  return (
    <>
      <ChapterStructuredData chapter={chapter} collection={collection} locale={locale} accessibleForFree={false} />
      <ChapterAccessGate chapterId={chapter.id} chapterTitle={locale === 'en' ? chapter.titleEn ?? chapter.title : chapter.title} access={access} unavailable={false} locale={locale} />
    </>
  );
}
