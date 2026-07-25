import fs from 'node:fs';
import path from 'node:path';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import SynthomaPortalRoot from '../SynthomaPortalRoot';

describe('Synthoma OS design foundation', () => {
  afterEach(() => {
    cleanup();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-density');
    document.documentElement.style.removeProperty('--font-size-multiplier');
  });

  it('defines one bounded shared token and layer contract', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/tokens.css'), 'utf8');
    const typography = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/typography.css'), 'utf8');
    expect(typography).toContain('--os-text-micro: var(--text-caption, 0.8125rem)');
    expect(css).toContain('--text-body: 1.0625rem');
    expect(css).toContain('--text-reader: 1.1875rem');
    expect(css).toMatch(/@media \(min-width: 1024px\)[\s\S]*?--text-body:\s*1\.125rem;[\s\S]*?--text-reader:\s*1\.25rem;/);
    expect(css).toContain('--os-command-height: 56px');
    expect(css).toContain('--os-tap: 44px');
    expect(css).toContain('--os-z-critical: 120');
    expect(css).not.toMatch(/z-index:\s*999/);
  });

  it('maps every available theme to semantic text and speaker roles', () => {
    const legacyThemes = fs.readFileSync(path.join(process.cwd(), 'src/styles/themes.css'), 'utf8');
    const tokens = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/tokens.css'), 'utf8');
    const themeIds = ['synthoma', 'green-matrix', 'neon-hellfire', 'cyber-dystopia', 'acid-glitch', 'retro-arcade', 'mono', 'mono-light'];
    for (const themeId of themeIds) {
      const block = legacyThemes.match(new RegExp(`\\[data-theme=${themeId}\\] \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';
      expect(block).toContain('--text-primary:');
      expect(block).toContain('--accent-primary:');
      expect(block).toContain('--accent-secondary:');
      expect(block).toContain('--accent-warning:');
    }
    for (const token of ['--text-accent-primary', '--text-accent-secondary', '--text-warning', '--speaker-sarkasma', '--speaker-glitchka', '--speaker-null']) {
      expect(tokens).toContain(`${token}:`);
    }
  });

  it('keeps key presentation surfaces on semantic tokens instead of fixed text colors', () => {
    const files = [
      'src/styles/synthoma-os/home.css',
      'src/styles/synthoma-os/intro.css',
      'src/styles/library-archive.css',
      'src/styles/book-reader-base.css',
    ];
    const source = files.map((file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')).join('\n');
    expect(source).toContain('var(--text-accent-primary)');
    expect(source).toContain('var(--speaker-color)');
    expect(source).not.toContain('color: #00eaff');
    expect(source).not.toContain('color: #ff3ebf');
    expect(source).not.toContain('color: #f6ff00');
  });

  it('propagates theme, scale, density and reduced-effects state without remounting content', async () => {
    render(<SynthomaPortalRoot><span data-testid="portal-child">SIGNAL</span></SynthomaPortalRoot>);
    const child = screen.getByTestId('portal-child');
    const portal = child.parentElement as HTMLElement;
    expect(portal).toHaveAttribute('data-synthoma-theme', 'synthoma');
    expect(portal).toHaveAttribute('data-synthoma-text-scale', '1');

    act(() => {
      document.documentElement.dataset.theme = 'mono-light';
      document.documentElement.dataset.density = 'compact';
      document.documentElement.style.setProperty('--font-size-multiplier', '1.4');
    });

    await waitFor(() => {
      expect(portal).toHaveAttribute('data-synthoma-theme', 'mono-light');
      expect(portal).toHaveAttribute('data-synthoma-text-scale', '1.4');
      expect(portal).toHaveAttribute('data-synthoma-density', 'compact');
    });
    expect(screen.getByTestId('portal-child')).toBe(child);
  });
});
