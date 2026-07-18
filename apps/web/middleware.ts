import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { resolveChapterId } from './src/content/catalog';

const LOCALE_COOKIE = 'synthoma_locale';

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

  if (request.nextUrl.pathname === '/reader') {
    const reference = request.nextUrl.searchParams.get('chapter')
      ?? request.nextUrl.searchParams.get('u');
    const chapterId = reference ? resolveChapterId(reference) : undefined;
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

    if (!resolveChapterId(chapterReference ?? '') || (!isChapterPage && !isChapterSocialImage)) {
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
  matcher: ['/((?!api/|_next/|assets/|audio/|videos/|sw\\.js|manifest\\.json|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)'],
};
