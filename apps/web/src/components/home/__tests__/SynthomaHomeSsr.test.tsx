/** @jest-environment node */

import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import SynthomaHome from '../SynthomaHome';
import { LangProvider } from '../../../lib/LangContext';

describe('Synthoma Home server HTML', () => {
  it('leaves canonical legal links to the global shell footer', () => {
    const html = renderToStaticMarkup(<SynthomaHome />);

    expect(html.match(/<footer\b/g)).toBeNull();
    expect(html).not.toContain('synthoma-home__legal');
    expect(html).not.toContain('SUBJECT_CONTACT');
    expect(html).not.toContain('SPOUSTIT');
    expect(html).toContain('SPUSTIT');
  });

  it('explains the project and exposes all guest entry paths before secondary auth', () => {
    const html = renderToStaticMarkup(<SynthomaHome />);
    const descriptor = 'SYNTHOMA je interaktivní psychologický román, diagnostická karetní hra a živý archiv uvnitř rozbitého terapeutického systému.';

    expect(html).toContain(descriptor);
    expect(html).toContain('Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.');
    expect(html).not.toContain('href="/landing-intro?replay=1"');
    expect(html).toContain('href="/chapter/0-inf-restart"');
    expect(html).toContain('href="/cyklus"');
    expect(html).toContain('href="/archive"');
    expect(html).toContain('bez registrace');
    expect(html.indexOf('href="/chapter/0-inf-restart"')).toBeLessThan(html.indexOf('href="/login"'));
    expect(html.indexOf('href="/archive"')).toBeLessThan(html.indexOf('href="/register"'));
    expect(html).not.toContain('Comet');
    expect(html).not.toContain('Reader surface opacity');
  });

  it('renders the complete English first-contact contract without JavaScript', () => {
    const html = renderToStaticMarkup(<LangProvider initialLang="en"><SynthomaHome /></LangProvider>);

    expect(html).toContain('SYNTHOMA is an interactive psychological novel, a diagnostic card game, and a living archive inside a broken therapeutic system.');
    expect(html).toContain('START THE STORY');
    expect(html).toContain('START THE CYCLE');
    expect(html).toContain('UNDERSTAND THE WORLD');
    expect(html).toContain('without registration');
    expect(html).toContain('href="/chapter/0-inf-restart?locale=en"');
  });

  it('styles the Czech motto as a theme-aware visual anchor', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/synthoma-os/home.css'), 'utf8');

    expect(css).toMatch(/\.home-light-quote__text\s*\{[^}]*font-family:\s*var\(--os-font-heading\);[^}]*font-size:\s*2\.5rem;/);
    expect(css).toContain('var(--text-accent-primary)');
    expect(css).toContain('var(--text-accent-secondary)');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.home-light-quote__text::after\s*\{[^}]*animation:\s*none;/);
  });
});
