import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { resolveChapterId } from './src/content/catalog';

export function middleware(request: NextRequest) {
  const chapterReference = request.nextUrl.pathname.slice('/chapter/'.length);
  if (resolveChapterId(chapterReference)) return NextResponse.next();

  return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
}

export const config = {
  matcher: '/chapter/:path*',
};
