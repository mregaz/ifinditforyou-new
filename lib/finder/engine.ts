import { parseQuery } from "./parser";
import { providers } from "./providers";
import type { FinderPlan, FinderResponse, Lang } from "./types";

type RunFinderInput = {
  query: string;
  lang: Lang;
  plan: FinderPlan;
};

export async function runFinderEngine(input: RunFinderInput): Promise<FinderResponse> {
  const parsedQuery = parseQuery(input.query, input.lang);

  const providerResults = await Promise.all(
    providers.map((provider) => provider.search(parsedQuery))
  );

  const results = providerResults.flat();

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