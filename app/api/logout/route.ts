import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/** Clears the encrypted session cookie on the server. */
export async function POST() {
    const session = await getSession();
    session.destroy();

    return NextResponse.json(
        { message: "Logged out successfully" },
        {
            status: 200,
            headers: { "Cache-Control": "no-store" },
        },
    );
}
