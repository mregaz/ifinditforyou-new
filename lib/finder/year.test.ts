import { afterEach, describe, expect, it, vi } from "vitest";
import { runFinderEngine } from "./engine";
import { filterByMinYear, extractVehicleYear } from "./year";
import type { FinderResult } from "./types";

afterEach(() => vi.restoreAllMocks());

describe("vehicle year extraction", () => {
  it.each([
    ["Yamaha Xmax 300 2021", "", 2021],
    ["Yamaha XMAX 300 (2018) Full Équipé & Révisé", "", 2018],
    ["Xmax 300 Iron max (2020)", "", 2020],
    ["YAMAHA X-Max CZD 300 ABS", "", undefined],
    ["Yamaha XMAX 300", "", undefined],
    ["YAMAHA X-Max CZD 300 ABS", "Zum Verkauf, Jahrgang 2019, 12'500 km.", 2019],
    ["Yamaha XMAX 300", "Année : 2018, batterie remplacée en 2025.", 2018],
  ])("extracts supported years from %s", (title, cardText, expected) => {
    expect(extractVehicleYear(title, cardText)).toBe(expected);
  });

  it.each([
    ["Yamaha XMAX 300", "Ginevra, 2020; CHF 4'900; 2021 km; 19.08.2026"],
    ["Yamaha XMAX 300 2020 km", ""],
    ["Yamaha XMAX 300 CHF 2020", ""],
    ["Yamaha XMAX 300 (2018)", "Jahrgang 2021"],
  ])("does not guess from unrelated or contradictory numbers: %s", (title, cardText) => {
    expect(extractVehicleYear(title, cardText)).toBeUndefined();
  });
});

describe("minimum year filter", () => {
  const listing = (id: string, year?: number): FinderResult => ({
    id, title: id, source: "anibis", url: `https://www.anibis.ch/it/vi/${id}`,
    score: 70, ...(year !== undefined && { year }),
  });
  const results = [listing("newer", 2021), listing("equal", 2020),
    listing("older", 2018), listing("unknown")];

  it("keeps newer, equal, and unknown years", () => {
    expect(filterByMinYear(results, 2020).map(({ id }) => id))
      .toEqual(["newer", "equal", "unknown"]);
  });

  it("preserves results when no minimum year exists", () => {
    expect(filterByMinYear(results)).toBe(results);
  });
});

function card(id: string, title: string, body = "Scooter in vendita."): string {
  return `<div data-private-srp-listing-item-id="${id}">
    <a href="/it/vi/${id}">${title}</a> <span>${body}</span> <span>4 000.-</span>
  </div>`;
}

describe("Finder year integration", () => {
  const html = [
    card("newer", "Yamaha Xmax 300 2021"),
    card("older", "Yamaha XMAX 300 (2018) Full Équipé & Révisé"),
    card("equal", "Xmax 300 Iron max (2020)"),
    card("unknown-abs", "YAMAHA X-Max CZD 300 ABS"),
    card("unknown", "Yamaha XMAX 300"),
  ].join("");

  it("filters established old years and keeps unknown listings", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));
    const response = await runFinderEngine({
      query: "Cerco uno scooter Yamaha XMAX 300 usato in Svizzera, massimo CHF 5'000, dal 2020 in poi, meno di 20'000 km.",
      lang: "it", plan: "free",
    });
    expect(response.results.map(({ id, year }) => [id, year])).toEqual([
      ["anibis-newer", 2021], ["anibis-equal", 2020],
      ["anibis-unknown-abs", undefined], ["anibis-unknown", undefined],
    ]);
  });

  it("keeps the 2018 listing for a query without minYear", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));
    const response = await runFinderEngine({query: "Yamaha XMAX 300", lang: "it", plan: "free"});
    expect(response.results.map(({ id }) => id)).toContain("anibis-older");
  });
});
