import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import type { MeResponse } from "@/types/auth";
import type { UserRow } from "@/types/user";
import type { RowDataPacket } from "mysql2/promise";

/** Current user profile + balance for client refresh hooks. */
export async function GET() {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
        return NextResponse.json<MeResponse>({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await db.query<RowDataPacket[]>(
        "SELECT id, username, email, balance, created_at FROM users WHERE id = ?",
        [sessionUser.id],
    );

    const user = (rows as UserRow[])[0];
    if (!user) {
        return NextResponse.json<MeResponse>({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json<MeResponse>({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            balance: Number(user.balance),
            created_at: user.created_at,
        },
    });
}
