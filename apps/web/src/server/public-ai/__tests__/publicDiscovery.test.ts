/** @jest-environment node */

import {
  apiDiscovery,
  apiV1Discovery,
  cyklusDiscovery,
  publicApiIndex,
  publicCyklusIndex,
  publicV1Index,
} from '../discovery';

const request = (path: string, headers?: HeadersInit) => new Request(
  `https://www.synthoma.cz${path}`,
  headers ? { headers } : undefined,
);

describe('public API discovery indexes', () => {
  it('returns the root, version and Cyklus indexes', async () => {
    const root = await apiDiscovery(request('/api/public')).json();
    const v1 = await apiV1Discovery(request('/api/public/v1')).json();
    const cyklus = await cyklusDiscovery(request('/api/public/v1/cyklus')).json();

    expect(root).toEqual(publicApiIndex);
    expect(v1).toEqual(publicV1Index);
    expect(cyklus).toEqual(publicCyklusIndex);
    expect(cyklus).toMatchObject({
      rules: '/api/public/v1/cyklus/rules',
      start: { method: 'POST', href: '/api/public/v1/cyklus/run' },
      choose: { method: 'POST', href: '/api/public/v1/cyklus/choice' },
    });
  });

  it('adds public cache, CORS and ETag without cookies or sessions', async () => {
    for (const [path, handler] of [
      ['/api/public', apiDiscovery],
      ['/api/public/v1', apiV1Discovery],
      ['/api/public/v1/cyklus', cyklusDiscovery],
    ] as const) {
      const response = handler(request(path));
      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
      expect(response.headers.get('cache-control')).toContain('public');
      expect(response.headers.get('etag')).toBeTruthy();
      expect(response.headers.get('set-cookie')).toBeNull();
      expect(JSON.stringify(await response.json())).not.toMatch(/session|userId|email|\/api\/me|\/api\/admin/i);
    }
  });

  it('supports conditional discovery requests', () => {
    const first = apiDiscovery(request('/api/public'));
    const cached = apiDiscovery(request('/api/public', { 'If-None-Match': first.headers.get('etag')! }));

    expect(cached.status).toBe(304);
    expect(cached.headers.get('set-cookie')).toBeNull();
  });
});
