import { prisma } from "@/lib/prisma";

/** Narrow `select` shape reused anywhere we hydrate a user without secrets. */
const safeUserSelect = {
    id: true,
    username: true,
    email: true,
    balance: true,
    createdAt: true,
} as const;

export type SafeUserRow = Awaited<ReturnType<typeof findUserForSession>>;

/**
 * API/session reads: explicit `select` so password hashes never enter response DTOs by accident.
 */
export async function findUserForSession(userId: number) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: safeUserSelect,
    });
}

/**
 * Atomic wallet credit + ledger row (same outcome as the raw SQL deposit route).
 * Spend flows that need “check balance then deduct” should use an interactive
 * transaction and lock the user row (e.g. `findUnique` + update in one tx).
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
