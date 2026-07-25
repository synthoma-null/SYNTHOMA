/** @jest-environment node */

import { renderToStaticMarkup } from 'react-dom/server';
import SynthomaHome from '../SynthomaHome';
import { LangProvider } from '../../../lib/LangContext';

describe('Synthoma Home server HTML', () => {
  it('renders one semantic footer with crawlable canonical legal links', () => {
    const html = renderToStaticMarkup(<SynthomaHome />);

    expect(html.match(/<footer\b/g)).toHaveLength(1);
    expect(html).toContain('<nav class="synthoma-home__legal" aria-label="Právní informace">');
    expect(html).toContain('<a href="/terms">PODMÍNKY POUŽITÍ A PRODEJE</a>');
    expect(html).toContain('<a href="/privacy">OCHRANA OSOBNÍCH ÚDAJŮ</a>');
    expect(html).not.toContain('SPOUSTIT');
    expect(html).toContain('SPUSTIT');
  });

  it('explains the project and exposes all guest entry paths before secondary auth', () => {
    const html = renderToStaticMarkup(<SynthomaHome />);
    const descriptor = 'SYNTHOMA je interaktivní psychologický román, diagnostická karetní hra a živý archiv uvnitř rozbitého terapeutického systému.';

    expect(html).toContain(descriptor);
    expect(html).toContain('Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.');
    expect(html).toContain('href="/landing-intro?replay=1"');
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
});
