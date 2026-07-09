import { withRetry } from "../utils/retry";
import type { FinderResult, ParsedQuery } from "../types";
import type { SearchProvider } from "../contracts/SearchProvider";
import { TimeoutError, withTimeout } from "../utils/withTimeout";
import { finderLogger } from "../utils/logger";
type ProviderExecutionStatus = "success" | "error";

type ProviderExecution = {
  provider: string;
  status: ProviderExecutionStatus;
  durationMs: number;
  resultCount: number;
};

type ProviderManagerResult = {
  results: FinderResult[];
  executions: ProviderExecution[];
};

type RunProvidersParams = {
  providers: SearchProvider[];
  query: ParsedQuery;
};

export async function runProvidersDetailed({
  providers,
  query,
}: RunProvidersParams): Promise<ProviderManagerResult> {
  const executions = await Promise.all(
    providers.map(async (provider) => {
      const startedAt = Date.now();

    try {
  const results = await withRetry(
    () => withTimeout(provider.search(query), 3000),
    {
      retries: 1,
      delayMs: 250,
      onRetry: ({ attempt, retries, error }) => {
        finderLogger.warn("provider retry", {
          provider: provider.name,
          attempt,
          retries,
          error,
        });
      },
    }
  );

  const durationMs = Date.now() - startedAt;

        return {
          results,
          execution: {
            provider: provider.name,
            status: "success" as const,
            durationMs,
            resultCount: results.length,
          },
        };
      } catch (error) {
        const durationMs = Date.now() - startedAt;

        if (error instanceof TimeoutError) {
          finderLogger.warn("provider timeout", {
  provider: provider.name,
  durationMs,
});

          return {
            results: [],
            execution: {
              provider: provider.name,
              status: "error" as const,
              durationMs,
              resultCount: 0,
            },
          };
        }

        finderLogger.error("provider failed", {
  provider: provider.name,
  durationMs,
  error,
});

        return {
          results: [],
          execution: {
            provider: provider.name,
            status: "error" as const,
            durationMs,
            resultCount: 0,
          },
        };
      }
    })
  );

  return {
    results: executions.flatMap((item) => item.results),
    executions: executions.map((item) => item.execution),
  };
}

export async function runProviders({
  providers,
  query,
}: RunProvidersParams): Promise<FinderResult[]> {
  const managerResult = await runProvidersDetailed({
    providers,
    query,
  });

  return managerResult.results;
}