import type { SearchProvider } from "../../contracts/SearchProvider";
import type { ParsedQuery, FinderResult } from "../../types";

export const mockProvider: SearchProvider = {
  name: "mock",

  async search(parsedQuery: ParsedQuery): Promise<FinderResult[]> {
    return [
      {
        id: "mock-1",
        title: `Risultato demo per: ${parsedQuery.raw}`,
        source: "mock",
        url: "https://example.com/result-1",
        snippet: "Questo è un risultato temporaneo generato dal Finder Engine.",
        score: 90,
      },
      {
        id: "mock-2",
        title: `Seconda opportunità collegata a: ${parsedQuery.raw}`,
        source: "mock",
        url: "https://example.com/result-2",
        snippet: "Questo serve solo a verificare che la pipeline funzioni.",
        score: 75,
      },
    ];
  },
};