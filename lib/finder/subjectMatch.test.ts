import { afterEach, describe, expect, it, vi } from "vitest";
import { runFinderEngine } from "./engine";
import { classifyVehicleSubject, filterByStructuredSubject, titleMatchesSubject } from "./subjectMatch";
import type { FinderResult } from "./types";

afterEach(() => vi.restoreAllMocks());

const subject = "Yamaha XMAX 300";

describe("structured vehicle subject matching", () => {
  it("classifies Vespa evidence without treating a different model as exact", () => {
    expect(classifyVehicleSubject("Vespa GTS 300 Super 2022", "Vespa GTS 300")).toBe("exact");
    expect(classifyVehicleSubject("Vespa Primavera 125 2022", "Vespa GTS 300")).toBe("alternative");
    expect(classifyVehicleSubject("Vespa scooter usata", "Vespa GTS 300")).toBe("unverified");
    expect(classifyVehicleSubject("KTM Duke 790", "Vespa GTS 300")).toBeUndefined();
  });

  it("preserves Yamaha and Honda model recognition", () => {
    expect(classifyVehicleSubject("Yamaha X-Max 300 2021", "Yamaha XMAX 300")).toBe("exact");
    expect(classifyVehicleSubject("Honda Forza 350 2022", "Honda Forza 350")).toBe("exact");
    expect(classifyVehicleSubject("Yamaha NMAX 125", "Yamaha XMAX 300")).toBe("alternative");
  });

  it("leaves non-vehicle results untouched", () => {
    const results: FinderResult[] = [{ id: "phone", title: "iPhone 13 mini", source: "ebay", url: "https://www.ebay.ch/itm/1", score: 50 }];
    expect(filterByStructuredSubject(results)).toBe(results);
  });
  it.each([
    "Yamaha Xmax 300 2021",
    "YAMAHA X-Max CZD 300 ABS",
    "Xmax 300 Iron max (2020)",
    "Yamaha XMAX 300",
    "yamaha x.max, 300",
    "X-MAX 300",
  ])("keeps a matching model: %s", (title) => {
    expect(titleMatchesSubject(title, subject)).toBe(true);
  });

  it.each([
    "KTM DUKE L 790",
    "Yamaha NMAX 125",
    "Yamaha NMAX 300",
    "Yamaha XMAX 125",
  ])("rejects a clear contradiction: %s", (title) => {
    expect(titleMatchesSubject(title, subject)).toBe(false);
  });

  it.each([
    "Yamaha XMAX, immatricolata 2021",
    "Scooter Yamaha 300",
  ])("keeps an ambiguous plausible title: %s", (title) => {
    expect(titleMatchesSubject(title, subject)).toBe(true);
  });

  it("does not filter without a structured subject", () => {
    const results: FinderResult[] = [{
      id: "ktm", title: "KTM DUKE L 790", source: "anibis",
      url: "https://www.anibis.ch/it/vi/1", score: 70,
    }];
    expect(filterByStructuredSubject(results)).toBe(results);
    expect(filterByStructuredSubject(results, "scooter usato")).toBe(results);
  });
});

function card(id: string, title: string, price: string): string {
  return `<div data-private-srp-listing-item-id="${id}">
    <a href="/it/vi/${id}">${title}</a> <span>Prezzo ${price}</span>
  </div>`;
}

const html = [
  card("accessory", "Pare-brise origine Xmax 300", "50.-"),
  card("over-cap", "Yamaha XMAX 300", "7 000.-"),
  card("xmax-2021", "Yamaha Xmax 300 2021", "4 900.-"),
  card("xmax-abs", "YAMAHA X-Max CZD 300 ABS", "4 350.-"),
  card("ktm", "KTM DUKE L 790", "2 850.-"),
  card("nmax", "Yamaha NMAX 125 2021", "3 000.-"),
  card("xmax-2018", "Yamaha XMAX 300 (2018) Full Équipé", "3 750.-"),
  card("xmax-2020", "Xmax 300 Iron max (2020)", "3 200.-"),
  card("xmax", "Yamaha XMAX 300", "4 200.-"),
].join("");

describe("Finder subject filter", () => {
  it("runs after price and accessory filters and excludes the 2018 model by minYear", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));

    const response = await runFinderEngine({
      query: "Cerco uno scooter Yamaha XMAX 300 usato in Svizzera, massimo CHF 5'000, dal 2020 in poi, meno di 20'000 km.",
      lang: "it", plan: "free",
    });

    expect(response.results.map(({ id }) => id)).toEqual([
      "anibis-xmax-2021", "anibis-xmax-abs",
      "anibis-xmax-2020", "anibis-xmax",
    ]);
  });

  it("preserves existing results for a general query without a subject", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));

    const response = await runFinderEngine({ query: "annunci", lang: "it", plan: "free" });

    expect(response.results).toHaveLength(9);
    expect(response.results.map(({ id }) => id)).toContain("anibis-ktm");
    expect(response.results.map(({ id }) => id)).toContain("anibis-nmax");
  });
});
