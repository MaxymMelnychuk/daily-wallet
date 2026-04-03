/**
 * Single source of truth for the MySQL connection string used by Prisma CLI
 * and the runtime driver adapter. Prefer DATABASE_URL in production; local
 * setups can keep using DB_* (same variables as the mysql2 pool in db.ts).
 */
export function getDatabaseUrl(): string {
    const explicit = process.env.DATABASE_URL?.trim();
    if (explicit) {
        return explicit;
    }

    const host = process.env.DB_HOST ?? "127.0.0.1";
    const port = process.env.DB_PORT ?? "3306";
    const user = process.env.DB_USER ?? "root";
    const password = process.env.DB_PASSWORD ?? "";
    const database = process.env.DB_NAME ?? "daily_wallet";

    const auth =
        password === ""
            ? encodeURIComponent(user)
            : `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;

    return `mysql://${auth}@${host}:${port}/${encodeURIComponent(database)}`;
}
