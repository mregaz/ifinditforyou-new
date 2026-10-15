import { describe, expect, it } from "vitest";
import { classifyEbayVehicleRelevance } from "../relevance";
import type { EbayItemSummary } from "../types";

function listing(
  title: string,
  categories: EbayItemSummary["categories"] = []
): EbayItemSummary {
  return {
    itemId: "test-item",
    title,
    categories,
  };
}

describe("eBay vehicle relevance", () => {
  it("excludes a windshield in a parts category", () => {
    const item = listing("Parabrezza Vespa GTS 300 2022", [
      { categoryId: "10063", categoryName: "Moto: ricambi" },
    ]);

    expect(classifyEbayVehicleRelevance(item)).toBe("EXCLUDE");
  });

  it("excludes a luggage box in an accessories category", () => {
    const item = listing("Bauletto Vespa GTS 300", [
      { categoryId: "179719", categoryName: "Bauletti e borse da sella" },
    ]);

    expect(classifyEbayVehicleRelevance(item)).toBe("EXCLUDE");
  });

  it("recognizes a possible complete scooter", () => {
    const item = listing("Vespa GTS 300 Super 2022");

    expect(classifyEbayVehicleRelevance(item)).toBe("MATCH");
  });

  it("marks a generic listing as uncertain", () => {
    const item = listing("Vespa GTS 300");

    expect(classifyEbayVehicleRelevance(item)).toBe("UNCERTAIN");
  });

  it("excludes parts identified by category name", () => {
    const item = listing("Vespa GTS 300 2021", [
      {
        categoryId: "unknown-category",
        categoryName: "Motorcycle Parts & Accessories",
      },
    ]);

    expect(classifyEbayVehicleRelevance(item)).toBe("EXCLUDE");
  });

  it("does not classify an engine as a complete scooter", () => {
    const item = listing("Vespa GTS 300 2022 motore completo");

    expect(classifyEbayVehicleRelevance(item)).not.toBe("MATCH");
  });

  it("excludes a scooter engine listed in a parts category", () => {
    const item = listing("Vespa GTS 300 2022 Engine", [
      {
        categoryId: "10063",
        categoryName: "Motorcycle & Scooter Parts & Accessories",
      },
    ]);

    expect(classifyEbayVehicleRelevance(item)).toBe("EXCLUDE");
  });

  it("does not approve a listing without sufficient evidence", () => {
    const item = listing("Vespa GTS 300");

    expect(classifyEbayVehicleRelevance(item)).toBe("UNCERTAIN");
  });

  it("does not mistake a dated windshield for a scooter", () => {
    const item = listing("Parabrezza Vespa GTS 300 2022");

    expect(classifyEbayVehicleRelevance(item)).not.toBe("MATCH");
  });
});
