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
    expect(worker).toContain('PWA_UPDATED');
    for (const cache of ['synthoma-static-', 'synthoma-fonts-', 'synthoma-images-', 'synthoma-reader-', 'synthoma-pages-']) {
      expect(worker).toContain(cache);
    }
    expect(buildSource).toContain("swDest: 'public/sw.js'");
    expect(buildSource).toContain('cleanupOutdatedCaches: true');
    expect(buildSource).toContain('navigationPreload: true');
    expect(buildSource).toContain('skipWaiting: true');
    expect(buildSource).toContain("const PWA_VERSION = '1.0.0-pwa.3'");
    expect(worker).toContain('1.0.0-pwa.3');
  });

  it('keeps private routes and every API response network-only', () => {
    expect(buildSource).toContain("url.pathname.startsWith('/api/')");
    for (const pathPrefix of ['/profile', '/admin', '/login', '/register', '/purchase']) {
      expect(buildSource).toContain(pathPrefix);
    }
    expect(buildSource).toContain("handler: 'NetworkOnly'");
    expect(buildSource).not.toContain("method: 'POST'");
  });

  it('bypasses Next.js streams and rejects consumed or Flight responses from cache', () => {
    for (const marker of ["url.searchParams.has('_rsc')", "request.headers.has('RSC')", "request.headers.has('Next-Router-Prefetch')", "request.headers.has('Next-Router-State-Tree')"]) {
      expect(buildSource).toContain(marker);
    }
    expect(buildSource).toContain("contentType.includes('text/x-component')");
    expect(buildSource).toContain('response.bodyUsed');
    expect(buildSource).toContain('response.clone()');
    expect(worker).toContain('text/x-component');
  });

  it('clones the Workbox network response before the asynchronous cache write', () => {
    expect(worker).toMatch(/await this\.fetch\(t\),s=e\.clone\(\);return this\.waitUntil\(this\.cachePut\(t,s\)\),e/);
  });

  it('deletes incompatible SYNTHOMA caches and notifies controlled clients', () => {
    expect(worker).toContain('name.startsWith("synthoma-")');
    expect(worker).toContain('!name.includes(self.__SYNTHOMA_PWA_BUILD__)');
    expect(worker).toContain('includeUncontrolled:true');
    expect(worker).toContain('PWA_UPDATED');
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
