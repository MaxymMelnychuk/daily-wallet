import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import {
    TRANSACTION_TYPES,
    DEFAULT_TRANSACTIONS_LIMIT,
    MAX_TRANSACTIONS_LIMIT,
    type TransactionsResponse,
} from "@/types/auth";
import type { RowDataPacket } from "mysql2/promise";

/**
 * Paginated ledger for the current user. Query params:
 * - `type`: `all` (default), `deposit`, or `spend`
 * - `page`: 1-based
 * - `limit`: clamped to `MAX_TRANSACTIONS_LIMIT`, default `DEFAULT_TRANSACTIONS_LIMIT`
 */
export async function GET(req: NextRequest) {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
        return NextResponse.json<TransactionsResponse>(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? "all";
    const pageRaw = parseInt(searchParams.get("page") ?? "1", 10);
    const page = Math.max(1, Number.isFinite(pageRaw) ? pageRaw : 1);
    const limitRaw = parseInt(searchParams.get("limit") ?? String(DEFAULT_TRANSACTIONS_LIMIT), 10);
    const limit = Math.min(
        MAX_TRANSACTIONS_LIMIT,
        Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : DEFAULT_TRANSACTIONS_LIMIT,
    );
    const offset = (page - 1) * limit;

    const typeFilter = TRANSACTION_TYPES.includes(type as (typeof TRANSACTION_TYPES)[number])
        ? type
        : null;

    const baseWhere = typeFilter
        ? "WHERE user_id = ? AND type = ?"
        : "WHERE user_id = ?";
    const baseParams = typeFilter
        ? [sessionUser.id, typeFilter]
        : [sessionUser.id];

    const [countRows] = await db.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM transactions ${baseWhere}`,
        baseParams,
    );
    const total = (countRows as { total: number }[])[0].total;

    const [rows] = await db.query<RowDataPacket[]>(
        `SELECT * FROM transactions ${baseWhere} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...baseParams, limit, offset],
    );

    return NextResponse.json<TransactionsResponse>({
        transactions: rows as TransactionsResponse["transactions"],
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
}
