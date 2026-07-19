import fs from 'node:fs';
import path from 'node:path';

describe('Reader decision style contract', () => {
  const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/components-choice.css'), 'utf8');

  it('defines persistent selected and locked states independently of focus', () => {
    expect(css).toContain('[data-state="selected-locked"]');
    expect(css).toContain('[data-state="unselected-locked"]');
    expect(css).toContain('.reader-decision-marker');
    expect(css).toContain('pointer-events: none !important');
  });

  it('removes locked hover movement and motion animations', () => {
    expect(css).toMatch(/\[data-state="locked"\][\s\S]*?\.choice-link:hover[\s\S]*?transform: none !important/);
    expect(css).toMatch(/:root\[data-motion="off"\][\s\S]*?animation: none !important/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.reader-decision-group[\s\S]*?transform: none !important/);
  });

  it('keeps locked choices visible across themes and focus modes', () => {
    expect(css).toMatch(/unselected-locked[\s\S]*?opacity: 0\.58 !important/);
    expect(css).not.toMatch(/focus[^\n{]*[\s\S]{0,120}unselected-locked[^\n{]*\{[^}]*display:\s*none/);
  });
});
