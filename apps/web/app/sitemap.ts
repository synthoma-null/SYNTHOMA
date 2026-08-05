import type { MetadataRoute } from 'next';
import { getPublicArchive } from '../src/server/public-ai/contentService';
import { getPublicCards } from '../src/server/public-ai/contentService';
import { PUBLIC_SITE_URL } from '../src/server/public-ai/config';
import { getManagedContentCatalog } from '../src/server/content/managedContent';

const LAST_MODIFIED = new Date('2026-07-18T00:00:00.000Z');

export const dynamic = 'force-dynamic';

function localized(url: string): Pick<MetadataRoute.Sitemap[number], 'alternates'> {
  return { alternates: { languages: { cs: url, en: `${url}${url.includes('?') ? '&' : '?'}locale=en`, 'x-default': url } } };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const managed = await getManagedContentCatalog();
  const visibleBooks = new Set(managed.books.filter((book) => book.visibility === 'published').map((book) => book.id));
  const staticPages: MetadataRoute.Sitemap = [
    { url: PUBLIC_SITE_URL, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 1.0, ...localized(PUBLIC_SITE_URL) },
    { url: `${PUBLIC_SITE_URL}/books`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9, ...localized(`${PUBLIC_SITE_URL}/books`) },
    { url: `${PUBLIC_SITE_URL}/archive`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8, ...localized(`${PUBLIC_SITE_URL}/archive`) },
    { url: `${PUBLIC_SITE_URL}/autor`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7, ...localized(`${PUBLIC_SITE_URL}/autor`) },
    { url: `${PUBLIC_SITE_URL}/cyklus`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${PUBLIC_SITE_URL}/ai/cs/index.md`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${PUBLIC_SITE_URL}/ai/en/index.md`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${PUBLIC_SITE_URL}/ai/api`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${PUBLIC_SITE_URL}/ai-policy`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${PUBLIC_SITE_URL}/privacy`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${PUBLIC_SITE_URL}/terms`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const chapterPages: MetadataRoute.Sitemap = managed.chapters
    .filter((item) => visibleBooks.has(item.bookId) && item.visibility === 'published' && item.chapter.availability === 'published')
    .map((item) => {
      const ch = item.chapter;
      return ({
      url: `${PUBLIC_SITE_URL}/chapter/${ch.id}`,
      lastModified: item.updatedAt ?? LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: ch.accessPolicy === 'free' ? 0.8 : 0.5,
      alternates: { languages: ch.filenameEn || item.bodyHtmlEn
        ? { cs: `${PUBLIC_SITE_URL}/chapter/${ch.id}`, en: `${PUBLIC_SITE_URL}/chapter/${ch.id}?locale=en`, 'x-default': `${PUBLIC_SITE_URL}/chapter/${ch.id}` }
        : { cs: `${PUBLIC_SITE_URL}/chapter/${ch.id}`, 'x-default': `${PUBLIC_SITE_URL}/chapter/${ch.id}` } },
      });
    });

  const archivePages: MetadataRoute.Sitemap = getPublicArchive('cs').map((entry) => ({
    url: `${PUBLIC_SITE_URL}/archive/${entry.id}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: entry.visibility === 'publicFull' ? 0.6 : 0.4,
    ...localized(`${PUBLIC_SITE_URL}/archive/${entry.id}`),
  }));

  const cardPages: MetadataRoute.Sitemap = [
    { url: `${PUBLIC_SITE_URL}/cards`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    ...getPublicCards('cs').map((card) => ({
      url: card.canonicalUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: card.visibility === 'publicFull' ? 0.6 : 0.4,
      ...localized(card.canonicalUrl),
    })),
  ];

  return [...staticPages, ...chapterPages, ...archivePages, ...cardPages];
}
