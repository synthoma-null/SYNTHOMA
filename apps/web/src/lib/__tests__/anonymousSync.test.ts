import fs from 'node:fs';
import path from 'node:path';

describe('anonymous public route sync contract', () => {
  it.each([
    'src/lib/synthoma/library/useLibraryProgress.ts',
    'app/archive/ArchiveClient.tsx',
    'src/lib/synthoma/archive/useArchiveSnapshot.ts',
    'src/components/reader/ChapterReadingProgress.tsx',
    'app/components/ThemeShopClient.tsx',
    'app/reader/ReaderContent.tsx',
  ])('%s gates private sync behind an authenticated session', (filename) => {
    const source = fs.readFileSync(path.join(process.cwd(), filename), 'utf8');
    expect(source).toContain("'authenticated'");
    expect(source).toMatch(/sessionStatus|status/);
  });

  it('prevents the global access provider from resolving or purchasing anonymously', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'src/components/access/AccessProvider.tsx'), 'utf8');
    expect(source).toContain("if (status !== 'authenticated')");
    expect(source).toContain("'AUTH_REQUIRED'");
    expect(source).toContain("status === 'authenticated' && requestedRef.current.size");
  });
});
