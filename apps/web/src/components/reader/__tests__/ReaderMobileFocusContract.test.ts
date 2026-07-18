import fs from 'node:fs';
import path from 'node:path';

describe('mobile Reader focus contract', () => {
  const readerCss = fs.readFileSync(path.join(process.cwd(), 'src/styles/reader.css'), 'utf8');

  it('keeps the direct Focus control visible on small screens', () => {
    const mobileRules = readerCss.match(/@media \(max-width: 640px\) \{([\s\S]*?)\n\}/)?.[1] ?? '';

    expect(mobileRules).toContain('.chapter-reader__utilities button:last-child { display: none; }');
    expect(mobileRules).not.toContain('button:not(:nth-child(-n+3))');
  });
});
