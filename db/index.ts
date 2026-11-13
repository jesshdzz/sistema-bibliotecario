import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const globalParaPool = globalThis as unknown as { __pgPool?: Pool };

const pool =
  globalParaPool.__pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== 'production') {
  globalParaPool.__pgPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
