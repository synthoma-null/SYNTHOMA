import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  schema: './prisma/schema.prisma',
  // Migrace potřebují přímé spojení; aplikační Prisma klient dál používá
  // transakční pooler z DATABASE_URL.
  datasource: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL! },
});
