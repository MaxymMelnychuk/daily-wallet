import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
    const adapter = new PrismaMariaDb(getDatabaseUrl());
    return new PrismaClient({ adapter });
}

/**
 * One PrismaClient per Node process in dev (Next.js hot reload) to avoid exhausting pools.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
