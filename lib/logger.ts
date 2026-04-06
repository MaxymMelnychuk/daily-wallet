import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

/** Structured logging: pretty transport in dev, JSON in production for aggregators. */
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
