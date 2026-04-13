import "dotenv/config";
import { defineConfig } from "prisma/config";
import { getDatabaseUrl } from "./lib/database-url";

/**
 * Prisma 7 “project” file: where the schema lives, where migrations go, and how
 * to reach the database for CLI commands. Reuses `getDatabaseUrl()` so env
 * setup matches the running Next.js app.
 */
export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: getDatabaseUrl(),
    },
});
