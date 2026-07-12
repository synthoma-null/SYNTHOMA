import fs from 'node:fs';
import path from 'node:path';

const ROUTES = [
  'page.tsx', 'books/page.tsx', 'archive/page.tsx', 'reader/page.tsx', 'cyklus/page.tsx', 'cyklus/void/page.tsx',
  'landing-intro/page.tsx', 'login/page.tsx', 'register/page.tsx', 'privacy/page.tsx', 'terms/page.tsx', 'autor/page.tsx',
];

describe('Synthoma public route smoke contract', () => {
  it.each(ROUTES)('keeps app/%s addressable', (route) => {
    expect(fs.existsSync(path.join(process.cwd(), 'app', route))).toBe(true);
  });

  it('mounts one shared shell and one portal context in the root layout', () => {
    const layout = fs.readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');
    expect(layout.match(/<SynthomaShell>/g)).toHaveLength(1);
    expect(layout.match(/<SynthomaPortalRoot>/g)).toHaveLength(1);
    expect(layout.match(/<SynthomaAudioPanel\s*\/>/g)).toHaveLength(1);
    expect(layout.match(/<SubjectProfilePanelClient\s*\/>/g)).toHaveLength(1);
    expect(layout).toContain('className="skip-to-content"');
  });
});
