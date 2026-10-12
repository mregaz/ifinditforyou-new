
import { describe, expect, it } from "vitest";
import { isValidEbayItem } from "../validator";
import type { EbayItemSummary } from "../types";

const validItem: EbayItemSummary = {
  itemId: "test-123",
  title: "MacBook Pro A2141 Display Silver",
  itemWebUrl: "https://www.ebay.ch/itm/123456789",
  price: {
    value: "120.00",
    currency: "CHF",
  },
  condition: "Used",
};

describe("eBay item validator", () => {
  it("accepts a structurally valid item", () => {
    expect(isValidEbayItem(validItem)).toBe(true);
  });

  it("rejects an item without an ID", () => {
    expect(
      isValidEbayItem({ ...validItem, itemId: "" })
    ).toBe(false);
  });

  it("rejects an item without a title", () => {
    expect(
      isValidEbayItem({ ...validItem, title: "" })
    ).toBe(false);
  });

  it("rejects an external website", () => {
    expect(
      isValidEbayItem({
        ...validItem,
        itemWebUrl: "https://example.com/item",
      })
    ).toBe(false);
  });

  it("rejects an insecure URL", () => {
    expect(
      isValidEbayItem({
        ...validItem,
        itemWebUrl: "http://www.ebay.ch/itm/123",
      })
    ).toBe(false);
  });

  it("rejects an invalid price", () => {
    expect(
      isValidEbayItem({
        ...validItem,
        price: { value: "abc", currency: "CHF" },
      })
    ).toBe(false);
  });

  it("rejects an empty price value", () => {
    expect(
      isValidEbayItem({
        ...validItem,
        price: { value: "", currency: "CHF" },
      })
    ).toBe(false);
  });

  it("rejects a missing price", () => {
    expect(
      isValidEbayItem({
        ...validItem,
        price: undefined,
      })
    ).toBe(false);
  });

  it("accepts EUR as a valid currency code", () => {
    expect(
      isValidEbayItem({
        ...validItem,
        price: { value: "100.00", currency: "EUR" },
      })
    ).toBe(true);
  });
});
