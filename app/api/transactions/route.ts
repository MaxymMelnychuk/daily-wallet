import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import type { TransactionsResponse } from "@/types/auth";
import type { RowDataPacket } from "mysql2/promise";

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
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10", 10));
    const offset = (page - 1) * limit;

    const validTypes = ["deposit", "spend"];
    const typeFilter = validTypes.includes(type) ? type : null;

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
