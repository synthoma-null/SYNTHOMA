import fs from 'node:fs';
import path from 'node:path';

describe('service worker cache contract', () => {
  const source = fs.readFileSync(path.join(process.cwd(), 'public/sw.js'), 'utf8');

  it('invalidates the legacy HTML cache and keeps navigations network-first', () => {
    const staticCache = source.match(/const STATIC_CACHE = \[([\s\S]*?)\]/)?.[1] ?? '';

    expect(source).toContain("const CACHE_NAME = 'synthoma-v2'");
    expect(staticCache).not.toContain("'/'");
    expect(source.indexOf('if (isNavigation)')).toBeLessThan(source.indexOf('caches.match(request).then'));
    expect(source).toMatch(/if \(isNavigation\) \{[\s\S]*?fetch\(request\)[\s\S]*?catch\(async \(\) =>/);
  });
});
