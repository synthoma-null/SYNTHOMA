import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

function makePrisma() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return {
    pool,
    client: new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : process.env.NODE_ENV === 'test'
          ? []
          : ['error'],
    }),
  };
}

const instance = globalForPrisma.prisma && globalForPrisma.prismaPool
  ? { client: globalForPrisma.prisma, pool: globalForPrisma.prismaPool }
  : makePrisma();

export const prisma = instance.client;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = instance.pool;
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  await instance.pool.end();
}

export default prisma;
