import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const requiredIcons = [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['pwa-maskable-192x192.png', 192],
  ['pwa-maskable-512x512.png', 512],
  ['pwa-monochrome-512x512.png', 512],
  ['apple-touch-icon-180x180.png', 180],
];

for (const [name, expected] of requiredIcons) {
  const file = path.join(root, 'public', 'icons', name);
  const metadata = await sharp(file).metadata();
  if (metadata.width !== expected || metadata.height !== expected || metadata.format !== 'png') {
    throw new Error(`${name}: expected ${expected}x${expected} PNG, got ${metadata.width}x${metadata.height} ${metadata.format}`);
  }
}

const swPath = path.join(root, 'public', 'sw.js');
const sw = await fs.readFile(swPath, 'utf8');
const stat = await fs.stat(swPath);
const requiredMarkers = [
  'synthoma-static-1.0.0-pwa.2-',
  'synthoma-fonts-1.0.0-pwa.2-',
  'synthoma-images-1.0.0-pwa.2-',
  'synthoma-reader-1.0.0-pwa.2-',
  'synthoma-pages-1.0.0-pwa.2-',
  'PWA_UPDATED',
  'text/x-component',
  '_rsc',
  '/offline',
  '/api/',
];
for (const marker of requiredMarkers) {
  if (!sw.includes(marker)) throw new Error(`Service worker is missing ${marker}`);
}

const precacheStart = sw.indexOf('[{url:');
const precacheEnd = sw.indexOf('}]),function(t){const e=', precacheStart);
const precacheBlock = precacheStart >= 0 && precacheEnd > precacheStart ? sw.slice(precacheStart, precacheEnd) : '';
const precacheEntries = precacheBlock.match(/\{url:/g) ?? [];
const report = {
  serviceWorkerBytes: stat.size,
  precacheEntries: precacheEntries.length,
  runtimeCaches: 5,
  icons: requiredIcons.length,
};
console.log(JSON.stringify(report, null, 2));
