
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { runFinderEngine } from "../engine";
import { providerRegistry } from "./index";

const originalStates = providerRegistry.map((entry) => ({
  id: entry.id,
  enabled: entry.enabled,
}));

const originalMode = process.env.FINDER_MODE;

function enableBothProviders() {
  process.env.FINDER_MODE = "real";

  for (const entry of providerRegistry) {
    if (entry.id === "anibis" || entry.id === "ebay") {
      entry.enabled = true;
    }
  }
}

afterEach(() => {
  vi.restoreAllMocks();

  if (originalMode === undefined) {
    delete process.env.FINDER_MODE;
  } else {
    process.env.FINDER_MODE = originalMode;
  }

  for (const entry of providerRegistry) {
    const original = originalStates.find(
      (item) => item.id === entry.id
    );

    if (original) entry.enabled = original.enabled;
  }
});

describe("Phoenix multi-provider integration", () => {
  it("combines Anibis and eBay and applies shared filters", async () => {
    enableBothProviders();

    const anibis = providerRegistry.find(
      (entry) => entry.id === "anibis"
    )!.provider;

    const ebay = providerRegistry.find(
      (entry) => entry.id === "ebay"
    )!.provider;

    vi.spyOn(anibis, "search").mockResolvedValue([
      {
        id: "anibis-scooter",
        title: "Yamaha XMAX 300 2021",
        source: "anibis",
        url: "https://www.anibis.ch/it/vi/test",
        priceChf: 4200,
        year: 2021,
        score: 90,
      },
      {
        id: "anibis-expensive",
        title: "Yamaha XMAX 300 2022",
        source: "anibis",
        url: "https://www.anibis.ch/it/vi/expensive",
        priceChf: 7000,
        year: 2022,
        score: 95,
      },
    ]);

    vi.spyOn(ebay, "search").mockResolvedValue([
      {
        id: "ebay-scooter",
        title: "Yamaha XMAX 300 2020",
        source: "ebay",
        url: "https://www.ebay.ch/itm/test",
        priceChf: 4500,
        year: 2020,
        score: 85,
      },
      {
        id: "ebay-accessory",
        title: "Yamaha XMAX 300 windscreen",
        source: "ebay",
        url: "https://www.ebay.ch/itm/accessory",
        priceChf: 100,
        isAccessory: true,
        score: 99,
      },
    ]);

    const response = await runFinderEngine({
      query: "Yamaha XMAX 300 massimo CHF 5000",
      lang: "it",
      plan: "free",
    });

    expect(response.results.map((item) => item.id)).toEqual([
      "anibis-scooter",
      "ebay-scooter",
    ]);
  });

  it("keeps eBay results when Anibis fails", async () => {
    enableBothProviders();

    const anibis = providerRegistry.find(
      (entry) => entry.id === "anibis"
    )!.provider;

    const ebay = providerRegistry.find(
      (entry) => entry.id === "ebay"
    )!.provider;

    vi.spyOn(anibis, "search").mockRejectedValue(
      new Error("Simulated Anibis failure")
    );

    vi.spyOn(ebay, "search").mockResolvedValue([
      {
        id: "ebay-survivor",
        title: "Yamaha XMAX 300 2021",
        source: "ebay",
        url: "https://www.ebay.ch/itm/survivor",
        priceChf: 4300,
        score: 80,
      },
    ]);

    const response = await runFinderEngine({
      query: "Yamaha XMAX 300 massimo CHF 5000",
      lang: "it",
      plan: "free",
    });

    expect(response.results.map((item) => item.id)).toEqual([
      "ebay-survivor",
    ]);
  });
});
