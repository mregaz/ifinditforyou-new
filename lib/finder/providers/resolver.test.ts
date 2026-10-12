import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { resolveProviders } from "./resolver";

const originalFinderMode = process.env.FINDER_MODE;

afterEach(() => {
  if (originalFinderMode === undefined) {
    delete process.env.FINDER_MODE;
  } else {
    process.env.FINDER_MODE = originalFinderMode;
  }
});

describe("Phoenix provider resolver", () => {
  it("uses Anibis but excludes disabled eBay in real mode", () => {
    process.env.FINDER_MODE = "real";

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
