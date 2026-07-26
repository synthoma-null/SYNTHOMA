import fs from 'node:fs';
import path from 'node:path';

function readStyle(file: string) {
  return fs.readFileSync(path.join(process.cwd(), 'src/styles/cyklus', file), 'utf8');
}

describe('Cyklus gameplay geometry contract', () => {
  const shell = readStyle('shell.css');
  const card = readStyle('card.css');
  const cardOverlay = readStyle('card-overlay.css');
  const compact = readStyle('compact-mobile.css');
  const hud = readStyle('hud.css');
  const tokens = readStyle('tokens.css');
  const client = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/CyklusClient.tsx'), 'utf8');

  it('locks active gameplay below the shared global header', () => {
    expect(shell).toMatch(/\.cyklus-page\s*\{[\s\S]*?--cy-shell-top:\s*var\(--os-command-height, 56px\);[\s\S]*?position:\s*fixed;[\s\S]*?inset:\s*var\(--cy-shell-top\) 0 0;[\s\S]*?height:\s*calc\(100dvh - var\(--cy-shell-top\)\);[\s\S]*?overflow:\s*hidden;/);
    expect(cardOverlay).toMatch(/\.cyklus-page > \.cyklus-root--playing:not\(\.cyklus-root--menu\)\s*\{[\s\S]*?height:\s*calc\(100dvh - var\(--cy-shell-top\) - var\(--cy-shell-bottom\)\);[\s\S]*?min-height:\s*0;/);
    expect(compact).toMatch(/\.cyklus-page > \.cyklus-root--playing\s*\{[\s\S]*?height:\s*calc\(100dvh - var\(--cy-shell-top\) - var\(--cy-shell-bottom\)\);[\s\S]*?overflow:\s*hidden;/);
  });

  it('uses one stat-bar pocket control without duplicate global commands', () => {
    expect(shell).toMatch(/grid-template-rows:\s*auto minmax\(0, 1fr\);/);
    expect(compact).toMatch(/grid-template-rows:\s*44px minmax\(0, 1fr\);/);
    expect(client).toContain('pocketControl={(');
    expect(client).toContain('placement="stat"');
    expect(client.match(/<CyklusPocketDock/g)).toHaveLength(1);
    expect(client).not.toContain('<CyklusMobileUtilityDock');
    expect(client).not.toContain('<CyklusBottomNav');
    expect(client).not.toContain('<CyklusCommandRail');
    expect(shell).toMatch(/\.cyklus-pocket--header,\s*\.cyklus-pocket--stat\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;/);
    expect(shell).toMatch(/\.cyklus-stat-dock:has\([^}]+aria-expanded='true'[^}]+\)\s*\{[\s\S]*?z-index:\s*var\(--cy-z-sheet\);/);
    expect(hud).toMatch(/\.cyklus-stat-dock--with-pocket\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\) minmax\(44px, 52px\);/);
  });

  it('uses the complete stage rect for text and poster cards', () => {
    expect(shell).toMatch(/\.cyklus-stage\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?min-width:\s*0;[\s\S]*?min-height:\s*0;[\s\S]*?overflow:\s*hidden;/);
    expect(card).toMatch(/\.cyklus-card\s*\{[\s\S]*?width:\s*min\(100%, 1360px\);[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*0;/);
    expect(card).not.toMatch(/\.cyklus-card\s*\{[^}]*height:\s*clamp\(/);
    expect(card).not.toMatch(/^\.cyklus-card--poster\s*\{[^}]*height:/m);
    expect(cardOverlay).toMatch(/\.cyklus-root--playing > \.cyklus-stage\s*\{[\s\S]*?grid-template-rows:\s*minmax\(0, 1fr\);/);
    expect(cardOverlay).toMatch(/\.cyklus-card\s*\{[\s\S]*?height:\s*100%;/);
  });

  it('removes the obsolete trace disclosure from gameplay geometry', () => {
    expect(cardOverlay).toMatch(/\.cyklus-root--playing > \.cyklus-stage\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/);
    const statDock = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/StatDock.tsx'), 'utf8');
    expect(client).not.toContain('currentTraceOpen');
    expect(statDock).not.toContain('Otevřít aktuální stopu');
    expect(statDock).not.toContain('STOPA');
    expect(statDock).toContain('{pocketControl}');
  });

  it('scrolls long scene text while keeping naturally sized choices inside the card', () => {
    expect(card).toMatch(/\.cyklus-card-scene\s*\{[\s\S]*?min-height:\s*0;[\s\S]*?overflow-y:\s*auto;[\s\S]*?overscroll-behavior:\s*contain;[\s\S]*?scrollbar-gutter:\s*stable;[\s\S]*?touch-action:\s*pan-y;/);
    expect(client).toMatch(/<CyklusCardScene card=\{card\} \/>[\s\S]*?data-cyklus-choice-dock[\s\S]*?<OutcomePanel/);
    expect(cardOverlay).toMatch(/grid-template-areas:[\s\S]*?"scene"[\s\S]*?"choices";/);
    expect(compact).toMatch(/\.cyklus-card__preview\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);[\s\S]*?min-height:\s*0;/);
    expect(compact).toMatch(/\.cyklus-preview \{[\s\S]*?height:\s*auto;[\s\S]*?max-height:\s*none;/);
    expect(compact).toMatch(/\.cyklus-preview\s+\.cyklus-btn\s*\{[\s\S]*?white-space:\s*normal;[\s\S]*?overflow-wrap:\s*anywhere;/);
    expect(client).not.toContain('className="cyklus-choice-dock"');
  });

  it('keeps one responsive pocket branch for every viewport', () => {
    expect(client.match(/<CyklusPocketDock/g)).toHaveLength(1);
    expect(shell).toMatch(/\.cyklus-pocket--stat \.cyklus-pocket__panel\s*\{[\s\S]*?width:\s*min\(360px, calc\(100vw - 16px\)\);/);
    expect(compact).toMatch(/grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\) 44px;/);
    expect(client).not.toContain('CyklusMobileUtilityDock');
  });

  it('declares one accessible fullscreen viewer with bounded zoom controls', () => {
    const poster = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/CyklusCardPoster.tsx'), 'utf8');
    expect(poster).toContain('const MAX_SCALE = 4');
    expect(poster).toContain('aria-label="Zvětšit obrázek"');
    expect(poster).toContain("event.key !== 'Escape'");
    expect(poster).toContain('onWheel={fullscreen ? handleWheel : undefined}');
    expect(client.match(/createPortal\(/g)).toHaveLength(1);
    expect(tokens).toMatch(/--cy-z-sheet:\s*60;/);
    expect(tokens).toMatch(/--cy-z-critical:\s*120;/);
    expect(card).toMatch(/\.cyklus-poster-viewer\s*\{[\s\S]*?z-index:\s*calc\(var\(--os-z-critical, 120\) \+ 10\);/);
  });
});
