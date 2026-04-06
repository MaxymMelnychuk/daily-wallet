import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionUser } from "@/types/auth";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export const sessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "daily_wallet_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        maxAge: SESSION_MAX_AGE_SEC,
    },
};

export type AppSession = IronSession<{ user?: SessionUser }>;

/** Server Components / Route Handlers: read or mutate the encrypted session cookie. */
export async function getSession(): Promise<AppSession> {
    const cookieStore = await cookies();
    return getIronSession<{ user?: SessionUser }>(cookieStore, sessionOptions);
}

export async function getSessionUser(): Promise<SessionUser | null> {
    const session = await getSession();
    return session.user ?? null;
}
