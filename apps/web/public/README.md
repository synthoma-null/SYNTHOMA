# Public assets pro SYNTHOMA web 💀

Statické soubory servírované Next.js na `/`.

## 📁 Struktura

- `/assets/` → různé assety (ikony, shadery, atd.)
  - `/assets/images/` → obrázky (raster/vector)
  - `/assets/favicon.ico` → favicon (referencovaný v Next metadata)
- `/fonts/` → webfonty (woff2)
- `/audio/` → hudba a zvukové efekty pro kapitoly
- `/video/` → background videa pro čtečku a stránky
- `/books/` → kapitoly v HTML formátu + generovaný manifest.json
  - `/books/SYNTHOMA-NULL/` → kapitoly první kolekce
  - `/books/manifest.json` → generovaný výstup z `src/content/catalog.ts`; needitovat ručně
  - `/books/mbti.js` → MBTI interaktivní skripty pro kapitoly
  - `/books/glitch-toggle.js` → glitch toggle funkce
- `/data/` → archivní data a obsahové soubory
- `/styles.css` → globální styly načítané HTML kapitolami (důležité!)

## 📝 Poznámky

- Pro velká media preferuj CDN nebo Git LFS
- Licenční soubory drž vedle third-party médií
- **NEDOTÝKAT SE** `styles.css`, `mbti.js`, `glitch-toggle.js` – jsou používané v HTML kapitolách!
