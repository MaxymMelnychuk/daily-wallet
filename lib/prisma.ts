import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseUrl } from "@/lib/database-url";

/**
 * In dev, Next hot-reloads modules and would create many Prisma clients (each
 * with its own pool) if we did not cache the instance on `globalThis`.
 */
const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
};

/**
 * Wires Prisma to MySQL through the official MariaDB driver adapter — required
 * for Prisma 6+ when not using the old binary engines for this setup.
 */
function createPrismaClient(): PrismaClient {
    const adapter = new PrismaMariaDb(getDatabaseUrl());
    return new PrismaClient({ adapter });
}

/** Alias if you need to annotate helpers that accept any Prisma client. */
export type AppPrismaClient = PrismaClient;

/**
 * Process-wide singleton: reuse in dev to prevent connection storms during HMR.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
