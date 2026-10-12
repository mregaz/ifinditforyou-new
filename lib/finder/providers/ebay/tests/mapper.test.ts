
import { describe, expect, it } from "vitest";
import { mapEbayItem } from "../mapper";
import type { EbayItemSummary } from "../types";

const validItem: EbayItemSummary = {
  itemId: "123456789",
  title: "MacBook Pro A2141 Display",
  itemWebUrl: "https://www.ebay.ch/itm/123456789",
  price: {
    value: "120.00",
    currency: "CHF",
  },
  condition: "Used",
};


describe("eBay CHF decimal precision regression", () => {
  it.each([
    ["19.99", 19.99],
    ["1299.90", 1299.90],
  ])("preserves CHF price %s", (value, expected) => {
    const item: EbayItemSummary = {
      itemId: "precision-test",
      title: "Test product",
      itemWebUrl: "https://www.ebay.ch/itm/123456789",
      price: { value, currency: "CHF" },
    };

    expect(mapEbayItem(item).priceChf).toBe(expected);
  });
});

describe("eBay to Phoenix mapper", () => {
  it("maps the basic fields correctly", () => {
    const result = mapEbayItem(validItem);

    expect(result.id).toBe("ebay-123456789");
    expect(result.title).toBe(validItem.title);
    expect(result.source).toBe("ebay");
    expect(result.url).toBe(validItem.itemWebUrl);
  });

  it("preserves a valid CHF price", () => {
    expect(mapEbayItem(validItem).priceChf).toBe(120);
  });

  it("does not interpret EUR as CHF", () => {
    const item = {
      ...validItem,
      price: { value: "100.00", currency: "EUR" },
    };

    expect(mapEbayItem(item).priceChf).toBeUndefined();
  });

  it("handles a missing price", () => {
    const item = { ...validItem, price: undefined };

    expect(mapEbayItem(item).priceChf).toBeUndefined();
  });

  it("rejects a non-numeric price", () => {
    const item = {
      ...validItem,
      price: { value: "invalid", currency: "CHF" },
    };

    expect(mapEbayItem(item).priceChf).toBeUndefined();
  });

  it("rejects an empty price", () => {
    const item = {
      ...validItem,
      price: { value: "", currency: "CHF" },
    };

    expect(mapEbayItem(item).priceChf).toBeUndefined();
  });

  it("rejects a negative price", () => {
    const item = {
      ...validItem,
      price: { value: "-10", currency: "CHF" },
    };

    expect(mapEbayItem(item).priceChf).toBeUndefined();
  });

  it("preserves the description", () => {
    const item = {
      ...validItem,
      shortDescription: "Original replacement display",
    };

    expect(mapEbayItem(item).snippet).toBe(
      "Original replacement display"
    );
  });
});
