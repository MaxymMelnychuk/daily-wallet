"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
    username: string;
}

/**
 * Sticky header for the dashboard: brand, who is signed in, and logout.
 * Logout calls the API then navigates client-side — `router.refresh()` lets
 * server components re-read the now-empty session if we add any on this layout.
 */
export function Navbar({ username }: NavbarProps) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/logout", { method: "POST" });
            router.push("/auth/login");
            router.refresh();
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-900">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-white font-medium tracking-tight">DailyWallet</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-white text-sm border border-neutral-700 px-4 py-2">
                        <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 18"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden={true}
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                        <span className="text-sm text-neutral-400">{username}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="text-white border border-red-950/80 hover:bg-red-900/20 px-4 py-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loggingOut ? "..." : "Sign out"}
                    </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
