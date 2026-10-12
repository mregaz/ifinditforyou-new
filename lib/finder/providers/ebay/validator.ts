
import type { EbayItemSummary } from "./types";

export function isValidEbayItem(
  item: EbayItemSummary
): boolean {
  if (!item.itemId?.trim()) return false;
  if (!item.title?.trim()) return false;

  if (!item.itemWebUrl) return false;

  try {
    const url = new URL(item.itemWebUrl);

    if (url.protocol !== "https:") return false;

    const hostname = url.hostname.toLowerCase();

    if (
      hostname !== "ebay.com" &&
      !hostname.endsWith(".ebay.com") &&
      !/^www\.ebay\.[a-z.]+$/.test(hostname)
    ) {
      return false;
    }
  } catch {
    return false;
  }

  if (!item.price) return false;
  if (!item.price.value?.trim()) return false;

  const price = Number(item.price.value);

  if (!Number.isFinite(price) || price < 0) {
    return false;
  }

  if (!/^[A-Z]{3}$/.test(item.price.currency)) {
    return false;
  }

  return true;
}
