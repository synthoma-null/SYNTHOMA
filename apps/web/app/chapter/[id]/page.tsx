import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CHAPTERS, getChapterById } from '../../../src/content/booksManifest';

const BASE_URL = 'https://www.synthoma.cz';
const OG_IMAGE = `${BASE_URL}/assets/og-synthoma.jpg`;

export async function generateStaticParams() {
  return CHAPTERS.map((ch) => ({ id: ch.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const chapter = getChapterById(id);

  if (!chapter) {
    return {
      title: 'SYNTHOMA',
      robots: { index: false, follow: false },
    };
  }

  const title = `${chapter.title} | SYNTHOMA`;
  const description = chapter.teaser
    ? chapter.teaser.replace(/^„|"$/g, '').trim()
    : `Kapitola ${chapter.title} z interaktivního glitch-noir příběhu SYNTHOMA.`;
  const canonicalUrl = `${BASE_URL}/chapter/${id}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: {
      index: chapter.access === 'free',
      follow: true,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      siteName: 'SYNTHOMA',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'SYNTHOMA' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function ChapterPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  redirect(`/reader?chapter=${encodeURIComponent(id)}`);
}
