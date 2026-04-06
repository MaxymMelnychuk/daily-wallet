import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/auth";
import { getSession } from "@/lib/session";
import type { LoginResponse } from "@/types/auth";

/** Validates credentials, then persists `session.user` in the iron-session cookie. */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";

        if (!email || !password) {
            return NextResponse.json<LoginResponse>(
                { error: "Email and password are required" },
                { status: 400 },
            );
        }

        const user = await verifyUser(email, password);

        if (!user) {
            return NextResponse.json<LoginResponse>(
                { error: "Invalid email or password" },
                { status: 401 },
            );
        }

        const session = await getSession();
        session.user = { id: user.id, username: user.username, email: user.email };
        await session.save();

        return NextResponse.json<LoginResponse>({
            message: "Login successful",
            user: session.user,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        return NextResponse.json<LoginResponse>({ error: message }, { status: 500 });
    }
}
