import type { NextRequest } from 'next/server';
import { middleware } from './middleware';

jest.mock('next/server', () => ({
  NextResponse: {
    next: () => ({
      status: 200,
      headers: new Headers({ 'x-middleware-next': '1' }),
    }),
    rewrite: (url: URL, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers({ 'x-middleware-rewrite': url.toString() }),
    }),
  },
}));

function chapterRequest(pathname: string): NextRequest {
  return {
    nextUrl: { pathname },
    url: `https://www.synthoma.cz${pathname}`,
  } as NextRequest;
}

describe('chapter route guard', () => {
  it('allows canonical chapter IDs and existing aliases', () => {
    const canonical = middleware(chapterRequest('/chapter/0-0-null'));
    const alias = middleware(chapterRequest('/chapter/null'));

    expect(canonical.headers.get('x-middleware-next')).toBe('1');
    expect(alias.headers.get('x-middleware-next')).toBe('1');
  });

  it('rewrites unknown chapter IDs to a hard 404', () => {
    const response = middleware(chapterRequest('/chapter/unknown-chapter'));

    expect(response.status).toBe(404);
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://www.synthoma.cz/_not-found',
    );
  });
});
