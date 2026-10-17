import { afterEach, describe, expect, it, vi } from "vitest";
import { runFinderEngine } from "./engine";
import { extractVehicleMileageKm, filterByMaxMileage } from "./mileage";
import type { FinderResult } from "./types";
import { providerRegistry } from "./providers";


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

describe("vehicle mileage extraction", () => {
  it.each([
    ["Zum Verkauf, mit lediglich 12'500 km.", 12500],
    ["Kilométrage : 30'000 kmTransmission : Automatique", 30000],
    ["Xmax 300 à vendre Km: 41000", 41000],
    ["Yamaha XMAX 300 17 000 km Expertisé", 17000],
    ["Service des 25000 effectué en septembre 2026.", undefined],
    ["prochain service 42000 km", undefined],
    ["Courroie remplacée lors du service des 20'000 km.", undefined],
    ["Yamaha XMAX 300 CHF 4'900, 2021, Ginevra 1201, listing 1073997512", undefined],
  ])("reads current mileage conservatively from %s", (text, expected) => {
    expect(extractVehicleMileageKm(text)).toBe(expected);
  });

  it("uses explicit current mileage despite a different belt-service mileage", () => {
    expect(extractVehicleMileageKm(
      "Kilométrage : 30'000 km. Courroie remplacée lors du service des 20'000 km."
    )).toBe(30000);
  });

  it("uses current mileage rather than a future service interval", () => {
    expect(extractVehicleMileageKm("Km: 41000 (prochain service 42000 km)"))
      .toBe(41000);
  });

  it("returns unknown when two apparent current mileages conflict", () => {
    expect(extractVehicleMileageKm("Kilométrage : 17 000 km. Odometer: 22 000 km."))
      .toBeUndefined();
  });
});

describe("maximum mileage filter", () => {
  const listing = (id: string, mileageKm?: number): FinderResult => ({
    id, title: id, source: "anibis", url: `https://www.anibis.ch/it/vi/${id}`,
    score: 70, ...(mileageKm !== undefined && { mileageKm }),
  });
  const results = [listing("below", 17000), listing("equal", 20000),
    listing("above", 30000), listing("unknown")];

  it("keeps below, equal, and unknown mileage", () => {
    expect(filterByMaxMileage(results, 20000).map(({ id }) => id))
      .toEqual(["below", "equal", "unknown"]);
  });

  it("preserves results without a mileage maximum", () => {
    expect(filterByMaxMileage(results)).toBe(results);
  });
});

function card(id: string, title: string, body: string): string {
  return `<div data-private-srp-listing-item-id="${id}">
    <a href="/it/vi/${id}">${title}</a> <span>${body}</span> <span>4 000.-</span>
  </div>`;
}

describe("Finder mileage integration", () => {
  const html = [
    card("service-only", "Yamaha Xmax 300 2021", "Service des 25000 effectué."),
    card("high", "Xmax 300 Iron max (2020)", "Km: 41000 (prochain service 42000)"),
    card("low", "Yamaha XMAX 300", "Yamaha XMAX 300 17 000 km Expertisé."),
  ].join("");

  it("keeps unknown service history, rejects high mileage, and keeps low mileage", async () => {
  enableAnibisForTests();

  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));
    const response = await runFinderEngine({
      query: "Cerco uno scooter Yamaha XMAX 300 usato in Svizzera, massimo CHF 5'000, dal 2020 in poi, meno di 20'000 km.",
      lang: "it", plan: "free",
    });
    expect(response.results.map(({ id, mileageKm }) => [id, mileageKm])).toEqual([
      ["anibis-service-only", undefined], ["anibis-low", 17000],
    ]);
  });

  it("preserves the high-mileage listing without maxMileageKm", async () => {
  enableAnibisForTests();

  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));
    const response = await runFinderEngine({query: "Yamaha XMAX 300", lang: "it", plan: "free"});
    expect(response.results.map(({ id }) => id)).toContain("anibis-high");
  });
});
