import mysql from "mysql2/promise";

/**
 * mysql2 pool for legacy SQL routes and `lib/auth`. Keep `DB_*` aligned with `getDatabaseUrl`
 * so Prisma CLI and the app hit the same database.
 */
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});