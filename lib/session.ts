import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionUser } from "@/types/auth";

export const sessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "daily_wallet_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax" as const,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
};

export type AppSession = IronSession<{ user?: SessionUser }>;

export async function getSession(): Promise<AppSession> {
    const cookieStore = await cookies();
    return getIronSession<{ user?: SessionUser }>(cookieStore, sessionOptions);
}

export async function getSessionUser(): Promise<SessionUser | null> {
    const session = await getSession();
    return session.user ?? null;
}
