# SYNTHOMA PWA

## Architecture

SYNTHOMA uses one production service worker at `/sw.js`. The App Router manifest lives in `app/manifest.ts` and is served as `/manifest.webmanifest`. `PwaProvider` owns registration, installability, online state, cache state and the waiting-worker update flow. It registers only in a production build, including a local `next start` build.

The implementation uses Workbox `generateSW`. The current requirements are limited to precaching, standard runtime strategies and the built-in `SKIP_WAITING` message flow, so a custom `injectManifest` worker would add lifecycle code without adding useful behavior.

## Version

Current PWA version: `1.0.0-pwa.2`.

The version is declared in:

- `src/lib/pwa.ts` for client UI
- `scripts/build-pwa.mjs` for cache names and precache revisions

Change both values together. `npm run pwa:audit` verifies the generated worker contains the expected cache version.

## Manifest And Icons

- Manifest source: `app/manifest.ts`
- Manifest URL: `/manifest.webmanifest`
- Source icon: `public/icons/source/synthoma-pwa-master.png`
- Monochrome source: `public/icons/source/synthoma-pwa-monochrome-master.png`
- Generated icons: `public/icons/*.png`
- Generator: `npm run pwa:icons`

The maskable variants keep the glyph inside a 78% safe area. The monochrome icon is generated as a white alpha mask. Do not replace these with a book cover or a text-heavy image.

Manifest screenshots are real captures of the current application in `public/screenshots`. Refresh them when the main shell, Reader or Archive changes materially.

## Service Worker Build

`npm run build` generates content and icons, builds Next.js, then runs `npm run pwa:build`. Workbox precaches the offline route, core icons, essential local fonts and generated CSS. The worker runtime is inlined into the single `/sw.js` file.

Cache groups:

| Cache | Strategy | Scope |
| --- | --- | --- |
| Workbox precache | Precache | offline route, icons, essential fonts, built CSS |
| `synthoma-static-*` | CacheFirst | `/_next/static/*` |
| `synthoma-fonts-*` | CacheFirst | same-origin fonts |
| `synthoma-images-*` | StaleWhileRevalidate | same-origin images and covers |
| `synthoma-reader-*` | NetworkFirst / CacheFirst | chapter navigations and reader CSS |
| `synthoma-pages-*` | NetworkFirst | public page navigations |

Navigation uses a three-second network timeout and falls back to the visited page or `/offline`. A visited canonical chapter can therefore be reopened offline. The worker does not download future chapters automatically.

All `/api/*` requests and the Profile, Admin, Login, Register and Purchase surfaces are `NetworkOnly`. POST, PATCH, PUT and DELETE requests do not enter runtime caching. Authentication, MNEM, entitlements, user profile, whispers and private API responses are never stored in Cache Storage.

Next.js RSC and Flight requests are explicitly `NetworkOnly`. Requests with `_rsc`, `RSC`, `Next-Router-Prefetch` or `Next-Router-State-Tree` markers are bypassed, and responses with `text/x-component` or an already consumed body are rejected by the cache plugin. This prevents streamed server output from being mixed between builds.

## Installation

Chromium installability is captured from `beforeinstallprompt`. The automatic SYNTHOMA prompt appears only after the second browser session, never in standalone/fullscreen mode, and never during Reader, Cyklus, login, registration or purchase interactions. Dismissal has a fourteen-day cooldown. A manual entry remains available at `/install` and under Settings > Application.

The system splash is driven by the manifest background color, theme color, app name and maskable icon. No additional blocking logo intro is used because the server-rendered shell already provides an immediate first paint.

## Updates

Workers claim clients immediately so the recovery release can replace the incompatible production worker. Activation removes older `synthoma-*` cache generations and sends `PWA_UPDATED` with the public build identifier and removed-cache count. The provider then offers one explicit safe reload. Update UI is deferred while the user is in Reader, Cyklus, authentication or purchase flows.

For an ordinary waiting worker, `AKTUALIZOVAT` sends `{ type: "SKIP_WAITING" }`; the page reloads only after `controllerchange`. Cache cleanup failures are contained and do not replace a valid network response with an application failure.

`/sw.js` and `/manifest.webmanifest` use `Cache-Control: public, max-age=0, must-revalidate`. Registration also uses `updateViaCache: "none"`.

## Offline UI

`/offline` is precached and listens for `online` and `offline` events. It offers retry, Library, and the last chapter only when that chapter is actually present in Cache Storage. Reconnecting never forces a reload during reading.

Clearing offline data removes only cache names beginning with `synthoma-`. It does not clear localStorage, IndexedDB, cookies, reading progress, choices, UI settings, Cyklus state or authentication.

Anonymous readers keep progress and free theme choices locally. Client code waits for the session state and does not call `/api/me/progress`, `/api/me/themes` or other user synchronization endpoints unless the session is authenticated.

`/install?debug=1` shows manifest, worker, controller, standalone, prompt, connectivity, build and cache-version status. It contains no token or user data. The same core status and maintenance actions are available under Settings > Application.

## Local Verification

```powershell
cd C:\SYNTHOMA\apps\web
npm.cmd run pwa:icons
npm.cmd run build
npm.cmd run pwa:audit
npm.cmd run pwa:test
npm.cmd run start
```

Use `http://localhost:3000` or another explicit port. Service workers require HTTPS or localhost. Verify `/manifest.webmanifest`, `/sw.js`, `/offline`, one visited chapter offline, one uncached route fallback, and the absence of API entries in Cache Storage.

## Production Verification

After deployment, verify on `https://www.synthoma.cz`:

1. Manifest and worker return 200 with the expected content types and revalidation headers.
2. Worker scope is `/` and exactly one registration is active.
3. Installation uses the SYNTHOMA launcher icon and system splash.
4. A visited chapter reloads in airplane mode.
5. An uncached route renders `/offline`.
6. A new deployment produces the update prompt and activates only after confirmation.
7. Cache Storage contains no `/api/auth`, `/api/me` or `/api/profile` response.

To recover from an old worker, use the Application panel action `VYMAZAT OFFLINE CACHE`, then `ZKONTROLOVAT AKTUALIZACI`. A full browser reset is a last resort because it also removes local reader and Cyklus state.
