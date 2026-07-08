import type { FinderResult, ParsedQuery } from "./types";

export async function mockProvider(parsedQuery: ParsedQuery): Promise<FinderResult[]> {
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
}