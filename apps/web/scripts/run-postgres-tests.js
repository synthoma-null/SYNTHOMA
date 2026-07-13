#!/usr/bin/env node

const { spawnSync } = require('child_process');

const connectionString = process.env.SYNTHOMA_POSTGRES_TEST_URL;
if (!connectionString) {
  console.error('SYNTHOMA_POSTGRES_TEST_URL is required for real PostgreSQL tests.');
  process.exit(1);
}

const parsed = new URL(connectionString);
const localHosts = new Set(['127.0.0.1', 'localhost', '::1']);
const databaseName = parsed.pathname.replace(/^\//, '');
if (
  !['postgres:', 'postgresql:'].includes(parsed.protocol) ||
  !localHosts.has(parsed.hostname) ||
  !/^synthoma_(?:test|541_)/.test(databaseName)
) {
  console.error('PostgreSQL integration tests require a guarded local synthoma test database.');
  process.exit(1);
}

const environment = {
  ...process.env,
  DATABASE_URL: connectionString,
  NODE_ENV: 'test',
};

const prismaCli = require.resolve('prisma/build/index.js');
const migrate = spawnSync(process.execPath, [prismaCli, 'migrate', 'deploy'], {
  cwd: process.cwd(),
  env: environment,
  stdio: 'inherit',
});
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

const jestCli = require.resolve('jest/bin/jest');
const test = spawnSync(process.execPath, [
  jestCli,
  'src/server/economy/__tests__/postgresTransactions.integration.test.ts',
  '--runInBand',
  '--no-coverage',
], {
  cwd: process.cwd(),
  env: environment,
  stdio: 'inherit',
});
process.exit(test.status ?? 1);
