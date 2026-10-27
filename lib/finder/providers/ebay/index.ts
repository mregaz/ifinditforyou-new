import "server-only";

import type { FinderResult, ParsedQuery } from "../../types";
import type { SearchProvider } from "../../contracts/SearchProvider";

import { fetchEbay } from "./fetch";
import { isValidEbayItem } from "./validator";
import { mapEbayItem } from "./mapper";
import { classifyEbaySearchIntent } from "./intent";
import { classifyEbayVehicleRelevance } from "./relevance";
import { classifyVehicleSubject } from "../../subjectMatch";

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

const categoryId = isVespaSearch ? "9939" : undefined;

// Un solo budget temporale per ricerca iniziale e fallback.
const searchDeadline = AbortSignal.timeout(7000);

let response = await fetchEbay(
  searchText,
  categoryId,
  searchDeadline
);

const hasUsableVehicle = (response.itemSummaries ?? []).some(
  (item) => {
    if (!isValidEbayItem(item)) return false;

    const relevance = classifyEbayVehicleRelevance(item);
    if (relevance === "EXCLUDE") return false;

    const subjectMatch = query.searchSubject
      ? classifyVehicleSubject(item.title, query.searchSubject)
      : undefined;

    if (query.searchSubject && !subjectMatch) return false;

    if (
      relevance === "UNCERTAIN" &&
      !/\b(?:vespa|yamaha|honda)\b/i.test(item.title)
    ) {
      return false;
    }

    return true;
  }
);

if (
  isVespaSearch &&
  query.searchSubject &&
  !hasUsableVehicle &&
  searchText.toLowerCase() !== "vespa" &&
  !searchDeadline.aborted
) {
  response = await fetchEbay(
    "Vespa",
    categoryId,
    searchDeadline
  );
}

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
      const filtered = validItems.flatMap((item) => {
        const relevance = classifyEbayVehicleRelevance(item);
        if (relevance === "EXCLUDE") return [];
        const subjectMatch = query.searchSubject
          ? classifyVehicleSubject(item.title, query.searchSubject)
          : undefined;
        if (query.searchSubject && !subjectMatch) return [];
        if (relevance === "UNCERTAIN" &&
            !/\b(?:vespa|yamaha|honda)\b/i.test(item.title)) return [];

        const result = mapEbayItem(item);
        return [{
          ...result,
          ...(query.searchSubject && {
            matchClassification: relevance === "MATCH" && subjectMatch === "exact"
              ? "exact" as const
              : subjectMatch === "alternative"
                ? "alternative" as const
                : "unverified" as const,
          }),
        }];
      });

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
