import { absolutePublicUrl, PUBLIC_CONTENT_UPDATED_AT, type PublicLocale } from './config';
import type { PublicChapterDocument } from './contentService';
import { getPublicArchive, getPublicAuthor, getPublicBook, getPublicBooks, getPublicChapters } from './contentService';

function frontMatter(values: Record<string, string>): string {
  return ['---', ...Object.entries(values).map(([key, value]) => `${key}: ${JSON.stringify(value)}`), '---', ''].join('\n');
}

export async function siteMarkdown(locale: PublicLocale): Promise<string> {
  const cs = locale === 'cs';
  return `${frontMatter({ id: 'synthoma', locale, status: 'public', canonical: absolutePublicUrl('/'), updatedAt: PUBLIC_CONTENT_UPDATED_AT })}# SYNTHOMA

${cs
    ? 'SYNTHOMA je interaktivni psychologicky roman, diagnosticka karetni hra a zivy archiv uvnitr rozbiteho terapeutickeho systemu.'
    : 'SYNTHOMA is an interactive psychological novel, a diagnostic card game, and a living archive inside a broken therapeutic system.'}

## ${cs ? 'Verejny obsah' : 'Public content'}

- [${cs ? 'Kniha SYNTHOMA-NULL' : 'SYNTHOMA-NULL book'}](${absolutePublicUrl(`/ai/${locale}/books/synthoma-null.md`)})
- [SYNTHOMA: KONEC PODPORY](${absolutePublicUrl(`/ai/${locale}/books/konec-podpory.md`)})
- [${cs ? 'Archiv' : 'Archive'}](${absolutePublicUrl(`/ai/${locale}/archive.md`)})
- [${cs ? 'Autor' : 'Author'}](${absolutePublicUrl(`/ai/${locale}/author.md`)})
- [Cyklus cards](${absolutePublicUrl(`/ai/${locale}/cards/index.md`)})
`;
}

export async function authorMarkdown(locale: PublicLocale): Promise<string> {
  const author = await getPublicAuthor(locale);
  return `${frontMatter({ id: author.id, locale, status: 'public', canonical: author.canonicalUrl, updatedAt: author.updatedAt })}# ${author.title}\n\n${author.markdown}\n`;
}

export async function archiveMarkdown(locale: PublicLocale): Promise<string> {
  const entries = getPublicArchive(locale);
  const sections = entries.map((entry) => {
    const status = entry.visibility === 'publicFull' ? 'public' : 'locked';
    const body = entry.visibility === 'publicFull'
      ? [...(entry.quote ? [`> ${entry.quote}`] : []), ...entry.body].join('\n\n')
      : entry.teaser;
    return `## ${entry.title}\n\n- ID: \`${entry.id}\`\n- Status: ${status}\n- Canonical: ${absolutePublicUrl(`/archive/${entry.id}`)}\n\n${body}`;
  });
  return `${frontMatter({ id: 'archive', locale, status: 'public', canonical: absolutePublicUrl('/archive'), updatedAt: PUBLIC_CONTENT_UPDATED_AT })}# ${locale === 'cs' ? 'Archiv SYNTHOMA' : 'SYNTHOMA Archive'}\n\n${sections.join('\n\n')}\n`;
}

export async function bookMarkdown(locale: PublicLocale, id = 'synthoma-null'): Promise<string | null> {
  const book = await getPublicBook(locale, id);
  if (!book) return null;
  const chapters = book.chapters.map((chapter) => `- [${chapter.title}](${absolutePublicUrl(`/ai/${locale}/chapters/${chapter.id}.md`)}) - ${chapter.status}`).join('\n');
  return `${frontMatter({ id: book.id, locale, status: 'public', canonical: book.canonicalUrl, updatedAt: book.updatedAt })}# ${book.title}\n\n${book.description}\n\n## ${locale === 'cs' ? 'Kapitoly' : 'Chapters'}\n\n${chapters}\n`;
}

export async function bookIndexMarkdown(locale: PublicLocale): Promise<string> {
  const books = await getPublicBooks(locale);
  return books.map((book) => `- [${book.title}](${absolutePublicUrl(`/ai/${locale}/books/${book.id}.md`)})`).join('\n');
}

export function chapterMarkdown(chapter: PublicChapterDocument): string {
  const metadata = frontMatter({
    id: chapter.id,
    bookId: chapter.bookId,
    locale: chapter.locale,
    sourceLocale: chapter.sourceLocale,
    status: chapter.status,
    visibility: chapter.visibility,
    canonical: chapter.canonicalUrl,
    updatedAt: chapter.updatedAt,
  });
  const body = chapter.visibility === 'publicFull'
    ? chapter.markdown ?? ''
    : `${chapter.summary}\n\n${chapter.locale === 'cs' ? 'Plny text teto kapitoly neni verejny.' : 'The full text of this chapter is not public.'}`;
  return `${metadata}# ${chapter.title}\n\n${body}\n`;
}

export async function chapterIndexMarkdown(locale: PublicLocale): Promise<string> {
  const chapters = await getPublicChapters(locale);
  return chapters.map(chapterMarkdown).join('\n\n---\n\n');
}
