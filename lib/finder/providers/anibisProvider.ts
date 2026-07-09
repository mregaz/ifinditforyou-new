import type { FinderResult, ParsedQuery } from "../types";
import type { SearchProvider } from "../contracts/SearchProvider";

const ANIBIS_SAMPLE_URL =
  "https://www.anibis.ch/fr/vi/vaud/vehicules/motos/vespa-gts-super-300/54729592";

export const anibisProvider: SearchProvider = {
  name: "anibis",

  async search(query: ParsedQuery): Promise<FinderResult[]> {
    const response = await fetch(ANIBIS_SAMPLE_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 PhoenixFinder/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Anibis request failed with status ${response.status}`);
    }

    return [
      {
        id: "anibis-sample-54729592",
        title: `Anibis real provider check: ${query.normalized}`,
        source: "anibis",
        url: ANIBIS_SAMPLE_URL,
        snippet:
          "Provider reale Anibis raggiunto correttamente. Parsing ricerca previsto in uno step successivo.",
        score: 60,
      },
    ];
  },
};