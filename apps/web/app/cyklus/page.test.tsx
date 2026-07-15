/** @jest-environment node */

import { readFileSync } from 'fs';
import { join } from 'path';
import { renderToStaticMarkup } from 'react-dom/server';
import CyklusPage from './page';

jest.mock('../../src/components/cyklus/CyklusClient', () => ({
  __esModule: true,
  default: () => <div data-testid="cyklus-client-placeholder">Nahrává se Cyklus...</div>,
}));

describe('Cyklus public AI SSR discovery', () => {
  it('renders crawlable discovery content without running client JavaScript', () => {
    const html = renderToStaticMarkup(<CyklusPage />);

    expect(html).toContain('AI A AUTOMATIZOVANÝ PŘÍSTUP');
    expect(html).toContain('href="/ai/api"');
    expect(html).toContain('href="/api/public/v1/cyklus/rules"');
    expect(html).not.toMatch(/cyklus-ai-discovery[^>]*(?:display\s*:\s*none|aria-hidden)/i);
  });

  it('publishes the service discovery relations from the root head', () => {
    const layout = readFileSync(join(process.cwd(), 'app/layout.tsx'), 'utf8');

    expect(layout).toContain('rel="service-desc"');
    expect(layout).toContain('href="/api/public/openapi.json"');
    expect(layout).toContain('rel="alternate" type="application/json" href="/api/public/v1/cyklus/rules"');
    expect(layout).toContain('rel="help" href="/ai/api"');
  });
});
