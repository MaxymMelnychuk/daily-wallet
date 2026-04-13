import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";
import { Navbar } from "@/components/dashboard/Navbar";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

type UserSummary = {
  id: number;
  username: string;
  email: string;
  balance: number;
  created_at: string;
};

type StatsSummary = {
  total_deposited: number;
  total_spent: number;
  transaction_count: number;
};

/**
 * Fetches the signed-in user plus aggregate transaction stats in two queries.
 * Kept as a local helper so the page component reads top-to-bottom: auth →
 * data → render.
 */
async function getUserData(userId: number): Promise<{ user: UserSummary; stats: StatsSummary } | null> {
  const [userRows] = await db.query<RowDataPacket[]>(
    "SELECT id, username, email, balance, created_at FROM users WHERE id = ?",
    [userId],
  );
  const user = (userRows as UserSummary[])[0];
  if (!user) return null;

  const [statsRows] = await db.query<RowDataPacket[]>(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END), 0) AS total_deposited,
      COALESCE(SUM(CASE WHEN type = 'spend' THEN amount ELSE 0 END), 0) AS total_spent,
      COUNT(*) AS transaction_count
    FROM transactions
    WHERE user_id = ?`,
    [userId],
  );
  const stats = (statsRows as StatsSummary[])[0];

  return { user, stats };
}

/**
 * Home is the dashboard: requires a session. If the user row disappeared
 * (deleted DB row) we treat it like logged-out and send them to login.
 */
export default async function HomePage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/auth/login");
  }

  const data = await getUserData(sessionUser.id);

  if (!data) {
    redirect("/auth/login");
  }

  const { user, stats } = data;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar username={user.username} />
      <DashboardClient
        initialBalance={Number(user.balance)}
        totalDeposited={Number(stats.total_deposited)}
        totalSpent={Number(stats.total_spent)}
        transactionCount={Number(stats.transaction_count)}
      />
    </div>
  );
}
