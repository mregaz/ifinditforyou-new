import { describe, expect, it } from "vitest";
import type { ParsedQuery } from "../../../types";
import { classifyEbaySearchIntent } from "../intent";

function makeQuery(raw: string, vehicleIntent = false): ParsedQuery {
  return {
    raw,
    normalized: raw.toLowerCase(),
    lang: "it",
    vehicleIntent,
  };
}

describe("eBay search intent classification", () => {
  it.each([
    ["Vespa GTS 300", false, "VEHICLE"],
    ["Cerco uno scooter Vespa GTS 300", true, "VEHICLE"],
    ["Cerco una sella per scooter Vespa GTS 300", true, "ACCESSORY"],
    [
      "Cerco una sella per scooter Vespa GTS 300 con spedizione",
      true,
      "ACCESSORY",
    ],
    [
      "Cerco uno scooter Vespa GTS 300 con parabrezza",
      true,
      "VEHICLE",
    ],
    ["Informazioni generali", false, "UNKNOWN"],
  ] as const)(
    "classifies %s as %s",
    (raw, vehicleIntent, expected) => {
      expect(
        classifyEbaySearchIntent(makeQuery(raw, vehicleIntent))
      ).toBe(expected);
    }
  );
});

describe("eBay explicit spare-parts intent precedence", () => {
  it("prioritizes spare parts over equipment wording", () => {
    const query = makeQuery(
      "Cerco ricambi Vespa GTS 300 con parabrezza",
      true
    );

    expect(classifyEbaySearchIntent(query)).toBe("ACCESSORY");
  });
});

describe("eBay vehicle with spare parts included", () => {
  it("recognizes a complete Vespa sold with spare parts", () => {
    const query = makeQuery(
      "Cerco una Vespa GTS 300 con ricambi inclusi",
      true
    );

    expect(classifyEbaySearchIntent(query)).toBe("VEHICLE");
  });
});

describe("eBay multilingual search intent", () => {
  it.each([
    ["Je cherche une selle pour Vespa GTS 300", "ACCESSORY"],
    ["Je cherche un scooter Vespa GTS 300", "VEHICLE"],
    ["Ich suche einen Sattel für Vespa GTS 300", "ACCESSORY"],
    ["Ich suche einen Vespa GTS 300 Roller", "VEHICLE"],
    ["Looking for a Vespa GTS 300 windshield", "ACCESSORY"],
    ["Looking for a Vespa GTS 300 scooter", "VEHICLE"],
  ] as const)("classifies %s", (raw, expected) => {
    expect(classifyEbaySearchIntent(makeQuery(raw))).toBe(expected);
  });
});
