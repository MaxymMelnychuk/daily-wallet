import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { SessionUser } from "@/types/auth";


const PROTECTED_PATHS = ["/"];

const AUTH_PATHS = ["/auth/login", "/auth/register"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const res = NextResponse.next();
    const session = await getIronSession<{ user?: SessionUser }>(
        req,
        res,
        sessionOptions,
    );

    const isAuthenticated = !!session.user;

    const isProtected = PROTECTED_PATHS.some(
        (p) => pathname === p || (p !== "/" && pathname.startsWith(p)),
    );

    if (isProtected && !isAuthenticated) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && isAuthenticated) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: [

        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
