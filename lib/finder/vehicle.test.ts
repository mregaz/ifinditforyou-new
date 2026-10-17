import { afterEach, describe, expect, it, vi } from "vitest";
import { runFinderEngine } from "./engine";

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

  for (const original of originalProviderStates) {
    const entry = providerRegistry.find(({ id }) => id === original.id);
    if (entry) entry.enabled = original.enabled;
  }
});

const html = `
  <div data-private-srp-listing-item-id="screen">
    <a href="/it/vi/vaud/veicoli/accessori-moto/pare-brise/1">Pare-brise origine Xmax 300</a> <span>Prezzo 50.-</span>
  </div>
  <div data-private-srp-listing-item-id="exhaust">
    <a href="/it/vi/2">Échappement origine Xmax 300</a> <span>Prezzo 200.-</span>
  </div>
  <div data-private-srp-listing-item-id="cover">
    <a href="/it/vi/3">Tablier Scooter Tucano Urbano PRO R190PRO-X</a> <span>Prezzo 130.-</span>
  </div>
  <div data-private-srp-listing-item-id="xmax">
    <a href="/it/vi/4">Yamaha Xmax 300 2021</a> <span>Prezzo 4 900.-</span>
  </div>
  <div data-private-srp-listing-item-id="xmax-abs">
    <a href="/it/vi/5">YAMAHA X-Max CZD 300 ABS</a> <span>Prezzo 4 350.-</span>
  </div>`;

describe("Finder vehicle intent", () => {
  it("rejects obvious accessories after the price cap", async () => {
    enableAnibisForTests();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));

    const response = await runFinderEngine({
      query: "Cerco uno scooter Yamaha XMAX 300 usato in Svizzera, massimo CHF 5'000, dal 2020 in poi, meno di 20'000 km.",
      lang: "it",
      plan: "free",
    });

    expect(response.results.map(({ id }) => id)).toEqual([
      "anibis-xmax", "anibis-xmax-abs",
    ]);
  });

  it("preserves accessories when vehicle intent is absent", async () => {
    enableAnibisForTests();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(html));

    const response = await runFinderEngine({
      query: "Ricambi Yamaha XMAX 300",
      lang: "it",
      plan: "free",
    });

    expect(response.results.map(({ id }) => id)).toEqual([
      "anibis-screen", "anibis-exhaust",
      "anibis-cover", "anibis-xmax", "anibis-xmax-abs",
    ]);
  });
});
