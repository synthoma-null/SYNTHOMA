import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { resolveChapterId } from './src/content/catalog';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/reader') {
    const reference = request.nextUrl.searchParams.get('chapter')
      ?? request.nextUrl.searchParams.get('u');
    const chapterId = reference ? resolveChapterId(reference) : undefined;
    const target = new URL(chapterId ? `/chapter/${encodeURIComponent(chapterId)}` : '/books', request.url);

    if (chapterId && request.nextUrl.searchParams.get('locale') === 'en') {
      target.searchParams.set('locale', 'en');
    }

    return NextResponse.redirect(target, 308);
  }

  const chapterPath = request.nextUrl.pathname.slice('/chapter/'.length);
  const [chapterReference, nestedRoute, extraRoute] = chapterPath.split('/');
  const isChapterPage = Boolean(chapterReference) && !nestedRoute;
  const isChapterSocialImage = nestedRoute === 'opengraph-image' && !extraRoute;

  if (resolveChapterId(chapterReference ?? '') && (isChapterPage || isChapterSocialImage)) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
}

export const config = {
  matcher: ['/chapter/:path*', '/reader'],
};
