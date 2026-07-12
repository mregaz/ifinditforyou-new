import type { MarketplaceListing } from "./types";

export type ValidationResult = {
  valid: MarketplaceListing[];
  rejected: MarketplaceListing[];
};

export function validateMarketplaceListings(
  listings: MarketplaceListing[],
): ValidationResult {
  const valid: MarketplaceListing[] = [];
  const rejected: MarketplaceListing[] = [];

  for (const listing of listings) {
    if (
      listing.id.trim() &&
      listing.url.trim() &&
      listing.title.trim()
    ) {
      valid.push(listing);
    } else {
      rejected.push(listing);
    }
  }

  return { valid, rejected };
}