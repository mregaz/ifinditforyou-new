import { describe, expect, it } from "vitest";
import { resolveProviders } from "./resolver";

describe("resolveProviders", () => {
  it("resolves vehicle providers by priority", () => {
    const providers = resolveProviders({
      capability: "vehicles",
    });

    expect(providers.map((provider) => provider.name)).toEqual([
      "mock",
      "anibis",
    ]);
  });

  it("resolves watch providers", () => {
    const providers = resolveProviders({
      capability: "watches",
    });

    expect(providers.map((provider) => provider.name)).toEqual(["mock"]);
  });

  it("resolves electronics providers", () => {
    const providers = resolveProviders({
      capability: "electronics",
    });

    expect(providers.map((provider) => provider.name)).toEqual(["mock"]);
  });

  it("resolves general marketplace providers by priority", () => {
    const providers = resolveProviders({
      capability: "general-marketplace",
    });

    expect(providers.map((provider) => provider.name)).toEqual([
      "mock",
      "anibis",
    ]);
  });
});
