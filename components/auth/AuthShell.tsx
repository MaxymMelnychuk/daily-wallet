import type { ReactNode } from "react";
import Link from "next/link";

interface AuthShellProps {
  children: ReactNode;
}

/**
 * Full-height centered column for login/register. The home link is `position:
 * absolute` so it does not affect vertical centering of the form card.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Link
        href="/"
        aria-label="Back to home"
        className="absolute top-4 left-4 text-white px-4 py-2 hover:bg-neutral-800/50 transition-colors rounded-sm"
      >
        ← Home
      </Link>
      {children}
    </div>
  );
}
