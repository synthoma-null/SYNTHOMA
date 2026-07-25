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
  const trace = readStyle('trace-panel.css');
  const tokens = readStyle('tokens.css');
  const client = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/CyklusClient.tsx'), 'utf8');

  it('locks active gameplay to the complete viewport without global shell offsets', () => {
    expect(shell).toMatch(/\.cyklus-page\s*\{[\s\S]*?--cy-shell-top:\s*0px;[\s\S]*?position:\s*fixed;[\s\S]*?inset:\s*0;[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100dvh;[\s\S]*?min-height:\s*100dvh;[\s\S]*?overflow:\s*hidden;/);
    expect(cardOverlay).toMatch(/\.cyklus-page > \.cyklus-root--playing:not\(\.cyklus-root--menu\)\s*\{[\s\S]*?height:\s*calc\(100dvh - var\(--cy-shell-top\) - var\(--cy-shell-bottom\)\);[\s\S]*?min-height:\s*0;/);
    expect(shell).toMatch(/@media \(max-width: 767px\)[\s\S]*?--cy-shell-top:\s*0px;[\s\S]*?--cy-shell-bottom:\s*0px;/);
    expect(compact).toMatch(/\.cyklus-page > \.cyklus-root--playing\s*\{[\s\S]*?height:\s*calc\(100dvh - var\(--cy-shell-top\) - var\(--cy-shell-bottom\)\);[\s\S]*?overflow:\s*hidden;/);
  });

  it('uses one compact header pocket control without separate gameplay rows', () => {
    expect(shell).toMatch(/grid-template-rows:\s*44px auto minmax\(0, 1fr\);/);
    expect(compact).toMatch(/grid-template-rows:\s*44px 44px minmax\(0, 1fr\);/);
    expect(client).toContain('pocketControl={!ending ? (');
    expect(client).toContain('placement="header"');
    expect(client.match(/<CyklusPocketDock/g)).toHaveLength(1);
    expect(client).not.toContain('<CyklusMobileUtilityDock');
    expect(client).not.toContain('<CyklusBottomNav');
    expect(shell).toMatch(/\.cyklus-pocket--header\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;/);
    expect(shell).toMatch(/\.cyklus-game-header:has\([^}]+aria-expanded='true'[^}]+\)\s*\{[\s\S]*?z-index:\s*var\(--cy-z-sheet\);/);
  });

  it('uses the complete stage rect for text and poster cards', () => {
    expect(shell).toMatch(/\.cyklus-stage\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?min-width:\s*0;[\s\S]*?min-height:\s*0;[\s\S]*?overflow:\s*hidden;/);
    expect(card).toMatch(/\.cyklus-card\s*\{[\s\S]*?width:\s*min\(100%, 1360px\);[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*0;/);
    expect(card).not.toMatch(/\.cyklus-card\s*\{[^}]*height:\s*clamp\(/);
    expect(card).not.toMatch(/^\.cyklus-card--poster\s*\{[^}]*height:/m);
    expect(cardOverlay).toMatch(/\.cyklus-root--playing > \.cyklus-stage\s*\{[\s\S]*?grid-template-rows:\s*minmax\(0, 1fr\);/);
    expect(cardOverlay).toMatch(/\.cyklus-card\s*\{[\s\S]*?height:\s*100%;/);
  });

  it('keeps the current trace out of gameplay geometry until the desktop disclosure opens', () => {
    expect(cardOverlay).toMatch(/\.cyklus-root--playing > \.cyklus-stage\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/);
    expect(client).toContain('{currentTraceOpen && !mobileGameplayLayout && (');
    expect(client).not.toMatch(/<>\s*<ActiveObjectivePanel/);
    expect(trace).toMatch(/\.cyklus-stage > \.cyklus-active-objective--popover\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?z-index:\s*var\(--cy-z-sheet\);[\s\S]*?max-height:\s*calc\(100% - \(2 \* var\(--cy-space-2\)\)\);[\s\S]*?overflow:\s*hidden;/);
    expect(trace).toMatch(/\.cyklus-active-objective--popover \.cyklus-active-objective__body\s*\{[\s\S]*?overflow-y:\s*auto;[\s\S]*?overscroll-behavior:\s*contain;/);
  });

  it('keeps one 44px desktop trace utility while retaining the four-column mobile stat dock', () => {
    expect(client.match(/aria-label="Otevřít aktuální stopu"/g) ?? []).toHaveLength(0);
    const statDock = fs.readFileSync(path.join(process.cwd(), 'src/components/cyklus/StatDock.tsx'), 'utf8');
    expect(statDock.match(/aria-label="Otevřít aktuální stopu"/g)).toHaveLength(1);
    expect(statDock).toContain("aria-controls={traceOpen ? 'cyklus-current-trace-panel' : undefined}");
    expect(statDock).toContain('aria-expanded={traceOpen}');
    expect(trace).toMatch(/\.cyklus-stat-dock__trace-trigger\s*\{[\s\S]*?min-height:\s*44px;/);
    expect(trace).toMatch(/@media \(max-width: 767px\)[\s\S]*?\.cyklus-stat-dock--with-trace\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/);
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
    expect(shell).toMatch(/\.cyklus-pocket--header \.cyklus-pocket__panel\s*\{[\s\S]*?width:\s*min\(360px, calc\(100vw - 16px\)\);/);
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
