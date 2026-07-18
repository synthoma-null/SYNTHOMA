import fs from 'node:fs';
import path from 'node:path';

describe('Reader appearance contract', () => {
  const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');

  it('connects the active Reader surface to opacity and glass root tokens', () => {
    const css = read('src/styles/reader.css');
    expect(css).toMatch(/\.chapter-reader__article\.SYNTHOMAREADER\s*\{[\s\S]*?--reader-surface-opacity/);
    expect(css).toMatch(/data-reader-glass="on"[\s\S]*?backdrop-filter:\s*blur\(var\(--reader-glass-blur/);
    expect(css).toMatch(/\.chapter-reader__article\.SYNTHOMAREADER\s*\{[\s\S]*?backdrop-filter:\s*none/);
    expect(css).toMatch(/@supports not \(\(backdrop-filter:/);
  });

  it('keeps focus and themes from overriding the Reader appearance tokens', () => {
    const readerCss = read('src/styles/reader.css');
    const themesCss = read('src/styles/themes.css');
    expect(readerCss).not.toMatch(/chapter-reader--focus[^{]*\.chapter-reader__article[^}]*background/);
    expect(themesCss).not.toContain('--reader-surface-opacity');
    expect(themesCss).not.toContain('--reader-glass-blur');
  });

  it('keeps reading progress and chapter navigation while focus hides utilities', () => {
    const readerCss = read('src/styles/reader.css');
    const utilities = read('src/components/reader/ReaderCommandUtilities.tsx');
    expect(readerCss).toMatch(/data-reader-focus="on"[\s\S]*synthoma-command-header[\s\S]*display:\s*none/);
    expect(readerCss).toMatch(/chapter-reader--focus[\s\S]*chapter-reader__machine-links[\s\S]*display:\s*none/);
    expect(readerCss).not.toMatch(/chapter-reader--focus[^}]*chapter-reader__navigation[^}]*display:\s*none/);
    expect(readerCss).not.toMatch(/chapter-reader--focus[^}]*chapter-reader__progress[^}]*display:\s*none/);
    expect(utilities).toContain("updateUiPreferences({ focusMode: !preferences.focusMode })");
    expect(utilities).not.toMatch(/toggleFocus[\s\S]{0,180}audioEnabled/);
  });

  it('uses the same article for free and owned content while gates expose no preview', () => {
    const page = read('app/chapter/[id]/page.tsx');
    const gate = read('app/chapter/[id]/ChapterAccessGate.tsx');
    expect(page.match(/<ChapterReaderArticle/g)).toHaveLength(2);
    expect(gate).not.toContain('chapter-reader__article');
    expect(gate).not.toContain('SYNTHOMAREADER');
  });

  it('keeps opacity and blur as independent accessible controls', () => {
    const controls = read('app/components/ControlCenterClient.tsx');
    expect(controls).toContain('PRŮHLEDNOST ČTECÍ PLOCHY');
    expect(controls).toMatch(/min="0\.4"[\s\S]*?max="1"[\s\S]*?value=\{preferences\.readerOpacity\}/);
    expect(controls).toMatch(/glassBlur[\s\S]*?disabled=\{!preferences\.glassEnabled\}/);
    expect(controls).toContain('aria-valuetext={`${preferences.glassBlur} px`}');
  });
});
