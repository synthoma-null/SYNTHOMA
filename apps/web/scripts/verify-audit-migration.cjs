// Read-only verification. Never prints credentials or account/content records.
require('dotenv').config({ path: '.env.local', quiet: true });
const { Client } = require('pg');
const fs = require('node:fs');
const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL, connectionTimeoutMillis: 10000, statement_timeout: 30000 });
(async () => {
  await client.connect();
  await client.query('BEGIN READ ONLY');
  const migrations = (await client.query('SELECT migration_name, finished_at, rolled_back_at FROM "_prisma_migrations" ORDER BY started_at')).rows;
  const columns = (await client.query("SELECT table_name, column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND (table_name IN ('PasswordResetToken', 'SecurityRateLimit', 'CheckoutOrder') OR (table_name = 'User' AND column_name = 'sessionVersion')) ORDER BY table_name, ordinal_position")).rows;
  const counts = {};
  for (const name of ['User', 'Entitlement', 'Purchase', 'ManagedBook', 'ManagedChapter']) {
    counts[name] = (await client.query(`SELECT COUNT(*)::text AS count FROM "${name}"`)).rows[0].count;
  }
  await client.query('COMMIT');
  const report = { checkedAt: new Date().toISOString(), migrations, columns, counts };
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => { console.error('Database verification failed:', error.code || error.name); process.exitCode = 1; }).finally(() => client.end());
