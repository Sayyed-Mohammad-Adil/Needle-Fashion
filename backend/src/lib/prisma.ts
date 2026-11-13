import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/needle_fashion?schema=public';

const pool = globalForPrisma.pool ?? new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

/**
 * Add `_id` alias to Prisma records so frontend components expecting MongoDB's `_id`
 * continue working seamlessly alongside `id`.
 */
export function withMongoId<T extends { id: string }>(record: T): T & { _id: string } {
  return { ...record, _id: record.id };
}

export function withMongoIds<T extends { id: string }>(records: T[]): Array<T & { _id: string }> {
  return records.map(withMongoId);
}
