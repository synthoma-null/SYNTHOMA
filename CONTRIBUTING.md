# Contributing to SYNTHOMA 💀

Vítej v neonovém mokřadu, kde kód píšeme s ironií a glitche jsou feature, ne bug.

## 🚀 Jak začít

1. **Fork & Clone**
   ```bash
   git clone https://github.com/<your-username>/SYNTHOMA.git
   cd SYNTHOMA
   ```

2. **Nastav Node verzi**
   ```bash
   # Používáš nvm?
   nvm use
   # Ověř verzi
   node --version  # mělo by být >=20.0.0
   ```

3. **Instaluj dependencies**
   ```bash
   cd apps/web
   npm install
   ```

4. **Nastav environment variables**
   ```bash
   cp .env.example .env.local
   # Vyplň: DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL, STRIPE_SECRET_KEY, ...
   ```

5. **Vygeneruj Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Spusť dev server**
   ```bash
   npm run dev
   # → http://localhost:3000
   ```

---

## 📝 Pull Request Guidelines

### Před vytvořením PR:

✅ **Spusť linter a typecheck**
```bash
cd apps/web
npm run lint:fix
npm run typecheck
npm run format
```

✅ **Testuj lokálně**
- Zkontroluj všechny stránky, které jsi změnil
- Testuj na minimálně 2 prohlížečích (Chrome, Firefox)
- Mobilní responsive? Zkontroluj devtools

✅ **Commit pravidla**
- Používej [conventional commits](https://www.conventionalcommits.org/)
- Příklady:
  - `feat: přidána nová kapitola 0-21 [VOID]`
  - `fix: oprava glitch efektu v čtečce`
  - `chore: aktualizace dependencies`
  - `docs: vylepšení README`

---

## 📚 Přidání nové kapitoly

Přesný checklist najdeš v hlavním README, sekce "2.2) Checklist: Přidání nové kapitoly".

**TL;DR:**
1. Vytvoř HTML soubor v `apps/web/public/books/<kolekce>/`
2. Přidej záznam do `manifest.json`
3. Testuj v `/reader?u=...`
4. (Volitelně) Spusť `npm run validate:chapters`

⚠️ **Filename past**: Mezery a závorky v názvech = URL encoding hell. Preferuj linky z manifestu!

---

## 🔒 Bezpečnostní pravidla

- **Žádný user-generated HTML** – kapitóly jsou trusted content
- **Žádné inline styly** – používej CSS utility třídy
- **Žádné `<script>` v kapitólách** (kromě `/books/mbti.js` a `/books/glitch-toggle.js`)
- **Žádné API klíče v kódu** – vždy používej `.env.local`
- **Prisma schema změny** – vyžaduj migraci (`prisma migrate dev`), otestuj na dev DB

---

## ⚙️ API Kontrakt: Nedotýkat se!

Tyto soubory používají **VŠECHNY** kapitoly:

- `/public/styles.css`
- `/public/books/mbti.js`
- `/public/books/glitch-toggle.js`

Tyto soubory jsou kritické pro economy systém:

- `src/lib/access.ts` — `updateRunStats`, `checkAndActivateMissions`, `getUserEntitlements`
- `src/content/booksManifest.ts` — ARTIFACTS, MISSIONS, PACKAGES definice
- `prisma/schema.prisma` — datový model (UserRun, EntityRelation, Whisper...)

**Pokud MUSÍŠ něco změnit:**
1. Vytvoř branch/verzi
2. Testuj na vzorcích kapitol (minimálně 3-5)
3. Dokumentuj breaking changes
4. Notifikuj v PR, že jde o breaking change

---

## 🎨 Code Style

- **TypeScript**: Strict mode zapnutý, respektuj typy
- **React**: Funkcionální komponenty + hooks
- **CSS**: Utility-first, preferuj existující třídy před novými
- **Naming**: `camelCase` pro proměnné, `PascalCase` pro komponenty
- **Comments**: Komentuj "proč", ne "co" (a používej ironický humor 💀)

---

## 🐛 Bug Reports

Našel jsi bug? Cool, napiš issue s:

- **Co se stalo** (s kroky k reprodukci)
- **Co jsi čekal** (očekávané chování)
- **Screenshoty/logy** (pokud relevantní)
- **Browser/OS** (Edge je taky prohlížeč, bohužel)

---

## 💡 Feature Requests

Máš nápad? Super! Vytvoř issue s:

- **Popis** (co to má dělat)
- **Use case** (proč to potřebuješ)
- **Mockup/náčrt** (pokud máš)

---

## 📞 Kontakt

- **GitHub Issues**: Preferovaný způsob komunikace
- **Discussions**: Pro obecné otázky

---

**Thanks for contributing! Ať žije glitch a neonový chaos. ☠️💀🚀**
