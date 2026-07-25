import fs from 'node:fs';
import path from 'node:path';

function read(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('semantic color roles', () => {
  it('defines a restrained shared palette with distinct status accents', () => {
    const tokens = read('src/styles/synthoma-os/tokens.css');

    expect(tokens).toContain('--os-text-primary: var(--text-primary');
    expect(tokens).toContain('--os-text-cyan: var(--text-accent-primary)');
    expect(tokens).toContain('--os-text-magenta: var(--text-accent-secondary)');
    expect(tokens).toContain('--os-text-yellow: var(--text-warning)');
    expect(tokens).toContain('--os-text-red: var(--text-danger)');
    expect(tokens).toContain('--os-text-green: var(--text-success)');
    expect(tokens).toContain('--os-text-violet: var(--text-accent-tertiary)');
    expect(tokens).toContain('--os-text-amber: color-mix');
  });

  it('assigns meaning to Home sectors while keeping body copy neutral', () => {
    const css = read('src/styles/synthoma-os/home.css');

    expect(css).toMatch(/data-home-sector="books"[^}]*--home-sector-accent:\s*var\(--os-text-cyan\)/);
    expect(css).toMatch(/data-home-sector="archive"[^}]*--home-sector-accent:\s*var\(--os-text-violet\)/);
    expect(css).toMatch(/data-home-sector="cyklus"[^}]*--home-sector-accent:\s*var\(--os-text-yellow\)/);
    expect(css).toMatch(/data-home-sector="autor"[^}]*--home-sector-accent:\s*var\(--os-text-green\)/);
    expect(css).toMatch(/\.synthoma-home__statement\s*\{[^}]*color:\s*var\(--os-text-secondary\)/);
  });

  it('colors Archive metadata by category, source and lock state', () => {
    const css = read('src/styles/library-archive.css');

    expect(css).toMatch(/data-archive-category="mechaniky"[^}]*var\(--os-text-yellow\)/);
    expect(css).toMatch(/data-archive-category="udalosti"[^}]*var\(--os-text-magenta\)/);
    expect(css).toMatch(/data-archive-category="systemy-protokoly"[^}]*var\(--os-text-red\)/);
    expect(css).toMatch(/archive-record-card__badge--locked[^}]*var\(--os-text-yellow\)/);
    expect(css).toMatch(/data-source-book="konec-podpory"[\s\S]*?archive-record-card__source[^}]*var\(--os-text-magenta\)/);
    expect(css).toMatch(/\.archive-record-card__teaser\s*\{[^}]*color:\s*var\(--os-text-secondary\)/);
  });
});
