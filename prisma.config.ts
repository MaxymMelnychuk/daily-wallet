import "dotenv/config";
import { defineConfig } from "prisma/config";
import { getDatabaseUrl } from "./lib/database-url";

/** Prisma 7 project config: migrations + datasource URL shared with runtime `lib/database-url`. */
export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: getDatabaseUrl(),
    },
});
