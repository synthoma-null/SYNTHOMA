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
    redirect: (url: URL, status?: number) => ({
      status: status ?? 307,
      headers: new Headers({ location: url.toString() }),
    }),
  },
}));

function routeRequest(path: string): NextRequest {
  const url = new URL(path, 'https://www.synthoma.cz');
  return {
    nextUrl: url,
    url: url.toString(),
  } as NextRequest;
}

describe('chapter route guard', () => {
  it('allows editor-created slugs and upgrades their legacy reader links', () => {
    expect(middleware(routeRequest('/chapter/editor-created-chapter')).headers.get('x-middleware-next')).toBe('1');
    expect(middleware(routeRequest('/reader?chapter=editor-created-chapter')).headers.get('location')).toBe('https://www.synthoma.cz/chapter/editor-created-chapter');
  });

  it('sends old public HTML links through the current access gate without caching', () => {
    const response = middleware(routeRequest('/books/SYNTHOMA-NULL/0-%E2%88%9E%20%5BRESTART%5D.html'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://www.synthoma.cz/chapter/0-inf-restart');
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(middleware(routeRequest('/books/unknown.html')).status).toBe(404);
  });

  it('allows canonical chapter IDs and existing aliases', () => {
    const canonical = middleware(routeRequest('/chapter/0-0-null'));
    const alias = middleware(routeRequest('/chapter/null'));

    expect(canonical.headers.get('x-middleware-next')).toBe('1');
    expect(alias.headers.get('x-middleware-next')).toBe('1');
  });

  it('defers chapter existence and social image access to the server catalog', () => {
    const known = middleware(routeRequest('/chapter/0-0-null/opengraph-image'));
    const unknown = middleware(routeRequest('/chapter/unknown-chapter/opengraph-image'));

    expect(known.headers.get('x-middleware-next')).toBe('1');
    expect(unknown.headers.get('x-middleware-next')).toBe('1');
  });

  it('rejects malformed nested chapter routes', () => {
    const response = middleware(routeRequest('/chapter/unknown-chapter/extra/nested'));

    expect(response.status).toBe(404);
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://www.synthoma.cz/_not-found',
    );
  });

  it('permanently redirects legacy reader references without allowing open redirects', () => {
    const canonical = middleware(routeRequest('/reader?chapter=0-0-null&locale=en'));
    const alias = middleware(routeRequest('/reader?u=%2Fbooks%2FSYNTHOMA-NULL%2F0-1%2520%255BSTART%255D.html'));
    const unknown = middleware(routeRequest('/reader?u=https%3A%2F%2Fexample.com%2Fprivate'));

    expect(canonical.status).toBe(308);
    expect(canonical.headers.get('location')).toBe(
      'https://www.synthoma.cz/chapter/0-0-null?locale=en',
    );
    expect(alias.headers.get('location')).toBe(
      'https://www.synthoma.cz/chapter/0-1-start',
    );
    expect(unknown.headers.get('location')).toBe('https://www.synthoma.cz/books');
  });

  it('keeps the whitelisted SYNTHOMAINFO document in the interactive reader', () => {
    const response = middleware(routeRequest('/reader?u=%2Fdata%2FSYNTHOMAINFO.html'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });
});
