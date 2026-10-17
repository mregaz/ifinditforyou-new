import { afterEach, describe, expect, it, vi } from "vitest";
import { runFinderEngine } from "../../../engine";
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

describe("active Anibis search", () => {
  it.each([
    ["Yamaha XMAX 300", "https://www.anibis.ch/it/q?query=Yamaha+XMAX+300"],
    ["Honda Forza 350", "https://www.anibis.ch/it/q?query=Honda+Forza+350"],
    ["Cerco uno scooter Yamaha XMAX 300 usato in Svizzera, massimo CHF 5'000, dal 2020 in poi, meno di 20'000 km.", "https://www.anibis.ch/it/q?query=Yamaha+XMAX+300"],
    ["Yamaha XMAX 300 & more", "https://www.anibis.ch/it/q?query=Yamaha+XMAX+300"],
  ])("sends %s to Anibis", async (query, expectedUrl) => {
  enableAnibisForTests();

  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html></html>", { status: 200 })
    );

    await runFinderEngine({ query, lang: "it", plan: "free" });

expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
  expectedUrl,
  expect.objectContaining({
    method: "GET",
    cache: "no-store",
    signal: expect.any(AbortSignal),
  })
);  
  });
});
