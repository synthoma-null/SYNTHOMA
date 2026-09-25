import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { resolveChapterId } from './src/content/catalog';
import { isReaderInfoPath } from './src/content/readerInfo';

const LOCALE_COOKIE = 'synthoma_locale';
const isChapterSlug = (value: string) => value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

function resolveRequestLocale(request: NextRequest): 'cs' | 'en' {
  const queryLocale = request.nextUrl.searchParams.get('locale');
  if (queryLocale === 'en' || queryLocale === 'cs') return queryLocale;
  return request.cookies?.get?.(LOCALE_COOKIE)?.value === 'en' ? 'en' : 'cs';
}

function nextWithLocale(request: NextRequest, locale: 'cs' | 'en') {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-synthoma-locale', locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (request.nextUrl.searchParams.get('locale') === locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 31_536_000, sameSite: 'lax' });
  }
  return response;
}

export function middleware(request: NextRequest) {
  const locale = resolveRequestLocale(request);

  // Legacy files must pass through the same current publication/access checks.
  // Never serve the repository's original HTML after an editor changes its policy.
  if (request.nextUrl.pathname.startsWith('/books/') && /\.html?$/i.test(request.nextUrl.pathname)) {
    const chapterId = resolveChapterId(request.nextUrl.pathname);
    if (!chapterId) return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
    const target = new URL(`/chapter/${chapterId}`, request.url);
    if (locale === 'en' || /_en\.html?$/i.test(request.nextUrl.pathname)) target.searchParams.set('locale', 'en');
    const response = NextResponse.redirect(target, 307);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  if (request.nextUrl.pathname === '/reader') {
    const reference = request.nextUrl.searchParams.get('chapter')
      ?? request.nextUrl.searchParams.get('u');
    if (isReaderInfoPath(reference)) return nextWithLocale(request, locale);
    const chapterId = reference ? resolveChapterId(reference) ?? (isChapterSlug(reference) ? reference : undefined) : undefined;
    const target = new URL(chapterId ? `/chapter/${encodeURIComponent(chapterId)}` : '/books', request.url);

    if (chapterId && locale === 'en') {
      target.searchParams.set('locale', 'en');
    }

    return NextResponse.redirect(target, 308);
  }

  if (request.nextUrl.pathname.startsWith('/chapter/')) {
    const chapterPath = request.nextUrl.pathname.slice('/chapter/'.length);
    const [chapterReference, nestedRoute, extraRoute] = chapterPath.split('/');
    const isChapterPage = Boolean(chapterReference) && !nestedRoute;
    const isChapterSocialImage = nestedRoute === 'opengraph-image' && !extraRoute;

    if (!(resolveChapterId(chapterReference ?? '') || isChapterSlug(chapterReference ?? '')) || (!isChapterPage && !isChapterSocialImage)) {
      return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
    }
  }

  const explicitLocale = request.nextUrl.searchParams.get('locale');
  if (!explicitLocale && locale === 'en') {
    const target = request.nextUrl.clone();
    target.searchParams.set('locale', 'en');
    return NextResponse.redirect(target, 307);
  }

  return nextWithLocale(request, locale);
}

export const config = {
  matcher: ['/books/:path*', '/((?!api/|_next/|assets/|audio/|videos/|sw\\.js|manifest\\.json|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)'],
};
