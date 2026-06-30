import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/register', '/profile', '/admin', '/api/'],
      },
    ],
    sitemap: 'https://www.synthoma.cz/sitemap.xml',
    host: 'https://www.synthoma.cz',
  };
}
