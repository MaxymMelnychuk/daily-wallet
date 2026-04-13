interface StatsRowProps {
    totalDeposited: number;
    totalSpent: number;
    transactionCount: number;
}

/**
 * Small presentational block: label, value string, and a semantic color token.
 * Keeps the three dashboard tiles visually consistent.
 */
function StatCard({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: "green" | "red" | "neutral";
}) {
    const colorMap = {
        green: "text-green-500",
        red: "text-red-500",
        neutral: "text-white",
    };

    return (
        <div className="flex flex-col gap-2 p-6 bg-neutral-900/30 border border-neutral-800 rounded-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                {label}
            </span>
            <span className={`text-2xl font-light tracking-tight ${colorMap[color]}`}>
                {value}
            </span>
        </div>
    );
}

/**
 * Three-up summary fed from Redux (which was seeded from SQL aggregates on the
 * server page). Purely read-only — mutations happen in `WalletModal`.
 */
export function StatsRow({
    totalDeposited,
    totalSpent,
    transactionCount,
}: StatsRowProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
                label="Total In"
                value={`+ $${totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                color="green"
            />
            <StatCard
                label="Total Out"
                value={`- $${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                color="red"
            />
            <StatCard
                label="Transactions"
                value={String(transactionCount)}
                color="neutral"
            />
        </div>
    );
}
