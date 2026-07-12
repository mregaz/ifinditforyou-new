import { describe, expect, it } from "vitest";
import { validateMarketplaceListings } from "../validator";
import type { MarketplaceListing } from "../types";

describe("validateMarketplaceListings", () => {
  it("separates valid and rejected listings", () => {
    const listings: MarketplaceListing[] = [
      {
        id: "listing-1",
        url: "https://example.com/listing-1",
        title: "Valid listing",
      },
      {
        id: "",
        url: "https://example.com/listing-2",
        title: "Missing ID",
      },
    ];

    const result = validateMarketplaceListings(listings);

    expect(result.valid).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);

    expect(result.valid[0]?.id).toBe("listing-1");
    expect(result.rejected[0]?.title).toBe("Missing ID");
  });
});