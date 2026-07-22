import fs from 'node:fs';
import path from 'node:path';

describe('canonical Reader mobile header contract', () => {
  const article = fs.readFileSync(path.join(process.cwd(), 'app/chapter/[id]/ChapterReaderArticle.tsx'), 'utf8');
  const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/reader.css'), 'utf8');

  it('uses a compact two-row identity and keeps the panel action available', () => {
    expect(article).toContain('chapter-reader__back-mobile');
    expect(article).toContain('chapter-reader__brand');
    expect(article).toContain('chapter-reader__identity-meta');
    expect(article).toContain('chapter-reader__identity-title');
    expect(css).toContain('grid-template-areas: "route actions" "identity identity"');
    expect(css).toContain('.chapter-reader__utilities button:first-child');
  });

  it('bounds long titles and respects the PWA safe area without a fixed content offset', () => {
    expect(css).toContain('top: max(.35rem, var(--pwa-safe-top, 0px))');
    expect(css).toContain('-webkit-line-clamp: 2');
    expect(css).toContain('max-width: 100%');
    expect(css).toContain('overflow: hidden');
  });
});
