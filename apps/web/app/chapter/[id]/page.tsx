import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '../../../auth';
import { getChapterCatalogEntry } from '../../../src/content/catalog';
import type { ContentAccess } from '../../../src/content/catalog';
import { getContentAccess } from '../../../src/server/economy';
import { reportRuntimeDatabaseError } from '../../../src/server/runtimeDatabase';
import { getPublicChapterDocument } from '../../../src/server/public-ai/contentService';
import { readChapterDocument } from '../../../src/server/chapters/chapterDocument';
import ChapterAccessGate from './ChapterAccessGate';
import ChapterReaderArticle from './ChapterReaderArticle';

const BASE_URL = 'https://www.synthoma.cz';
const OG_IMAGE = `${BASE_URL}/assets/og-synthoma.jpg`;

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ locale?: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const locale = (await searchParams)?.locale === 'en' ? 'en' : 'cs';
  const chapter = getChapterCatalogEntry(id);
  if (!chapter) notFound();

  const title = `${locale === 'en' ? chapter.titleEn ?? chapter.title : chapter.title} | SYNTHOMA`;
  const teaser = chapter.metadata?.teaser;
  const description = typeof teaser === 'string'
    ? teaser.replace(/^„|"$/g, '').trim()
    : `Kapitola ${chapter.title} z interaktivního glitch-noir příběhu SYNTHOMA.`;
  const canonicalUrl = `${BASE_URL}/chapter/${chapter.id}`;
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: canonicalUrl,
        en: `${canonicalUrl}?locale=en`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      siteName: 'SYNTHOMA',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'SYNTHOMA' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  };
}

export default async function ChapterPage(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ locale?: string }> },
) {
  const { id } = await params;
  const locale = (await searchParams)?.locale === 'en' ? 'en' : 'cs';
  const chapter = getChapterCatalogEntry(id);
  if (!chapter) notFound();

  if (chapter.availability === 'published' && chapter.accessPolicy === 'free') {
    const publicChapter = await getPublicChapterDocument(chapter.id, locale);
    if (!publicChapter?.bodyHtml) notFound();
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Chapter',
      name: publicChapter.title,
      position: (chapter.order ?? 0) + 1,
      author: { '@type': 'Person', name: 'Tomáš Valíček', url: `${BASE_URL}/autor` },
      isPartOf: { '@type': 'Book', name: 'SYNTHOMA-NULL', url: `${BASE_URL}/books` },
      inLanguage: publicChapter.sourceLocale,
      isAccessibleForFree: true,
      wordCount: publicChapter.wordCount,
      dateModified: publicChapter.updatedAt,
      url: publicChapter.canonicalUrl,
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ChapterReaderArticle
          chapter={chapter}
          locale={locale}
          sourceLocale={publicChapter.sourceLocale}
          bodyHtml={publicChapter.bodyHtml}
          publicMachineLinks
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
      contentType: 'chapter',
      contentId: chapter.id,
      state: 'locked',
      reason: 'catalog_error',
      canAccess: false,
      canPurchase: false,
      mnemCost: chapter.mnemCost,
      title: chapter.title,
      purchasePackageIds: chapter.packageIds,
      prerequisiteChapterId: chapter.prerequisiteChapterId ?? null,
    };
    return (
      <ChapterAccessGate
        chapterId={chapter.id}
        chapterTitle={chapter.title}
        access={closedAccess}
        unavailable={false}
        databaseErrorRef={report.correlationId}
      />
    );
  }
  if (access.canAccess) {
    const document = await readChapterDocument(chapter, locale);
    return (
      <ChapterReaderArticle
        chapter={chapter}
        locale={locale}
        sourceLocale={document.sourceLocale}
        bodyHtml={document.bodyHtml}
      />
    );
  }

  return (
    <ChapterAccessGate
      chapterId={chapter.id}
      chapterTitle={chapter.title}
      access={access}
      unavailable={chapter.availability === 'unavailable'}
    />
  );
}
