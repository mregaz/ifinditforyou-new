import type { FinderResult, ParsedQuery } from "../../types";
import type { SearchProvider } from "../../contracts/SearchProvider";
import { fetchAnibis } from "./fetch";
import { parseAnibisHtml } from "./parser";
import { mapAnibisListing } from "./mapper";
import { validateAnibisListings } from "./validator";

export const anibisProvider: SearchProvider = {
  name: "anibis",

  async search(query: ParsedQuery): Promise<FinderResult[]> {
    const searchUrl = new URL("https://www.anibis.ch/it/q");
    searchUrl.searchParams.set("query", query.raw.trim());
    const html = await fetchAnibis(searchUrl.toString());

    const listings = parseAnibisHtml(html);

    const { valid } = validateAnibisListings(listings);

    return valid.map(mapAnibisListing);
  },
};
