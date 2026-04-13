import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";

/**
 * Single Redux store for the browser. Wallet numbers here are a cache for UX
 * (instant modal updates); the database remains authoritative — always
 * reconcile with `/api/me` or route responses if you add more features.
 */
export const store = configureStore({
    reducer: {
        wallet: walletReducer,
    },
    // Handy for debugging in dev; tree-shaken / off in production bundles.
    devTools: process.env.NODE_ENV !== "production",
});

/** Entire Redux tree — use with `useAppSelector`. */
export type RootState = ReturnType<typeof store.getState>;

/** Dispatch type — use with `useAppDispatch` for typed actions. */
export type AppDispatch = typeof store.dispatch;
