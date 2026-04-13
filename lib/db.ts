import mysql from "mysql2/promise";

/**
 * Shared connection pool for code that still uses raw SQL (`lib/auth`, several
 * route handlers). Prisma uses the same database via `getDatabaseUrl()` — keep
 * `DB_*` (or `DATABASE_URL`) in sync so you never write to two different DBs.
 */
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Wait instead of failing immediately when the pool is exhausted.
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
