type LogLevel = "info" | "warn" | "error";

type FinderLogPayload = Record<string, unknown>;

function safeErrorText(value: string): string {
  return value
    .replace(/https?:\/\/[^\s]+/gi, (url) => {
      try {
        return `${new URL(url).origin}/[redacted]`;
      } catch {
        return "[redacted URL]";
      }
    })
    .replace(/\b(Bearer|Basic)\s+\S+/gi, "$1 [redacted]")
    .replace(/\b(token|key|secret|password)=\S+/gi, "$1=[redacted]")
    .slice(0, 500);
}

function describeError(error: Error): Record<string, unknown> {
  const details = error as Error & {
    code?: unknown;
    status?: unknown;
    statusText?: unknown;
    url?: unknown;
    requestUrl?: unknown;
  };
  const result: Record<string, unknown> = {
    name: safeErrorText(error.name),
    message: safeErrorText(error.message),
  };

  if (typeof details.code === "string" && /^[A-Z0-9_]{2,40}$/.test(details.code)) {
    result.code = details.code;
  }
  if (typeof details.status === "number" && Number.isInteger(details.status)) {
    result.status = details.status;
  }
  if (typeof details.statusText === "string") {
    result.statusText = safeErrorText(details.statusText);
  }

  const requestUrl = details.requestUrl ?? details.url;
  if (typeof requestUrl === "string") {
    try {
      result.hostname = new URL(requestUrl).hostname;
    } catch {
      // Omit malformed URLs rather than logging their contents.
    }
  }

  if (error.cause instanceof Error) {
    const cause = error.cause as Error & { code?: unknown };
    result.cause = {
      name: safeErrorText(cause.name),
      message: safeErrorText(cause.message),
      ...(typeof cause.code === "string" && /^[A-Z0-9_]{2,40}$/.test(cause.code)
        ? { code: cause.code }
        : {}),
    };
  }

  return result;
}

function formatPayload(payload?: FinderLogPayload): string {
  if (!payload) {
    return "";
  }

  return ` ${JSON.stringify(payload, (_, value) =>
    value instanceof Error ? describeError(value) : value
  )}`;
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
