import type { TransactionRow } from "@/types/auth";

interface TransactionItemProps {
    tx: TransactionRow;
}

/**
 * One row in the ledger list: icon by direction, human label, timestamp, and
 * a signed amount. Handles bad `created_at` strings without crashing the list.
 */
export function TransactionItem({ tx }: TransactionItemProps) {
    const isDeposit = tx.type === "deposit";
    const date = new Date(tx.created_at);
    const invalid = Number.isNaN(date.getTime());
    const formattedDate = invalid
        ? "—"
        : date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
          });
    const time = invalid
        ? ""
        : date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
          });

    return (
        <div className="group flex items-center justify-between p-4 border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${isDeposit
                        ? "border-green-500/20 bg-green-500/10 text-green-500"
                        : "border-red-500/20 bg-red-500/10 text-red-400"
                    }`}>
                    {isDeposit ? "↓" : "↑"}
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white tracking-tight">
                        {tx.description || (isDeposit ? "Deposit" : "Payment")}
                    </span>
                    <span className="text-xs text-neutral-500 flex gap-2">
                        <span>{formattedDate}</span>
                        {!invalid && (
                            <>
                                <span>&middot;</span>
                                <span>{time}</span>
                            </>
                        )}
                    </span>
                </div>
            </div>

            <div className={`text-sm font-mono tracking-tight ${isDeposit ? "text-green-500" : "text-red-500"
                }`}>
                {isDeposit ? "+" : "-"}${Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
        </div>
    );
}
