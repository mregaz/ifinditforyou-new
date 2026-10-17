import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { resolveProviders } from "./resolver";
import { providerRegistry } from "./index";

const originalProviderStates = providerRegistry.map(({ id, enabled }) => ({
  id,
  enabled,
}));

function useLegacyAnibisTestConfiguration() {
  for (const entry of providerRegistry) {
    if (entry.id === "anibis") entry.enabled = true;
    if (entry.id === "ebay") entry.enabled = false;
  }
}

const originalFinderMode = process.env.FINDER_MODE;

afterEach(() => {
  if (originalFinderMode === undefined) {
    delete process.env.FINDER_MODE;
  } else {
    process.env.FINDER_MODE = originalFinderMode;
  }

  for (const original of originalProviderStates) {
    const entry = providerRegistry.find(({ id }) => id === original.id);
    if (entry) entry.enabled = original.enabled;
  }
});

describe("Phoenix provider resolver", () => {

  it("selects Anibis and eBay together in real mode without Mock", () => {
    process.env.FINDER_MODE = "real";

    for (const entry of providerRegistry) {
      if (entry.id === "anibis" || entry.id === "ebay") {
        entry.enabled = true;
      }
    }

    const providers = resolveProviders({
      capability: "vehicles",
    });

    expect(providers.map((provider) => provider.name)).toEqual([
      "anibis",
      "ebay",
    ]);
  });

  it("uses Anibis but excludes disabled eBay in real mode", () => {
    process.env.FINDER_MODE = "real";
    useLegacyAnibisTestConfiguration();
    const providers = resolveProviders({
      capability: "general-marketplace",
    });

    const names = providers.map((provider) => provider.name);

    expect(names).toContain("anibis");
    expect(names).not.toContain("ebay");
    expect(names).not.toContain("mock");
  });

  it("uses only Mock in demo mode", () => {
    process.env.FINDER_MODE = "demo";

    const providers = resolveProviders({
      capability: "general-marketplace",
    });

    expect(providers.map((provider) => provider.name)).toEqual(["mock"]);
  });

  it("returns no providers for an unknown mode", () => {
    process.env.FINDER_MODE = "unknown";

    const providers = resolveProviders({
      capability: "general-marketplace",
    });

    expect(providers).toEqual([]);
  });
});
