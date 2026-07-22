import fs from 'node:fs';
import path from 'node:path';

describe('PWA service worker contract', () => {
  const worker = fs.readFileSync(path.join(process.cwd(), 'public/sw.js'), 'utf8');
  const buildSource = fs.readFileSync(path.join(process.cwd(), 'scripts/build-pwa.mjs'), 'utf8');
  const providerSource = fs.readFileSync(path.join(process.cwd(), 'src/components/pwa/PwaProvider.tsx'), 'utf8');
  const nextConfig = fs.readFileSync(path.join(process.cwd(), 'next.config.ts'), 'utf8');

  it('generates one versioned Workbox worker with explicit runtime caches', () => {
    expect(worker).toContain('workbox:core');
    expect(worker).toContain('/offline');
    expect(worker).toContain('SKIP_WAITING');
    for (const cache of ['synthoma-static-', 'synthoma-fonts-', 'synthoma-covers-', 'synthoma-reader-', 'synthoma-pages-']) {
      expect(worker).toContain(cache);
    }
    expect(buildSource).toContain("swDest: 'public/sw.js'");
    expect(buildSource).toContain('cleanupOutdatedCaches: true');
    expect(buildSource).toContain('navigationPreload: true');
  });

  it('keeps private routes and every API response network-only', () => {
    expect(buildSource).toContain("url.pathname.startsWith('/api/')");
    for (const pathPrefix of ['/profile', '/admin', '/login', '/register', '/purchase']) {
      expect(buildSource).toContain(pathPrefix);
    }
    expect(buildSource).toContain("handler: 'NetworkOnly'");
    expect(buildSource).not.toContain("method: 'POST'");
  });

  it('registers exactly one root-scoped worker only in production', () => {
    expect(providerSource.match(/serviceWorker\.register\('\/sw\.js'/g)).toHaveLength(1);
    expect(providerSource).toContain("process.env.NODE_ENV !== 'production'");
    expect(providerSource).toContain("scope: '/'");
    expect(providerSource).toContain("updateViaCache: 'none'");
    expect(providerSource).toContain("removeEventListener('controllerchange'");
  });

  it('forces revalidation headers without weakening CSP', () => {
    expect(nextConfig).toContain("source: '/sw.js'");
    expect(nextConfig).toContain("source: '/manifest.webmanifest'");
    expect(nextConfig).toContain('public, max-age=0, must-revalidate');
    expect(nextConfig).toContain("worker-src 'self'");
    expect(nextConfig).toContain("manifest-src 'self'");
    expect(nextConfig).toContain("isDev\n      ? \"script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(nextConfig).toContain(": \"script-src 'self' 'unsafe-inline' https://");
  });
});
