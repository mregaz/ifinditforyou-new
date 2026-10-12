import "server-only";

import type { FinderResult, ParsedQuery } from "../../types";
import type { SearchProvider } from "../../contracts/SearchProvider";

import { fetchEbay } from "./fetch";
import { isValidEbayItem } from "./validator";
import { mapEbayItem } from "./mapper";
import { classifyEbaySearchIntent } from "./intent";

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

    const intent = classifyEbaySearchIntent(query);

    if (intent === "VEHICLE") {
      return results.filter((result) => result.isAccessory !== true);
    }

    return results;
  },
};
