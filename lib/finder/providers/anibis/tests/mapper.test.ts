import { describe, expect, it } from "vitest";
import { mapAnibisListing } from "../mapper";
import type { AnibisListing } from "../types";

function createListing(
  overrides: Partial<AnibisListing> = {}
): AnibisListing {
  return {
    id: "anibis-123",
    title: "Vespa GTS 300",
    url: "https://www.anibis.ch/it/vi/123",
    price: "CHF 5'790.-",
    location: "Losanna, 1000",
    description: undefined,
    imageUrl: undefined,
    ...overrides,
  };
}

describe("mapAnibisListing", () => {
  it("maps a listing into FinderResult", () => {
    const result = mapAnibisListing(createListing(), 0);

    expect(result).toEqual({
      id: "anibis-123",
      title: "Vespa GTS 300",
      source: "anibis",
      url: "https://www.anibis.ch/it/vi/123",
      snippet: "CHF 5'790.- · Losanna, 1000",
      score: 70,
    });
  });

  it("uses description when available", () => {
    const result = mapAnibisListing(
      createListing({
        description: "Scooter in ottime condizioni",
      }),
      0
    );

    expect(result.snippet).toBe(
      "Scooter in ottime condizioni"
    );
  });

  it("falls back to default snippet", () => {
    const result = mapAnibisListing(
      createListing({
        price: undefined,
        location: undefined,
        description: undefined,
      }),
      0
    );

    expect(result.snippet).toBe(
      "Risultato estratto da Anibis."
    );
  });

  it("decreases score according to index", () => {
    expect(mapAnibisListing(createListing(), 0).score).toBe(70);
    expect(mapAnibisListing(createListing(), 1).score).toBe(69);
    expect(mapAnibisListing(createListing(), 10).score).toBe(60);
  });

  it("never returns a score below one", () => {
    expect(mapAnibisListing(createListing(), 100).score).toBe(1);
  });
});
