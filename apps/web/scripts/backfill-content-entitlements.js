#!/usr/bin/env node

const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { loadTypeScriptModule } = require('./validate-content');

const ROOT = path.resolve(__dirname, '..');
const apply = process.argv.includes('--apply');
if (process.argv.includes('--help')) {
  console.log('Usage: npm run entitlements:backfill -- [--apply]');
  console.log('Default mode is dry-run. --apply writes idempotent generic entitlements.');
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  const envPath = path.join(ROOT, '.env.local');
  try {
    if (typeof process.loadEnvFile === 'function') process.loadEnvFile(envPath);
    else require('dotenv').config({ path: envPath, quiet: true });
  } catch {
    // The explicit DATABASE_URL check below provides the actionable error.
  }
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required. No data was read or written.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function key(contentType, contentId) {
  return `${contentType}:${contentId}`;
}

function anonymizeLedgerId(id) {
  return crypto.createHash('sha256').update(id).digest('hex').slice(0, 12);
}

async function main() {
  const catalogModule = loadTypeScriptModule(path.join(ROOT, 'src', 'content', 'catalog.ts'));
  const catalogKeys = new Set(catalogModule.CONTENT_CATALOG.map((entry) => key(entry.type, entry.id)));
  const columns = await prisma.$queryRawUnsafe(
    `SELECT table_name AS "tableName", column_name AS "columnName"
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name IN ('Entitlement', 'MnemLedger')`,
  );
  const entitlementColumns = new Set(
    columns.filter((item) => item.tableName === 'Entitlement').map((item) => item.columnName),
  );
  const ledgerColumns = new Set(
    columns.filter((item) => item.tableName === 'MnemLedger').map((item) => item.columnName),
  );
  const coreSchemaPresent = entitlementColumns.has('contentType') && entitlementColumns.has('contentId');
  const balanceAfterPresent = ledgerColumns.has('balanceAfter');
  if (apply && !coreSchemaPresent) {
    throw new Error('Entitlement core migration must be applied before --apply.');
  }

  const rawEntitlements = coreSchemaPresent
    ? await prisma.entitlement.findMany({
        select: {
          id: true, userId: true, contentType: true, contentId: true, chapterId: true,
          source: true, createdAt: true, grantedAt: true,
        },
      })
    : await prisma.$queryRawUnsafe(
        `SELECT "id", "userId", "packageId", "chapterId", "source", "createdAt"
         FROM "Entitlement"`,
      );
  const entitlements = rawEntitlements.map((item) => coreSchemaPresent ? item : ({
    ...item,
    contentType: item.chapterId ? 'chapter' : item.packageId ? 'package' : 'legacy_unknown',
    contentId: item.chapterId ?? item.packageId ?? `legacy:${item.id}`,
    grantedAt: item.createdAt,
  }));
  const rawLedgerPromise = balanceAfterPresent
    ? prisma.mnemLedger.findMany({
        orderBy: [{ userId: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
        select: { id: true, userId: true, amount: true, balanceAfter: true, createdAt: true },
      })
    : prisma.$queryRawUnsafe(
        `SELECT "id", "userId", "amount", NULL::INTEGER AS "balanceAfter", "createdAt"
         FROM "MnemLedger" ORDER BY "userId", "createdAt", "id"`,
      );
  const [fragments, artifacts, cosmetics, ledger] = await Promise.all([
    prisma.fragmentUnlock.findMany(),
    prisma.userArtifact.findMany(),
    prisma.userCosmeticUnlock.findMany(),
    rawLedgerPromise,
  ]);

  const existing = new Set(
    entitlements.map((item) => `${item.userId}:${key(item.contentType, item.contentId)}`),
  );
  const candidates = [];
  for (const item of entitlements) {
    const canonicalId = item.contentType === 'chapter'
      ? catalogModule.resolveChapterId(item.contentId) ?? item.contentId
      : item.contentId;
    if (canonicalId !== item.contentId) {
      candidates.push({
        userId: item.userId,
        contentType: 'chapter',
        contentId: canonicalId,
        chapterId: canonicalId,
        source: 'backfill_alias',
        sourceReference: item.id,
        grantedAt: item.grantedAt ?? item.createdAt,
        createdAt: item.createdAt,
      });
    }
  }
  for (const item of fragments) candidates.push({
    userId: item.userId, contentType: 'fragment', contentId: item.fragmentId,
    source: item.source || 'legacy_fragment', sourceReference: item.id,
    grantedAt: item.unlockedAt, createdAt: item.unlockedAt,
  });
  for (const item of artifacts) candidates.push({
    userId: item.userId, contentType: 'artifact', contentId: item.artifactId,
    source: item.source || 'legacy_artifact', sourceReference: item.id,
    grantedAt: item.unlockedAt, createdAt: item.unlockedAt,
  });
  for (const item of cosmetics) {
    const normalized = item.cosmeticId.replace(/^theme-/, '');
    candidates.push({
      userId: item.userId, contentType: 'cosmetic', contentId: normalized,
      source: item.source || 'legacy_cosmetic', sourceReference: item.id,
      grantedAt: item.unlockedAt, createdAt: item.unlockedAt,
    });
  }

  const uniqueCandidates = new Map();
  for (const candidate of candidates) {
    uniqueCandidates.set(`${candidate.userId}:${key(candidate.contentType, candidate.contentId)}`, candidate);
  }
  const unknownReferences = [];
  const inserts = [];
  for (const candidate of uniqueCandidates.values()) {
    if (!catalogKeys.has(key(candidate.contentType, candidate.contentId))) {
      unknownReferences.push(key(candidate.contentType, candidate.contentId));
      continue;
    }
    if (!existing.has(`${candidate.userId}:${key(candidate.contentType, candidate.contentId)}`)) {
      inserts.push(candidate);
    }
  }

  const runningByUser = new Map();
  const sumByUser = new Map();
  const ledgerUpdates = [];
  const negativeLedgerIds = [];
  let balanceMismatches = 0;
  let negativeHistoricalBalances = 0;
  let missingBalanceAfter = 0;
  for (const entry of ledger) {
    const expected = (runningByUser.get(entry.userId) ?? 0) + entry.amount;
    runningByUser.set(entry.userId, expected);
    sumByUser.set(entry.userId, (sumByUser.get(entry.userId) ?? 0) + entry.amount);
    if (entry.balanceAfter === null) missingBalanceAfter += 1;
    else if (expected !== entry.balanceAfter) balanceMismatches += 1;
    if (entry.balanceAfter === null || expected !== entry.balanceAfter) {
      ledgerUpdates.push({ id: entry.id, balanceAfter: expected });
    }
    if (expected < 0) {
      negativeHistoricalBalances += 1;
      negativeLedgerIds.push(anonymizeLedgerId(entry.id));
    }
  }

  const finalBalanceMismatches = [...runningByUser.entries()].filter(
    ([userId, balance]) => balance !== sumByUser.get(userId),
  ).length;
  const constraintBeforeRows = balanceAfterPresent
    ? await prisma.$queryRawUnsafe(
        `SELECT convalidated AS "validated"
         FROM pg_constraint
         WHERE conname = 'MnemLedger_balanceAfter_nonnegative'
           AND conrelid = '"MnemLedger"'::regclass`,
      )
    : [];
  const constraintBefore = {
    present: constraintBeforeRows.length === 1,
    validated: constraintBeforeRows[0]?.validated ?? false,
  };

  let inserted = 0;
  let updatedLedgerRows = 0;
  let constraintAfter = constraintBefore;
  if (apply) {
    if (unknownReferences.length) {
      throw new Error('Unknown catalog references detected; --apply stopped before writes.');
    }
    if (negativeLedgerIds.length) {
      throw new Error(
        `Historical running balance is negative at anonymized ledger IDs: ${negativeLedgerIds.join(', ')}`,
      );
    }
    if (finalBalanceMismatches !== 0) {
      throw new Error('Final running balances do not equal SUM(amount); --apply stopped.');
    }
    if (!constraintBefore.present) {
      throw new Error('MnemLedger nonnegative constraint is missing; --apply stopped.');
    }

    const result = await prisma.$transaction(async (tx) => {
      let ledgerCount = 0;
      for (const update of ledgerUpdates) {
        const updateResult = await tx.mnemLedger.updateMany({
          where: { id: update.id },
          data: { balanceAfter: update.balanceAfter },
        });
        ledgerCount += updateResult.count;
      }
      if (ledgerCount !== ledgerUpdates.length) {
        throw new Error('Updated ledger row count does not match the dry-run plan.');
      }

      const entitlementResult = inserts.length
        ? await tx.entitlement.createMany({ data: inserts, skipDuplicates: true })
        : { count: 0 };
      if (entitlementResult.count !== inserts.length) {
        throw new Error('Inserted entitlement count does not match the dry-run plan.');
      }

      await tx.$executeRawUnsafe(
        'ALTER TABLE "MnemLedger" VALIDATE CONSTRAINT "MnemLedger_balanceAfter_nonnegative"',
      );
      const status = await tx.$queryRawUnsafe(
        `SELECT convalidated AS "validated"
         FROM pg_constraint
         WHERE conname = 'MnemLedger_balanceAfter_nonnegative'
           AND conrelid = '"MnemLedger"'::regclass`,
      );
      if (status.length !== 1 || status[0].validated !== true) {
        throw new Error('MnemLedger nonnegative constraint was not validated.');
      }
      return {
        insertedEntitlements: entitlementResult.count,
        updatedLedgerRows: ledgerCount,
        constraintAfter: { present: true, validated: true },
      };
    }, { isolationLevel: 'Serializable', maxWait: 10_000, timeout: 120_000 });
    inserted = result.insertedEntitlements;
    updatedLedgerRows = result.updatedLedgerRows;
    constraintAfter = result.constraintAfter;
  }

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'dry-run',
    schemaMode: coreSchemaPresent ? 'entitlement-core' : 'legacy-pre-migration',
    scanned: {
      entitlements: entitlements.length,
      fragmentUnlocks: fragments.length,
      artifacts: artifacts.length,
      cosmetics: cosmetics.length,
      ledgerEntries: ledger.length,
    },
    plannedEntitlements: inserts.length,
    insertedEntitlements: inserted,
    plannedLedgerUpdates: ledgerUpdates.length,
    updatedLedgerRows,
    unknownReferences: [...new Set(unknownReferences)].sort(),
    ledgerAudit: {
      balanceMismatches,
      missingBalanceAfter,
      negativeHistoricalBalances,
      negativeLedgerIds,
      finalBalanceMismatches,
      constraintBefore,
      constraintAfter,
    },
  }, null, 2));
}

main()
  .catch((error) => {
    console.error('Backfill failed without exposing user data:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
