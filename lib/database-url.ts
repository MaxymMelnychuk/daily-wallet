/**
 * Builds the MySQL URL Prisma expects. Used by:
 * - `prisma.config.ts` (migrations, `prisma generate`)
 * - `lib/prisma.ts` (runtime adapter)
 *
 * Production usually sets `DATABASE_URL` once. Local dev can rely on the same
 * `DB_*` variables as `lib/db.ts` so there is only one mental model.
 */
export function getDatabaseUrl(): string {
    const explicit = process.env.DATABASE_URL?.trim();
    if (explicit) {
        return explicit;
    }

    const host = process.env.DB_HOST?.trim() || "127.0.0.1";
    const portRaw = process.env.DB_PORT?.trim() || "3306";
    // Avoid malformed URLs if someone typos `DB_PORT` (e.g. "33o6").
    const port = /^\d+$/.test(portRaw) ? portRaw : "3306";
    const user = (process.env.DB_USER ?? "root").trim();
    const password = process.env.DB_PASSWORD ?? "";
    const database = (process.env.DB_NAME ?? "daily_wallet").trim();

    const auth =
        password === ""
            ? encodeURIComponent(user)
            : `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;

    return `mysql://${auth}@${host}:${port}/${encodeURIComponent(database)}`;
}
