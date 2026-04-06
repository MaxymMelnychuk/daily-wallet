import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";

/** Client-only wallet UI state; server data is still the source of truth for balance. */
export const store = configureStore({
    reducer: {
        wallet: walletReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
