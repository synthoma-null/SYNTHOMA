# PWA audit

## Build-time PASS

- Manifest 200, application/manifest+json, 5 ikon, 4 shortcuts a 3 screenshots.
- Service worker 28 424 B, 24 precache položek a 5 runtime cache strategií.
- PWA audit skript prošel; 6 ikon bylo ověřeno/generováno.
- Citlivé /api, auth, profile, purchase a admin cesty jsou NetworkOnly.
- _rsc, text/x-component a router prefetch nejsou cachovány.
- Mutující metody nejsou runtime cache cílem.
- CSS/font/static používají CacheFirst, images StaleWhileRevalidate, navigace NetworkFirst s /offline fallbackem.
- Verze cache je namespaced a cleanup starých cache existuje.

## Rizika

1. **P2** | Dopad: update UX | Pracnost: malá/střední | Riziko změny: střední | Jistota: vysoká | Pořadí: po browser QA Workbox používá skipWaiting:true a clientsClaim:true. Nový worker se může aktivovat ještě před potvrzením uživatele; ověřit soulad s update dialogem.
2. Fresh install precache neobsahuje celé knihy. Offline funguje pro shell/fallback a navštívené navigace, ne automaticky pro všechny kapitoly. To musí UI popsat pravdivě.
3. public/sw.js je generovaný soubor; pětřádková pre-build varianta a finální Workbox output mohou mást statické skeny. Zdroj je build-pwa.mjs.
4. Prázdný public/assets/images/favicon.ico má 0 B; i když aplikace může používat jiné ikony, tento asset je vadný kandidát.

## Browser HOLD

- skutečný controller a scope
- install prompt na podporované platformě
- standalone launch
- update dialog a reload
- offline navštívené kapitoly
- hydration #418 a Response body is already used
- anonymní /api/me/* spam v network panelu

Verdikt: PWA build contract PASS; reálná instalovatelnost/update/offline runtime HOLD.
