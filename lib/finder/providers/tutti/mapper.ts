import type { FinderResult } from "../../types";
import type { TuttiListing } from "./types";

export function mapTuttiListing(
  listing: TuttiListing,
  index: number
): FinderResult {
  return {
    id: listing.id,
    title: listing.title,
    source: "tutti",
    url: listing.url,
    snippet: listing.description,
    score: Math.max(1, 70 - index),
  };
}
