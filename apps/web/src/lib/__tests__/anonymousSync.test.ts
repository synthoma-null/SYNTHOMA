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

  it('keeps reader choice tracking local until a session is authenticated', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'src/hooks/useChoiceTracking.ts'), 'utf8');
    const anonymousGuard = source.indexOf('sessionStatus !== "authenticated"');
    const privateRequest = source.indexOf('fetch("/api/me/choices"');
    expect(anonymousGuard).toBeGreaterThan(-1);
    expect(anonymousGuard).toBeLessThan(privateRequest);
  });

  it('keeps Cyklus server sync disabled until an authenticated client enables it', () => {
    const storage = fs.readFileSync(path.join(process.cwd(), 'src/game/cyklus/cyklusStorage.ts'), 'utf8');
    const client = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/CyklusClient.tsx'), 'utf8');
    const voidHub = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/CyklusVoidHubClient.tsx'), 'utf8');
    expect(storage).toContain('let serverSyncEnabled = false');
    expect(storage).toContain("if (!serverSyncEnabled || typeof window === 'undefined') return");
    expect(client).toContain("setServerSyncEnabled(sessionStatus === 'authenticated')");
    expect(voidHub).toContain("setServerSyncEnabled(sessionStatus === 'authenticated')");
  });
});
