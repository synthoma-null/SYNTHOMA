import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const BASE_URL = 'https://www.synthoma.cz';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/books`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/landing-intro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/autor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Generate chapter URLs from manifest
  let chapterPages: MetadataRoute.Sitemap = [];
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'books', 'manifest.json');
    const raw = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);

    for (const collection of manifest?.collections || []) {
      for (const chapter of collection?.chapters || []) {
        if (chapter.path) {
          chapterPages.push({
            url: `${BASE_URL}/reader?u=${encodeURIComponent(chapter.path)}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    // If manifest can't be read, proceed with static pages only
  }

  return [...staticPages, ...chapterPages];
}
