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
      priceChf: 5790,
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
    expect(result.priceChf).toBeUndefined();
  });

  it("does not invent a numeric price from ambiguous text", () => {
    expect(mapAnibisListing(createListing({ price: "4,900" }), 0).priceChf)
      .toBeUndefined();
  });

  it.each([
    ["Pare-brise origine Xmax 300", "https://www.anibis.ch/it/vi/54370590"],
    ["Échappement origine Xmax 300", "https://www.anibis.ch/it/vi/54370588"],
    ["Tablier Scooter Tucano Urbano PRO R190PRO-X", "https://www.anibis.ch/it/vi/1074007688"],
    ["Yamaha XMAX 300", "https://www.anibis.ch/it/vi/vaud/veicoli/accessori-moto/54370590"],
  ])("marks an obvious accessory: %s", (title, url) => {
    expect(mapAnibisListing(createListing({ title, url }), 0).isAccessory).toBe(true);
  });

  it.each([
    "Yamaha Xmax 300 2021",
    "YAMAHA X-Max CZD 300 ABS",
    "Yamaha XMAX 300 avec pare-brise",
  ])("keeps a vehicle or ambiguous listing unmarked: %s", (title) => {
    expect(mapAnibisListing(createListing({ title }), 0).isAccessory).toBeUndefined();
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
