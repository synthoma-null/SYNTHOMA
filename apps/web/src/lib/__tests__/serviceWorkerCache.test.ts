import fs from 'node:fs';
import path from 'node:path';

describe('service worker cache contract', () => {
  const source = fs.readFileSync(path.join(process.cwd(), 'public/sw.js'), 'utf8');

  it('invalidates legacy HTML caches and keeps navigations network-first', () => {
    const staticCache = source.match(/const STATIC_CACHE = \[([\s\S]*?)\]/)?.[1] ?? '';
    const navigationBranch = source.match(/if \(isNavigation\) \{([\s\S]*?)\n  \}/)?.[1] ?? '';

    expect(source).toContain("const CACHE_NAME = 'synthoma-v3'");
    expect(source).toContain("const OFFLINE_URL = '/offline.html'");
    expect(staticCache).not.toContain("'/'");
    expect(staticCache).toContain('OFFLINE_URL');
    expect(source.indexOf('if (isNavigation)')).toBeLessThan(source.indexOf('caches.match(request).then'));
    expect(source).toMatch(/if \(isNavigation\) \{[\s\S]*?fetch\(request\)[\s\S]*?catch\(async \(\) =>/);
    expect(navigationBranch).not.toContain('cache.put');
    expect(source).not.toContain("caches.match('/')");
  });

  it('never caches account, API, purchase or private responses', () => {
    for (const pathPrefix of ['/api/', '/profile', '/admin', '/login', '/register', '/purchase']) {
      expect(source).toContain(pathPrefix);
    }
    expect(source).toContain("if (request.method !== 'GET') return");
    expect(source).toContain('isSensitiveRequest(request)');
    expect(source).toContain("!cacheControl.includes('private')");
    expect(source).toContain("!cacheControl.includes('no-store')");
  });
});
