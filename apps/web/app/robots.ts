import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const publicRules = {
    allow: ['/', '/books', '/chapter/', '/archive', '/autor', '/cards', '/ai/', '/llms.txt', '/llms-full.txt', '/api/public/'],
    disallow: [
      '/admin', '/api/admin', '/api/auth', '/api/me', '/api/purchase', '/api/stripe',
      '/profile', '/account', '/login', '/register', '/preview', '/debug', '/reader',
    ],
  };
  return {
    rules: [
      { userAgent: '*', ...publicRules },
      { userAgent: 'OAI-SearchBot', ...publicRules },
      { userAgent: 'GPTBot', ...publicRules },
    ],
    sitemap: 'https://www.synthoma.cz/sitemap.xml',
    host: 'https://www.synthoma.cz',
  };
}
