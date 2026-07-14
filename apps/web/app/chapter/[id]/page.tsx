import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { getChapterCatalogEntry } from '../../../src/content/catalog';
import type { ContentAccess } from '../../../src/content/catalog';
import { getContentAccess } from '../../../src/server/economy';
import { reportRuntimeDatabaseError } from '../../../src/server/runtimeDatabase';
import { getPublicChapterDocument } from '../../../src/server/public-ai/contentService';
import ChapterAccessGate from './ChapterAccessGate';
import PublicChapterArticle from './PublicChapterArticle';

const BASE_URL = 'https://www.synthoma.cz';
const OG_IMAGE = `${BASE_URL}/assets/og-synthoma.jpg`;

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const chapter = getChapterCatalogEntry(id);
  if (!chapter) notFound();

  const title = `${chapter.title} | SYNTHOMA`;
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
    robots: { index: chapter.accessPolicy === 'free', follow: true },
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
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const chapter = getChapterCatalogEntry(id);
  if (!chapter) notFound();

  if (chapter.availability === 'published' && chapter.accessPolicy === 'free') {
    const publicChapter = await getPublicChapterDocument(chapter.id, 'cs');
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
        <PublicChapterArticle chapter={publicChapter} />
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
  if (access.canAccess) redirect(`/reader?chapter=${encodeURIComponent(chapter.id)}`);

  return (
    <ChapterAccessGate
      chapterId={chapter.id}
      chapterTitle={chapter.title}
      access={access}
      unavailable={chapter.availability === 'unavailable'}
    />
  );
}
