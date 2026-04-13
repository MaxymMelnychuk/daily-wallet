import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Server-side logger only (API routes, lib). In dev we pretty-print; in prod we
 * emit JSON lines so platforms like Vercel/Datadog can parse severity and time.
 * Override verbosity with `LOG_LEVEL` (e.g. `debug`, `warn`).
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  ...(isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        },
      }
    : {}),
});
