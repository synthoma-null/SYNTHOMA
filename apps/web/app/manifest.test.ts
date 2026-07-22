import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import manifest from './manifest';

describe('SYNTHOMA web app manifest', () => {
  it('defines stable standalone identity, shortcuts and Android presentation', () => {
    const value = manifest();
    expect(value).toMatchObject({
      id: '/',
      name: 'SYNTHOMA',
      short_name: 'SYNTHOMA',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#020509',
      theme_color: '#000d1a',
    });
    expect(value.display_override).toEqual(['fullscreen', 'standalone']);
    expect(value.shortcuts?.map((shortcut) => shortcut.url)).toEqual(['/books', '/archive', '/cyklus', '/resume']);
    expect(value.icons?.some((icon) => icon.sizes === '192x192' && icon.purpose === 'any')).toBe(true);
    expect(value.icons?.some((icon) => icon.sizes === '512x512' && icon.purpose === 'maskable')).toBe(true);
    expect(value.screenshots).toHaveLength(3);
  });

  it.each([
    ['pwa-192x192.png', 192],
    ['pwa-512x512.png', 512],
    ['pwa-maskable-192x192.png', 192],
    ['pwa-maskable-512x512.png', 512],
    ['pwa-monochrome-512x512.png', 512],
    ['apple-touch-icon-180x180.png', 180],
  ])('ships a valid %s icon', async (filename, size) => {
    const iconPath = path.join(process.cwd(), 'public', 'icons', filename);
    expect(fs.existsSync(iconPath)).toBe(true);
    const metadata = await sharp(iconPath).metadata();
    expect(metadata).toMatchObject({ width: size, height: size, format: 'png' });
  });

  it.each([
    'pwa-home-wide.png',
    'pwa-reader-wide.png',
    'pwa-archive-wide.png',
  ])('ships a valid %s manifest screenshot', async (filename) => {
    const screenshotPath = path.join(process.cwd(), 'public', 'screenshots', filename);
    expect(fs.existsSync(screenshotPath)).toBe(true);
    const metadata = await sharp(screenshotPath).metadata();
    expect(metadata).toMatchObject({ width: 1280, height: 720, format: 'png' });
  });
});
