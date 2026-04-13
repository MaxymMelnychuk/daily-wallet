"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

/**
 * Client boundary: the Redux store only exists in the browser. Import this
 * once in `layout.tsx` so any `"use client"` page can use hooks from
 * `@/store/hooks`.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
