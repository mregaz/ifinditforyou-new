import type { AnibisListing } from "./types";
export type AnibisValidationResult = {
  valid: AnibisListing[];
  rejected: AnibisListing[];
};

function isValidListing(listing: AnibisListing): boolean {
  if (!listing.id.trim()) {
    return false;
  }

  if (!listing.title.trim()) {
    return false;
  }

  if (!listing.url.trim()) {
    return false;
  }

  if (!listing.url.startsWith("https://www.anibis.ch/")) {
    return false;
  }

  if (listing.title.toLowerCase().includes("immagine")) {
    return false;
  }

  return true;
}

export function validateAnibisListings(
  listings: AnibisListing[]
): AnibisValidationResult {
  const valid: AnibisListing[] = [];
  const rejected: AnibisListing[] = [];

  for (const listing of listings) {
    if (isValidListing(listing)) {
      valid.push(listing);
    } else {
      rejected.push(listing);
    }
  }

  return {
    valid,
    rejected,
  };
}