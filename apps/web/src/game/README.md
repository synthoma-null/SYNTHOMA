# SYNTHOMA: Nezlob Prázdnotu — Technická dokumentace

Tahová online party hra pro 2–6 hráčů zasazená do univerza SYNTHOMA.

---

## Přehled

| Parametr | Hodnota |
|---|---|
| Hráčů | 2–6 |
| Typy hry | Party, Kooperativní, Chaos |
| Platforma | Web (Next.js, mobilní prohlížeč) |
| Transport | HTTP polling (2 s interval) |
| Autorizace | NextAuth session nebo anonymní `clientToken` |

---

## Architektura

```
apps/web/
├── app/
│   ├── game/
│   │   ├── page.tsx                  Server component (metadata, robots: noindex)
│   │   ├── GameClient.tsx            Vstupní UI: vytvořit / připojit místnost
│   │   └── room/[code]/
│   │       ├── page.tsx              Server component
│   │       └── RoomClient.tsx        Lobby polling + GameShell mount
│   └── api/game/
│       ├── rooms/route.ts            POST vytvořit, GET seznam lobby
│       └── rooms/[code]/
│           ├── route.ts              GET poll stavu, POST připojit se
│           ├── start/route.ts        POST spustit hru (jen host)
│           └── move/route.ts         POST server-authoritative akce
└── src/
    ├── components/game/              React UI komponenty
    └── game/                         Čistá herní logika (bez React)
```

---

## Herní logika (`src/game/`)

### Soubory

| Soubor | Obsah |
|---|---|
| `types.ts` | Všechny TypeScript typy a interfejsy |
| `constants.ts` | `ROOM_CODE_LENGTH=6`, `PLAYER_COLORS`, `VOID_PRESSURE_MAX=20` |
| `dice.ts` | Seeded RNG (mulberry32), `rollD6`, `shuffleArray`, `pickRandom` |
| `boardMap.ts` | `BOARD_NODES`, `BOARD_EDGES`, `getNeighbors`, `START_NODE_ID` |
| `cards.ts` | 30 karet (`CARDS`, `CARD_IDS`, `getCardById`) |
| `storyEvents.ts` | 40 příběhových eventů s volbami |
| `traps.ts` | 10 pastí (`TRAPS`, `getTrapById`) |
| `engine.ts` | Herní akce: `rollDice`, `selectPiece`, `moveStep`, `resolveEvent`, `playCard`, `endTurn`, `checkWinLose` |
| `setup.ts` | `createGameState(config: NewGameConfig)` |
| `reducer.ts` | `gameReducer` s `GameAction` union typem |
| `scoring.ts` | `computePlayerScore`, `computeGameResult` |
| `profile.ts` | `computeGameArchetype`, `mapGameProfileToPsyche` |
| `storage.ts` | `loadLocalGame`, `saveLocalGame`, `clearLocalGame` (verzováno) |

### Herní stavový automat

```
roll → select_piece → move → event? → card → end → (next turn / roll)
```

### Fáze tahu (`TurnPhase`)

| Fáze | Popis |
|---|---|
| `roll` | Aktivní hráč hodí kostkou |
| `select_piece` | Hráč vybere fragment k pohybu |
| `move` | Fragment se pohybuje po deskové mapě |
| `event` | Příběhový event čeká na výběr možnosti |
| `card` | Volitelně zahrát kartu z ruky |
| `end` | Hráč ukončí tah |

### Vítězné podmínky

- **Výhra:** Všichni hráči dostanou všechny 3 fragmenty do cíle (uzel `finish`) před `VOID_PRESSURE_MAX = 20`
- **Prohra:** `voidPressure` dosáhne 20 nebo bossovi dojdou HP hráčů
- **Finální kolo:** Jakmile jeden hráč dokončí všechny fragmenty, ostatní mají ještě jedno kolo

---

## Databázové modely (Prisma)

```prisma
model GameRoom {
  id           String
  code         String   @unique  // 6 znaků, náhodný
  hostUserId   String?
  hostPlayerId String?
  status       String   // lobby | playing | finished
  mode         String   // party | coop | chaos
  maxPlayers   Int      @default(6)
  stateJson    Json     // serializovaný GameState
  stateVersion Int      @default(1)
  players      GameRoomPlayer[]
}

model GameRoomPlayer {
  id              String
  roomId          String
  userId          String?   // null pro anonymní hráče
  clientTokenHash String?   // hash anonymního tokenu
  nickname        String
  seatIndex       Int
  color           String
  isHost          Boolean
  status          String    // waiting | playing | disconnected
}
```

---

## API Endpointy

| Metoda | URL | Popis | Auth |
|---|---|---|---|
| `POST` | `/api/game/rooms` | Vytvořit místnost | volitelná |
| `GET` | `/api/game/rooms` | Seznam lobby místností | — |
| `GET` | `/api/game/rooms/[code]?ct=TOKEN` | Poll stavu + `myGamePlayerId` | volitelná |
| `POST` | `/api/game/rooms/[code]` | Připojit se do místnosti | volitelná |
| `POST` | `/api/game/rooms/[code]/start` | Spustit hru (jen host) | session nebo token |
| `POST` | `/api/game/rooms/[code]/move` | Odeslat herní akci | session nebo token |

### Identifikace hráče (bez přihlášení)

Anonymní hráči jsou identifikováni přes `clientToken` — náhodný řetězec uložený v `localStorage('synthoma_game_token')`. Na serveru se ukládá pouze jeho hash (`hashToken()`), nikdy plaintext.

GET `/api/game/rooms/[code]?ct=TOKEN` vrátí `myGamePlayerId` — ID hráče v `GameState` (např. `"a3f9x2b"`) — které se předá do `GameShell` jako `myPlayerId`.

---

## UI Komponenty (`src/components/game/`)

| Komponenta | Popis |
|---|---|
| `GameShell` | Hlavní herní layout; orchestruje fáze, dispatch akcí |
| `BoardMap` | SVG mapa s uzly a hranami; klikací fragmenty |
| `DiceRoller` | Animovaná kostka; `canRoll` prop řídí interaktivitu |
| `CardHand` | Horizontálně scrollovatelná ruka karet |
| `PlayerPanel` | Přehled všech hráčů se zdroji a pozicí |
| `VoidTrack` | Progress bar tlaku Prázdnoty (0–20) |
| `GameLog` | Scrollovatelný log herních událostí |
| `StoryEventModal` | Fullscreen overlay pro příběhové eventy |
| `EndGameReport` | Výsledková obrazovka s archetypy a sdílením |
| `RoomLobby` | Lobby čekárna s kódem místnosti a hráči |

---

## Tok dat (online hra)

```
[Hráč A: GameClient]
    → POST /api/game/rooms          vytvoří místnost, uloží playerId
    → přesměruje na /game/room/CODE

[Hráč B: GameClient]
    → POST /api/game/rooms/CODE     připojí se, uloží playerId

[RoomClient: polling každé 2s]
    → GET /api/game/rooms/CODE?ct=TOKEN
    ← { stateJson, myGamePlayerId, players, status }
    → renderuje RoomLobby nebo GameShell

[Host: stiskne SPUSTIT HRU]
    → POST /api/game/rooms/CODE/start  { playerId, clientToken }
    ← { started: true }

[GameShell: akce hráče]
    → dispatch (lokální optimistický update)
    → POST /api/game/rooms/CODE/move  { action, stateVersion, playerId, clientToken }
    ← { stateVersion: N+1 }
    → fetchRoom() pro sync
```

---

## CSS / Téma

Všechny herní styly jsou v `src/styles/game.css`. Barvy jsou navázány na CSS proměnné z `themes.css`:

| Proměnná | Použití |
|---|---|
| `--game-bg` | Hlavní pozadí |
| `--game-bg-card` | Pozadí karet |
| `--game-bg-surface` | Panely, sidebary |
| `--game-text` | Primární text |
| `--game-text-muted` | Sekundární text |
| `--game-accent` | Zvýraznění, aktivní stav |
| `--game-accent-alt` | Sekundární akcent |
| `--game-border` | Ohraničení |
| `--game-border-active` | Aktivní / hover ohraničení |
| `--game-danger` | Upozornění, chyby, boss |
| `--game-warn` | Varování (střední tlak Prázdnoty) |
| `--game-input-bg` | Pozadí inputů |

Motiv se mění přes `data-theme` atribut na `<html>` — stejný mechanismus jako zbytek webu.

### Breakpointy

| Breakpoint | Cílové zařízení |
|---|---|
| `≤ 1024px` | Tablet |
| `≤ 900px` | Phablet / landscape mobil |
| `≤ 600px` | Telefon na výšku |
| `≤ 380px` | Malý telefon |
| `hover: none` | Dotykové zařízení (44px tap targets) |

---

## Lokální hra (singleplayer / offline)

`src/game/storage.ts` poskytuje `loadLocalGame` / `saveLocalGame` pro lokální uložení stavu bez serveru. Verze je ověřena při načítání — nekompatibilní stav je zahozen.

---

## Rozšíření / TODO

- WebSocket transport místo HTTP pollingu (pro nižší latenci)
- SVG ikony pro sektory a typy karet
- Reconnect logika (hráč se vrátí po výpadku sítě)
- Spektátor mód (čtení stavu bez `myGamePlayerId`)
- Notifikace na tahu (Push API nebo tab title blink)
