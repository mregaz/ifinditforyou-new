type LogLevel = "info" | "warn" | "error";

type FinderLogPayload = Record<string, unknown>;

function formatPayload(payload?: FinderLogPayload): string {
  if (!payload) {
    return "";
  }

  return ` ${JSON.stringify(payload)}`;
}

function log(level: LogLevel, message: string, payload?: FinderLogPayload) {
  const prefix = "[finder]";

  if (level === "info") {
    console.info(`${prefix} ${message}${formatPayload(payload)}`);
    return;
  }

  if (level === "warn") {
    console.warn(`${prefix} ${message}${formatPayload(payload)}`);
    return;
  }

  console.error(`${prefix} ${message}${formatPayload(payload)}`);
}

export const finderLogger = {
  info(message: string, payload?: FinderLogPayload) {
    log("info", message, payload);
  },

  warn(message: string, payload?: FinderLogPayload) {
    log("warn", message, payload);
  },

  error(message: string, payload?: FinderLogPayload) {
    log("error", message, payload);
  },
};
