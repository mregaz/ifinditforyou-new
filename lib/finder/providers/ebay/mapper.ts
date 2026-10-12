
import type { FinderResult } from "../../types";
import type { EbayItemSummary } from "./types";
import { isEbayAccessory } from "./accessory";

export function mapEbayItem(
  item: EbayItemSummary
): FinderResult {
  const priceValue = item.price?.value?.trim();

  const priceChf =
    item.price?.currency === "CHF" &&
    priceValue !== undefined &&
    /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(priceValue) &&
    Number.isFinite(Number(priceValue)) &&
    Number(priceValue) <= Number.MAX_SAFE_INTEGER / 100
      ? Number(priceValue)
      : undefined;

  return {
    id: `ebay-${item.itemId}`,
    title: item.title,
    source: "ebay",
    url: item.itemWebUrl ?? "",
    snippet: item.shortDescription ?? item.condition,
    priceChf,
    ...(isEbayAccessory(item.title) && { isAccessory: true }),
    score: 50,
  };
}
