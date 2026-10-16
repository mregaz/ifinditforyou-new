import { isEbayAccessory as checkMultilingualAccessory } from "../accessory";
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

describe("eBay accessory classification precedence", () => {
  it("identifies a spare-parts kit even when equipment is mentioned", () => {
    expect(
      mapEbayItem(
        item("Kit ricambi Vespa GTS 300 con parabrezza")
      ).isAccessory
    ).toBe(true);
  });
});

describe("eBay multilingual accessory titles", () => {
  it.each([
    ["Selle Vespa GTS 300 originale", true],
    ["Sattel Vespa GTS 300 original", true],
  ] as const)("classifies %s as accessory", (title, expected) => {
    expect(checkMultilingualAccessory(title)).toBe(expected);
  });
});

describe("eBay French vehicle versus accessory titles", () => {
  it.each([
    ["Vespa GTS 300 2022 avec selle confort", false],
    ["Selle confort pour Vespa GTS 300", true],
  ] as const)("classifies %s correctly", (title, expected) => {
    expect(checkMultilingualAccessory(title)).toBe(expected);
  });
});

describe("eBay real-world Vespa search regression", () => {
  it.each([
    "Vespa Gs 150 Vs5t Ulma Originale Anbauteile",
    "Vespa ACMA 1950 Bacchetta Accesories Gestängeschaltung Zubehör Patina",
  ])("excludes accessory listing: %s", (title) => {
    expect(checkMultilingualAccessory(title)).toBe(true);
  });

  it.each([
    "Vespa primavera 50 ccm",
    "vespa 125ccm",
  ])("keeps potential complete scooter: %s", (title) => {
    expect(checkMultilingualAccessory(title)).toBe(false);
  });
});

describe("eBay real-world scooter accessories", () => {
  it.each([
    "TPU Schutzfolie für Vespa GTS300",
    "Taillight - PIAGGIO Vespa GTS 300",
    "BAULETTO ORIGINALE PIAGGIO VESPA GTS 300",
    "Vespa GTS 300 Original Vespa Emblem",
    "Spiegellochabdeckung CNC für Vespa GTS 300",
    "Navigation Storage Bag For Vespa GTS 300",
    "Manuale Officina Vespa GTS 300",
    "Vespa GTS 300 Throttle Body ECU",
    "WOLFLINE Gepäckträger für Vespa GTS 300",
    "WOLFLINE Schutzbügel für Vespa GTS 300",
    "ALBERO MOTORE COMPLETO VESPA GTS 300",
    "Vespa GTS 300 Auspuffrohr",
    "Vespa GTS 300 Kennzeichenhalter",
    "Vespa GTS 300 FORCELLA TUBO STERZO",
  ])("recognizes a separately sold accessory: %s", (title) => {
    expect(checkMultilingualAccessory(title)).toBe(true);
  });
});
