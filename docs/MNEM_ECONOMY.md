# SYNTHOMA — MNEM ekonomika

## Ledger

`MnemLedger` je append-only. `amount` je delta, `balanceAfter` je výsledný zůstatek po zápisu. Nový záznam obsahuje `transactionType`, důvod, globálně unikátní `idempotencyKey` a volitelné vazby na obsah, balíček, Stripe session, externí referenci a admin aktéra.

Podporované operace jsou pouze:

- `grantMnems` pro nezáporný kredit,
- `spendMnemsAtomic` pro kladnou požadovanou útratu, která se zapíše jako záporná delta,
- `adjustMnems` pro auditovanou administrátorskou korekci.

Všechny zamknou řádek uživatele `FOR UPDATE`, znovu spočítají aktuální zůstatek a odmítnou výsledek pod nulou. Databázový check `balanceAfter >= 0 NOT VALID` chrání nové řádky a dovoluje samostatně auditovat případná historická data.

## Nákup za MNEM

`purchaseWithMnems` validuje cenu výhradně z katalogu. V jedné Serializable transakci:

1. zamkne účet,
2. ověří idempotency klíč,
3. odmítne již vlastněný obsah,
4. vytvoří pending `Purchase`,
5. zapíše debit,
6. vytvoří entitlement,
7. dokončí purchase receipt.

Selhání kteréhokoli kroku vrátí celý stav zpět. Stejný klíč vrátí původní výsledek. Jiný klíč pro již vlastněný obsah vrátí 409 bez debitu. Cena zaslaná klientem se nečte.

## Balíčky

Balíček vytváří jeden entitlement typu `package`. `grantPackage` může současně přidat katalogem definovaný MNEM kredit, ale neduplikuje entitlementy kapitol. Resolver rozbalí `chapterIds` centrálně. Supporter příznak sám o sobě neodemkne obsah mimo explicitní seznam balíčku.

## Stripe

Checkout vyžaduje přihlášení a idempotency klíč. Metadata rozlišují balíček a konkrétní obsah. `single-fragment` s kapitolou grantuje kapitolu, ne prázdný balíček.

Pouze podepsaný `checkout.session.completed` s `payment_status=paid` může zapsat grant. `ExternalGrantEvent` deduplikuje Stripe event i session. Návratová stránka nic negrantuje a netvrdí úspěch, dokud stav nepotvrdí server. Nevyřešená identita zůstane `unresolved`; plaintext kódy se nelogují.

## Redeem a administrace

Redeem kód lze atomicky claimnout pouze jednou. Opakování stejným uživatelem je bezpečný replay, jiný uživatel dostane konflikt. Kód může grantovat balíček, obsah nebo MNEM a vždy volá sdílené služby.

Admin korekce vyžaduje `Idempotency-Key`, nesmí vytvořit záporný zůstatek a zapisuje `AdminAuditLog` s aktérem, cílem a referencí. Generování přístupových kódů je auditováno bez ukládání plaintextů do logu.

## Provozní kontroly

- Žádný produkční kód mimo `src/server/economy` nesmí volat `mnemLedger.create` nebo `entitlement.create/upsert`.
- Profil a admin detail počítají zůstatek z celého ledgeru, nikoli z omezené historie.
- Backfill: `npm run entitlements:backfill` je dry-run; zápis vyžaduje `-- --apply`.
