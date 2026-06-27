# SYNTHOMA — Kompletní auditní zpráva

**Datum:** červen 2025 (aktualizováno červen 2026)  
**Rozsah:** Hloubková analýza celého projektu — architektura, funkčnost mechanismů, vizuální konzistence, CSS styly, bezpečnost, přístupnost, výkon a SEO.

---

## 1. Přehled projektu

**Typ:** Interaktivní webová čtečka / glitch-noir knižní platforma s meta-game ekonomikou  
**Stack:** Next.js 15.5 (App Router) · React 18.3 · TypeScript 5 · Prisma 7.8 · PostgreSQL · CSS Modules + globální CSS  
**Monorepo:** Strukturální (root `c:\SYNTHOMA`, aplikace v `apps/web`)  
**Runtime:** Node.js >= 20, npm >= 10  
**Cílové prostředí:** Vercel (SSR/ISR + static export)

### 1.1 Struktura routingu

| Route | Typ | Popis |
|---|---|---|
| `/` | Client (SSR shell) | Domovská stránka s menu, glitch titulkem, continue-reading |
| `/landing-intro` | Client | Cinematický onboarding s TypewriterReader, CTA |
| `/books` | ISR (1h) | Knihovna sbírek a kapitol z `manifest.json` |
| `/reader` | Client (dynamic import) | Hlavní čtečka s typewriter efektem |
| `/archive` | ISR (1h) | Lore karty z `archiveCards.json` |
| `/autor` | SSR + Client | Stránka autora s TypewriterReader |
| `/profile` | Dynamic | Profil subjektu s profilem, CYKLUS, achievementy |
| `/sitemap.xml` | Dynamic | Generováno z `manifest.json` |

**API Routes (červen 2026):**

| Endpoint | Metody | Funkce |
|---|---|---|
| `/api/me/run` | GET, PATCH | Run stav, update stability/pressure/shadow |
| `/api/me/choices` | GET, POST | Záznam voleb, run delta, aktivace misí |
| `/api/me/progress` | GET, POST | Čtecí pokrok, completed flag |
| `/api/me/profile` | GET, PATCH | Profil subjektu, mnem balance |
| `/api/me/missions` | GET | Aktivní mise subjektu |
| `/api/me/artifacts` | GET, POST | Artefakty, nákup za mnemy |
| `/api/me/badges` | GET | Odznaky subjektu |
| `/api/whispers` | GET, POST | Šepoty komunity |
| `/api/whispers/[id]/resonate` | POST | Rezonance na šepot |
| `/api/whispers/[id]/boost` | POST | Boost šepotu za mnemy |
| `/api/admin/whispers` | GET, PATCH | Moderace šepotů (admin only) |

### 1.2 Klíčové datové soubory

- `public/books/manifest.json` — 1 kolekce „SYNTHOMA-NULL", 21 kapitol (12 final, 9 draft)
- `public/data/archiveCards.json` — lore karty
- `public/data/SYNTHOMAAUTOR.html` — autorský obsah
- `public/data/SYNTHOMAINFO.html` — intro obsah pro landing
- `src/data/playlist.ts` — 13 audio tracků

---

## 2. Architektura a konfigurace

### 2.1 Next.js (`next.config.ts`)

**Stav: V pořádku**

- `reactStrictMode: true` — správně zapnuto
- Security headers korektně nastaveny:
  - `Content-Security-Policy` — dynamicky dle `NODE_ENV` (development povoluje `unsafe-eval` pro HMR)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` — blokuje camera, microphone, geolocation

**Nález [NÍZKÁ priorita]:** CSP v produkci povoluje `'unsafe-inline'` pro styly — běžné pro Next.js, ale lze zpřísnit pomocí nonce.

### 2.2 TypeScript (`tsconfig.json`)

**Stav: Výborný**

- `strict: true` + `noUncheckedIndexedAccess: true` + `exactOptionalPropertyTypes: true` — nadstandardně přísná konfigurace
- `target: ES2017` — kompatibilní se všemi moderními prohlížeči
- `moduleResolution: node` — standardní pro Next.js

### 2.3 ESLint + Prettier

**Stav: V pořádku**

- Extends `next/core-web-vitals`
- `no-console` nastaveno na `warn` (kromě `warn`/`error`) — dobré pro produkci
- `@next/next/no-img-element` vypnuto — vědomé rozhodnutí (projekt nepoužívá `next/image`)
- Prettier: `singleQuote`, `trailingComma: es5`, `semi: true`, `printWidth: 100`

### 2.4 Package.json

**Stav: V pořádku**

- Scripts: `dev`, `build` (`prisma generate && next build`), `start`, `lint`, `format`, `typecheck`, `validate:chapters`, `test`
- `engines`: Node >= 20, npm >= 10
- Závislosti: Next.js 15.5, React 18.3.1, Prisma 7.8, @prisma/adapter-pg, pg, next-auth 5 beta, stripe, zod

**Nález [NÍZKÁ]:** `validate:chapters` skript (`scripts/validate-books.js`) validuje pouze `data-tags` atributy na `<p class="choice">`. Nevaliduje existenci odkazovaných souborů ani konzistenci s `manifest.json`.

### 2.5 Jest (`jest.config.js`)

**Nález [STŘEDNÍ]:** Konfigurace používá `moduleNameMapping` místo správného `moduleNameMapper`. Toto pole Jest tiše ignoruje — aliasy `@/` nefungují v testech.

```js
// Aktuální (chybný):
moduleNameMapping: { '^@/(.*)$': '<rootDir>/src/$1' }
// Správný:
moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }
```

---

## 3. Funkčnost mechanismů

### 3.1 TypewriterReader (core čtečka)

**Stav: Funkční, komplexní**

Mechanismus: Fetch HTML kapitoly → sanitizace → progressivní vykreslování po znacích → detekce choice bloků → MBTI scoring.

- `typewriterContent.ts` — `sanitizeHTML()` odstraňuje `<script>`, `<iframe>`, `on*` handlery, `javascript:` URL, inline `style` atributy. **Bezpečnostní vrstva je solidní.**
- `splitContentAtChoices()` — správně dělí obsah na pre/choice/remainder segmenty pomocí DOM Range API
- `revealHtmlPreserve()` — progressivní odhalování zachovávající HTML strukturu
- `typewriter.ts` — `runTypewriter()` respektuje `prefers-reduced-motion` (okamžité vykreslení)

**Nález [NÍZKÁ]:** `sanitizeHTML()` odstraňuje všechny `style` atributy — to je záměrné pro bezpečnost, ale může ovlivnit autorské formátování v kapitolách.

### 3.2 Glitch Heading (`glitchHeading.ts`)

**Stav: Výborný**

- Pracuje na per-character `<span>` elementech (`.glitch-char`) — stabilní layout bez DOM churn
- Konfigurovatelné: `intervalMs`, `perCharChance`, `perTickMax`, `glitchMinMs`/`glitchMaxMs`
- Respektuje `prefers-reduced-motion`
- Správně zastavuje animace při skrytém tabu (`document.visibilityState`)
- Cleanup funkce korektně čistí timery a obnovuje originální text

### 3.3 Audio systém

**Stav: Funkční s drobnými poznámkami**

Vrstvy:
1. `audio.ts` — singleton `getSharedAudio()` s DOM elementem
2. `ControlPanelClient.tsx` — playlist management, play/pause/stop/loop, progress bar
3. `GlobalAudioClient.tsx` — persistuje přehrávání přes navigaci a visibility changes
4. `playlist.ts` — 13 tracků s mood tagy

**Nález [STŘEDNÍ]:** `audio.ts:getSharedAudio()` hardcoduje `/audio/SynthBachmoff.mp3` jako výchozí zdroj a aktivně přepisuje `<source>` pokud neodpovídá. To může kolidovat se stavem playlistu v ControlPanelu, který nastavuje jiné tracky.

**Nález [NÍZKÁ]:** Service Worker (`sw.js`) necachuje audio soubory explicitně, ale zachytí je přes catch-all fetch handler. Audio soubory mohou být velké — zvážit explicitní strategii (network-first pro media).

### 3.4 MBTI systém

**Stav: Dobře navržený**

Vrstvy:
1. `MBTIProviderClient.tsx` — React Context, persistence do localStorage, sync přes `storage` event a custom `synthoma:choice-made` event
2. `MBTIHudClient.tsx` — vizuální HUD s progress bary pro osy E/I, S/N, T/F, P/J
3. `public/books/mbti.js` — vanilla JS handler pro kapitolové HTML soubory
4. `validate-books.js` — validátor `data-tags` atributů

- URL seeding: `?mbti=INFJ` nastaví počáteční skóre
- Klávesová zkratka `Alt+M` pro toggle HUD
- HUD se dynamicky umisťuje vedle toggle tlačítka panelu

**Nález [NÍZKÁ]:** `mbti.js` (vanilla) a `MBTIProviderClient` (React) oba zapisují do `localStorage.mbtiScores`. Synchronizace funguje přes `storage` event, ale pokud obě vrstvy zapíší ve stejném ticku, může dojít k race condition.

### 3.5 Control Panel (`ControlPanelClient.tsx`)

**Stav: Funkční, velmi rozsáhlý (~1100 řádků)**

Funkce:
- **Animace:** toggle `body.no-animations`, persistence
- **Glass mode:** toggle `.glass` na `.SYNTHOMAREADER` elementech
- **Font size:** CSS variable `--font-size-multiplier`
- **Opacity/Blur:** CSS variables `--app-bg-opacity`, `--app-bg-blur`
- **Themes:** 7 témat přes `data-theme` na `<html>`
- **Audio:** Play/pause, stop, playlist, loop, progress bar
- **TTS:** Web Speech API — sběr textu z aktuální stránky, chunking po větách, persistence stavu

**Nález [STŘEDNÍ]:** Komponent je monolitický (~1100 řádků). Doporučuji extrakci do submodulů (audio, TTS, themes, animations) pro lepší udržitelnost.

**Nález [NÍZKÁ]:** TTS implementace závisí na dostupnosti `window.speechSynthesis`, která nemusí být k dispozici ve všech prohlížečích (zejména starší mobilní). Fallback/chybová zpráva není uživateli zobrazena.

### 3.6 ScrollGuard (`ScrollGuardClient.tsx`)

**Stav: Solidní**

- MutationObserver na reader kontejnerech
- Anchor-delta přístup (bod 16,16 obrazovky) pro stabilitu pozice
- Respektuje uživatelský scroll (nezasahuje, pokud uživatel scrolluje)
- Reaguje na `pathname` změny

### 3.7 RetroPixelCanvas (`RetroPixelCanvasClient.tsx`)

**Stav: Funkční**

- Canvas overlay pro Retro Arcade téma
- Čte CSS proměnné (`--retro-canvas-pixelate`, `--pixelate-scale`)
- Sampling videa do offscreen canvasu → upscale bez smoothingu
- MutationObserver pro retargetování při změně video zdroje
- Skrývá canvas automaticky, když téma není aktivní

### 3.8 FirstVisitRedirect

**Stav: V pořádku**

- Při prvním návštěvě přesměruje na `/landing-intro`
- Persistence přes `localStorage.visited_once`

### 3.9 Service Worker (`sw.js`)

**Stav: Funkční s poznámkami**

- Cache-first pro statické assety, stale-while-revalidate pro HTML
- Offline fallback na `/`

**Nález [STŘEDNÍ]:** `CACHE_NAME = 'synthoma-v1'` — při aktualizaci obsahu je potřeba manuálně změnit verzi. Bez automatického cache busting mechanismu mohou uživatelé vidět zastaralý obsah.

---

## 4. CSS styly a vizuální konzistence

### 4.1 Architektura stylů

Globální CSS (importováno v `layout.tsx`):
1. `base.css` (228 řádků) — reset, CSS variables, font-face, focus-visible, noscript
2. `components.css` (2365 řádků) — utility třídy, typografie, panel, button, choice
3. `effects.css` (524 řádků) — animace, typewriter, glitch, neon efekty
4. `themes.css` (353 řádků) — 7 barevných témat
5. `reader.css` (647 řádků) — SYNTHOMAREADER, loading, choices, control panel, playlist

CSS Modules (per-route):
- `menu.module.css` — homepage menu a lore sekce
- `books.module.css` — knihovna
- `autor.module.css` — autor stránka (noscript fallback)
- `ReaderContent.module.css` — reader-specifické styly
- `landing-intro/styles.module.css` — landing page

### 4.2 Konzistence barevného systému

**Stav: Sjednocený, téma-aware**

Všechny komponenty používají CSS proměnné:
- `--text-primary`, `--text-secondary`, `--text-accent`
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-glass`
- `--accent-primary`, `--accent-secondary`, `--accent-warning`, `--accent-error`
- `--glow-primary`, `--glow-secondary`
- `--border-primary`, `--border-secondary`, `--border-tertiary`
- `--shadow-primary`, `--shadow-glow`
- `--filter-primary`

**7 témat:**
1. `synthoma` (default) — cyan/magenta neon
2. `green-matrix` — zelený matrix
3. `neon-hellfire` — červené peklo
4. `cyber-dystopia` — studená dystopie
5. `acid-glitch` — kyselinový glitch
6. `retro-arcade` — pixelovaný retro + CRT scanlines
7. `mono` — černobílý, grayscale filter

**Nález [NÍZKÁ]:** Některé hardcoded barvy přetrvávají:
- `ReaderContent.module.css` — `.readerHeader` background `#262626`, `.readerTitle` color `#60a5fa`, `.helpModalTitle` color `#60a5fa` — nesledují téma
- `menu.module.css` — `.link` background `rgba(18,18,22,.65)`, color `#f7f7ff` — pevné hodnoty
- `reader.css` — `.error` color `#f00` — hardcoded

### 4.3 Typografie

**Stav: Konzistentní**

- `h1`, `h2` — font `'Synthoma'`, `clamp()` pro responzivitu
- `h3` — font `'Text01'`
- `h4-h6` — font `'Text01'`, `calc(1.7rem * var(--font-size-multiplier))`
- `p` — `inherit`, `calc(1.1rem * var(--font-size-multiplier))`
- `.log` — `'Text03i'`, uppercase, bold
- `.dialog` — `'Text03i'`, italic, bold
- `.dialogG` (Glitchka) — `'Text03i'`, žlutý akcent

Všechny textové elementy respektují `--font-size-multiplier` z Control Panelu.

### 4.4 Responzivita

**Stav: Pokryta, ale nerovnoměrně**

Breakpointy:
- `800px` — menu přechod na 1 sloupec, reader padding
- `768px` — reader container padding
- `700px` — control panel na 1 sloupec, playlist zmenšení
- `640px` — homepage padding, glitch heading spacing, chapter nav
- `520px` — lore grid 1 sloupec
- `400px` — ultra-small padding úprava

Height breakpointy (menu):
- `740px`, `620px`, `520px` — progresivní zmenšení paddingu

**Nález [STŘEDNÍ]:** Breakpointy nejsou sjednocené do systému. Globální CSS používá `800px`, CSS modules `640px`, `768px`, components `700px`. Doporučuji definovat breakpoint proměnné nebo komentářem zdokumentovat systém.

### 4.5 Textové efekty

**Stav: Bohatá knihovna, sjednocená**

Inline efekty (display: inline): `fx-neon`, `fx-glow-magenta`, `fx-shadow-lg`, `fx-outline`, `fx-gradient`, `fx-rainbow`, `fx-noise`, `fx-flicker`, `fx-wave`, `fx-underline`, `fx-uppercase-wide`, `.halo`, `.datastream`, `.echo-ghost`, `.memory-leak`, `.overheat`, `.neon-blood`, `.corrupt`

Blokové efekty: `effect-pulseWave`, `effect-riftGlow`, `effect-kernelBlink`, `effect-fogNoise`, `effect-crtTerminal`, `.static-noise`, `.quantum-blur`, `.redacted`, `.bios-warning`

Safeguard v `components.css:351`: Inline efekty jsou explicitně nastaveny na `display: inline; vertical-align: baseline;` — brání nechtěnému blokovému chování.

### 4.6 Animace a A11y

**Stav: Výborný**

- `prefers-reduced-motion: reduce` — konzistentně ošetřeno ve všech třech CSS souborech
- `body.no-animations` — kill-switch z Control Panelu
- `.allow-alarm` — override pro kritické alarm emote i při vypnutých animacích
- `:focus-visible` — globální outline styl definovaný v `base.css`
- Skip-to-content link v `layout.tsx`

### 4.7 Glass mode

**Stav: Sjednocený**

- `.SYNTHOMAREADER.glass` — `backdrop-filter: blur(80px)`, transparentní pozadí
- `.glass` disabluje `::before` overlay na `.chapter-content`
- Při typingu (`.SYNTHOMAREADER.typing.glass`) se backdrop-filter vypíná pro GPU úlevu
- Fallback pro prohlížeče bez `color-mix()` support

### 4.8 Duplikace CSS pravidel

**Nález [STŘEDNÍ]:** `.choice-link` je stylovaná na třech místech:
1. `components.css:77-99` — hlavní definice
2. `reader.css:265-280` — reader-specifická varianta s mírně odlišnými hodnotami (`border-radius: 6px` vs `8px`, `padding: 0.25rem 0.5rem` vs `0.35rem 0.6rem`)
3. `themes.css` — choice button styly v `#hero-info`

Doporučuji sjednotit do jednoho zdroje pravdy v `components.css`.

### 4.9 User-select

**Nález [STŘEDNÍ]:** `components.css:210-215` globálně zakazuje výběr textu:
```css
:where(html, body, *) {
  -webkit-user-select: none;
  user-select: none;
}
```
To brání uživatelům kopírovat text. Pro čtečku literárních děl to může být záměrné (ochrana obsahu), ale negativně ovlivňuje UX a přístupnost (screen readery, asistivní technologie).

---

## 5. HTML kapitolové soubory

### 5.1 Struktura

Každý kapitolový HTML soubor obsahuje:
```html
<meta charset="UTF-8">
<link rel="stylesheet" href="/styles.css" />
<script src="/books/mbti.js" defer></script>
<script src="/books/glitch-toggle.js" defer></script>
<body>
  <p class="log">...</p>
  <p class="dialog">...</p>
  <h1 class="title">NÁZEV KAPITOLY</h1>
  <p class="text">... obsah s efekty ...</p>
  <p class="choice" data-tags="I">...</p>
</body>
```

**Nález [NÍZKÁ]:** HTML soubory nemají `<!DOCTYPE html>`, `<html>`, ani `<head>` tagy. To je akceptovatelné, protože se nepoužívají jako standalone stránky — obsah se fetchuje a injektuje do Next.js readeru přes `sanitizeHTML()`.

### 5.2 Reference na `/styles.css`

Kapitolové HTML soubory odkazují na `<link rel="stylesheet" href="/styles.css" />`. Soubor `public/styles.css` existuje (356 řádků), ale je to **legacy CSS** s vlastními proměnnými (`:root { --neon-cyan: #00ffcc; }`) odlišnými od hlavního témového systému (`--accent-secondary: #0ff`).

**Nález [STŘEDNÍ]:** Tento soubor je relevantní pouze pokud by kapitoly byly otevřeny přímo v prohlížeči (mimo Next.js reader). V praxi `sanitizeHTML()` odstraní `<link>` a `<style>` tagy, takže se `styles.css` v readeru nepoužívá. Nicméně existence dvou nezávislých systémů barevných proměnných je matoucí.

### 5.3 Vanilla JS skripty

- `mbti.js` (169 řádků) — MBTI scoring, toast notifikace, `fx-outline` toggle, choice handling s vizuálním feedbackem (selected/disabled)
- `glitch-toggle.js` (11 řádků) — toggle `.glitch-echo` na `.fx-glitch` elementech

Tyto skripty se načítají s `defer` a fungují nezávisle na React. V kontextu Next.js readeru se nenačtou (sanitizace odstraní `<script>`), ale MBTI scoring z kapitol se propaguje přes localStorage → React `MBTIProviderClient`.

### 5.4 Manifest

- 21 kapitol ve sbírce „SYNTHOMA-NULL"
- 12 se statusem `final`, 9 se statusem `draft`
- `draft` kapitoly mají `free: false`
- 4 kapitoly mají přiřazený audio track
- 5 kapitol má background video, zbylé mají prázdný string `""`

**Nález [NÍZKÁ]:** Kapitoly se statusem `draft` a `free: false` jsou v manifestu, ale fyzické HTML soubory nebyly ověřeny. Pokud chybí, reader zobrazí chybu při pokusu o načtení.

---

## 6. Chybějící assety a broken reference

### 6.1 PWA ikony — CHYBÍ

`public/manifest.json` odkazuje na 8 ikon:
- `/assets/icon-72x72.png` ... `/assets/icon-512x512.png`

**Nález [VYSOKÁ]:** V `public/assets/` existují pouze: `Vallia.png`, `favicon.ico`, `vallia.svg`, `vallia_animated.svg` + `images/favicon.ico`. **Žádné icon-*.png soubory neexistují.** PWA manifest je nefunkční — prohlížeče nebudou schopny nainstalovat aplikaci a favicona v PWA nebude zobrazena.

### 6.2 Open Graph obrázek — CHYBÍ

`sw.js` cachuje `/assets/og-synthoma.jpg` a `layout.tsx` definuje Open Graph metadata.

**Nález [VYSOKÁ]:** `/assets/og-synthoma.jpg` neexistuje. Social media sharing nebude zobrazovat náhledový obrázek.

### 6.3 `/styles.css` vs téma systém

Jak popsáno v 5.2 — dva nezávislé systémy. Není kritické, ale matoucí pro vývojáře.

### 6.4 SYNTHOMAINFO.html

Landing intro page fetchuje `/data/SYNTHOMAINFO.html`. Existence souboru nebyla přímo ověřena, ale kód obsahuje fallback (`console.warn` při neúspěšném fetchi).

---

## 7. Bezpečnost

### 7.1 HTML sanitizace

**Stav: Solidní**

`typewriterContent.ts:sanitizeHTML()`:
- Odstraňuje `<script>`, `<iframe>`, `<object>`, `<embed>`
- Odstraňuje `on*` event handlery
- Odstraňuje `javascript:` URL
- Odstraňuje inline `style` atributy
- Povoluje pouze `http://`, `https://`, `//`, `/`, `#` URL schémata

### 7.2 CSP

**Stav: Dobře nastavené**

- Produkce: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'`
- Development: rozšířeno o `unsafe-eval`, `jsdelivr.net`, WebSocket

**Nález [NÍZKÁ]:** `script-src 'unsafe-inline'` v produkci povoluje inline skripty. Pro maximální bezpečnost zvážit nonce-based CSP.

### 7.3 Robots.txt

**Stav: Výborný**

- Blokuje AI crawlery (GPTBot, CCBot, Google-Extended)
- Zakazuje indexaci `/_next/`, `/assets/`, `/audio/`, `/video/`, `/fonts/`
- Zakazuje přímé HTML soubory knihoven (`/books/*.html$`)
- Sitemap reference na `https://www.synthoma.cz/sitemap.xml`

### 7.4 localStorage

**Stav: Bezpečný**

`browser.ts` — všechny localStorage operace obaleny v try/catch. Podporuje local i session storage. Žádná citlivá data nejsou ukládána.

---

## 8. Výkon

### 8.1 Pozitivní

- **Dynamic imports:** `ControlPanelClient` a `DebugPanel` (dev-only) jsou lazy-loaded
- **ISR:** Books a Archive stránky s `revalidate = 3600`
- **will-change:** Správně aplikováno na `.tw-line`, `.alarm-emote`, reader buttons
- **contain:** `layout paint` na `.noising-text` a `.typed-box`
- **Visibility check:** Glitch heading, RetroPixelCanvas, ControlPanel — všechny skrývají animace při `document.visibilityState === 'hidden'`
- **Backdrop-filter disable při typingu:** GPU úleva v glass mode

### 8.2 Poznámky

**Nález [STŘEDNÍ]:** `RetroPixelCanvasClient` běží `requestAnimationFrame` loop neustále, i když retro téma není aktivní (pouze skryje canvas). Loop by mohl být pozastaven úplně, pokud `--retro-canvas-pixelate` je 0.

**Nález [NÍZKÁ]:** Globální `scrollbar-width: none` na `html, body, .SYNTHOMAREADER, #reader-body, #reader-extra` — skryté scrollbary mohou zmást uživatele na desktopech.

**Nález [NÍZKÁ]:** `ControlPanelClient.tsx` je ~1100 řádků — monolitický komponent. Refaktoring do menších subkomponent by zlepšil maintainability a potenciálně snížil bundle size (tree-shaking).

---

## 9. SEO

### 9.1 Metadata

**Stav: Kompletní**

- Root layout: title, description, icons, manifest, themeColor, metadataBase, robots, openGraph, twitter, JSON-LD (WebSite schema)
- Per-route metadata: reader, books, archive, autor — každý má vlastní title, description, canonical, robots
- Sitemap: generuje URL pro všechny statické stránky + kapitoly z manifestu

### 9.2 Noscript fallback

**Stav: Implementováno**

- `layout.tsx` — globální noscript zpráva
- `books/page.tsx` — statický seznam knih/kapitol
- `autor/page.tsx` — server-side rendered HTML obsah

### 9.3 Structured data

- JSON-LD `WebSite` schema v root layoutu
- JSON-LD `Book` schema pro každou sbírku v `/books`

---

## 10. Přístupnost (A11y)

### 10.1 Pozitivní

- Skip-to-content link v layoutu
- `:focus-visible` globální outline
- `prefers-reduced-motion` konzistentně respektováno
- MBTI HUD: `aria-live="polite"`, `aria-label`
- Choices v kapitolách: `tabindex="0"`, `role="button"`, `aria-pressed`
- `fx-outline` elementy: `tabindex="0"`, `role="button"`, `aria-pressed`
- Help modal v readeru s klávesovými zkratkami (`?` pro otevření, `Esc` pro zavření)
- Focus trap v archive detail cards
- Screen reader only class `.sr-only`

### 10.2 Nálezy

**Nález [STŘEDNÍ]:** Globální `user-select: none` (viz 4.9) brání uživatelům s asistivními technologiemi v kopírování textu.

**Nález [NÍZKÁ]:** `RetroPixelCanvasClient` renderuje `<canvas aria-hidden>` bez boolean hodnoty — správně by mělo být `aria-hidden="true"`.

**Nález [NÍZKÁ]:** Background videa nemají `<track>` element pro subtitles/captions — relevantní pouze pokud videa obsahují mluvený obsah.

---

## 11. Testování

### 11.1 Aktuální stav

- **Jest** konfigurován s `@testing-library/react` a `jest-environment-jsdom`
- **validate:chapters** skript — validuje `data-tags` MBTI atributy
- **Chyba v konfiguraci:** `moduleNameMapping` místo `moduleNameMapper` (viz 2.5)

### 11.2 Chybějící testy

**Nález [STŘEDNÍ]:** Nebyly nalezeny žádné testovací soubory (`*.test.ts`, `*.test.tsx`, `*.spec.ts`). Framework je nastaven, ale žádné testy neexistují. Kritické oblasti pro testování:
- `sanitizeHTML()` — bezpečnostní vrstva
- `splitContentAtChoices()` — parser obsahu
- `readStorage/writeStorage` — persistence
- MBTI scoring logika
- Manifest parsing

---

## 12. Shrnutí nálezů dle priority

### VYSOKÁ priorita (2)

| # | Oblast | Popis |
|---|---|---|
| 1 | Assets | PWA ikony (icon-72x72.png až icon-512x512.png) **zcela chybí** — manifest.json je nefunkční |
| 2 | Assets | Open Graph obrázek (`og-synthoma.jpg`) **chybí** — social media sharing bez náhledu |

### STŘEDNÍ priorita (7)

| # | Oblast | Popis |
|---|---|---|
| 3 | Config | `jest.config.js` — `moduleNameMapping` místo `moduleNameMapper` — aliasy v testech nefungují |
| 4 | Audio | `audio.ts` hardcoduje default track, potenciální kolize s playlist stavem |
| 5 | SW | Service Worker nemá automatický cache busting — zastaralý obsah |
| 6 | CSS | Breakpointy nesjednocené (800px / 768px / 700px / 640px / 520px / 400px) |
| 7 | CSS | `.choice-link` definována na 3 místech s mírně odlišnými hodnotami |
| 8 | CSS | Globální `user-select: none` — negativní dopad na UX a A11y |
| 9 | Testy | Žádné unit testy neexistují, přestože je Jest nakonfigurován |

### NÍZKÁ priorita (11)

| # | Oblast | Popis |
|---|---|---|
| 10 | Config | CSP povoluje `unsafe-inline` pro styly |
| 11 | Config | `validate:chapters` nevaliduje existenci odkazovaných souborů |
| 12 | Reader | `sanitizeHTML()` odstraňuje style atributy — záměrné, ale omezující |
| 13 | MBTI | Potenciální race condition mezi vanilla JS a React při simultánním zápisu |
| 14 | TTS | Chybí fallback zpráva pokud SpeechSynthesis není k dispozici |
| 15 | Perf | RetroPixelCanvas RAF loop běží i když téma není aktivní |
| 16 | Perf | Skryté scrollbary mohou zmást desktop uživatele |
| 17 | Perf | ControlPanelClient monolitický (~1100 řádků) |
| 18 | CSS | Hardcoded barvy v ReaderContent.module.css a menu.module.css |
| 19 | A11y | `aria-hidden` bez boolean hodnoty na canvas |
| 20 | Manifest | Draft kapitoly v manifestu — existence HTML souborů neověřena |

---

## 13. Celkové hodnocení

| Oblast | Hodnocení | Komentář |
|---|---|---|
| **Architektura** | 9/10 | Čistá Next.js App Router architektura, ISR, Prisma + PostgreSQL backend |
| **Funkčnost** | 9/10 | Economy systém, whispers, missions, artefakty — plně funkční |
| **Vizuální konzistence** | 8/10 | Sjednocený téma systém, drobné hardcoded výjimky |
| **CSS kvalita** | 7/10 | Bohatá, ale objemná (4000+ řádků), drobné duplikace |
| **Bezpečnost** | 9/10 | Solidní HTML sanitizace, CSP, AI crawler blokace, JWT session |
| **Přístupnost** | 7/10 | Dobré základy, ale user-select: none je problematický |
| **Výkon** | 8/10 | MutationObserver debounce opravena, mobile sekaní vyřešeno |
| **SEO** | 9/10 | Kompletní metadata, JSON-LD, sitemap, noscript fallback |
| **Testování** | 3/10 | Konfigurováno, ale žádné testy |
| **Dokumentace** | 9/10 | README, CONTRIBUTING, CHANGELOG, AUDIT-REPORT aktuální |

**Celkové skóre: 7.9 / 10**

Projekt je solidně postavený s propracovaným vizuálním systémem, bohatou interaktivitou a funkční meta-game ekonomikou. Hlavní oblasti ke zlepšení zůstávají chybějící PWA/OG assety a absence unit testů.

---

*Audit provedl: Cascade AI*  
*Metodika: Manuální code review všech zdrojových souborů, analýza závislostí, kontrola referencí na assety*  
*Aktualizace červen 2026: rozšíření o Prisma backend, economy systém, Vercel build opravy, mobile performance*
