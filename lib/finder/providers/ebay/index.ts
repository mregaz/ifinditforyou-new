import "server-only";

import type { FinderResult, ParsedQuery } from "../../types";
import type { SearchProvider } from "../../contracts/SearchProvider";

import { fetchEbay } from "./fetch";
import { isValidEbayItem } from "./validator";
import { mapEbayItem } from "./mapper";

export const ebayProvider: SearchProvider = {
  name: "ebay",

  async search(query: ParsedQuery): Promise<FinderResult[]> {
    const searchText =
      query.searchSubject?.trim() || query.raw.trim();

    if (!searchText) {
      return [];
    }

    const response = await fetchEbay(searchText);

    const validItems = (response.itemSummaries ?? [])
      .filter(isValidEbayItem);

    const results = validItems.map(mapEbayItem);

    const normalizedQuery = query.raw
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLowerCase();

    const explicitAccessoryIntent =
      /\b(parabrezza|sella|scarico|ricambi|ricambio|windshield|windscreen|ersatzteile|ersatzteil|spare parts)\b/.test(
        normalizedQuery
      );

    const completeVehicleIntent =
      query.vehicleIntent === true ||
      /\b(vespa|scooter|moto|motocicletta)\b/.test(normalizedQuery) &&
        /\b(usata|usato|used|occasion|gebraucht)\b/.test(normalizedQuery);

    if (completeVehicleIntent && !explicitAccessoryIntent) {
      return results.filter((result) => result.isAccessory !== true);
    }

    return results;
  },
};
