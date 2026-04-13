import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Which overlay is open, if any. `null` means no modal — keeps one source of
 * truth instead of separate booleans for deposit vs spend.
 */
type ModalMode = "deposit" | "spend" | null;

/**
 * Everything the dashboard client needs between server renders:
 * - balances and counters for stats cards
 * - modal visibility
 * - `refreshTrigger`: bump this to tell `TransactionList` to refetch
 */
interface WalletState {
    balance: number;
    totalDeposited: number;
    totalSpent: number;
    transactionCount: number;
    modal: ModalMode;
    refreshTrigger: number;
}

const initialState: WalletState = {
    balance: 0,
    totalDeposited: 0,
    totalSpent: 0,
    transactionCount: 0,
    modal: null,
    refreshTrigger: 0,
};

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        /**
         * Called once when the server component passes initial props down.
         * Replaces slice state with the truth from SQL (after login/navigation).
         */
        initWallet(state, action: PayloadAction<Omit<WalletState, "modal" | "refreshTrigger">>) {
            state.balance = action.payload.balance;
            state.totalDeposited = action.payload.totalDeposited;
            state.totalSpent = action.payload.totalSpent;
            state.transactionCount = action.payload.transactionCount;
        },
        /** Opens or closes the deposit/spend dialog. */
        setModal(state, action: PayloadAction<ModalMode>) {
            state.modal = action.payload;
        },
        /**
         * After a successful API call, apply the new balance and roll local
         * aggregates forward so the UI matches without a full page reload.
         * Ignores junk amounts so bad payloads cannot corrupt totals.
         */
        applyTransaction(
            state,
            action: PayloadAction<{ newBalance: number; type: "deposit" | "spend"; amount: number }>,
        ) {
            const { newBalance, type, amount } = action.payload;
            if (!Number.isFinite(amount) || amount <= 0) {
                return;
            }
            state.balance = newBalance;
            state.transactionCount += 1;
            state.refreshTrigger += 1;
            if (type === "deposit") {
                state.totalDeposited += amount;
            } else {
                state.totalSpent += amount;
            }
            state.modal = null;
        },
    },
});

export const { initWallet, setModal, applyTransaction } = walletSlice.actions;
export default walletSlice.reducer;
