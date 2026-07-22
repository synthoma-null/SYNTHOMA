import { promises as fs } from 'node:fs';
import path from 'node:path';

const origin = 'http://127.0.0.1:3210';
const out = 'C:/SYNTHOMA/audit/2026-07-22_10-10';
const readerIndex = JSON.parse(await fs.readFile('C:/SYNTHOMA/apps/web/src/content/generated/readerChapterIndex.json', 'utf8'));
const queue = ['/', '/books', '/archive', '/autor', '/cards', '/cyklus', '/install', '/offline', ...readerIndex.filter((chapter) => chapter.availability === 'published').map((chapter) => `/chapter/${chapter.id}`)];
const seen = new Set();
const discovered = new Map();
const results = [];
const excluded = (pathname) => pathname.startsWith('/api/') || pathname.startsWith('/admin') || pathname.startsWith('/purchase') || pathname.startsWith('/login') || pathname.startsWith('/register');

while (queue.length && seen.size < 500) {
  const target = queue.shift();
  if (!target || seen.has(target) || excluded(target)) continue;
  seen.add(target);
  try {
    const response = await fetch(origin + target, { redirect: 'manual', headers: { 'user-agent': 'SYNTHOMA-LINK-AUDIT/1.0' } });
    const contentType = response.headers.get('content-type') ?? '';
    const body = contentType.includes('text/html') ? await response.text() : '';
    const links = [];
    for (const match of body.matchAll(/\bhref=["']([^"']+)/gi)) {
      try {
        const url = new URL(match[1], origin + target);
        if (url.origin !== origin || !url.pathname.startsWith('/')) continue;
        const normalized = url.pathname + url.search;
        links.push(normalized);
        const sources = discovered.get(normalized) ?? [];
        sources.push(target);
        discovered.set(normalized, sources);
        if (!seen.has(normalized) && !excluded(url.pathname) && !/\.(png|jpe?g|webp|avif|gif|svg|mp3|webm|mp4|woff2?|ttf|css|js|json|xml|txt)$/i.test(url.pathname)) queue.push(normalized);
      } catch {}
    }
    results.push({ target, status: response.status, location: response.headers.get('location') ?? '', contentType, links: [...new Set(links)] });
  } catch (error) {
    results.push({ target, status: 0, error: String(error), links: [] });
  }
}

const broken = results.filter((item) => item.status === 0 || item.status >= 400);
const redirects = results.filter((item) => item.status >= 300 && item.status < 400);
const report = { origin, checkedAt: new Date().toISOString(), checked: results.length, discovered: discovered.size, broken, redirects, results };
await fs.writeFile(path.join(out, 'link-check-data.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ checked: report.checked, discovered: report.discovered, broken, redirects }, null, 2));
