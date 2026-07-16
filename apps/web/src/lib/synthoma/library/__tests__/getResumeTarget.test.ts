import { resolveResumeHref } from '../getResumeTarget';

describe('resolveResumeHref', () => {
  it('keeps canonical chapter and API chapter routes canonical', () => {
    expect(resolveResumeHref('/chapter/0-0-null')).toBe('/chapter/0-0-null');
    expect(resolveResumeHref('/api/chapter/0-0-null')).toBe('/chapter/0-0-null');
  });

  it('maps legacy public book paths through the generated chapter catalog', () => {
    expect(resolveResumeHref('/books/SYNTHOMA-NULL/0-∞ [RESTART].html')).toBe('/chapter/0-inf-restart');
    expect(resolveResumeHref('/books/SYNTHOMA-NULL/0-0%20%5BNULL%5D.html')).toBe('/chapter/0-0-null');
  });

  it('returns to the library instead of exposing the old reader shell for an unknown path', () => {
    expect(resolveResumeHref('/books/unknown.html')).toBe('/books');
    expect(resolveResumeHref('unknown.html')).toBe('/books');
  });
});
