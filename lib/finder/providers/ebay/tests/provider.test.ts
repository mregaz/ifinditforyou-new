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

    expect(fetchEbayMock).toHaveBeenCalledWith("Vespa GTS 300", "9939");
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

describe("eBay model classification", () => {
  it("separates exact, alternative and unverified Vespa listings", async () => {
    fetchEbayMock.mockResolvedValueOnce({ total: 4, itemSummaries: [
      { itemId: "exact", title: "Vespa GTS 300 Super 2022", itemWebUrl: "https://www.ebay.ch/itm/1", price: { value: "5000", currency: "CHF" } },
      { itemId: "alternative", title: "Vespa Primavera 125 2022", itemWebUrl: "https://www.ebay.ch/itm/2", price: { value: "4000", currency: "CHF" } },
      { itemId: "unknown", title: "Vespa scooter usata", itemWebUrl: "https://www.ebay.ch/itm/3", price: { value: "3000", currency: "CHF" } },
      { itemId: "accessory", title: "Parabrezza Vespa GTS 300 2022", itemWebUrl: "https://www.ebay.ch/itm/4", price: { value: "100", currency: "CHF" } },
    ] });

    const results = await ebayProvider.search(baseQuery);
    expect(results.map(({ id, matchClassification }) => [id, matchClassification])).toEqual([
      ["ebay-exact", "exact"],
      ["ebay-alternative", "alternative"],
      ["ebay-unknown", "unverified"],
    ]);
  });
});

describe("eBay implicit vehicle intent", () => {
  it("excludes accessories for a Vespa model without 'usata'", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 2,
      itemSummaries: [
        {
          itemId: "vespa-complete",
          title: "Vespa GTS 300 Super 2022",
          itemWebUrl: "https://www.ebay.ch/itm/333",
          price: { value: "5500.00", currency: "CHF" },
        },
        {
          itemId: "vespa-windshield",
          title: "Parabrezza Vespa GTS 300",
          itemWebUrl: "https://www.ebay.ch/itm/444",
          price: { value: "100.00", currency: "CHF" },
        },
      ],
    });

    const results = await ebayProvider.search({
      raw: "Vespa GTS 300",
      normalized: "vespa gts 300",
      lang: "it",
    });

    expect(results.map((result) => result.id)).toEqual([
      "ebay-vespa-complete",
    ]);
  });
});

describe("eBay vehicle with accessory requirements", () => {
  it("keeps complete scooters when a windshield is requested as equipment", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 2,
      itemSummaries: [
        {
          itemId: "scooter-equipped",
          title: "Vespa GTS 300 2022 con parabrezza",
          itemWebUrl: "https://www.ebay.ch/itm/555",
          price: { value: "5200.00", currency: "CHF" },
        },
        {
          itemId: "windshield-only",
          title: "Parabrezza Vespa GTS 300",
          itemWebUrl: "https://www.ebay.ch/itm/666",
          price: { value: "120.00", currency: "CHF" },
        },
      ],
    });

    const results = await ebayProvider.search({
      raw: "Cerco uno scooter Vespa GTS 300 con parabrezza",
      normalized: "cerco uno scooter vespa gts 300 con parabrezza",
      lang: "it",
      vehicleIntent: true,
    });

    expect(results.map((result) => result.id)).toEqual([
      "ebay-scooter-equipped",
    ]);
  });
});

describe("eBay explicit accessory intent", () => {
  it("keeps spare parts requested for a scooter", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 2,
      itemSummaries: [
        {
          itemId: "complete-vespa",
          title: "Vespa GTS 300 Super 2022",
          itemWebUrl: "https://www.ebay.ch/itm/777",
          price: { value: "5300.00", currency: "CHF" },
        },
        {
          itemId: "vespa-parts",
          title: "Ricambi Vespa GTS 300",
          itemWebUrl: "https://www.ebay.ch/itm/888",
          price: { value: "80.00", currency: "CHF" },
        },
      ],
    });

    const results = await ebayProvider.search({
      raw: "Cerco ricambi per scooter Vespa GTS 300",
      normalized: "cerco ricambi per scooter vespa gts 300",
      lang: "it",
      vehicleIntent: true,
    });

    expect(results.map((result) => result.id)).toContain(
      "ebay-vespa-parts"
    );
  });
});

describe("eBay accessory intent with shipping requirements", () => {
  it("keeps spare parts when the user requests shipping", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 1,
      itemSummaries: [
        {
          itemId: "parts-shipping",
          title: "Ricambi Vespa GTS 300",
          itemWebUrl: "https://www.ebay.ch/itm/999",
          price: { value: "95.00", currency: "CHF" },
        },
      ],
    });

    const results = await ebayProvider.search({
      raw: "Cerco ricambi per scooter Vespa GTS 300 con spedizione",
      normalized: "cerco ricambi per scooter vespa gts 300 con spedizione",
      lang: "it",
      vehicleIntent: true,
    });

    expect(results.map((result) => result.id)).toContain(
      "ebay-parts-shipping"
    );
  });
});

describe("eBay accessory request with shipping", () => {
  it("keeps a saddle requested with shipping", async () => {
    fetchEbayMock.mockResolvedValueOnce({
      total: 1,
      itemSummaries: [
        {
          itemId: "vespa-saddle",
          title: "Sella originale Vespa GTS 300",
          itemWebUrl: "https://www.ebay.ch/itm/1001",
          price: { value: "150.00", currency: "CHF" },
        },
      ],
    });

    const results = await ebayProvider.search({
      raw: "Cerco una sella per scooter Vespa GTS 300 con spedizione",
      normalized: "cerco una sella per scooter vespa gts 300 con spedizione",
      lang: "it",
      vehicleIntent: true,
    });

    expect(results.map((result) => result.id)).toContain(
      "ebay-vespa-saddle"
    );
  });
});
