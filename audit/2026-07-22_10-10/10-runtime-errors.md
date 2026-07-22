# Runtime, route a provozní chyby

## Lokální produkční server

Testováno proti čerstvému next start na http://localhost:3210 po úspěšném production buildu.

- 41/41 kanonických chapter page routes: HTTP 200. Nepublikované kapitoly mohou mít veřejnou metadata/gate page; jejich API vrací 409.
- Free chapter API: 200 a HTML.
- Locked chapter API: 403 se strukturovaným CONTENT_LOCKED; chráněný text nebyl vydán.
- Unavailable chapter API: 409.
- Unknown chapter a unknown page: 404.
- Legacy reader odkazy: 308 na kanonickou /chapter/[id].
- /api/me/profile signed-out: 401.
- /api/admin/overview signed-out: 401.
- /api/whispers: 500.
- Interní crawl: 500 URL, 857 odkazů, 0 zjištěných 404/5xx/redirectů ve vzorku.

## Whispers

**P1** | Dopad: endpoint je lokálně nefunkční | Pracnost: malá až střední | Riziko změny: nízké při úzké opravě | Jistota: vysoká lokálně | Pořadí: 1

Serverový log ukázal Prisma operaci whisper.findMany(), error code EACCES a Prisma Client 7.8.0. Odpověď měla prázdné tělo a chyběl JSON Content-Type. Současně se v logu opakoval Auth.js UntrustedHost pro http://localhost:3000/api/auth/session, protože server běžel na 3210 a lokální auth URL zůstala na 3000.

EACCES může být lokální síťové/sandbox omezení a samo nedokazuje produkční DB chybu. Endpoint však má minimálně slabou error boundary. Další krok: reprodukce na správném hostu, signed-out/signed-in/empty table a úzký handler test. Žádná schema změna z tohoto auditu neplyne.

## Console a hydration

Reálný browser runtime nebyl povolen, proto console errors, hydration #418, network waterfall a media errors zůstávají HOLD. HTML odpovědi neměly marker Next server error. To není náhrada za hydrataci.

## Produkční shoda

Lokální HEAD je 3ce9615. origin/HEAD ukazuje main, ale skutečná Vercel Production Branch, deployment ID, alias a servírované chunky nebyly dostupné. Produkční doména nesmí být označena za shodnou jen na základě lokálního buildu.
