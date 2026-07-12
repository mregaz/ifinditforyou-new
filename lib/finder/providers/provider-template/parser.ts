import type { MarketplaceListing } from "./types";

export function parseMarketplaceHtml(
  html: string,
): MarketplaceListing[] {
  void html;

  throw new Error(
    "Provider template: parseMarketplaceHtml must be implemented",
  );
}