import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const root = process.cwd();
const iconsDir = path.join(root, 'public', 'assets', 'generated');
const sourceDir = path.join(root, 'public', 'assets');
const master = path.join(sourceDir, 'icon_1024.png');
const monoMaster = path.join(sourceDir, 'icon_mono_1024.png');

await mkdir(iconsDir, { recursive: true });

async function colorIcon(size, destination) {
  await sharp(master)
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconsDir, destination));
}

async function maskableIcon(size, destination) {
  const safeSize = Math.round(size * 0.78);
  const inset = Math.floor((size - safeSize) / 2);
  await sharp(master)
    .resize(safeSize, safeSize, { fit: 'contain' })
    .extend({ top: inset, bottom: size - safeSize - inset, left: inset, right: size - safeSize - inset, background: '#02060b' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconsDir, destination));
}

async function monochromeIcon() {
  const { data, info } = await sharp(monoMaster)
    .resize(512, 512, { fit: 'contain' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let index = 0; index < data.length; index += 1) {
    const offset = index * 4;
    rgba[offset] = 255;
    rgba[offset + 1] = 255;
    rgba[offset + 2] = 255;
    rgba[offset + 3] = Math.max(0, Math.min(255, Math.round((data[index] - 8) * 1.2)));
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconsDir, 'monochrome-icon-512.png'));
}

await Promise.all([
  colorIcon(192, 'icon-192.png'),
  colorIcon(180, 'apple-touch-icon-180.png'),
  maskableIcon(192, 'maskable-icon-192.png'),
  maskableIcon(512, 'maskable-icon-512.png'),
  monochromeIcon(),
]);

console.log('PWA icons generated from public/assets/icon_1024.png and icon_mono_1024.png.');
