# Changelog

Všechny významné změny v projektu SYNTHOMA budou dokumentovány v tomto souboru.

Formát je založený na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt používá [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed (Final Improvements - Dec 13, 2025)
- 🔗 Quick Links: Čtečka href nyní míří správně na `/reader` s example URL odděleně
- 💪 Odstranění "pokud existuje" u `validate:chapters` - skript je implementovaný
- 📅 CHANGELOG datum opraveno na 2025 (konzistence s audit reportem)
- 🔍 Sanitizace: přidán odkaz na konkrétní implementaci v TypewriterReader.tsx

### Verified
- ✅ Build: Compiled successfully in 5.6s (všechny route optimalizované)
- ✅ Lint: Exit code 0 (2 non-blocking warnings)
- ✅ TypeCheck: Exit code 0 (žádné TS errory)

### Added
- ✨ `.nvmrc` soubory pro konzistentní Node verzi (20 LTS)
- 📚 `CONTRIBUTING.md` - kompletní průvodce pro přispěvatele
- 🚀 Quick Links sekce v README pro rychlou navigaci
- 🚨 Troubleshooting sekce s 3 nejčastějšími problémy
- ✅ Checklist pro přidání nových kapitol
- 🔒 Bezpečnostní dokumentace HTML renderingu
- ⚙️ API kontrakt dokumentace pro kritické soubory
- 🔧 `npm run validate:chapters` skript v package.json
- 📝 Engines specifikace v package.json (Node >=20, npm >=10)
- 🏗️ Kompletní adresářová struktura v README
- 💡 Vysvětlení app/ vs src/ struktury
- 🔐 Environment variables best practices (.env.local)

### Changed
- 📖 Kompletně přepsaný README s lepší strukturou
- 🎯 Monorepo story vysvětlena (strukturální monorepo, ne workspace)
- 📦 package.json description a keywords
- ✨ Vylepšený public/README.md s aktuální strukturou

### Removed
- 🗑️ Legacy prototyp: `index.html`, `app.js`, `404.html`
- 🗑️ Nepoužívané skripty: `ui-helpers.js`, `video-visuals.js`
- 🗑️ Duplicitní data: `chapters-media.json`
- 🗑️ Prázdné složky: `content/`, `app/info/`, `public/archive/`, `public/autor/`
- 🗑️ Duplicitní dokumentace: `landing-intro/README.md`
- 📁 Celkem ~35KB mrtvého kódu

### Security
- 🔒 Dokumentována sanitizace HTML v TypewriterReader
- 🔒 Trusted content policy vysvětlena
- 🔒 Explicitní `.env.local` v gitignore

---

## [1.0.0] - 2025-12-13

### Initial Release
- 🎉 Next.js 15 aplikace s App Router
- 📚 Interaktivní čtečka kapitol
- 💀 Cyberpunk design s glitch efekty
- 🎨 MBTI interaktivita
- 🎬 Landing page s video pozadím
- 📖 Knihovna kolekcí
- 🗂️ Archiv s interaktivními kartami
