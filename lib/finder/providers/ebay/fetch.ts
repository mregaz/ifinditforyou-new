import "server-only";

import { getEbayAccessToken } from "./oauth";
import type { EbaySearchResponse } from "./types";

const EBAY_SEARCH_URL =
  "https://api.ebay.com/buy/browse/v1/item_summary/search";

const DEFAULT_MARKETPLACE = "EBAY_CH";
const SEARCH_LIMIT = 50;
const REQUEST_TIMEOUT_MS = 5000;

export async function fetchEbay(
  query: string,
  categoryId?: string,
  signal?: AbortSignal
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

  const deadline = AbortSignal.timeout(7000);
if (signal?.aborted) {
  throw signal.reason ?? new Error("eBay search aborted");
}
const effectiveDeadline = signal
  ? AbortSignal.any([deadline, signal])
  : deadline;

const token = await new Promise<string>((resolve, reject) => {
  const cleanup = () => {
    effectiveDeadline.removeEventListener("abort", onAbort);
  };

  const onAbort = () => {
    cleanup();
    reject(effectiveDeadline.reason);
  };

  if (effectiveDeadline.aborted) {
    reject(effectiveDeadline.reason);
    return;
  }

  effectiveDeadline.addEventListener("abort", onAbort, { once: true });

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
if (effectiveDeadline.aborted) {
  throw effectiveDeadline.reason ?? new Error("eBay search aborted");
}
  const url = new URL(EBAY_SEARCH_URL);

  url.searchParams.set("q", normalizedQuery);
  url.searchParams.set("limit", String(SEARCH_LIMIT));
  if (categoryId) {
  url.searchParams.set("category_ids", categoryId);
}
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": marketplace,
      Accept: "application/json",
    },
    signal: AbortSignal.any([
  effectiveDeadline,
  AbortSignal.timeout(REQUEST_TIMEOUT_MS),
]),
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
