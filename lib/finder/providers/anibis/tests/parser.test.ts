import { afterEach, describe, expect, it, vi } from "vitest";
import { runFinderEngine } from "../../../engine";
import { mapAnibisListing } from "../mapper";
import { parseAnibisHtml } from "../parser";
import { validateAnibisListings } from "../validator";
import { providerRegistry } from "../../index";

const originalProviderStates = providerRegistry.map(({ id, enabled }) => ({
  id,
  enabled,
}));

function enableAnibisForTests() {
  for (const entry of providerRegistry) {
    if (entry.id === "anibis") entry.enabled = true;
    if (entry.id === "ebay") entry.enabled = false;
  }
}

afterEach(() => {
  vi.restoreAllMocks();

  for (const entry of providerRegistry) {
    const original = originalProviderStates.find(
      (provider) => provider.id === entry.id
    );

    if (original) entry.enabled = original.enabled;
  }
});

function card(id: string, title: string, price = "4 900.-", href = `/it/vi/${id}`): string {
  return `<div data-private-srp-listing-item-id="${id}">
    <a href="${href}">${title}</a> <span>Prezzo ${price}</span>
  </div>`;
}

describe("Anibis candidate pool", () => {
  it("returns the first 20 valid cards from a larger page", () => {
    const html = Array.from({ length: 25 }, (_, index) =>
      card(String(index + 1), `Yamaha XMAX 300 listing ${index + 1}`)
    ).join("");

    const listings = parseAnibisHtml(html);

    expect(listings).toHaveLength(20);
    expect(listings[0].id).toBe("anibis-1");
    expect(listings[19].id).toBe("anibis-20");
  });

  it("returns every listing when fewer than 20 cards exist", () => {
    const html = Array.from({ length: 5 }, (_, index) =>
      card(String(index + 1), `Yamaha XMAX 300 listing ${index + 1}`)
    ).join("");

    expect(parseAnibisHtml(html)).toHaveLength(5);
  });

  it("skips malformed and duplicate cards before validation", () => {
    const html = [
      card("1", "Yamaha XMAX 300"),
      `<div data-private-srp-listing-item-id="missing-link">No listing link</div>`,
      `<div data-private-srp-listing-item-id="missing-title"><a href="/it/vi/2"></a></div>`,
      card("1", "Duplicate Yamaha XMAX 300"),
      card("external", "External listing", "4 900.-", "https://example.com/it/vi/3"),
      card("4", "Yamaha XMAX 300 ABS"),
    ].join("");

    const parsed = parseAnibisHtml(html);
    const { valid, rejected } = validateAnibisListings(parsed);

    expect(valid.map(({ id }) => id)).toEqual(["anibis-1", "anibis-4"]);
    expect(rejected).toHaveLength(1);
    expect(valid.map(mapAnibisListing).map(({ url }) => url)).toEqual([
      "https://www.anibis.ch/it/vi/1",
      "https://www.anibis.ch/it/vi/4",
    ]);
  });

  it("lets the existing price and accessory filters use later candidates", async () => {
  enableAnibisForTests();

  const html = [
      ...Array.from({ length: 5 }, (_, index) =>
        card(`part-${index}`, `Pare-brise XMAX 300 part ${index}`, "50.-")
      ),
      card("over-cap", "Yamaha XMAX 300", "7 000.-"),
      card("useful", "Yamaha XMAX 300 2021", "4 900.-"),
    ].join("");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));

    const response = await runFinderEngine({
      query: "Cerco uno scooter Yamaha XMAX 300 usato in Svizzera, massimo CHF 5'000, dal 2020 in poi, meno di 20'000 km.",
      lang: "it",
      plan: "free",
    });

    expect(response.results.map(({ id }) => id)).toEqual(["anibis-useful"]);
  });
});
