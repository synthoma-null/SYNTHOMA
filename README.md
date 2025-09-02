# SYNTHOMA

Monorepo (aktuálně část `apps/web`) s Next.js aplikací.

## Lokální vývoj

- Požadavky: Node 18+ (doporučeno LTS) a npm
- Instalace závislostí:
  ```bash
  cd apps/web
  npm install
  ```
- Dev server:
  ```bash
  npm run dev
  # běží na http://localhost:3000
  ```

## Build a start
```bash
cd apps/web
npm run build
npm start
```

## Struktura
- `apps/web/` – Next.js 15 + React 18 (app router)
- `apps/web/public/` – statická aktiva
- `apps/web/app/` – route segmenty a stránky

## GitHub – první push do repozitáře
Máte prázdný repo: https://github.com/synthoma-null/SYNTHOMA.git

Spusťte (v kořeni projektu):
```bash
# inicializace git repa a nastavení hlavní větve
git init
git branch -M main

# commit
git add .
git commit -m "chore: initial commit"

# vzdálený repozitář
git remote add origin https://github.com/synthoma-null/SYNTHOMA.git

git push -u origin main
```

## Nasazení na synthoma.cz (doporučeno Vercel)
Nejsnazší a nativní pro Next.js.

1) Propojte GitHub repo do Vercelu
- https://vercel.com -> Add New Project -> Import Git Repository -> zvolte `SYNTHOMA`
- Framework: Next.js
- Root Directory: `apps/web`
- Build Command: `next build` (automaticky)
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

## Linting
```bash
cd apps/web
npm run lint
```

## Poznámky
- Citlivé údaje dávejte do `.env` (nenahrávat do Gitu). Můžete vytvořit `apps/web/.env` a v Vercelu je nastavit v Project -> Settings -> Environment Variables.

---

# Uživatelský manuál: SYNTHOMA

Ano, i tvoje babička to přečte. A když ne, glitch efekt ji hypnotizuje, takže to bude aspoň vypadat kouzelně. ☠️

## 1) Jak aplikaci používat

- **Spuštění lokálně**: `cd apps/web && npm run dev` → http://localhost:3000
- **Hlavní navigace**:
  - `/` – domovská stránka
  - `/books` – knihovna kolekcí/knížek
  - `/reader?u=/books/<kolekce>/<kapitola>.html` – čtečka konkrétní kapitoly
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

## 3) Jak psát kapitoly (HTML)

Základní pravidla: žádné inline styly, používej sjednocené CSS utility a semantické třídy. Čtečka `TypewriterReader` obsah vykreslí tak, jak ho napíšeš.

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

Na stránkách s titulkem (Autor, Knihovna, Archiv, Reader) používáme jednotný glitch nadpis:

```tsx
<section className="story-block" data-theme="synthoma">
  <h1 id="glitch-XYZ" className="glitch-master title" ref={glitchRootRef as any} aria-label={TITLE}>
    <span className="glitch-fake1">{TITLE}</span>
    <span className="glitch-fake2">{TITLE}</span>
    <span className="glitch-real" aria-hidden="true">
      {TITLE.split("").map((ch, idx) => (
        <span key={idx} className="glitch-char">{ch}</span>
      ))}
    </span>
    <span className="sr-only">{TITLE}</span>
  </h1>
}</section>
```

- Nadpis je vždy ve `section.story-block` uvnitř `main.story`.
- Glitch animace: `attachGlitchHeading(...)` (respektuje `prefers-reduced-motion`).

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

## 10) Textové efekty (fx-*)

Protože text bez šminek je jako apokalypsa bez zombíků. Nuda. Používej jen tam, kde to dává smysl – ať čtenáři neprasknou oči. ☠️

### Přehled tříd

- **fx-neon** – neonový glow podle motivu
- **fx-glow-magenta** – silný purpurový glow
- **fx-shadow-lg** – výrazný stín pro kontrast na světlém pozadí
- **fx-outline** – obrys písma (fallback přes text-shadow + `-webkit-text-stroke`)
- **fx-scanline** – jemný CRT scanline overlay
- **fx-flicker** – poblikávání jak líná zářivka
- **fx-wave** – vertikální vlnění (inline-block)
- **fx-gradient** – statický přechod textu podle accent barev
- **fx-rainbow** – animovaná duhová výplň textu
- **fx-noise** – zrnitý šumový overlay (čistě CSS, bez assetů)
- **fx-uppercase-wide** – kapitálky s roztaženým kerningem
- **fx-underline** – cyber podtržení s jemným glow

### Použití v obsahu (HTML)

```html
<p class="text fx-neon">Neonový šepot kabeláže.</p>
<p class="log fx-shadow-lg">LOG: Systém nasadil černou kávu.</p>
<p class="warning fx-outline">VAROVÁNÍ: Tady to poblikává.</p>
<p class="text fx-scanline">CRT nostalgie přibalena.</p>
<p class="text"><span class="fx-wave">Vlna</span> ve tvém <span class="fx-wave">oku</span>.</p>
<h2 class="title fx-gradient">Gradientní výkřik do tmy</h2>
<h2 class="title fx-rainbow">Duhová pěst pravdy</h2>
<p class="text fx-noise">Zrnko chaosu pro lepší chuť.</p>
<p class="text fx-uppercase-wide">TICHÝ KŘIK.</p>
<p class="text fx-underline">Linka pod pravdou.</p>
```

### Poznámky a přístupnost

- **Reduced motion:** `fx-flicker`, `fx-wave`, `fx-rainbow` respektují `prefers-reduced-motion` a animace se vypnou.
- **Čitelnost:** Nesmí degradovat kontrast důležitých textů (logy, warningy nech ať jsou čitelné i bez efektu). Testuj ve `.SYNTHOMAREADER`.
- **Kompozice:** `fx-*` jsou utility – vrstvi je střídmě s `.text`, `.log`, `.warning`, `.title` atd. Žádné inline styly.
