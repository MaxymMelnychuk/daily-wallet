"use client";

import { useEffect } from "react";
import { BalanceCard } from "./BalanceCard";
import { StatsRow } from "./StatsRow";
import { WalletModal } from "./WalletModal";
import { TransactionList } from "./TransactionList";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initWallet, setModal, applyTransaction } from "@/store/walletSlice";

/** Client island: wires server-seeded totals into Redux and hosts modals + ledger. */
interface DashboardClientProps {
    initialBalance: number;
    totalDeposited: number;
    totalSpent: number;
    transactionCount: number;
}

export function DashboardClient({
    initialBalance,
    totalDeposited,
    totalSpent,
    transactionCount,
}: DashboardClientProps) {
    const dispatch = useAppDispatch();

    const balance = useAppSelector((state) => state.wallet.balance);
    const totalDep = useAppSelector((state) => state.wallet.totalDeposited);
    const totalSp = useAppSelector((state) => state.wallet.totalSpent);
    const txCount = useAppSelector((state) => state.wallet.transactionCount);
    const modal = useAppSelector((state) => state.wallet.modal);
    const refreshTrigger = useAppSelector((state) => state.wallet.refreshTrigger);

    useEffect(() => {
        dispatch(initWallet({ balance: initialBalance, totalDeposited, totalSpent, transactionCount }));
    }, [dispatch, initialBalance, totalDeposited, totalSpent, transactionCount]);

    return (
        <main className="max-w-7xl mx-auto px-6 flex flex-col gap-6 w-full">
            <BalanceCard balance={balance} />

            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    onClick={() => dispatch(setModal("deposit"))}
                    className="py-4 border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 text-lg tracking-tight group"
                >
                    <span className="group-hover:text-green-500 mr-2">↓ Add Funds</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={() => dispatch(setModal("spend"))}
                    className="py-4 border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 text-lg tracking-tight group"
                >
                    <span className="text-white mr-2 group-hover:text-red-400">↑ Spend Funds</span>
                </Button>
            </div>

            <StatsRow
                totalDeposited={totalDep}
                totalSpent={totalSp}
                transactionCount={txCount}
            />

            <TransactionList refreshTrigger={refreshTrigger} />

            {modal && (
                <WalletModal
                    mode={modal}
                    onClose={() => dispatch(setModal(null))}
                    onSuccess={(newBalance) => {
                        const amount = Math.abs(newBalance - balance);
                        dispatch(applyTransaction({ newBalance, type: modal, amount }));
                    }}
                />
            )}
        </main>
    );
}
