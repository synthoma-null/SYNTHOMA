import { promises as fs } from 'node:fs';
import path from 'node:path';

const base = 'http://127.0.0.1:3210';
const out = 'C:/SYNTHOMA/audit/2026-07-22_10-10';
const domain = JSON.parse(await fs.readFile(path.join(out, 'domain-audit-data.json'), 'utf8'));
const routeMatrixPath = path.join(out, '09-route-matrix.csv');

const requests = [
  ['home', '/'], ['books', '/books'], ['archive', '/archive'], ['author', '/autor'], ['cards', '/cards'],
  ['cyklus', '/cyklus'], ['cyklus-void', '/cyklus/void'], ['install', '/install'], ['profile-signed-out', '/profile'],
  ['offline', '/offline'], ['free-null', '/chapter/0-0-null'], ['free-kp', '/chapter/kp-00-podporovano'],
  ['locked', '/chapter/0-4-defragmentation'], ['unavailable', '/chapter/0-12-conflict'], ['unknown', '/chapter/not-a-real-chapter'],
  ['legacy-reader-id', '/reader?chapter=0-0-null'], ['legacy-reader-path', '/reader?u=%2Fbooks%2FSYNTHOMA-NULL%2F0-0%20%5BNULL%5D.html'],
  ['manifest', '/manifest.webmanifest'], ['worker', '/sw.js'], ['robots', '/robots.txt'], ['sitemap', '/sitemap.xml'],
  ['llms', '/llms.txt'], ['llms-full', '/llms-full.txt'], ['public-site', '/api/public/v1/site'], ['openapi', '/api/public/openapi.json'],
  ['private-profile', '/api/me/profile'], ['admin-overview', '/api/admin/overview'], ['whispers', '/api/whispers'], ['unknown-page', '/this-route-does-not-exist-for-audit'],
];

async function inspect(label, target, init = {}) {
  const started = performance.now();
  try {
    const response = await fetch(base + target, { redirect: 'manual', headers: { 'user-agent': 'SYNTHOMA-FORENSIC-AUDIT/1.0' }, ...init });
    const body = await response.text();
    return {
      label, target, status: response.status, durationMs: Math.round(performance.now() - started),
      contentType: response.headers.get('content-type') ?? '', cacheControl: response.headers.get('cache-control') ?? '',
      location: response.headers.get('location') ?? '', contentLength: response.headers.get('content-length') ?? '',
      csp: response.headers.get('content-security-policy') ?? '', xContentTypeOptions: response.headers.get('x-content-type-options') ?? '',
      bodyBytes: Buffer.byteLength(body), title: body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '',
      h1Count: (body.match(/<h1\b/gi) ?? []).length, hasNextError: /Internal Server Error|Application error|NEXT_NOT_FOUND/.test(body),
      hasProtectedMarker: /DEFRAGMENTATION|Archiv tě nepřijal|0-4 \[DEFRAGMENTATION\]/i.test(body),
      bodySample: body.replace(/\s+/g, ' ').slice(0, 180),
    };
  } catch (error) {
    return { label, target, status: 0, durationMs: Math.round(performance.now() - started), error: String(error) };
  }
}

const results = [];
for (const request of requests) results.push(await inspect(...request));

const chapterResults = [];
for (const collection of domain.catalog.collections) {
  // Collection summary is retained for report grouping; route IDs come from generated reader index below.
  void collection;
}
const readerIndex = JSON.parse(await fs.readFile('C:/SYNTHOMA/apps/web/src/content/generated/readerChapterIndex.json', 'utf8'));
for (const chapter of readerIndex) chapterResults.push({ id: chapter.id, availability: chapter.availability, accessPolicy: chapter.accessPolicy, ...(await inspect(chapter.id, `/chapter/${encodeURIComponent(chapter.id)}`)) });

const freeApi = await inspect('free-api', '/api/chapter/0-0-null');
const lockedApi = await inspect('locked-api', '/api/chapter/0-4-defragmentation');
const unavailableApi = await inspect('unavailable-api', '/api/chapter/0-12-conflict');

const worker = results.find((item) => item.label === 'worker');
const manifest = results.find((item) => item.label === 'manifest');
const report = {
  base,
  checkedAt: new Date().toISOString(),
  results,
  chapterResults,
  chapterSummary: {
    total: chapterResults.length,
    statusCounts: Object.fromEntries([...new Set(chapterResults.map((item) => item.status))].map((status) => [status, chapterResults.filter((item) => item.status === status).length])),
    errors: chapterResults.filter((item) => item.status >= 500 || item.status === 0),
  },
  chapterApi: { freeApi, lockedApi, unavailableApi },
  pwa: { worker, manifest },
};
await fs.writeFile(path.join(out, 'runtime-audit-data.json'), JSON.stringify(report, null, 2));

// Fill liveStatus for exact static routes without changing the source/ownership columns.
const csv = await fs.readFile(routeMatrixPath, 'utf8');
const lines = csv.trimEnd().split(/\r?\n/);
const parseCsvLine = (line) => {
  const values = []; let current = ''; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"' && quoted && line[i + 1] === '"') { current += '"'; i += 1; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { values.push(current); current = ''; }
    else current += ch;
  }
  values.push(current); return values;
};
const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const headers = parseCsvLine(lines[0]);
const routeIndex = headers.indexOf('route');
const statusIndex = headers.indexOf('liveStatus');
const resultByTarget = new Map(results.map((item) => [item.target, item]));
const updated = [lines[0]];
for (const line of lines.slice(1)) {
  const row = parseCsvLine(line);
  const result = resultByTarget.get(row[routeIndex]);
  if (result) row[statusIndex] = String(result.status);
  updated.push(row.map(csvCell).join(','));
}
await fs.writeFile(routeMatrixPath, updated.join('\r\n') + '\r\n');
console.log(JSON.stringify({ selected: results.map(({ label, target, status, location, contentType, bodyBytes, hasNextError }) => ({ label, target, status, location, contentType, bodyBytes, hasNextError })), chapterSummary: report.chapterSummary, chapterApi: { free: freeApi.status, locked: lockedApi.status, unavailable: unavailableApi.status } }, null, 2));
