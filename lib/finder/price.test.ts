import { afterEach, describe, expect, it, vi } from "vitest";
import { runFinderEngine } from "./engine";
import { filterByPriceCap, parseChfPrice } from "./price";
import type { FinderResult } from "./types";

afterEach(() => vi.restoreAllMocks());

describe("CHF price normalization", () => {
  it.each([
    ["4 900.-", 4900],
    ["4'900.-", 4900],
    ["CHF 4'900", 4900],
    ["4350", 4350],
    ["4’900.–", 4900],
  ])("parses %s", (source, expected) => {
    expect(parseChfPrice(source)).toBe(expected);
  });

  it.each([undefined, "", "Preis auf Anfrage", "4,900", "4 90.-"])(
    "does not guess a price from %s",
    (source) => expect(parseChfPrice(source)).toBeUndefined()
  );
});

describe("price cap filtering", () => {
  const result = (id: string, priceChf?: number): FinderResult => ({
    id,
    title: id,
    source: "anibis",
    url: `https://www.anibis.ch/it/vi/${id}`,
    score: 70,
    ...(priceChf !== undefined && { priceChf }),
  });
  const results = [
    result("below", 4900),
    result("at-cap", 5000),
    result("above", 5001),
    result("missing"),
  ];

  it("keeps prices below and at the cap, rejecting higher and unknown prices", () => {
    expect(filterByPriceCap(results, 5000).map(({ id }) => id))
      .toEqual(["below", "at-cap"]);
  });

  it("preserves every result when no cap is requested", () => {
    expect(filterByPriceCap(results)).toBe(results);
  });
});

describe("Finder price-cap integration", () => {
  const html = `
    <div data-private-srp-listing-item-id="below">
      <a href="/it/vi/below">Yamaha XMAX 300 below cap</a><span>4 900.-</span>
    </div>
    <div data-private-srp-listing-item-id="above">
      <a href="/it/vi/above">Yamaha XMAX 300 above cap</a><span>5 100.-</span>
    </div>`;

  it("applies the cap to provider results", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));

    const response = await runFinderEngine({
      query: "Cerco uno scooter Yamaha XMAX 300 usato, massimo CHF 5'000",
      lang: "it",
      plan: "free",
    });

    expect(response.results.map(({ id }) => id)).toEqual(["anibis-below"]);
  });

  it("keeps the existing provider results for a simple no-cap request", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));

    const response = await runFinderEngine({
      query: "Yamaha XMAX 300",
      lang: "it",
      plan: "free",
    });

    expect(response.results.map(({ id }) => id)).toEqual([
      "anibis-below", "anibis-above",
    ]);
  });
});
