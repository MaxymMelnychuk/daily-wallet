import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Typed `useDispatch`. Without `.withTypes`, thunks and action payloads devolve
 * to `any` and you lose autocomplete across the codebase.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed `useSelector`. The selector function receives `RootState` so nested
 * keys like `state.wallet.balance` stay checked at compile time.
 */
export const useAppSelector = useSelector.withTypes<RootState>();
