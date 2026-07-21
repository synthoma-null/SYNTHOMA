import { resolvePublicLocale, type PublicLocale } from './config';
import { getPublicChapterDocument } from './contentService';
import { archiveMarkdown, authorMarkdown, bookMarkdown, chapterMarkdown, siteMarkdown } from './markdown';
import { publicMarkdown } from './response';

function localeOrResponse(value: string): PublicLocale | Response {
  return resolvePublicLocale(value) ?? publicMarkdown('# Unsupported locale\n\nSupported locales: `cs`, `en`.\n', 404);
}

export async function siteMarkdownRoute(localeValue: string): Promise<Response> {
  const locale = localeOrResponse(localeValue);
  return locale instanceof Response ? locale : publicMarkdown(await siteMarkdown(locale));
}

export async function authorMarkdownRoute(localeValue: string): Promise<Response> {
  const locale = localeOrResponse(localeValue);
  return locale instanceof Response ? locale : publicMarkdown(await authorMarkdown(locale));
}

export async function archiveMarkdownRoute(localeValue: string): Promise<Response> {
  const locale = localeOrResponse(localeValue);
  return locale instanceof Response ? locale : publicMarkdown(await archiveMarkdown(locale));
}

export async function bookMarkdownRoute(localeValue: string, id = 'synthoma-null'): Promise<Response> {
  const locale = localeOrResponse(localeValue);
  if (locale instanceof Response) return locale;
  const markdown = await bookMarkdown(locale, id);
  return markdown ? publicMarkdown(markdown) : publicMarkdown('# Unknown book\n', 404);
}

export async function chapterMarkdownRoute(localeValue: string, path: string[]): Promise<Response> {
  const locale = localeOrResponse(localeValue);
  if (locale instanceof Response) return locale;
  if (path.length !== 1 || !path[0]?.endsWith('.md')) return publicMarkdown('# Not found\n', 404);
  const chapter = await getPublicChapterDocument(path[0].slice(0, -3), locale);
  return chapter ? publicMarkdown(chapterMarkdown(chapter)) : publicMarkdown('# Unknown chapter\n', 404);
}
