import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionUser } from "@/types/auth";

/** One week — balances “remember me” without keeping cookies forever. */
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

/**
 * Shared iron-session config: used by `getSession()` in routes and duplicated
 * in `middleware.ts` (Edge cannot import all of `next/headers`, but needs the
 * same cookie name and secret to decrypt).
 */
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

/** Narrow session shape for components that only care about `user`. */
export type AppSession = IronSession<{ user?: SessionUser }>;

/**
 * Server-only: reads the incoming cookie, decrypts it, returns a mutable
 * session object. Call `session.save()` after changing `session.user`.
 */
export async function getSession(): Promise<AppSession> {
    const cookieStore = await cookies();
    return getIronSession<{ user?: SessionUser }>(cookieStore, sessionOptions);
}

/**
 * Small helper for routes that only need “who is logged in?” without touching
 * the rest of the session API.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
    const session = await getSession();
    return session.user ?? null;
}
