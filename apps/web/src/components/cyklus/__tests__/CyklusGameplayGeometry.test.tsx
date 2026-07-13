import fs from 'node:fs';
import path from 'node:path';

function readStyle(file: string) {
  return fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus', file), 'utf8');
}

describe('Cyklus gameplay geometry contract', () => {
  const shell = readStyle('shell.css');
  const card = readStyle('card.css');
  const compact = readStyle('compact-mobile.css');
  const client = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/CyklusClient.tsx'), 'utf8');
  const bottomNav = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/CyklusBottomNav.tsx'), 'utf8');

  it('keeps active gameplay in a non-scrolling 100dvh shell', () => {
    expect(shell).toMatch(/\.cyklus-page > \.cyklus-root\s*\{[\s\S]*?height:\s*100dvh;[\s\S]*?overflow:\s*hidden;/);
    expect(compact).toMatch(/\.cyklus-page > \.cyklus-root--playing\s*\{[\s\S]*?height:\s*100dvh;[\s\S]*?overflow:\s*hidden;/);
  });

  it('reserves explicit rows for stats, pocket, stage, choices and navigation', () => {
    expect(shell).toMatch(/grid-template-rows:\s*auto auto minmax\(0, 1fr\) auto auto;/);
    expect(compact).toMatch(/grid-template-rows:\s*44px 38px minmax\(0, 1fr\) 58px calc\(var\(--cy-bottom-height\)/);
    expect(client.indexOf('<StatDock')).toBeLessThan(client.indexOf('<CyklusPocketDock'));
    expect(client.indexOf('<CyklusPocketDock')).toBeLessThan(client.indexOf('<main className="cyklus-stage">'));
    expect(client.indexOf('<main className="cyklus-stage">')).toBeLessThan(client.indexOf('data-cyklus-choice-dock'));
  });

  it('uses the complete stage rect for text and poster cards', () => {
    expect(shell).toMatch(/\.cyklus-stage\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?min-width:\s*0;[\s\S]*?min-height:\s*0;[\s\S]*?overflow:\s*hidden;/);
    expect(card).toMatch(/\.cyklus-card\s*\{[\s\S]*?width:\s*min\(100%, 1360px\);[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*0;/);
    expect(card).not.toMatch(/\.cyklus-card\s*\{[^}]*height:\s*clamp\(/);
    expect(card).not.toMatch(/^\.cyklus-card--poster\s*\{[^}]*height:/m);
  });

  it('scrolls long scene text internally while choices remain outside the card', () => {
    expect(card).toMatch(/\.cyklus-card-scene\s*\{[\s\S]*?min-height:\s*0;[\s\S]*?overflow-y:\s*auto;[\s\S]*?overscroll-behavior:\s*contain;[\s\S]*?scrollbar-gutter:\s*stable;[\s\S]*?touch-action:\s*pan-y;/);
    expect(client).toMatch(/<\/main>[\s\S]*?data-cyklus-choice-dock/);
    expect(card).toMatch(/\.cyklus-choice-dock\s*\{[\s\S]*?max-width:\s*1360px;[\s\S]*?overflow:\s*hidden;/);
  });

  it('keeps one non-fixed pocket trigger out of BottomNav', () => {
    const pocketBlock = shell.match(/\.cyklus-pocket--standalone\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(pocketBlock).toContain('position: relative');
    expect(pocketBlock).not.toMatch(/position:\s*(?:fixed|sticky)|bottom:\s*0|margin-top:\s*auto/);
    expect(bottomNav).not.toContain('KAPSA');
    expect(client.match(/<CyklusPocketDock/g)).toHaveLength(1);
  });

  it('declares one accessible fullscreen viewer with bounded zoom controls', () => {
    const poster = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/CyklusCardPoster.tsx'), 'utf8');
    expect(poster).toContain('const MAX_SCALE = 4');
    expect(poster).toContain('aria-label="Zvětšit obrázek"');
    expect(poster).toContain("event.key !== 'Escape'");
    expect(poster).toContain('onWheel={fullscreen ? handleWheel : undefined}');
    expect(client.match(/createPortal\(/g)).toHaveLength(1);
  });
});
