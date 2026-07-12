import { describe, expect, it } from "vitest";
import { mapMarketplaceListing } from "../mapper";
import type { MarketplaceListing } from "../types";

describe("mapMarketplaceListing", () => {
  it("maps a marketplace listing to a FinderResult", () => {
    const listing: MarketplaceListing = {
      id: "listing-1",
      url: "https://example.com/listing-1",
      title: "Example listing",
      price: "CHF 1'200",
      location: "Lausanne",
      imageUrl: "https://example.com/image.jpg",
    };

    const result = mapMarketplaceListing(listing);

    expect(result).toEqual({
      id: "listing-1",
      title: "Example listing",
      source: "provider-template",
      url: "https://example.com/listing-1",
      snippet: "CHF 1'200 · Lausanne",
      score: 0,
    });
  });
});