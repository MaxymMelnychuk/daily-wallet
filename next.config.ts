import type { NextConfig } from "next";

/**
 * Next.js build/runtime flags. `reactStrictMode` double-invokes some effects
 * in dev on purpose — catches impure side effects early.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
