import { describe, expect, it } from "vitest";
import { resolveCapability } from "./capabilityResolver";
import type { ParsedQuery } from "../types";

function createQuery(normalized: string): ParsedQuery {
  return {
    raw: normalized,
    normalized,
    lang: "it",
  };
}

describe("resolveCapability", () => {
  it("resolves vehicle queries", () => {
    expect(resolveCapability(createQuery("vespa 300 gts usata"))).toBe(
      "vehicles"
    );
  });

  it("resolves watch queries", () => {
    expect(resolveCapability(createQuery("rolex submariner"))).toBe(
      "watches"
    );
  });

  it("resolves electronics queries", () => {
    expect(resolveCapability(createQuery("macbook pro usato"))).toBe(
      "electronics"
    );
  });

  it("falls back to general marketplace", () => {
    expect(resolveCapability(createQuery("divano in pelle"))).toBe(
      "general-marketplace"
    );
  });
});
