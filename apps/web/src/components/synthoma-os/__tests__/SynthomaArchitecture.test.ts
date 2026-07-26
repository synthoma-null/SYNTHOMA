import fs from 'node:fs';
import path from 'node:path';

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');

describe('SYNTHOMA OS architecture', () => {
  it('owns the global header, route background, navigation and footer in one shell', () => {
    const shell = read('src/components/synthoma-os/SynthomaShell.tsx');
    expect(shell.match(/<SynthomaCommandHeader/g)).toHaveLength(1);
    expect(shell.match(/<SynthomaGlobalBackground/g)).toHaveLength(1);
    expect(shell.match(/<SynthomaMobileNavigation/g)).toHaveLength(1);
    expect(shell.match(/<SynthomaFooter/g)).toHaveLength(1);
    expect(shell).not.toContain("!cyklus && <SynthomaCommandHeader");
  });

  it('keeps active public routes out of the background media business', () => {
    const owners = [
      'src/components/home/SynthomaHome.tsx',
      'src/components/library/SynthomaLibrary.tsx',
      'src/components/archive/SynthomaArchive.tsx',
      'app/autor/AutorClient.tsx',
      'app/login/page.tsx',
      'app/register/page.tsx',
    ];
    for (const file of owners) {
      const source = read(file);
      expect(source).not.toContain('<video');
      expect(source).not.toContain('SynthomaMediaLayer');
    }
  });

  it('keeps chapter and Cyklus media as explicit immersive exceptions', () => {
    expect(read('src/components/synthoma-os/SynthomaGlobalBackground.tsx')).toMatch(/pathname\.startsWith\('\/chapter\/'\)[\s\S]*pathname\.startsWith\('\/cyklus'\)/);
    expect(read('src/components/reader/ChapterBackground.tsx')).toContain('<video');
    expect(read('src/components/cyklus/CyklusClient.tsx')).toContain('cyklus-menu__video');
  });

  it('removes the global glass preference and legacy runtime hooks', () => {
    const preferences = read('src/lib/uiPreferences.ts');
    const bootstrap = read('src/lib/uiPreferenceBootstrap.ts');
    const controls = read('app/components/ControlCenterClient.tsx');
    expect(preferences).not.toContain('glassEnabled:');
    expect(preferences).not.toContain('glassBlur:');
    expect(preferences).not.toContain('dataset.readerGlass =');
    expect(bootstrap).not.toContain('raw.glassEnabled');
    expect(bootstrap).not.toContain('raw.glassBlur');
    expect(controls).not.toContain('preferences.glassEnabled');
    expect(controls).not.toContain('preferences.glassBlur');
  });

  it('keeps one shared audio engine and no duplicate Cyklus global controls', () => {
    const layout = read('app/layout.tsx');
    const rail = read('src/components/cyklus/CyklusCommandRail.tsx');
    expect(layout.match(/<GlobalAudioClient/g)).toHaveLength(1);
    expect(layout.match(/<SynthomaAudioPanel/g)).toHaveLength(1);
    expect(rail).not.toContain('toggle-panel-btn');
    expect(rail).not.toContain('toggle-audio-panel-btn');
    expect(rail).not.toContain('synthoma:identity-toggle');
  });
});
