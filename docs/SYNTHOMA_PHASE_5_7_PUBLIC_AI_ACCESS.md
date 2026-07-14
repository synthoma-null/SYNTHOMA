# SYNTHOMA Phase 5.7 - Public AI Access

Version: 1
Date: 2026-07-14
Branch: `refactor/mnem-entitlement-core`
Content version: `2026-07-14`
Cyklus public engine version: `1.0.0`

## CURRENT AUDIT

Before Phase 5.7:

- `/` and `/books` contained useful server-rendered content.
- `/autor` and `/archive` relied on client presentation for their primary experience; limited fallback text existed in `noscript`.
- canonical `/chapter/[id]` redirected an accessible chapter to the JavaScript Reader instead of returning the free chapter text itself.
- legacy `/reader` remained an interactive client route and was not a stable machine-readable content contract.
- `/cyklus` was a browser game tied to the normal application presentation and progression flow.
- `robots.txt` disallowed the entire `/api/` namespace, including any future public API.
- there was no public versioned lore API, card catalog, Markdown corpus, OpenAPI contract, LLM manifest, or stateless agent game.
- structured data existed in isolated places but did not form one complete public discovery contract.

After Phase 5.7, public material is present in initial HTML or available through stable Markdown/JSON routes. Private application APIs, profiles, purchases, sessions, admin routes, and user data remain outside the public contract.

## PUBLIC CONTENT

| Resource | HTML | Markdown | JSON | Visibility rule |
| --- | --- | --- | --- | --- |
| Homepage | full SSR | `/ai/{locale}/index.md` | `/api/public/v1/site` | publicFull |
| Author | full SSR | `/ai/{locale}/author.md` | `/api/public/v1/author` | publicFull |
| Library | chapter metadata | `/ai/{locale}/books/synthoma-null.md` | `/api/public/v1/books` | publicFull |
| Free chapter | full SSR | `/ai/{locale}/chapters/{id}.md` | `/api/public/v1/chapters/{id}` | publicFull |
| Paid/draft chapter | gate and metadata | metadata only | metadata only | publicMetadata |
| Archive | public bodies plus locked metadata | `/ai/{locale}/archive.md` | `/api/public/v1/archive` | canonical access config |
| Cyklus cards | crawlable catalog and detail | `/ai/{locale}/cards/...` | `/api/public/v1/cards` | canonical card resolver |
| Cyklus game | human game unchanged | rules linked | `/api/public/v1/cyklus/*` | isolated sandbox |

The same visibility resolvers serve HTML, Markdown, JSON, sitemap, LLM manifests, and the public game safety filter. There is no separately maintained public content catalog.

Public JSON lists support stable ordering, `limit` from 1 to 100, opaque cursors, `nextCursor`, and exact totals. Responses include CORS `*`, public CDN caching, `ETag`, `Last-Modified`, and conditional `304` responses. They do not enable credentials or create sessions.

## FREE CHAPTERS

Public full-text chapter IDs:

1. `0-inf-restart`
2. `0-0-null`
3. `0-1-start`
4. `0-2-run`
5. `0-3-discontinuum`

`/chapter/[id]` now returns semantic `main` and `article` HTML for these chapters without auth or a database query. Czech and English canonical files are selected server-side with `?locale=cs|en`; the article carries the source language. Chapter JSON-LD includes `Chapter`, position, author, parent `Book`, language, free status, word count, modification date, and canonical URL.

Known paid and draft IDs return only access/catalog metadata and never read their protected source into the public service. Unknown IDs return a real 404. The production crawler QA compared a protected-source sample against the locked response and found no leak.

## ARCHIVE AND AUTHOR

Author sources remain the canonical Czech and English author HTML files. Public exports are available as semantic HTML, Markdown, and JSON.

Archive sources remain the canonical Czech and English archive JSON files. Entries marked full and free expose their public body. Locked entries expose teaser and access metadata only. Hidden entries are filtered out before every public renderer.

Machine routes support `cs` and `en`. When a canonical translation does not exist, the response reports its actual `sourceLocale` instead of inventing translated content.

## CARDS

Registry source: canonical `CYKLUS_CARDS` plus `CYKLUS_CARD_ART_IDS` and the central visibility resolver.

- `publicFull`: 66
- `publicMetadata`: 158
- `hidden`: 17

Public full cards include stable ID, title, plain scene, public choice IDs and labels, category, tags, poster URL, alt text, canonical URL, and visibility. Metadata cards omit scene, choices, and poster. Tutorial/hidden cards return 404 and are absent from catalog, sitemap, Markdown indexes, and AI gameplay.

The exports do not contain card weights, conditions, outcome effects, internal notes, or unsafe raw HTML.

## AI GAME

Flow:

1. `GET /api/public/v1/cyklus/rules`
2. `POST /api/public/v1/cyklus/run` with optional locale and seed
3. read the returned public card and choices
4. `POST /api/public/v1/cyklus/choice` with `stateToken` and `choiceId`
5. continue for at most 12 turns
6. receive `completed` or `collapsed` plus summary

The adapter uses the existing Cyklus engine for effects, stats, consequences, and picking. It clears account/meta progression at sandbox start and applies the central public visibility filter to the engine result. No copy of effect rules was created.

State tokens use authenticated encryption with Node `AES-256-GCM`, token and engine versions, a 60-minute expiry, and no user identity. Production requires `AI_STATE_TOKEN_SECRET`, `AUTH_SECRET`, or `NEXTAUTH_SECRET`. Modified tokens return `INVALID_STATE_TOKEN`, expired tokens return `RUN_EXPIRED`, incompatible versions return `VERSION_EXPIRED`, and invalid choices return `INVALID_CHOICE`.

Rate limits are independently configurable and default to:

- read-only content: 300 requests / 10 minutes / IP
- start run: 30 requests / hour / IP
- choices: 500 requests / hour / IP

The request body limit is 64 KiB and the public run horizon is 12 turns. A limit response is JSON `429` with `Retry-After`.

Database side effects: **0**. The sandbox has no user ID, MNEM, entitlement, collection, discovery, or progression write contract.

Reproducible test run:

- seed: `phase-5-7-contract`
- choices: alternating `yes`, `no`
- turns: 12
- first card: `restart_0`
- last card: `choose_archive`
- final stats: energy 52, memory 53, bond 48, control 59
- status: `completed`
- ending classification: `sandbox_horizon`

Production HTTP QA repeated seed `http-contract` in `cs` and `en`. Both runs completed 12 turns with identical card IDs, choices, final stats, and ending classification. Locale did not affect gameplay.

## DISCOVERY

- `robots.txt` explicitly allows public content for `*`, `OAI-SearchBot`, and `GPTBot`.
- private auth, profile, account, purchase, admin, preview, debug, and non-public API paths remain disallowed.
- `sitemap.xml` is generated from canonical chapter, Archive, and card registries.
- `/llms.txt` is the curated public index.
- `/llms-full.txt` contains Author, free chapters, publicFull Archive records, and Cyklus links; it excludes paid chapters and private/user data.
- JSON-LD covers `WebSite`, `CreativeWorkSeries`, `Book`, `Chapter`, `ProfilePage`, `Person`, `CollectionPage`, `ItemList`, `CreativeWork`, and `Game` relationships.
- root HTML advertises OpenAPI through `rel="service-desc"`.

Crawler QA used generic curl, Googlebot, Bingbot, OAI-SearchBot, GPTBot, ChatGPT-User, and generic AI-Agent user agents against ten public routes each.

- requests: 70
- HTTP/content checks: 70/70 PASS
- response types: 56 HTML, 7 Markdown, 7 JSON
- measured concurrent batch latency: average 479.6 ms, maximum 488 ms
- minimum response size: 1,657 bytes
- paid source sample in locked response: false
- JavaScript required to read tested public content: no

## OPENAPI

- JSON: `https://www.synthoma.cz/api/public/openapi.json`
- YAML: `https://www.synthoma.cz/api/public/openapi.yaml`
- human documentation: `https://www.synthoma.cz/ai/api`
- policy: `https://www.synthoma.cz/ai-policy`

OpenAPI 3.1 documents every public lore, card, rules, start, and choice endpoint, including locale, pagination, request bodies, JSON errors, rate limiting, and the absence of authentication. JSON serialization, required paths, production routes, and YAML structure are covered by tests and build QA.

## LIVE PRODUCTION QA

Deployment commit: `5a0c2ec`

Verification window: 2026-07-14 19:13-21:49 CEST

Live domain: `https://www.synthoma.cz`

### Deployment and secret configuration

- Both Vercel deployment checks completed successfully for the final commit.
- `AI_STATE_TOKEN_SECRET`: **PASS**. Production now requires this dedicated variable, rejects values shorter than 32 characters, rejects equality with `AUTH_SECRET` or `NEXTAUTH_SECRET`, and has no auth-secret fallback.
- A live run start returned 200 only after the dedicated production variable was configured. No secret value was read or printed.
- The optimized client bundle contained zero references to `AI_STATE_TOKEN_SECRET`, `AUTH_SECRET`, or `NEXTAUTH_SECRET`. No `.env` file was included in the build output.

### Crawler matrix

The same 15 routes were requested with each user agent: `/`, `/books`, one free chapter, one locked chapter, `/archive`, `/autor`, `/cards`, one `publicFull` card, `/llms.txt`, `/llms-full.txt`, the site API, OpenAPI JSON, OpenAPI YAML, `robots.txt`, and `sitemap.xml`.

| User agent | Result |
| --- | --- |
| curl | 15/15 PASS |
| Googlebot | 15/15 PASS |
| Bingbot | 15/15 PASS |
| OAI-SearchBot | 15/15 PASS |
| GPTBot | 15/15 PASS |
| ChatGPT-User | 15/15 PASS |
| generic AI-Agent | 15/15 PASS |

Total: **105/105 PASS**. Every tested public route returned useful server-rendered or machine-readable content without JavaScript.

### Visibility and private boundaries

- Free chapter: 200 with full semantic text.
- Locked chapter: 200 with gate/catalog metadata; public JSON contains null text and Markdown fields.
- Hidden tutorial card: 404 from both JSON API and human HTML route.
- Signed-out `/api/me/profile`: 401 with no session cookie or private payload.
- The hidden-card HTML status required and received a narrow route fix in `1469fee`.

### Cache and CORS

- Public machine responses expose `Access-Control-Allow-Origin: *`.
- Cyklus CORS preflight returns 204 with `GET, POST, OPTIONS`.
- Public JSON and cacheable HTML expose ETag; tested conditional requests returned 304.
- LLM Markdown and OpenAPI YAML expose Last-Modified rather than ETag; tested conditional requests also returned 304.
- Auth-dependent chapter pages are intentionally private/no-store and do not expose public cache validators.
- Cyklus run and choice responses now return `Cache-Control: private, no-store`, no ETag, no Last-Modified, and no cookie. The narrow production fix is `78abdbd`.

### Live AI Cyklus

Seed: `phase-5-7-1-live-parity`. Both locales used the same alternating yes/no choices.

- Czech run: 12 decisions, completed, `sandbox_horizon`.
- English run: 12 decisions, completed, `sandbox_horizon`.
- Card IDs, choice IDs, per-turn stats, final stats, and ending classification: **identical**.
- State token cleared after completion: **PASS**.
- Cookies, sessions, personal payload keys, and account state: **absent**.
- Database writes: **0 by the isolated adapter contract and source dependency audit**; the public handlers have no user, auth, Prisma, progression, entitlement, or MNEM write path.
- Modified token: 400 `INVALID_STATE_TOKEN`.
- Invalid choice: 400 `INVALID_CHOICE`.
- Request body above 64 KiB: 413 `BODY_TOO_LARGE`.
- Expired token: automated contract test **PASS**; live 60-minute expiry wait was not performed, so live expiry remains **HOLD**.
- English text layer: **HOLD**. The live English run reports `sourceLocale: cs` and returns the same title, scene, and choice labels as Czech. Gameplay localization isolation works, but canonical English card copy does not yet exist.

### Rate limit backend

Status: **HOLD**.

The current backend is a module-level in-process `Map`. It works inside one warm function instance: a 320-request live batch returned 298 successful responses and 22 rate-limited responses; 429 included `Retry-After`. It does not coordinate across Vercel instances and does not survive a serverless cold start or deployment.

Minimal shared adapter prepared for the follow-up:

1. Define an async `PublicRateLimitStore.consume(key, limit, windowMs)` contract returning allowed/reset/retry-after data.
2. Keep the in-memory implementation only for tests and local development.
3. Use one production shared backend with an atomic increment-and-expiry operation, such as Vercel KV or an existing Redis-compatible service.
4. Require the shared backend in production and fail closed if it is unavailable.
5. Preserve the current response schema and `Retry-After` header.

No shared storage dependency or production credential was selected in this phase, so the limiter was not replaced speculatively.

### External discovery

- `robots.txt` permits the documented public paths for generic crawlers, OAI-SearchBot, and GPTBot while disallowing private APIs.
- OAI-SearchBot and GPTBot had zero CDN/WAF failures.
- Sitemap, LLM manifests, OpenAPI server URL, canonical links, and JSON-LD use `https://www.synthoma.cz` and contain no localhost URLs.

### Live decision

- Public content and discovery: **PASS**.
- Public visibility boundaries: **PASS**.
- Dedicated state-token secret and no-store token transport: **PASS**.
- Deterministic 12-turn gameplay: **PASS**.
- Multi-instance production rate limiting: **HOLD**.
- English card text localization: **HOLD**.
- Live expiry observation: **HOLD** (automated expiry contract is green).

Overall Phase 5.7.1 decision: **HOLD for a fully green public AI release claim**, while the deployed public read layer and Czech stateless Cyklus contract are operational.

## MCP

Status: **deferred**.

The repository has no verified MCP SDK or standard Streamable HTTP transport. Phase 5.7 therefore does not publish a proprietary endpoint falsely named MCP. REST/OpenAPI and the shared public service layer are complete and can support a later standards-compliant adapter with the proposed resources and `start_cyklus` / `choose_cyklus` tools.

## TESTS

- targeted public AI and SSR suites: 4 passed, 19 tests passed
- content generation: 0 files changed
- content validation: PASS, 96 entries and 22 chapters
- Prisma validation: PASS
- TypeScript: PASS
- full Jest: 69 suites passed, 599 tests passed, 21 skipped
- production build: PASS
- production crawler matrix: PASS, 70/70
- two complete HTTP agent runs: PASS, deterministic across locale

Build retains four known hook dependency warnings outside this phase in `BooksClient`, `GameShell`, and `TypewriterReader`. They are non-blocking and were not changed here.

## GIT

Phase commits:

- `667dd3f feat: expose public Synthoma content as semantic server HTML`
- `f756fa4 feat: add Markdown and JSON exports for public lore`
- `43e522b feat: publish robots sitemap and LLM discovery files`
- `e7e84fd feat: expose the public Cyklus card catalog`
- `69e37a4 feat: add stateless AI gameplay for Cyklus`
- `7da949b docs: publish OpenAPI and AI access policy`
- commit 7 intentionally omitted because MCP was deferred
- final verification: `test: verify crawler content and agent gameplay contracts`

No `.env`, signing secret, database dump, runtime/request log, screenshot, `.next`, or `tsconfig.tsbuildinfo` belongs to these commits.

## RELEASE

**PASS** for public HTML, Markdown, JSON, card catalog, discovery, OpenAPI, AI policy, and stateless agent Cyklus.

MCP is an explicit non-blocking follow-up. No database migration or backfill was executed in this phase.
