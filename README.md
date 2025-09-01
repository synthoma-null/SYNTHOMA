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
Autor: Synthoma
