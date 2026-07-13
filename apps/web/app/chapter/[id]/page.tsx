import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { CHAPTER_CATALOG, getChapterCatalogEntry } from '../../../src/content/catalog';
import { getContentAccess } from '../../../src/server/economy';
import ChapterAccessGate from './ChapterAccessGate';

const BASE_URL = 'https://www.synthoma.cz';
const OG_IMAGE = `${BASE_URL}/assets/og-synthoma.jpg`;

export async function generateStaticParams() {
  return CHAPTER_CATALOG.map((chapter) => ({ id: chapter.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const chapter = getChapterCatalogEntry(id);
  if (!chapter) return { title: 'SYNTHOMA', robots: { index: false, follow: false } };

  const title = `${chapter.title} | SYNTHOMA`;
  const teaser = chapter.metadata?.teaser;
  const description = typeof teaser === 'string'
    ? teaser.replace(/^„|"$/g, '').trim()
    : `Kapitola ${chapter.title} z interaktivního glitch-noir příběhu SYNTHOMA.`;
  const canonicalUrl = `${BASE_URL}/chapter/${chapter.id}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
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

  const session = await auth();
  const access = await getContentAccess(session?.user?.id ?? null, 'chapter', chapter.id);
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
