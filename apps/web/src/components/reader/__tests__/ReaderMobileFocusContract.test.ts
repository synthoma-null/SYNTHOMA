import fs from 'node:fs';
import path from 'node:path';

describe('mobile Reader command contract', () => {
  const readerCss = fs.readFileSync(path.join(process.cwd(), 'src/styles/reader.css'), 'utf8');

  it('keeps Panel visible and moves secondary controls into it on small screens', () => {
    const mobileRules = readerCss.match(/@media \(max-width: 640px\) \{([\s\S]*?)\n\}/)?.[1] ?? '';

    expect(mobileRules).toContain('.chapter-reader__utilities button { display: none; }');
    expect(mobileRules).toContain('.chapter-reader__utilities button:first-child { display: inline-flex;');
    expect(mobileRules).not.toContain('button:not(:nth-child(-n+3))');
  });
});
