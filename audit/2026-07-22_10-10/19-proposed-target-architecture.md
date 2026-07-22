# Navržená cílová architektura

Návrh zachovává Next.js App Router a současné domény. Nejde o přepis frameworku.

~~~text
apps/web/
  app/                         # pouze routes, metadata a tenké composition vrstvy
  src/
    content/
      catalog/                 # jediný typed katalog knih, kapitol, produktů
      books/                   # metadata a odkazy na HTML sources
      archive/                 # typed locale registry + unlock metadata
      speakers/                # role, barvy, aliases, tones
      generated/               # pouze generované, banner DO NOT EDIT
    features/
      reader/                  # controllers, state, UI, tests
      library/
      archive/
      profile/
      cyklus/                  # engine/content/ui/storage odděleně
      pwa/
      public-ai/
    server/
      auth/
      chapters/
      economy/
      rate-limit/
    design-system/
      tokens.css
      shell.css
      typography.css
      motion.css
      ui/
    platform/
      storage-keys.ts
      env.ts
      observability.ts
  content-source/
    books/null/
    books/konec-podpory/
    media-masters/             # není přímo servírováno
  public/
    generated/                 # optimalizované runtime assets
    fonts/
  scripts/
    content/
    pwa/
    qa/
  tests/
    contracts/
    integration/
    browser/
    visual/
~~~

## Pravidla hranic

- Route importuje feature veřejné API; feature neimportuje app route.
- Server-only moduly nesmí být re-exportovány klientskými barrels.
- Každý generovaný soubor uvádí zdroj a příkaz; CI ověří nulový diff po generování.
- Archivní barva odkazuje na speaker role, ne na zkopírovaný hex.
- Knižní CSS je namespaced pod collection root a nesmí resetovat cizí route.
- Cyklus engine nemá UI importy; UI používá fasádu. Content registry má referenční validátor.
- PWA runtime cache rules jsou testovaný kontrakt, update strategy je explicitní produktové rozhodnutí.
- Browser testy drží kritické toky, unit testy čistou logiku, screenshoty pouze stabilní vizuální kontrakty.
