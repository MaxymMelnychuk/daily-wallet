"use client";

import { useState } from "react";
import { BalanceCard } from "./BalanceCard";
import { StatsRow } from "./StatsRow";
import { WalletModal } from "./WalletModal";
import { TransactionList } from "./TransactionList";
import { Button } from "@/components/ui/Button";

interface DashboardClientProps {
    initialBalance: number;
    totalDeposited: number;
    totalSpent: number;
    transactionCount: number;
}

type ModalMode = "deposit" | "spend" | null;

export function DashboardClient({
    initialBalance,
    totalDeposited: initDeposited,
    totalSpent: initSpent,
    transactionCount: initCount,
}: DashboardClientProps) {
    const [balance, setBalance] = useState(initialBalance);
    const [totalDeposited, setTotalDeposited] = useState(initDeposited);
    const [totalSpent, setTotalSpent] = useState(initSpent);
    const [transactionCount, setTransactionCount] = useState(initCount);
    const [modal, setModal] = useState<ModalMode>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = (
        newBalance: number,
        type: "deposit" | "spend",
        amount: number,
    ) => {
        setBalance(newBalance);
        setTransactionCount((c) => c + 1);
        if (type === "deposit") {
            setTotalDeposited((t) => t + amount);
        } else {
            setTotalSpent((t) => t + amount);
        }
        setRefreshTrigger((n) => n + 1);
    };

    return (
        <main className="mx-auto px-6 flex flex-col gap-6 w-full">
            <BalanceCard balance={balance} />

            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    onClick={() => setModal("deposit")}
                    className="py-4 border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 text-lg tracking-tight group"
                >
                    <span className="group-hover:text-green-500 mr-2">↓ Add Funds</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setModal("spend")}
                    className="py-4 border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 text-lg tracking-tight group "
                >
                    <span className="text-white mr-2 group-hover:text-red-400">↑ Spend Funds</span> 
                </Button>
            </div>

            <StatsRow
                totalDeposited={totalDeposited}
                totalSpent={totalSpent}
                transactionCount={transactionCount}
            />

            <TransactionList refreshTrigger={refreshTrigger} />

            {modal && (
                <WalletModal
                    mode={modal}
                    onClose={() => setModal(null)}
                    onSuccess={(newBalance) => {
                        const prevBalance = balance;
                        const diff = Math.abs(newBalance - prevBalance);
                        handleSuccess(newBalance, modal, diff);
                    }}
                />
            )}
        </main>
    );
}
