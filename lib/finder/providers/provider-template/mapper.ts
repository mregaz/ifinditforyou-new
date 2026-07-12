import type { FinderResult } from "../../types";
import type { MarketplaceListing } from "./types";

export function mapMarketplaceListing(
  listing: MarketplaceListing,
): FinderResult {
  return {
    id: listing.id,
    title: listing.title,
    source: "provider-template",
    url: listing.url,
    snippet: [
      listing.price,
      listing.location,
    ]
      .filter(Boolean)
      .join(" · ") || undefined,
    score: 0,
  };
}