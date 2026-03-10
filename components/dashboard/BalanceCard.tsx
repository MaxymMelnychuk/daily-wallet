"use client";

import { useEffect, useRef } from "react";

interface BalanceCardProps {
    balance: number;
}

function AnimatedBalance({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const start = 0;
        const end = value;
        const duration = 800;
        const startTime = performance.now();

        const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;

            const formatted = current.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            el.textContent = formatted;

            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }, [value]);

    return <span ref={ref}>0.00</span>;
}

export function BalanceCard({ balance }: BalanceCardProps) {
    return (
        <div className="relative border border-neutral-900 bg-neutral-950 p-24  flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
                Wallet Balance
            </div>

            <div className="flex items-start justify-center gap-1 text-white">
                <span className="text-2xl sm:text-3xl font-light text-neutral-500 mt-1 sm:mt-2">$</span>
                <span className="text-5xl sm:text-7xl font-semibold tracking-tighter">
                    <AnimatedBalance value={balance} />
                </span>
            </div>

            <div className="mt-8 text-xs text-neutral-600 flex items-center gap-2">
                <span className="w-1 h-1 bg-neutral-600 rounded-full" />
                Virtual demo funds only
            </div>
        </div>
    );
}
