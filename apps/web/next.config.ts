import type { NextConfig } from 'next';

const pwaBuildId = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local')
  .replace(/[^a-zA-Z0-9.-]/g, '-')
  .slice(0, 16);

function getSecurityHeaders() {
  const isDev = process.env.NODE_ENV !== 'production';
  const base: Array<{ key: string; value: string }> = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Permissions-Policy', value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  ];
  const cspDirectives: string[] = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "media-src 'self' https:",
    "style-src 'self' 'unsafe-inline' https:",
    "font-src 'self' data: https:",
    // In dev allow unsafe-eval for React Refresh/HMR runtime
    // and allow jsDelivr for UMD/CDN scripts used by public/index.html
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.tailwindcss.com https://js.stripe.com"
      : "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com https://js.stripe.com",
    // Some browsers treat element-specific differently; be explicit
    isDev
      ? "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.tailwindcss.com https://js.stripe.com"
      : "script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com https://js.stripe.com",
    // HMR/websockets in dev
    isDev ? "connect-src 'self' ws: https:" : "connect-src 'self' https://api.stripe.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "worker-src 'self'",
    "manifest-src 'self'",
    "frame-ancestors 'self'",
  ];
  base.push({ key: 'Content-Security-Policy', value: cspDirectives.join('; ') });
  return base;
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SYNTHOMA_BUILD_ID: pwaBuildId,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg', 'bcryptjs'],
  outputFileTracingIncludes: {
    '/api/chapter/[chapterId]': ['./public/books/**/*', './src/content/protected/**/*'],
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        source: '/:path*',
        headers: getSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
