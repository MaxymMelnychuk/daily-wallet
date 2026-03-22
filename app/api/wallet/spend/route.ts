import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { WalletResponse } from "@/types/auth";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(req: NextRequest) {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
        return NextResponse.json<WalletResponse>(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

    const { amount, description } = await req.json();
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0 || !Number.isFinite(parsedAmount)) {
        return NextResponse.json<WalletResponse>(
            { error: "Amount must be a positive number" },
            { status: 400 },
        );
    }

    const rounded = Math.round(parsedAmount * 100) / 100;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [balanceRows] = await connection.query<RowDataPacket[]>(
            "SELECT balance FROM users WHERE id = ? FOR UPDATE",
            [sessionUser.id],
        );
        const rawBalance = (balanceRows as RowDataPacket[])[0]?.balance ?? 0;
        const current = Number(rawBalance);

        if (current < rounded) {
            await connection.rollback();
            connection.release();
            return NextResponse.json<WalletResponse>(
                { error: `Insufficient balance. Current balance: ${current.toFixed(2)}` },
                { status: 422 },
            );
        }

        await connection.query(
            "UPDATE users SET balance = balance - ? WHERE id = ?",
            [rounded, sessionUser.id],
        );

        await connection.query(
            "INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'spend', ?)",
            [sessionUser.id, rounded, description ?? null],
        );

        const [updatedRows] = await connection.query<RowDataPacket[]>(
            "SELECT balance FROM users WHERE id = ?",
            [sessionUser.id],
        );
        const newBalance = Number((updatedRows as RowDataPacket[])[0].balance);

        await connection.commit();
        connection.release();

        return NextResponse.json<WalletResponse>({
            message: "Spending recorded",
            balance: newBalance,
        });
    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error({ err }, "Spend transaction error");
        return NextResponse.json<WalletResponse>(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
