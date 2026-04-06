import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";
import { Navbar } from "@/components/dashboard/Navbar";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

/** Loads the signed-in user row plus aggregate transaction stats for the dashboard header. */
async function getUserData(userId: number) {
  const [userRows] = await db.query<RowDataPacket[]>(
    "SELECT id, username, email, balance, created_at FROM users WHERE id = ?",
    [userId],
  );
  const user = (
    userRows as {
      id: number;
      username: string;
      email: string;
      balance: number;
      created_at: string;
    }[]
  )[0];
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
  const stats = (statsRows as {
    total_deposited: number;
    total_spent: number;
    transaction_count: number;
  }[])[0];

  return { user, stats };
}

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
