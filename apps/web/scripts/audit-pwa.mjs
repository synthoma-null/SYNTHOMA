import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const requiredIcons = [
  ['assets/generated/icon-192.png', 192],
  ['assets/icon_512.png', 512],
  ['assets/generated/maskable-icon-192.png', 192],
  ['assets/generated/maskable-icon-512.png', 512],
  ['assets/generated/monochrome-icon-512.png', 512],
  ['assets/generated/apple-touch-icon-180.png', 180],
];

for (const [name, expected] of requiredIcons) {
  const file = path.join(root, 'public', name);
  const metadata = await sharp(file).metadata();
  if (metadata.width !== expected || metadata.height !== expected || metadata.format !== 'png') {
    throw new Error(`${name}: expected ${expected}x${expected} PNG, got ${metadata.width}x${metadata.height} ${metadata.format}`);
  }
}

const swPath = path.join(root, 'public', 'sw.js');
const sw = await fs.readFile(swPath, 'utf8');
const stat = await fs.stat(swPath);
const pwaSource = await fs.readFile(path.join(root, 'src', 'lib', 'pwa.ts'), 'utf8');
const pwaVersion = pwaSource.match(/PWA_VERSION = '([^']+)'/)?.[1];
if (!pwaVersion) throw new Error('PWA version could not be read from src/lib/pwa.ts');
const requiredMarkers = [
  `synthoma-static-${pwaVersion}-`,
  `synthoma-fonts-${pwaVersion}-`,
  `synthoma-images-${pwaVersion}-`,
  `synthoma-reader-${pwaVersion}-`,
  `synthoma-pages-${pwaVersion}-`,
  'PWA_UPDATED',
  'text/x-component',
  '_rsc',
  '/offline',
  '/api/',
];
for (const marker of requiredMarkers) {
  if (!sw.includes(marker)) throw new Error(`Service worker is missing ${marker}`);
}

const precacheEntries = [...sw.matchAll(/\{url:"([^"]+)"/g)].map((match) => match[1]);
if (!precacheEntries.includes('/offline')) throw new Error('Offline page missing from precache');
if (precacheEntries.includes('/assets/og-synthoma.png')) throw new Error('Social image must not be downloaded during PWA installation');
const report = {
  serviceWorkerBytes: stat.size,
  precacheEntries: precacheEntries.length,
  runtimeCaches: 5,
  icons: requiredIcons.length,
};
console.log(JSON.stringify(report, null, 2));
