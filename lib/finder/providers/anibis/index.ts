import type { FinderResult, ParsedQuery } from "../../types";
import type { SearchProvider } from "../../contracts/SearchProvider";
import { fetchAnibis } from "./fetch";
import { parseAnibisHtml } from "./parser";
import { mapAnibisListing } from "./mapper";
import { validateAnibisListings } from "./validator";

const ANIBIS_TEST_SEARCH_URL =
  "https://www.anibis.ch/it/q/cercare/Ak6l2ZXNwYSAzMDDAlMDAwMA";

export const anibisProvider: SearchProvider = {
  name: "anibis",

  async search(_query: ParsedQuery): Promise<FinderResult[]> {
    const html = await fetchAnibis(ANIBIS_TEST_SEARCH_URL);

    const listings = parseAnibisHtml(html);

    const { valid } = validateAnibisListings(listings);

    return valid.map(mapAnibisListing);
  },
};