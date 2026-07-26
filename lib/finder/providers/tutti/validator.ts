import type { TuttiListing } from "./types";

export function validateTuttiListing(
  listing: TuttiListing
): boolean {
  return Boolean(
    listing.id &&
    listing.title &&
    listing.url
  );
}
