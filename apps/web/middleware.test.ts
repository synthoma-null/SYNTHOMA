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
  it('allows canonical chapter IDs and existing aliases', () => {
    const canonical = middleware(routeRequest('/chapter/0-0-null'));
    const alias = middleware(routeRequest('/chapter/null'));

    expect(canonical.headers.get('x-middleware-next')).toBe('1');
    expect(alias.headers.get('x-middleware-next')).toBe('1');
  });

  it('allows the social image only below a known chapter', () => {
    const known = middleware(routeRequest('/chapter/0-0-null/opengraph-image'));
    const unknown = middleware(routeRequest('/chapter/unknown-chapter/opengraph-image'));

    expect(known.headers.get('x-middleware-next')).toBe('1');
    expect(unknown.status).toBe(404);
  });

  it('rewrites unknown chapter IDs to a hard 404', () => {
    const response = middleware(routeRequest('/chapter/unknown-chapter'));

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
});
