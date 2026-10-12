import { describe, expect, it } from "vitest";
import { mapEbayItem } from "../mapper";
import type { EbayItemSummary } from "../types";

function item(title: string): EbayItemSummary {
  return {
    itemId: "accessory-test",
    title,
    itemWebUrl: "https://www.ebay.ch/itm/123456789",
    price: {
      value: "150.00",
      currency: "CHF",
    },
  };
}

describe("eBay accessory classification", () => {
  it.each([
    "Parabrezza Vespa GTS 300",
    "Sella originale Vespa GTS 300",
    "Scarico sportivo Vespa GTS 300",
    "Vespa GTS 300 replacement windshield",
    "Vespa GTS 300 Ersatzteile",
  ])("identifies an accessory: %s", (title) => {
    expect(mapEbayItem(item(title)).isAccessory).toBe(true);
  });

  it.each([
    "Vespa GTS 300 2021 scooter",
    "Vespa GTS 300 Super 2020",
    "Yamaha XMAX 300 2022",
    "Honda Forza 350 2023",
  ])("does not classify a complete vehicle as an accessory: %s", (title) => {
    expect(mapEbayItem(item(title)).isAccessory).not.toBe(true);
  });

  it("preserves the CHF price when classifying accessories", () => {
    const result = mapEbayItem(item("Parabrezza Vespa GTS 300"));

    expect(result.priceChf).toBe(150);
    expect(result.source).toBe("ebay");
  });
});

describe("eBay complete vehicles with equipment", () => {
  it.each([
    "Vespa GTS 300 2022 con parabrezza",
    "Yamaha XMAX 300 con sella nuova",
  ])("keeps a complete scooter: %s", (title) => {
    expect(mapEbayItem(item(title)).isAccessory).not.toBe(true);
  });

  it("still identifies a windshield sold separately", () => {
    expect(
      mapEbayItem(item("Parabrezza Vespa GTS 300")).isAccessory
    ).toBe(true);
  });
});
