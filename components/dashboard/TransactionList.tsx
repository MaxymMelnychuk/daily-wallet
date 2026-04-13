"use client";

import { useEffect, useState, useCallback } from "react";
import { LEDGER_UI_PAGE_SIZE, type TransactionRow, type TransactionsResponse } from "@/types/auth";
import { TransactionItem } from "./TransactionItem";

type TabType = "all" | "deposit" | "spend";

const TABS: { label: string; value: TabType }[] = [
    { label: "All", value: "all" },
    { label: "Deposits", value: "deposit" },
    { label: "Spending", value: "spend" },
];

interface TransactionListProps {
    refreshTrigger?: number;
}

/**
 * Client-side ledger: fetches `/api/transactions` when tab/page changes or when
 * `refreshTrigger` increments (after a successful wallet mutation).
 */
export function TransactionList({ refreshTrigger }: TransactionListProps) {
    const [tab, setTab] = useState<TabType>("all");
    const [transactions, setTransactions] = useState<TransactionRow[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(
        async (currentTab: TabType, currentPage: number) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `/api/transactions?type=${currentTab}&page=${currentPage}&limit=${LEDGER_UI_PAGE_SIZE}`,
                );
                const data: TransactionsResponse = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to load");
                setTransactions(data.transactions ?? []);
                setTotalPages(data.totalPages ?? 1);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Error loading transactions");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        fetchTransactions(tab, page);
    }, [tab, page, fetchTransactions, refreshTrigger]);

    const handleTabChange = (newTab: TabType) => {
        setTab(newTab);
        setPage(1);
    };

    return (
        <div className="flex flex-col border border-neutral-800 bg-black overflow-hidden mt-6 rounded-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-neutral-700 gap-4">
                <h2 className="text-sm font-medium tracking-tight text-white uppercase">
                    Transaction History
                </h2>

                <div className="flex gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-md" role="tablist">
                    {TABS.map((t) => (
                        <button
                            key={t.value}
                            type="button"
                            role="tab"
                            aria-selected={tab === t.value}
                            onClick={() => handleTabChange(t.value)}
                            className={`px-4 py-1.5 text-xs tracking-wide transition-colors rounded-sm cursor-pointer ${tab === t.value
                                    ? "bg-neutral-800 text-white shadow-sm"
                                    : "text-neutral-500 hover:text-white"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[200px] flex flex-col">
                {loading && (
                    <div className="flex flex-col divide-y divide-neutral-800/50">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 animate-shimmer" />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="p-8 text-center text-sm text-red-500">
                        {error}
                    </div>
                )}

                {!loading && !error && transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-500">
                        <span className="text-2xl opacity-50">✦</span>
                        <p className="text-sm">No transactions found</p>
                    </div>
                )}

                {!loading && !error && transactions.length > 0 && (
                    <div className="flex flex-col">
                        {transactions.map((tx) => (
                            <TransactionItem key={tx.id} tx={tx} />
                        ))}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center p-4 border-t border-neutral-800 gap-4 text-sm font-mono tracking-tight">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="text-neutral-500 hover:text-white disabled:opacity-30 transition-colors"
                    >
                        ← Prev
                    </button>
                    <span className="text-neutral-600">
                        <span className="text-white">{page}</span> / {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="text-neutral-500 hover:text-white disabled:opacity-30 transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
