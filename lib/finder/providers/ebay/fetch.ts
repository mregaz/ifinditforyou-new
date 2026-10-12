import "server-only";

import { getEbayAccessToken } from "./oauth";
import type { EbaySearchResponse } from "./types";

const EBAY_SEARCH_URL =
  "https://api.ebay.com/buy/browse/v1/item_summary/search";

const DEFAULT_MARKETPLACE = "EBAY_CH";
const SEARCH_LIMIT = 20;
const REQUEST_TIMEOUT_MS = 2000;

export async function fetchEbay(
  query: string
): Promise<EbaySearchResponse> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return { total: 0, itemSummaries: [] };
  }

  const marketplace =
    process.env.EBAY_MARKETPLACE_ID || DEFAULT_MARKETPLACE;

  if (marketplace !== "EBAY_CH") {
    throw new Error("Unsupported eBay marketplace configuration");
  }

  const deadline = AbortSignal.timeout(2500);

  const token = await new Promise<string>((resolve, reject) => {
    const cleanup = () => {
      deadline.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      cleanup();
      reject(deadline.reason);
    };

    if (deadline.aborted) {
      reject(deadline.reason);
      return;
    }

    deadline.addEventListener("abort", onAbort, { once: true });

    getEbayAccessToken().then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(error);
      }
    );
  });

  const url = new URL(EBAY_SEARCH_URL);

  url.searchParams.set("q", normalizedQuery);
  url.searchParams.set("limit", String(SEARCH_LIMIT));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": marketplace,
      Accept: "application/json",
    },
    signal: AbortSignal.any([deadline, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `eBay Browse API request failed with HTTP ${response.status}`
    );
  }

  const data: unknown = await response.json();

  if (!data || typeof data !== "object") {
    throw new Error("Invalid eBay Browse API response");
  }

  const result = data as EbaySearchResponse;

  if (
    result.itemSummaries !== undefined &&
    !Array.isArray(result.itemSummaries)
  ) {
    throw new Error("Invalid eBay item summaries");
  }

  return {
    total: result.total,
    itemSummaries: result.itemSummaries ?? [],
  };
}
