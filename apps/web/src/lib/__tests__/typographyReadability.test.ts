const { auditTypographyReadability } = require('../../../scripts/typography-readability-audit');
const fs = require('node:fs');
const path = require('node:path');

describe('typography readability browser audit', () => {
  const originalRect = HTMLElement.prototype.getBoundingClientRect;

  beforeAll(() => {
    HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
      return { width: 120, height: 24, top: 0, right: 120, bottom: 24, left: 0, x: 0, y: 0, toJSON: () => ({}) };
    };
  });

  afterAll(() => {
    HTMLElement.prototype.getBoundingClientRect = originalRect;
  });

  it('reports route, selector context and computed readability values', () => {
    document.body.innerHTML = `
      <p class="tiny-copy" style="font-size: 11px; letter-spacing: 2px; opacity: .5">Dlouhý informační text, který musí audit zachytit i s kontextem prvku.</p>
      <button class="tiny-action" style="font-size: 12px">Pokračovat</button>
    `;

    expect(auditTypographyReadability(document, '/books')).toEqual(expect.arrayContaining([
      expect.objectContaining({ route: '/books', element: 'p', className: 'tiny-copy', fontSize: 11, opacity: 0.5 }),
      expect.objectContaining({ route: '/books', element: 'button', className: 'tiny-action', fontSize: 12, reasons: expect.arrayContaining(['ui-under-13px']) }),
    ]));
  });

  it('ignores explicitly decorative and hidden text', () => {
    document.body.innerHTML = `
      <span data-decorative="true" style="font-size: 8px">DECORATIVE HASH</span>
      <span aria-hidden="true" style="font-size: 8px">HIDDEN COPY</span>
    `;

    expect(auditTypographyReadability(document, '/')).toEqual([]);
  });

  it('keeps key desktop reading surfaces on shared readable tokens', () => {
    const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    const tokens = read('src/styles/synthoma-os/tokens.css');
    const library = read('src/styles/library-archive.css');
    const reader = read('src/styles/reader.css');

    expect(tokens).toMatch(/@media \(min-width: 1024px\)[\s\S]*?--text-card:\s*1\.125rem;[\s\S]*?--text-reader:\s*1\.25rem;/);
    expect(library).toMatch(/\.library-book-card__description\s*\{[^}]*font-size:\s*var\(--text-card\)/);
    expect(library).toMatch(/\.archive-record-card__teaser\s*\{[^}]*font-size:\s*var\(--text-card\)/);
    expect(library).toMatch(/\.archive-record-card__source\s*\{[^}]*color:\s*var\(--os-text-blue\)/);
    expect(library).toMatch(/\.archive-record-card__teaser\s*\{[^}]*color:\s*var\(--os-text-secondary\)/);
    expect(reader).toMatch(/@media \(min-width: 1024px\)[\s\S]*?\.chapter-reader__command,[\s\S]*?font-size:\s*var\(--text-caption\)/);
  });
});
