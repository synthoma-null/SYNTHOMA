import fs from 'node:fs';
import path from 'node:path';

describe('global motion contract', () => {
  const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/motion-contract.css'), 'utf8');

  it('kills animations, transitions and smooth scrolling in off mode', () => {
    expect(css).toMatch(/data-motion="off"[\s\S]*animation:\s*none\s*!important/);
    expect(css).toMatch(/data-motion="off"[\s\S]*transition:\s*none\s*!important/);
    expect(css).toMatch(/data-motion="off"[\s\S]*scroll-behavior:\s*auto\s*!important/);
  });

  it('hides every registered decorative video and retro canvas', () => {
    for (const selector of ['synthoma-media-layer__video', 'video-background video', 'chapter-background__video', 'cyklus-menu__video', 'retro-video-canvas']) {
      expect(css).toContain(selector);
    }
  });

  it('uses the corrected body-level legacy selector', () => {
    const effects = fs.readFileSync(path.join(process.cwd(), 'src/styles/effects.css'), 'utf8');
    expect(effects).toContain('body.no-animations:not(.force-shine) .noising-char');
    expect(effects).not.toContain('body:not(.force-shine) .no-animations .noising-char');
  });

  it('keeps the control center tabs outside the scrollable content row', () => {
    const panel = fs.readFileSync(path.join(process.cwd(), 'src/styles/control-panel-os.css'), 'utf8');
    expect(panel).toContain('grid-template-rows: auto auto auto minmax(0, 1fr) auto;');
  });

  it('does not leave an opened control center in its off-canvas transition state', () => {
    const panel = fs.readFileSync(path.join(process.cwd(), 'src/styles/control-panel-os.css'), 'utf8');
    expect(panel).toMatch(/#control-panel\.control-panel\.visible\s*{[^}]*transform:\s*translateX\(0\);[^}]*transition:\s*none;[^}]*visibility:\s*visible;/);
    expect(panel).toContain('#control-panel.control-panel.visible > * { visibility: visible; }');
  });
});
