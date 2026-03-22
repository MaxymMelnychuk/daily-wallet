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
        await connection.query(
            "UPDATE users SET balance = balance + ? WHERE id = ?",
            [rounded, sessionUser.id],
        );

        await connection.query(
            "INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'deposit', ?)",
            [sessionUser.id, rounded, description ?? null],
        );

        const [rows] = await connection.query<RowDataPacket[]>(
            "SELECT balance FROM users WHERE id = ?",
            [sessionUser.id],
        );
        const newBalance = Number((rows as RowDataPacket[])[0].balance);

        await connection.commit();
        connection.release();

        return NextResponse.json<WalletResponse>({
            message: "Deposit successful",
            balance: newBalance,
        });
    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error({ err }, "Deposit transaction error");
        return NextResponse.json<WalletResponse>(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
