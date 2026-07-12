import type { SearchProvider } from "../../contracts/SearchProvider";
import { fetchMarketplaceHtml } from "./fetch";
import { parseMarketplaceHtml } from "./parser";
import { validateMarketplaceListings } from "./validator";
import { mapMarketplaceListing } from "./mapper";

export const marketplaceProvider: SearchProvider = {
  name: "provider-template",

  async search(query) {
    const html = await fetchMarketplaceHtml({
      query: query.normalized,
    });

    const listings = parseMarketplaceHtml(html);
    const { valid } = validateMarketplaceListings(listings);

    return valid.map(mapMarketplaceListing);
  },
};