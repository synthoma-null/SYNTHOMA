import type { ChapterCatalogEntry } from '../../../src/content/catalog';
import type { ChapterLocale } from '../../../src/server/chapters/chapterDocument';
import { PUBLIC_CONTENT_UPDATED_AT } from '../../../src/server/public-ai/config';

const BASE_URL = 'https://www.synthoma.cz';

interface Props {
  chapter: ChapterCatalogEntry;
  locale: ChapterLocale;
  accessibleForFree: boolean;
  wordCount?: number | null;
}

export default function ChapterStructuredData({ chapter, locale, accessibleForFree, wordCount }: Props) {
  const canonical = `${BASE_URL}${chapter.route}${locale === 'en' ? '?locale=en' : ''}`;
  const title = locale === 'en' ? chapter.titleEn ?? chapter.title : chapter.title;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Chapter',
        '@id': `${canonical}#chapter`,
        name: title,
        position: (chapter.order ?? 0) + 1,
        author: { '@type': 'Person', name: 'Tomáš Valíček', url: `${BASE_URL}/autor` },
        isPartOf: { '@type': 'Book', '@id': `${BASE_URL}/books#book`, name: 'SYNTHOMA-NULL', url: `${BASE_URL}/books` },
        inLanguage: locale,
        isAccessibleForFree: accessibleForFree,
        ...(typeof wordCount === 'number' ? { wordCount } : {}),
        dateModified: PUBLIC_CONTENT_UPDATED_AT,
        url: canonical,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'SYNTHOMA', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'SYNTHOMA-NULL', item: `${BASE_URL}/books` },
          { '@type': 'ListItem', position: 3, name: title, item: canonical },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
