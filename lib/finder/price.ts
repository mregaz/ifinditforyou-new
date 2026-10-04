import type { FinderResult } from "./types";

export function parseChfPrice(value?: string): number | undefined {
  if (!value) return undefined;

  const match = value.trim().match(
    /^(?:CHF\s*)?(\d{1,3}(?:[ '\u00a0\u202f’]\d{3})+|\d+)(?:\s*(?:\.-|\.–|–|-))?$/i
  );
  if (!match) return undefined;

  const price = Number(match[1].replace(/[^\d]/g, ""));
  return Number.isSafeInteger(price) ? price : undefined;
}

export function filterByPriceCap(
  results: FinderResult[],
  maxPriceChf?: number
): FinderResult[] {
  if (maxPriceChf === undefined) return results;

  // An unknown price cannot establish that a listing meets the cap.
  return results.filter(({ priceChf }) =>
    priceChf !== undefined &&
    Number.isSafeInteger(priceChf) &&
    priceChf >= 0 &&
    priceChf <= maxPriceChf
  );
}
