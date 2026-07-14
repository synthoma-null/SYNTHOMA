import type { MetadataRoute } from 'next';
import { CHAPTER_CATALOG } from '../src/content/catalog';
import { getPublicArchive } from '../src/server/public-ai/contentService';
import { getPublicCards } from '../src/server/public-ai/contentService';
import { PUBLIC_CONTENT_UPDATED_AT, PUBLIC_SITE_URL } from '../src/server/public-ai/config';

const LAST_MODIFIED = new Date(PUBLIC_CONTENT_UPDATED_AT);

function localized(url: string): Pick<MetadataRoute.Sitemap[number], 'alternates'> {
  return { alternates: { languages: { cs: url, en: `${url}${url.includes('?') ? '&' : '?'}locale=en` } } };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: PUBLIC_SITE_URL, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 1.0, ...localized(PUBLIC_SITE_URL) },
    { url: `${PUBLIC_SITE_URL}/books`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9, ...localized(`${PUBLIC_SITE_URL}/books`) },
    { url: `${PUBLIC_SITE_URL}/archive`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8, ...localized(`${PUBLIC_SITE_URL}/archive`) },
    { url: `${PUBLIC_SITE_URL}/autor`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7, ...localized(`${PUBLIC_SITE_URL}/autor`) },
    { url: `${PUBLIC_SITE_URL}/cyklus`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${PUBLIC_SITE_URL}/ai/cs/index.md`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${PUBLIC_SITE_URL}/ai/en/index.md`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${PUBLIC_SITE_URL}/privacy`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${PUBLIC_SITE_URL}/terms`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const chapterPages: MetadataRoute.Sitemap = CHAPTER_CATALOG
    .map((ch) => ({
      url: `${PUBLIC_SITE_URL}/chapter/${ch.id}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: ch.accessPolicy === 'free' ? 0.8 : 0.5,
      ...localized(`${PUBLIC_SITE_URL}/chapter/${ch.id}`),
    }));

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
