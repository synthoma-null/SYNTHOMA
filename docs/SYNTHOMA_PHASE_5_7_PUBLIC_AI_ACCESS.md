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
