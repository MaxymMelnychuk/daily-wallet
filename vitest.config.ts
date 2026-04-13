import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest + jsdom for React and route handler tests. The `@` alias mirrors
 * `tsconfig` paths so imports like `@/lib/session` resolve in tests.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
