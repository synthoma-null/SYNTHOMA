import fs from 'node:fs';
import path from 'node:path';

function readStyle(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('Cyklus typography scale contract', () => {
  it('defines readable typography tokens that grow with the root rem scale', () => {
    const tokens = readStyle('src/styles/cyklus/tokens.css');

    expect(tokens).toMatch(/--cy-font-micro:\s*0\.75rem;/);
    expect(tokens).toMatch(/--cy-font-small:\s*0\.8125rem;/);
    expect(tokens).toMatch(/--cy-font-body:\s*0\.875rem;/);
    expect(tokens).toMatch(/--cy-font-control:\s*0\.8125rem;/);
    expect(tokens).toMatch(/--cy-font-value:\s*0\.875rem;/);
  });

  it('uses shared tokens across control surfaces without freezing the scale', () => {
    const legacy = readStyle('src/styles/components.css');
    const controlPanel = readStyle('src/styles/control-panel-os.css');
    const audioPanel = readStyle('src/styles/audio-panel.css');
    const overlays = readStyle('src/styles/cyklus/overlays.css');
    const shell = readStyle('src/styles/cyklus/shell.css');
    const header = readStyle('src/styles/cyklus/command-header.css');

    expect(legacy).not.toMatch(/#control-panel\s*\{\s*--font-size-multiplier:\s*1\s*!important/);
    for (const css of [controlPanel, audioPanel, overlays, shell, header]) {
      expect(css).toMatch(/var\(--cy-font-(?:micro|small|body|control|value)\)/);
    }
    expect(controlPanel).not.toMatch(/font-size:\s*(?:9|10|11)px/);
    expect(audioPanel).not.toMatch(/font:\s*[^;]*(?:9|10|11)px/);
  });

  it('keeps icon controls at 44px while text remains reflowable', () => {
    const header = readStyle('src/styles/cyklus/command-header.css');
    const controlPanel = readStyle('src/styles/control-panel-os.css');

    expect(header).toMatch(/\.cyklus-header__action\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;/);
    expect(controlPanel).toMatch(/\.cp-close\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;/);
    expect(controlPanel).toMatch(/\.slider-label-text\s*\{[\s\S]*?min-width:\s*0;/);
  });
});
