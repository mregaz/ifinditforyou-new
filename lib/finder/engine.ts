import { runProvidersDetailed } from "./manager/providerManager";
import { parseQuery } from "./parser";
import { filterByPriceCap } from "./price";
import { resolveCapability } from "./providers/capabilityResolver";
import { resolveProviders } from "./providers/resolver";
import type { FinderPlan, FinderResponse, Lang } from "./types";
import { finderLogger } from "./utils/logger";
type RunFinderInput = {
  query: string;
  lang: Lang;
  plan: FinderPlan;
};

export async function runFinderEngine(
  input: RunFinderInput
): Promise<FinderResponse> {
 const parsedQuery = parseQuery(input.query, input.lang);

const capability = resolveCapability(parsedQuery);

finderLogger.info("capability resolved", {
  query: parsedQuery.normalized,
  capability,
});

const providers = resolveProviders({
  capability,
});

  const providerManagerResult = await runProvidersDetailed({
    providers,
    query: parsedQuery,
  });

  finderLogger.info("provider executions", {
    executions: providerManagerResult.executions,
  });

  const results = filterByPriceCap(
    providerManagerResult.results,
    parsedQuery.maxPriceChf
  );
  const vehicleResults = parsedQuery.vehicleIntent
    ? results.filter((result) => result.isAccessory !== true)
    : results;

  const sortedResults = vehicleResults.sort((a, b) => b.score - a.score);

  return {
    query: parsedQuery,
    results: sortedResults,
    summary:
      input.plan === "pro"
        ? "Ricerca PRO completata con Finder Engine."
        : "Ricerca gratuita completata con Finder Engine.",
  };
}
