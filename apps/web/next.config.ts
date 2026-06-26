import type { NextConfig } from 'next';

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
    "frame-ancestors 'self'",
  ];
  base.push({ key: 'Content-Security-Policy', value: cspDirectives.join('; ') });
  return base;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg', 'bcryptjs'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: getSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
