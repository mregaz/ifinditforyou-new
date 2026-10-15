import "server-only";

import type { FinderResult, ParsedQuery } from "../../types";
import type { SearchProvider } from "../../contracts/SearchProvider";

import { fetchEbay } from "./fetch";
import { isValidEbayItem } from "./validator";
import { mapEbayItem } from "./mapper";
import { classifyEbaySearchIntent } from "./intent";
import { classifyEbayVehicleRelevance } from "./relevance";

export const ebayProvider: SearchProvider = {
  name: "ebay",

  async search(query: ParsedQuery): Promise<FinderResult[]> {
    const searchText =
      query.searchSubject?.trim() || query.raw.trim();

    if (!searchText) {
      return [];
    }

    const intent = classifyEbaySearchIntent(query);

const isVespaSearch =
  intent === "VEHICLE" &&
  /\bvespa\b/i.test(query.raw);

const response = await fetchEbay(
  searchText,
  isVespaSearch ? "9939" : undefined
);

    const validItems = (response.itemSummaries ?? [])
      .filter(isValidEbayItem);

    const results = validItems.map(mapEbayItem);

   

    console.log("[ebay] diagnostics", {
      received: response.itemSummaries?.length ?? 0,
      valid: validItems.length,
      intent,
      accessoriesDetected: results.filter(
        (result) => result.isAccessory === true
      ).length,
      items: validItems.slice(0, 5).map((item) => ({
        title: item.title,
        categories: JSON.stringify(item.categories ?? null),
      })),
    });


    if (intent === "VEHICLE") {
      const filtered = validItems
  .filter(
    (item) => classifyEbayVehicleRelevance(item) === "MATCH"
  )
  .map(mapEbayItem);

      console.log("[ebay] vehicle diagnostics", {
        received: response.itemSummaries?.length ?? 0,
        valid: validItems.length,
        accessoriesExcluded: results.length - filtered.length,
        remaining: filtered.length,
        categories: validItems.slice(0, 5).map((item) => ({
          title: item.title,
          categories: JSON.stringify(item.categories ?? null),
        })),
      });

      return filtered;
    }

    return results;
  },
};
