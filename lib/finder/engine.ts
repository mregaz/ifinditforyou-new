import { runProvidersDetailed } from "./manager/providerManager";
import { parseQuery } from "./parser";
import { providers } from "./providers";
import type { FinderPlan, FinderResponse, Lang } from "./types";
import { finderLogger } from "./utils/logger";
type RunFinderInput = {
  query: string;
  lang: Lang;
  plan: FinderPlan;
};

export async function runFinderEngine(input: RunFinderInput): Promise<FinderResponse> {
  const parsedQuery = parseQuery(input.query, input.lang);

  const providerManagerResult = await runProvidersDetailed({
  providers,
  query: parsedQuery,
});

finderLogger.info("provider executions", {
  executions: providerManagerResult.executions,
});

const results = providerManagerResult.results;


  const sortedResults = results.sort((a, b) => b.score - a.score);

  return {
    query: parsedQuery,
    results: sortedResults,
    summary:
      input.plan === "pro"
        ? "Ricerca PRO completata con Finder Engine."
        : "Ricerca gratuita completata con Finder Engine.",
  };
}
