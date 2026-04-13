import { prisma } from "@/lib/prisma";

/**
 * Explicit column allow-list for reads. Never `include` the password field —
 * that avoids leaking hashes into JSON by mistake.
 */
const safeUserSelect = {
    id: true,
    username: true,
    email: true,
    balance: true,
    createdAt: true,
} as const;

/** Whatever `findUserForSession` returns — useful for typing API handlers. */
export type SafeUserRow = Awaited<ReturnType<typeof findUserForSession>>;

/**
 * Loads a user by id for session refresh / profile endpoints. Prisma maps
 * `createdAt` in the schema; MySQL REST code still uses `created_at` strings.
 */
export async function findUserForSession(userId: number) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: safeUserSelect,
    });
}

/**
 * Example of an atomic money movement in Prisma: increment balance and insert
 * a matching `transactions` row in one `$transaction`. If you add a Prisma-based
 * spend, use `FOR UPDATE` semantics via interactive transaction + raw query
 * or serializable isolation — the SQL spend route already locks the row.
 */
export async function depositForUser(input: {
    userId: number;
    amount: number;
    description?: string | null;
}) {
    const { userId, amount, description } = input;

    return prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: userId },
            data: { balance: { increment: amount } },
        });

        await tx.transaction.create({
            data: {
                userId,
                amount,
                type: "deposit",
                description: description ?? null,
            },
        });

        return tx.user.findUniqueOrThrow({
            where: { id: userId },
            select: { balance: true },
        });
    });
}
