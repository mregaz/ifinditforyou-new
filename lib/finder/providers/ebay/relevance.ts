import type { EbayItemSummary } from "./types";
import { isEbayAccessory } from "./accessory";

export type EbayRelevance = "MATCH" | "EXCLUDE" | "UNCERTAIN";

// Categorie di ricambi/accessori osservate nelle risposte reali eBay.
const PARTS_CATEGORY_IDS = new Set([
  "10063",
  "131090",
  "84149",
  "35567",
  "35559",
  "182341",
  "182333",
  "179719",
  "179715",
  "179753",
  "25622",
  "259092",
  "41489",
  "257887",
  "259692",
]);

const PARTS_CATEGORY_PATTERN =
  /\b(?:parts|accessories|ricambi|accessori|pieces|pi[eè]ces|zubehor|ersatzteile|parabrezza|windshield|feux|bauletti)\b/i;

const VEHICLE_PATTERN =
  /\b(?:vespa|scooter|moto|motorcycle|yamaha|honda)\b/i;

const MODEL_PATTERN =
  /\b(?:gts|xmax|forza)\s*-?\s*\d{2,4}\b/i;

const YEAR_PATTERN = /\b(?:19|20)\d{2}\b/;

export function classifyEbayVehicleRelevance(
  item: EbayItemSummary
): EbayRelevance {
  const categories = item.categories ?? [];

  const hasPartsCategory = categories.some(
    (category) =>
      PARTS_CATEGORY_IDS.has(category.categoryId) ||
      PARTS_CATEGORY_PATTERN.test(category.categoryName ?? "")
  );

  if (hasPartsCategory || isEbayAccessory(item.title)) {
    return "EXCLUDE";
  }

  // Un titolo generico non dimostra che sia in vendita
  // un veicolo completo.
  const title = item.title ?? "";

  // Un motore venduto separatamente non è un veicolo completo.
  const standaloneEngine =
    /\b(?:motore\s+completo|complete\s+engine|engine\s+assembly)\b/i.test(title);

  if (standaloneEngine) {
    return "EXCLUDE";
  }

  const hasVehicle = VEHICLE_PATTERN.test(title);
  const hasModel = MODEL_PATTERN.test(title);
  const hasYear = YEAR_PATTERN.test(title);

  if (hasVehicle && hasModel && hasYear) {
  return "MATCH";
}

const isScooterCategory = categories.some(
  (category) => category.categoryId === "9939"
);

const hasVespa = /\bvespa\b/i.test(title);

const hasDisplacement =
  /\b\d{2,3}\s*(?:ccm|cc|cm3)\b/i.test(title);

if (isScooterCategory && hasVespa && hasDisplacement) {
  return "MATCH";
}

return "UNCERTAIN";
}
