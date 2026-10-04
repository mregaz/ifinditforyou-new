import type { FinderResult } from "../../types";
import { parseChfPrice } from "../../price";
import type { AnibisListing } from "./types";

function isObviousAccessory(listing: AnibisListing): boolean {
  const pathSegments = new URL(listing.url).pathname.toLowerCase().split("/");
  if (pathSegments.includes("accessori-moto") || pathSegments.includes("accessori-auto")) {
    return true;
  }

  return /^(?:pare[\s-]?brise|[ée]chappement|tablier|parabrezza|scarico|marmitta|pneus?|supporto?|top[\s-]?case|windschild|auspuff)\b/i
    .test(listing.title.trim());
}

export function mapAnibisListing(
  listing: AnibisListing,
  index: number
): FinderResult {
  const metadata = [listing.price, listing.location]
    .filter(Boolean)
    .join(" · ");
  const priceChf = parseChfPrice(listing.price);
  const isAccessory = isObviousAccessory(listing);

  return {
    id: listing.id,
    title: listing.title,
    source: "anibis",
    url: listing.url,
    ...(priceChf !== undefined && { priceChf }),
    ...(listing.year !== undefined && { year: listing.year }),
    ...(listing.mileageKm !== undefined && { mileageKm: listing.mileageKm }),
    ...(isAccessory && { isAccessory }),
    snippet:
      listing.description ||
      metadata ||
      "Risultato estratto da Anibis.",
    score: Math.max(1, 70 - index),
  };
}
