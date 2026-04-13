"use client";

import { useState } from "react";
import type { WalletResponse } from "@/types/auth";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";

type ModalMode = "deposit" | "spend";

interface WalletModalProps {
    mode: ModalMode;
    onClose: () => void;
    onSuccess: (newBalance: number) => void;
}

/**
 * Overlay form posting to `/api/wallet/deposit` or `/api/wallet/spend`. On
 * success we bubble the new balance up so Redux can update immediately; the
 * ledger refetch is triggered separately via `refreshTrigger`.
 */
export function WalletModal({ mode, onClose, onSuccess }: WalletModalProps) {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const endpoint = mode === "deposit" ? "/api/wallet/deposit" : "/api/wallet/spend";
        const parsed = Number.parseFloat(amount);
        const body = {
            amount: parsed,
            description: description.trim() || null,
        };

        if (!Number.isFinite(parsed) || parsed <= 0) {
            setError("Enter a valid positive amount");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data: WalletResponse = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            onSuccess(data.balance!);
            onClose();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isDeposit = mode === "deposit";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="w-full max-w-md bg-black border border-neutral-800 p-8 shadow-2xl animate-slide-up"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="wallet-modal-title"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 id="wallet-modal-title" className="text-xl font-medium tracking-tight text-white">
                        {isDeposit ? "Add Funds" : "Spend Funds"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="text-neutral-500 hover:text-white transition-colors p-1 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                            Amount
                        </label>
                        <TextInput
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            autoFocus
                            className="text-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                            Description
                        </label>
                        <TextInput
                            type="text"
                            placeholder={isDeposit ? "What is this deposit for?" : "What did you buy?"}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={200}
                            required={!isDeposit}
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? "Processing..." : isDeposit ? "Confirm" : "Spend"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
