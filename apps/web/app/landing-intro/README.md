# Landing Intro (Standalone)

Samostatná hlavní stránka s intrem a videem na pozadí. Přístupná na `/landing-intro`.

## Co obsahuje
- `page.tsx` – jednoduchá TSX stránka s ovládáním videopozadí (play/pause, mute, hlasitost, výběr kvality, přepínání klipů, skrytí overlaye, výběr motivu).
- `styles.module.css` – lokální styly (CSS Modules) + lokální motivy přes `data-theme` a lokální webfonty přes `@font-face`.

## Motivy (themes)
Přepínač motivu je v pravé části ovládacího panelu. Dostupné varianty: `default`, `neon`, `glitch`, `void`.

## Fonty
Stránka používá lokální webfonty definované v `styles.module.css`:
- Sans: `LI-Inter` (variable) – očekává soubor `public/landing-intro/fonts/Inter-Variable.woff2`
- Mono: `LI-JetBrainsMono` (variable) – očekává soubor `public/landing-intro/fonts/JetBrainsMono-Variable.woff2`

Pokud máte jen statické řezy, upravte `@font-face` definice a použijte např. `Inter-Regular.woff2`, `Inter-Bold.woff2` atd.

## Jak to rozběhnout
1. Vložte videa do `public/landing-intro/` (např. `video1-1080p.mp4`, `video1-720p.mp4`, `video2-1080p.mp4`, ...).
2. Vložte fonty do `public/landing-intro/fonts/` podle názvů výše (nebo upravte cesty v `styles.module.css`).
3. V `page.tsx` upravte pole `videos` podle svých souborů (cesty jsou relativní k `public/`).
4. Spusťte projekt a otevřete `/landing-intro`.

## Přenositelnost
Pro přenos stačí zkopírovat:
- složku `app/landing-intro/`
- složku `public/landing-intro/` (s videi a `fonts/`)
Nic dalšího není potřeba.

## Poznámky
- Autoplay může být blokován prohlížečem. Klikněte na ▶ a podle potřeby ztlumte/odemkněte zvuk.
- Pro lepší čitelnost je použit jemný skleněný overlay; v Safari je aktivní přes `-webkit-backdrop-filter`.
