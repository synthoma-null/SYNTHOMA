/** @jest-environment node */

import { readFileSync } from 'fs';
import { join } from 'path';
import { renderToStaticMarkup } from 'react-dom/server';
import CyklusPage from './page';

jest.mock('./CyklusPageClient', () => ({
  __esModule: true,
  default: () => <div data-testid="cyklus-client-placeholder">Nahrává se Cyklus...</div>,
}));

describe('Cyklus fullscreen route shell', () => {
  it('renders the game as the only main route content', async () => {
    const html = renderToStaticMarkup(await CyklusPage());

    expect(html.match(/<main\b/g)).toHaveLength(1);
    expect(html).toContain('id="cyklus-game"');
    expect(html).toContain('class="cyklus-page cyklus-game-shell"');
    expect(html).toContain('data-testid="cyklus-client-placeholder"');
    expect(html).not.toContain('CYKLUS // DIAGNOSTICKÁ KARETNÍ HRA');
    expect(html).not.toContain('CYKLUS // PUBLIC INTERFACE');
    expect(html).not.toContain('AI A AUTOMATIZOVANÝ PŘÍSTUP');
    expect(html).not.toMatch(/href="\/(?:ai\/api|api\/public|llms\.txt)/);
    expect(html).not.toMatch(/<footer\b/i);
  });

  it('keeps public AI discovery on specialized routes and root head relations', () => {
    const layout = readFileSync(join(process.cwd(), 'app/layout.tsx'), 'utf8');
    const publicApiPage = readFileSync(join(process.cwd(), 'app/ai/api/page.tsx'), 'utf8');

    expect(layout).toContain('rel="service-desc"');
    expect(layout).toContain('href="/api/public/openapi.json"');
    expect(layout).toContain('rel="alternate" type="application/json" href="/api/public/v1/cyklus/rules"');
    expect(layout).toContain('rel="help" href="/ai/api"');
    expect(publicApiPage).toContain('/api/public/openapi.json');
  });
});
