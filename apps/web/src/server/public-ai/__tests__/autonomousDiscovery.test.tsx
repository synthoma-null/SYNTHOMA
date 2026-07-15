/** @jest-environment node */

import { renderToStaticMarkup } from 'react-dom/server';
import CyklusPage from '../../../../app/cyklus/page';
import PublicApiPage from '../../../../app/ai/api/page';
import { cyklusDiscovery } from '../discovery';
import { chooseCyklus, startCyklusRun } from '../gameHandlers';
import { publicOpenApi } from '../openapi';
import { resetPublicRateLimitsForTests } from '../rateLimit';

jest.mock('../../../components/cyklus/CyklusClient', () => ({
  __esModule: true,
  default: () => <div>Nahrává se Cyklus...</div>,
}));

function linksFrom(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]!);
}

describe('autonomous public AI discovery from Cyklus', () => {
  beforeAll(() => { process.env.AI_STATE_TOKEN_SECRET = 'autonomous-discovery-test-secret-32-bytes'; });
  beforeEach(resetPublicRateLimitsForTests);

  it('discovers documentation, OpenAPI, the API index and a complete run from the Cyklus HTML', async () => {
    const cyklusHtml = renderToStaticMarkup(<CyklusPage />);
    const documentationHref = linksFrom(cyklusHtml).find((href) => href === '/ai/api');
    expect(documentationHref).toBe('/ai/api');

    const documentationHtml = renderToStaticMarkup(<PublicApiPage />);
    const openApiHref = linksFrom(documentationHtml).find((href) => href.endsWith('/api/public/openapi.json'));
    expect(openApiHref).toBe('/api/public/openapi.json');

    const cyklusIndexPath = Object.entries(publicOpenApi.paths).find(([, value]) =>
      'get' in value && value.get.operationId === 'discover_cyklus',
    )?.[0];
    expect(cyklusIndexPath).toBeTruthy();

    const indexResponse = cyklusDiscovery(new Request(`https://www.synthoma.cz${cyklusIndexPath}`));
    const index = await indexResponse.json();
    const startHref = index.start.href as string;
    const choiceHref = index.choose.href as string;

    let response = await startCyklusRun(new Request(`https://www.synthoma.cz${startHref}`, {
      method: index.start.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: 'cs', seed: 'autonomous-discovery' }),
    }));
    expect(response.status).toBe(200);
    let payload = await response.json();

    for (let turn = 0; turn < 12; turn += 1) {
      const choiceId = payload.card.choices[turn % payload.card.choices.length].id;
      response = await chooseCyklus(new Request(`https://www.synthoma.cz${choiceHref}`, {
        method: index.choose.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateToken: payload.stateToken, choiceId }),
      }));
      expect(response.status).toBe(200);
      payload = await response.json();
      if (payload.run.status !== 'active') break;
    }

    expect(payload.run.status).toBe('completed');
    expect(payload.summary.decisions).toHaveLength(12);
    expect(response.headers.get('set-cookie')).toBeNull();
  });
});
