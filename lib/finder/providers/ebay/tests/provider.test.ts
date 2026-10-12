import { describe, expect, it, vi } from "vitest";
import type { ParsedQuery } from "../../../types";

vi.mock("server-only", () => ({}));

const fetchEbayMock = vi.hoisted(() => vi.fn());

vi.mock("../fetch", () => ({
  fetchEbay: fetchEbayMock,
}));

import { ebayProvider } from "../index";

const baseQuery: ParsedQuery = {
  raw: "Trovami una Vespa GTS 300 sotto CHF 6000",
  normalized: "vespa gts 300",
  lang: "it",
  searchSubject: "Vespa GTS 300",
  maxPriceChf: 6000,
};

describe("eBay SearchProvider", () => {
  it("uses searchSubject when available", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 0,
      itemSummaries: [],
    });

    await ebayProvider.search(baseQuery);

    expect(fetchEbayMock).toHaveBeenCalledWith("Vespa GTS 300");
  });

  it("filters invalid items and maps valid items", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 2,
      itemSummaries: [
        {
          itemId: "123",
          title: "Vespa GTS 300",
          itemWebUrl: "https://www.ebay.ch/itm/123",
          price: { value: "4999.90", currency: "CHF" },
        },
        {
          itemId: "",
          title: "Invalid listing",
          itemWebUrl: "https://www.ebay.ch/itm/456",
          price: { value: "100", currency: "CHF" },
        },
      ],
    });

    const results = await ebayProvider.search(baseQuery);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "ebay-123",
      source: "ebay",
      title: "Vespa GTS 300",
      priceChf: 4999.9,
    });
  });

  it("does not fetch for an empty query", async () => {
    fetchEbayMock.mockClear();

    const results = await ebayProvider.search({
      raw: " ",
      normalized: "",
      lang: "it",
    });

    expect(results).toEqual([]);
    expect(fetchEbayMock).not.toHaveBeenCalled();
  });
});

describe("eBay vehicle versus accessory intent", () => {
  const listings = [
    {
      itemId: "vehicle-1",
      title: "Vespa GTS 300 Super 2021",
      itemWebUrl: "https://www.ebay.ch/itm/111",
      price: { value: "4900.00", currency: "CHF" },
    },
    {
      itemId: "accessory-1",
      title: "Parabrezza Vespa GTS 300",
      itemWebUrl: "https://www.ebay.ch/itm/222",
      price: { value: "120.00", currency: "CHF" },
    },
  ];

  it("excludes accessories when searching for a complete Vespa", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 2,
      itemSummaries: listings,
    });

    const results = await ebayProvider.search({
      raw: "Vespa GTS 300 usata",
      normalized: "vespa gts 300 usata",
      lang: "it",
    });

    expect(results.map((result) => result.id)).toEqual([
      "ebay-vehicle-1",
    ]);
  });

  it("keeps accessories when explicitly requested", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 2,
      itemSummaries: listings,
    });

    const results = await ebayProvider.search({
      raw: "Parabrezza Vespa GTS 300",
      normalized: "parabrezza vespa gts 300",
      lang: "it",
    });

    expect(results.map((result) => result.id)).toContain(
      "ebay-accessory-1"
    );
  });
});
