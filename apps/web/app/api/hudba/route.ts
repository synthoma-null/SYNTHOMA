import { readdir } from 'node:fs/promises';
import path from 'node:path';

// Generate the catalog from the same files that this deployment serves.
// No filesystem access or extra copy of the MP3s is needed in production.
export const dynamic = 'force-static';

const originalOrder = [
  'Otrok tvých rtů.mp3', 'Slunce se taky neptá.mp3', 'Střepina.mp3',
  'Tichá síla.mp3', 'Architektura žáru.mp3', 'Close to you.mp3',
  'Dobrou noc.mp3', 'Ghost Inside Your Skin.mp3', 'Keys to the lock.mp3', 'Kráska.mp3',
];

export async function GET() {
  const entries = await readdir(path.join(process.cwd(), 'public', 'hudba'), { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && /\.mp3$/i.test(entry.name)).map((entry) => entry.name);
  files.sort((a, b) => {
    const first = originalOrder.indexOf(a);
    const second = originalOrder.indexOf(b);
    return (first < 0 ? Infinity : first) - (second < 0 ? Infinity : second) || a.localeCompare(b, 'cs', { numeric: true });
  });

  return Response.json(files.map((file) => ({
    title: file.replace(/\.mp3$/i, ''),
    url: `/hudba/${encodeURIComponent(file)}`,
  })), { headers: { 'Cache-Control': 'no-cache' } });
}
