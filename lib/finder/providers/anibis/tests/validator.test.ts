import { describe, expect, it } from "vitest";
import { validateAnibisListings } from "../validator";
import type { AnibisListing } from "../types";

function createListing(
  overrides: Partial<AnibisListing> = {}
): AnibisListing {
  return {
    id: "anibis-123",
    title: "Vespa GTS 300",
    url: "https://www.anibis.ch/it/vi/123",
    ...overrides,
  };
}

describe("validateAnibisListings", () => {
  it("accepts a valid listing", () => {
    const listing = createListing();

    const result = validateAnibisListings([listing]);

    expect(result.valid).toEqual([listing]);
    expect(result.rejected).toEqual([]);
  });

  it("rejects a listing with an empty id", () => {
    const listing = createListing({
      id: "   ",
    });

    const result = validateAnibisListings([listing]);

    expect(result.valid).toEqual([]);
    expect(result.rejected).toEqual([listing]);
  });

  it("rejects a listing with an empty title", () => {
    const listing = createListing({
      title: "   ",
    });

    const result = validateAnibisListings([listing]);

    expect(result.valid).toEqual([]);
    expect(result.rejected).toEqual([listing]);
  });

  it("rejects a listing with an empty url", () => {
    const listing = createListing({
      url: "   ",
    });

    const result = validateAnibisListings([listing]);

    expect(result.valid).toEqual([]);
    expect(result.rejected).toEqual([listing]);
  });

  it("rejects a listing with a non-Anibis url", () => {
    const listing = createListing({
      url: "https://example.com/annuncio/123",
    });

    const result = validateAnibisListings([listing]);

    expect(result.valid).toEqual([]);
    expect(result.rejected).toEqual([listing]);
  });

  it('rejects titles containing "immagine"', () => {
    const listing = createListing({
      title: "Immagine annuncio",
    });

    const result = validateAnibisListings([listing]);

    expect(result.valid).toEqual([]);
    expect(result.rejected).toEqual([listing]);
  });

  it("separates valid and rejected listings", () => {
    const validListing = createListing();

    const rejectedListing = createListing({
      id: "",
      title: "Annuncio non valido",
    });

    const result = validateAnibisListings([
      validListing,
      rejectedListing,
    ]);

    expect(result.valid).toEqual([validListing]);
    expect(result.rejected).toEqual([rejectedListing]);
  });
});
