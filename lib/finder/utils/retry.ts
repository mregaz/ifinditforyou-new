import { TimeoutError } from "./withTimeout";

export type RetryOptions = {
  retries: number;
  delayMs: number;
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (params: {
    attempt: number;
    retries: number;
    error: unknown;
  }) => void;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }

  return undefined;
}

export function isTemporaryProviderError(error: unknown): boolean {
  if (error instanceof TimeoutError) {
    return false;
  }

  const code = getErrorCode(error);

  if (!code) {
    return false;
  }

  return [
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "EAI_AGAIN",
    "ENOTFOUND",
  ].includes(code);
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { retries, delayMs, shouldRetry = isTemporaryProviderError, onRetry } =
    options;

  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= retries || !shouldRetry(error)) {
        throw error;
      }

      attempt += 1;

      onRetry?.({
        attempt,
        retries,
        error,
      });

      await delay(delayMs);
    }
  }
}
