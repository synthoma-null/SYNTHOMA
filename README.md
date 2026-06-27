# SYNTHOMA 💀

Next.js (App Router) + React aplikace pro interaktivní cyberpunk čtečku.

> **Monorepo poznámka**: Repo je monorepo jen strukturou (pro budoucí rozšíření). Zatím se všechna instalace a práce děje v `apps/web/`.

---

## 🚀 Quick Start

```bash
# 1. Nainstaluj dependencies (v apps/web)
cd apps/web
npm install

# 2. Spusť dev server
npm run dev
# → http://localhost:3000
```

**Doporučená verze Node**: 20 LTS (ověř v `package.json` engines nebo nastav `.nvmrc`)

---

## 📚 Quick Links

- **Domů**: [http://localhost:3000/](http://localhost:3000/)
- **Knihovna**: [http://localhost:3000/books](http://localhost:3000/books)
- **Čtečka**: [http://localhost:3000/reader](http://localhost:3000/reader)  
  _Nový způsob (doporučený):_ `http://localhost:3000/reader?chapter=restart`  
  _Legacy způsob (stále funkční):_ `http://localhost:3000/reader?u=/books/SYNTHOMA-NULL/0-∞%20%5BRESTART%5D.html`
- **Archiv**: [http://localhost:3000/archive](http://localhost:3000/archive)
- **Landing**: [http://localhost:3000/landing-intro](http://localhost:3000/landing-intro)
- **Manifest knih**: `apps/web/public/books/manifest.json` ← zdroj pravdy
- **Verze balíčků**: `apps/web/package.json` ← aktuální dependencies

---

## 🏗️ Build a Produkce

```bash
cd apps/web
npm run build    # prisma generate + next build
npm start        # produkční server na port 3000
```

> **Poznámka:** Build script automaticky spouští `prisma generate` před buildem. Na Vercelu vyžaduje `DATABASE_URL` v environment variables.

## Struktura projektu 🏗️

```
SYNTHOMACZ/
├── apps/web/                    # Next.js aplikace
│   ├── app/                     # App Router stránky
│   │   ├── HomeClient.tsx       # Domovská stránka
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # "/" route
│   │   ├── archive/             # /archive
│   │   ├── autor/               # /autor
│   │   ├── books/               # /books knihovna
│   │   ├── components/          # Sdílené komponenty
│   │   ├── landing-intro/       # /landing-intro (standalone page)
│   │   └── reader/              # /reader čtečka kapitol
│   ├── public/                  # Statické soubory
│   │   ├── assets/              # Ikony, shadery
│   │   ├── audio/               # Hudba, SFX
│   │   ├── video/               # Background videa
│   │   ├── fonts/               # Webfonty
│   │   ├── books/               # HTML kapitoly + manifest
│   │   ├── data/                # Archivní data
│   │   ├── robots.txt           # SEO
│   │   ├── sitemap.xml          # SEO
│   │   └── styles.css           # Globální styly pro kapitoly
│   ├── src/                     # Zdrojové soubory
│   │   ├── components/          # React komponenty
│   │   ├── lib/                 # Utility, helpery
│   │   └── styles/              # CSS moduly a globální styly
│   ├── scripts/                 # Build/validační skripty
│   ├── package.json             # Dependencies a skripty
│   ├── tsconfig.json            # TypeScript config
│   ├── next.config.ts           # Next.js config
│   └── .eslintrc.json           # ESLint pravidla
├── setup.sh                     # Setup skript (Unix)
├── .gitignore                   # Git ignore
└── README.md                    # Tato dokumentace
```

### Klíčové adresáře:
- `apps/web/app/` – Next.js App Router stránky (routing, layouts, page komponenty)
- `apps/web/src/` – Sdílené komponenty, utility, styles (nezávislé na routingu)
- `apps/web/prisma/` – Prisma schema + migrace (PostgreSQL)
- `apps/web/src/content/booksManifest.ts` – CHAPTERS, PACKAGES, ARTIFACTS, MISSIONS
- `apps/web/src/lib/access.ts` – Economy logika (updateRunStats, checkAndActivateMissions)
- `apps/web/public/` – Statická aktiva servírovaná na `/`

> **Proč app/ a src/ vedle sebe?** Next.js App Router vyžaduje `app/` pro routing. Sdílené komponenty a logika patří do `src/`, aby se neplácaly s page strukturou.

## 🔐 Environment Variables

Pro lokální vývoj používej `.env.local` (Next.js standard):

```bash
cd apps/web
# Vytvoř .env.local (NEGITOVAT!)
echo "# Lokální environment variables" > .env.local
```

Pro produkci na Vercelu: Settings → Environment Variables

**Povinné Vercel env vars:**

| Proměnná | Popis |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (nepžije build bez ní) |
| `AUTH_SECRET` | Náhodný string pro NextAuth session podpis |
| `NEXTAUTH_URL` | Produkční URL, např. `https://www.synthoma.cz` |
| `STRIPE_SECRET_KEY` | Stripe API klíč (vólitelné, pro mnem platby) |
| `NEXT_PUBLIC_STRIPE_LINK_ARCHIV_PLUS` | Stripe payment link URL (volitelné) |

> **Pozor**: `DATABASE_URL` musí existovat už při buildu — Prisma ho potřebuje pro `prisma generate`. Vercel musí mít tuto proměnnou nastavenou v Environment Variables dříve než se spustí build.

## GitHub – první push do repozitáře

Máte prázdný repo: https://github.com/synthoma-null/SYNTHOMA.git

**Před prvním commitem:**
1. ✅ Zkontroluj, že máš `.gitignore` (měl by ignorovat `.env.local`, `node_modules`, `.next`)
2. ✅ Doporučená Node verze: přidej `.nvmrc` s obsahem `20` (nebo tvoje LTS verze)

```bash
# V kořeni projektu
git init
git branch -M main

# Commit
git add .
git commit -m "chore: initial commit 💀"

# Vzdálený repozitář
git remote add origin https://github.com/synthoma-null/SYNTHOMA.git
git push -u origin main
```

## Nasazení na synthoma.cz (doporučeno Vercel)
Nejsnazší a nativní pro Next.js.

1) Propojte GitHub repo do Vercelu
- https://vercel.com -> Add New Project -> Import Git Repository -> zvolte `SYNTHOMA`
- Framework: Next.js
- Root Directory: `apps/web`
- Build Command: ponechte **prázdné** (nebo `npm run build`) — `package.json` automaticky spustí `prisma generate && next build`
- Output: `.next` (automaticky)
- Deploy

2) Přidejte doménu do projektu
- V projektu: Settings -> Domains -> Add -> `synthoma.cz` a `www.synthoma.cz`

3) DNS u registrátora domény
- A záznam (apex):
  - Name/Host: `@`
  - Type: `A`
  - Value: `76.76.21.21` (Vercel apex IP)
  - TTL: default
- CNAME (www):
  - Name/Host: `www`
  - Type: `CNAME`
  - Value: `cname.vercel-dns.com.`
  - TTL: default

4) Ověření
- Vercel v Domains zobrazí, zda jsou DNS správně a certifikát je vydaný (Let’s Encrypt). Platnost do pár minut.

### Alternativa: GitHub Pages
GitHub Pages neumí server-side rendering Next.js. Šlo by použít statický export (`next export`), ale přijdete o SSR/Route Handlers. Pro plný Next.js použijte Vercel.

## Kvalita kódu ✨

### Linting
```bash
cd apps/web
npm run lint           # kontrola
npm run lint:fix       # automatická oprava
```

### Formátování
```bash
cd apps/web
npm run format         # prettier --write .
```

### Type checking
```bash
cd apps/web
npm run typecheck      # TypeScript kontrola bez buildu
```

## Landing-intro stránka 🎬

Samostatná landing page s video pozadím na `/landing-intro`.

**Fonty**: Stránka používá lokální webfonty z `public/fonts/`:
- Sans: `Inter-Variable.woff2`
- Mono: `JetBrainsMono-Variable.woff2`

**Videa**: Umístit do `public/video/` (např. `background-1080p.mp4`, atd.)

**Motivy**: Přepínač v UI nabízí `default`, `neon`, `glitch`, `void`

⚠️ Autoplay může být blokován prohlížečem – uživatel musí kliknout na ▶

---

## 🚨 Troubleshooting (3 nejčastější pasti)

### 1. Autoplay blokace (audio/video)
**Symptom**: Hudba nebo video se nespustí automaticky  
**Řešení**: Prohlížeče blokují autoplay. Uživatel musí kliknout na play nebo interagovat se stránkou.

### 2. 404 na kapitolu v čtečce
**Symptom**: Reader hlásí "Kapitola nenalezena" nebo 404  
**Důvody**:
- Špatné `chapter` ID — kontřoluj `id` pole v `booksManifest.ts`
- Legacy `?u=` cesta: špatná cesta v `manifest.json` nebo chybějící URL encoding

**Primární URL formát (nový):** `/reader?chapter=restart`  
**Legacy URL formát (příklad):** `/reader?u=/books/SYNTHOMA-NULL/0-∞%20%5BRESTART%5D.html`

**Fix**: Generuj odkazy přes `CHAPTERS` z `booksManifest.ts` a používej `chapter=<id>`. Legacy `?u=` je stále funkční, ale není doporučené.

### 3. Reader nezobrazuje styly (kapitola vypadá špatně)
**Symptom**: Kapitola se načte, ale je úplně bez stylů/layoutu  
**Důvody**:
- Chybí `<link rel="stylesheet" href="/styles.css" />` v HTML kapitole
- Špatná relativní cesta (musí být `/styles.css`, ne `../styles.css`)
- TypewriterReader odstranil inline styly (sanitizer)

**Fix**: Všechny kapitoly MUSÍ mít `<link rel="stylesheet" href="/styles.css" />` v `<head>`.

---

## 📝 Poznámky
- Citlivé údaje dávejte do `.env.local` (nenahrávat do Gitu). V Vercelu: Project → Settings → Environment Variables.
- Prettier a ESLint jsou nakonfigurovány v `apps/web/.prettierrc` a `apps/web/.eslintrc.json`
- Pro dev dependencies použij: `npm install --save-dev <package>` v `apps/web/`
- **Legacy upozornění**: Pokud najdeš odkazy na `index.html`, `app.js`, nebo `chapters-media.json` – ignoruj je, byly odstraněny během auditu 💀

---

# Uživatelský manuál: SYNTHOMA

Ano, i tvoje babička to přečte. A když ne, glitch efekt ji hypnotizuje, takže to bude aspoň vypadat kouzelně. ☠️

## 1) Jak aplikaci používat

- **Spuštění lokálně**: `cd apps/web && npm run dev` → http://localhost:3000
- **Hlavní navigace**:
  - `/` – domovská stránka
  - `/books` – knihovna kolekcí/knížek
  - `/reader?chapter=<id>` – čtečka konkrétní kapitoly (nový způsob, `id` viz `booksManifest.ts`)
  - `/reader?u=/books/<kolekce>/<kapitola>.html` – legacy způsob (stále funkční)
  - `/autor` – prezentační stránka autora se sjednoceným glitch nadpisem a ukázkou čtečky
  - `/archive` – interaktivní archiv s kartami

- **Klávesové zkratky (čtečka)**:
  - `?` nebo `Shift+/` – otevřít/zavřít nápovědu
  - `Esc` – zavřít nápovědu
  - Průběh čtení se průběžně ukládá (per kolekce) podle scrollu.

## 2) Struktura obsahu

- Kapitoly jsou statické HTML soubory pod `apps/web/public/books/<kolekce>/...`. Příklad cesty:
  - `/public/books/SYNTHOMA-NULL/0-∞ [RESTART].html`
- Manifest knih pod `/public/books/manifest.json` definuje kolekce, názvy kapitol a volitelná metadata (např. vybraná hudba pro kapitolu).

### 2.1) Manifest – přehled

- Umístění: `apps/web/public/books/manifest.json`
- Struktura (zjednodušeně):

```jsonc
{
  "collections": [
    {
      "slug": "SYNTHOMA-NULL",
      "title": "SYNTHOMA NULL",
      "cover": "/covers/synthoma-null.jpg",
      "chapters": [
        { "title": "0-∞ [RESTART]", "path": "/books/SYNTHOMA-NULL/0-∞ [RESTART].html", "free": true, "track": "/audio/intro.mp3" }
      ]
    }
  ]
}
```

- `track` je volitelné a použije se k doporučení hudby při otevření kapitoly.

### 2.2) ✅ Checklist: Přidání nové kapitoly

Když vytváříš novou kapitolu, projdi tento checklist:

1. **Vytvoř HTML soubor**
   - Umístění: `apps/web/public/books/<kolekce>/<název>.html`
   - ⚠️ **Filename past**: Používáš mezery/závorky? URL bude potřebovat encoding (`%20`, `%5B`, `%5D`)
   - Preferuj manifest linky před ručním linkováním!

2. **Přidej do manifestu**
   - Edituj `apps/web/public/books/manifest.json`
   - Přidej nový objekt do `chapters[]` s `title`, `path`, `free`, `track` (volitelné), `backgroundVideo` (volitelné)
   - **Kontrola**: `path` MUSÍ začínat `/books/...`

3. **Testuj v čtečce**
   - Otevři `/reader?chapter=<id>` (kde `id` je klíč v `CHAPTERS` v `booksManifest.ts`)
   - Legacy: `/reader?u=<cesta-s-encodingem>`
   - Zkontroluj, že se načte obsah, styly, a případná media

4. **Validuj**
   - Spusť `npm run validate:chapters`
   - Zkontroluj odkazy v manifestu vs. skutečné soubory

5. **Filename varování**
   - Soubory s `[`, `]`, mezerami, `∞` atd. vyžadují URL encoding
   - Generuj odkazy programově (přes manifest), nikdy ručně!

## 3) Jak psát kapitoly (HTML)

Základní pravidla: žádné inline styly, používej sjednocené CSS utility a semantické třídy. Čtečka `TypewriterReader` obsah vykreslí tak, jak ho napíšeš.

### 🔒 Bezpečnost HTML renderingu

**Trusted content only**: Kapitoly jsou součástí repa a jsou považovány za důvěryhodný obsah.  
**Nepřijímáme user-generated HTML** – veškerý obsah píšeš ty nebo trusted contributors.

**Sanitizace v TypewriterReader** (implementace: `apps/web/src/components/TypewriterReader.tsx` → `sanitizeHTML()`):
- `<script>`, `<iframe>`, `<object>`, `<embed>` jsou odstraněny
- `on*` event handlery jsou odstraněny (např. `onclick`, `onerror`)
- `javascript:` protokoly v `href`/`src` jsou odstraněny
- Inline `style` atributy jsou odstraněny (layout je řízený přes CSS třídy)

**Povolené externí zdroje**:
- `/styles.css` – globální styly (API kontrakt, viz níže)
- `/books/mbti.js` – MBTI interaktivita
- `/books/glitch-toggle.js` – glitch efekty

> **Pro detaily**: Zkontroluj funkci `sanitizeHTML()` na začátku `TypewriterReader.tsx` (řádky ~7-49)

### ⚙️ API kontrakt: Kritické soubory

**`/public/styles.css`**, **`/public/books/mbti.js`**, **`/public/books/glitch-toggle.js`**

⚠️ **NEDOTÝKAT SE BEZ DŮVODU!** Tyto soubory používají HTML kapitoly přes `<link>` a `<script>` tagy.

**Co to znamená**:
- **CSS classy**: Kapitoly závisí na třídách jako `.text`, `.log`, `.warning`, `.fx-*`, atd.
- **JS eventy**: `mbti.js` a `glitch-toggle.js` poslouchají DOM eventy a data atributy
- **Breaking changes**: Změny v těchto souborech mohou rozbít všechny kapitoly najednou

**Pokud měníš tyto soubory**:
1. Vytvoř verzi/branch
2. Testuj na VŠECH kapitolách (minimálně vzorky z každé kolekce)
3. Spusť `npm run validate:chapters` pro kontrolu konzistence
4. Dokumentuj změny v API (co se změnilo v classách/eventech)

### 3.1) Doporučená kostra kapitoly

```html
<article class="story-content">
  <h2 class="title">Název kapitoly</h2>

  <p class="text">Úvodní odstavec, který neslibuje nic, co bys pak musel splnit.</p>

  <p class="dialog">
    <strong>AI:</strong> Jsem jen šepot v kabeláži.
  </p>

  <p class="log">LOG: Systémová anomálie zaznamenána.</p>

  <p class="warning">Pozor, tady to začíná být křupavé.</p>

  <hr class="divider" />

  <p class="text">Pokračování…</p>
</article>
```

Tipy:
- Používej semantiku (`h2.title`, odstavce `p.text`, dialogy `p.dialog`, záznamy `p.log`, varování `p.warning`).
- Vyhni se inline `style=...` – layout v čtečce je sjednocený a ladí s motivem.
- Dekorativní levé proužky a heading offsety jsou už opravené v `.SYNTHOMAREADER` – nekompenzuj je vlastním CSS.

## 4) Sjednocený layout a nadpisy (stránky)

Na stránkách s titulkem (Home, Landing‑intro, Autor, Knihovna, Archiv, Reader) používáme jednotný glitch nadpis. Home (`/`) a Landing‑intro (`/landing-intro`) jsou nyní 1:1 shodné (markup, CSS, i inicializace):

```tsx
<section className="story-block" data-theme="synthoma">
  <h1 id="glitch-synthoma" className="glitch-master title" ref={glitchRootRef as any} aria-label={TITLE}>
    <span className="glitch-fake1">{TITLE}</span>
    <span className="glitch-fake2">{TITLE}</span>
    <span className="glitch-real" aria-hidden="true">
      {TITLE.split("").map((ch, idx) => (
        <span key={idx} className="glitch-char">{ch}</span>
      ))}
    </span>
    <span className="sr-only">{TITLE}</span>
  </h1>
</section>
```

- Nadpis je ve `section.story-block` (v Home/Landing‑intro i mimo panel sekci pro správné vrstvení).
- Glitch animace: `attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 })` – stejné pro Home i Landing‑intro. Respektuje `prefers-reduced-motion`.
- CSS se aplikuje na `.home-page #glitch-synthoma...` i `.landing-intro-page #glitch-synthoma...` – fake vrstvy (`.glitch-fake1/2`) i real vrstva (`.glitch-real`) mají shodné posuny, opacitu a glow. `glitch-char` používá šířku `1ch`.

## 5) Čtečka – pozadí, průhlednost, blur

Čtečka běží v komponentě `TypewriterReader`. Styling pozadí ovládej přes utility třídy (žádné inline styly):

- Průhlednost overlay: `readerOverlay-10 | 20 | 35 | 50 | 65`
- Rozostření overlay: `readerOverlay-blur | readerOverlay-blur-xs | readerOverlay-blur-sm | readerOverlay-blur-lg`
- Vypnutí background image: `readerOverlay-none`

Použití na komponentě:

```tsx
<TypewriterReader
  id="hero-info"
  srcUrl={"/books/SYNTHOMA-NULL/0-∞ [RESTART].html"}
  className="readerOverlay-35 readerOverlay-blur"
  ariaLabel="Čtečka"
  autoStart
/>
```

## 6) Stylový slovník (výběr)

- `title` – nadpis kapitoly uvnitř obsahu
- `text` – základní odstavec
- `dialog` – dialogová replika
- `log` – systémový záznam
- `warning` – upozornění
- `divider` – horizontální oddělovač
- `panel glass` – skleněný panel (Cards, upozornění v knihovně)
- `btn btn-lg` – velká akční tlačítka (např. CTA)
- `story` / `story-block` – sjednocená stránková mřížka, do které pasuje glitch nadpis i čtečka

Pozn.: Vše je skopované tak, aby se uvnitř čtečky (`.SYNTHOMAREADER`) nescházela nechtěná odsazení a pseudo-prvky seděly vlevo.

## 7) Hudba a doporučení skladeb

- Pokud kapitola v manifestu obsahuje `track`, čtečka může zobrazit dialog s doporučením přehrát skladbu.
- Respektujeme blokace autoplay (LocalStorage `audioAutoplayBlocked`).

## 8) Přístupnost a použitelnost

- Klávesové zkratky viz výše.
- Fokus se v archivních kartách drží uvnitř otevřené karty (focus trap).
- Živé oblasti a aria-labely jsou u čtečky zachované.

## 9) Lint/Build/Deploy (rychlá rekapitulace)

```bash
cd apps/web
npm run lint
npm run build && npm start
```

Deploy: Vercel, root `apps/web`, doména viz výše.

---
 Autor: Synthoma

## 10) Textové efekty a glitch koření (obsah + UI)

Protože text bez šminek je jako apokalypsa bez zombíků. Nuda. Používej střídmě – ať čtenáři neprasknou oči. ☠️

Zdroj: `apps/web/src/styles/components.css` (utility `fx-*`) a `apps/web/src/styles/effects.css` (tematické/kapitolové efekty).

### 10.1) Utility pro text (fx-*)

- `fx-neon` – neonový glow podle motivu
- `fx-glow-magenta` – silný purpurový glow
- `fx-shadow-lg` – výrazný stín na světlém pozadí
- `fx-outline` – obrys písma (fallback přes text-shadow + `-webkit-text-stroke`), přidej `is-lit` pro vyplnění + glow
- `fx-scanline` – jemný CRT scanline overlay (přes `::after`)
- `fx-flicker` – poblikávání jak líná zářivka
- `fx-wave` – vertikální vlnění (aplikuj na inline prvky/span)
- `fx-gradient` – statický přechod textu přes accent barvy
- `fx-rainbow` – animovaná duhová výplň textu
- `fx-noise` – zrnitý šumový overlay (čistě CSS)
- `fx-uppercase-wide` – kapitálky s roztaženým kerningem
- `fx-underline` – cyber podtržení s jemným glow

Ukázky:

```html
<p class="text fx-neon">Neonový šepot kabeláže.</p>
<p class="log fx-shadow-lg">LOG: Systém nasadil černou kávu.</p>
<p class="warning fx-outline is-lit">VAROVÁNÍ: Tady to poblikává.</p>
<p class="text fx-scanline">CRT nostalgie přibalena.</p>
<p class="text">Slovo <span class="fx-wave">vlní</span> se ti v oku.</p>
<h2 class="title fx-gradient">Gradientní výkřik do tmy</h2>
<h2 class="title fx-rainbow">Duhová pěst pravdy</h2>
<p class="text fx-noise">Zrnko chaosu pro lepší chuť.</p>
<p class="text fx-uppercase-wide">TICHÝ KŘIK.</p>
<p class="text fx-underline">Linka pod pravdou.</p>
```

### 10.2) Kapitolové efekty (theme-aware)

Tyto třídy jsou v `effects.css` a hodí se přímo do obsahu kapitol. Vše respektuje `prefers-reduced-motion`.

- `datastream` – jemný horizontální shimmer přes text
- `redacted` – začernění; vykresluje pruh „████…“ přes `::after`
- `corrupt` – chromatic split + drobný jitter
- `bios-warning` – periodický acid yellow „blik“ pro logy/varování
- `memory-leak` – „stékající“ gradient pod řádkem (přes `::after`)
- `overheat` – heat‑haze wobble (mírné rozmazání v cyklu)
- `echo-ghost` – duch textu; použij `data-echo` pro obsah stínu
- `static-noise` – animovaný zrnitý overlay přes blok textu
- `neon-blood` – pulzující červeno‑magenta glow
- `quantum-blur` – periodická ztráta ostrosti, pak „zacvaknutí“ zpět

Ukázky:

```html
<p class="text datastream">Proudění dat ti šeptá do ucha.</p>
<p class="text redacted">Tahle věta nikdy neexistovala.</p>
<p class="text corrupt">S Y S T É M  V A D N Ý .</p>
<p class="log bios-warning">LOG: Kernel blinknul a předstírá, že nic.</p>
<p class="text memory-leak">Paměť prosakuje jak špatný thriller.</p>
<p class="text overheat">Vzduch se vlní. Nebo mozky?</p>
<p class="text echo-ghost" data-echo="afterimage">Duch slova.</p>
<p class="text static-noise">Šumíš mi mezi řádky.</p>
<p class="text neon-blood">Svítí to peklem. Hezky.</p>
<p class="text quantum-blur">Zaostři si realitu, prosím.</p>
```

Poznámky:

- `echo-ghost` vyžaduje atribut `data-echo` se stejným textem pro „ducha“.
- `redacted` dělá obsah nečitelný (color: transparent). Používej jen na záměrné cenzury.
- Dlouhé souvislé odstavce nevln `corrupt/overheat/quantum-blur` – použij raději na krátké highlighty.

### 10.5) Glitching token (inline) – `.glitching`

Jemné „hledání znaku“ bez pohybu layoutu:

- Mechanika: krátká vlna (5–8 snímků, 80–110 ms/frame) na JEDNOM znaku v tokenu, opakuje se cca každých 0.7–1.2 s.
- Stabilita šířky: náhrada se vykreslí jako overlay přes původní glyph, celková šířka řádku se nemění; kerning je během vlny dočasně vypnut.
- Bez CSS pohybu: `.glitching`, `::before`, `::after` mají `animation/transition/transform: none` – jediný pohyb je výměna znaku.
- A11y: respektuje `prefers-reduced-motion`.

Použití:

```html
<p class="text">„Vítej v SYNTHOMĚ, <span class="glitching">@&SĐYŁ</span> !!!“</p>
```

Poznámka: Kombinovat přímo na stejném elementu s efekty jako `fx-flicker` nedává smysl – `.glitching` tyto animace záměrně vypíná. Pokud chceš flicker, obal `glitching` do rodiče a flicker dej na něj.

### 10.3) UI/sekční efekty (pro panely a boxy)

Vhodné pro panely, boxy nebo celé bloky na stránkách (ne inline uvnitř vět):

- `effect-pulseWave` – cyan pulsní „prstenec“ kolem boxu
- `effect-riftGlow` – magenta glow + jemná aberace textu/boxu
- `effect-kernelBlink` – acid yellow outline blik (varování)
- `effect-fogNoise` – mlhový parallax + noise overlay
- `effect-crtTerminal` – CRT terminál s flickerem a scanlines

Ukázka:

```html
<div class="panel effect-crtTerminal">
  <p class="text">root@void:~# wake_up</p>
  <p class="text">…nope.</p>
  <p class="log">OK</p>
  <p class="warning">Nezkoušej to doma.</p>
  <p class="text">– terminál přežil, ty snad taky.</p>
  <p class="text">&nbsp;</p>
</div>
```

### 10.4) Přístupnost a good practices

- Reduced motion: `fx-flicker`, `fx-wave`, `fx-rainbow`, a všechny `effects.css` animace respektují `prefers-reduced-motion`. V silném režimu zvaž přidání `.no-animations` na `<body>`.
- Čitelnost: Efekty nesmí degradovat kontrast – kritické texty (`.log`, `.warning`, navigace) drž čitelné i bez efektu. Testuj uvnitř `.SYNTHOMAREADER`.
- Kompozice: `fx-*` vrstvi střídmě na `.text`, `.log`, `.warning`, `.title`. Žádné inline styly – používáme utility a atributy (`data-echo`).
- Výkon: Vyhýbej se animacím na celé dlouhé bloky textu. Krátké úseky/inline prvky jsou OK.

Reference stylů:

- `apps/web/src/styles/components.css` – sekce „TEXT FX (utilities)“
- `apps/web/src/styles/effects.css` – sekce „Chapter Text Effects“ a CRT/overlay

