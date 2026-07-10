import type { FinderResult } from "../../types";
import type { AnibisListing } from "./types";

export function mapAnibisListing(
  listing: AnibisListing,
  index: number
): FinderResult {
  const metadata = [listing.price, listing.location]
    .filter(Boolean)
    .join(" · ");

  return {
    id: listing.id,
    title: listing.title,
    source: "anibis",
    url: listing.url,
    snippet:
      listing.description ||
      metadata ||
      "Risultato estratto da Anibis.",
    score: Math.max(1, 70 - index),
  };
}