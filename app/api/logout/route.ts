import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/**
 * Destroys the iron-session cookie contents. `Cache-Control: no-store` stops
 * intermediaries from caching a “logged out” JSON body that might confuse CDNs.
 */
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
