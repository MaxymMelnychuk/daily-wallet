import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { getSession } from "@/lib/session";
import type { RegisterResponse } from "@/types/auth";

export async function POST(req: NextRequest) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json<RegisterResponse>(
                { error: "All fields are required" },
                { status: 400 },
            );
        }

        const userId = await createUser(username, email, password);

        const session = await getSession();
        session.user = { id: userId, username, email };
        await session.save();

        return NextResponse.json<RegisterResponse>(
            { message: "Account created successfully", userId },
            { status: 201 },
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        return NextResponse.json<RegisterResponse>(
            { error: message },
            { status: 400 },
        );
    }
}
