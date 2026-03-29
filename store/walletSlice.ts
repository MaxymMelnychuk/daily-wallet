import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ModalMode = "deposit" | "spend" | null;

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
        initWallet(state, action: PayloadAction<Omit<WalletState, "modal" | "refreshTrigger">>) {
            state.balance = action.payload.balance;
            state.totalDeposited = action.payload.totalDeposited;
            state.totalSpent = action.payload.totalSpent;
            state.transactionCount = action.payload.transactionCount;
        },
        setModal(state, action: PayloadAction<ModalMode>) {
            state.modal = action.payload;
        },
        applyTransaction(
            state,
            action: PayloadAction<{ newBalance: number; type: "deposit" | "spend"; amount: number }>,
        ) {
            const { newBalance, type, amount } = action.payload;
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
