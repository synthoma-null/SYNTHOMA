/** @jest-environment node */

import { renderToStaticMarkup } from 'react-dom/server';
import SynthomaHome from '../SynthomaHome';

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
});
