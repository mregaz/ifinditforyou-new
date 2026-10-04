import type { FinderResult } from "./types";

// A grouped value or at least four contiguous digits avoids treating engine size as mileage.
const NUMBER = String.raw`(?:\d{1,3}(?:[ '’]\d{3})+|\d{4,6})`;
const WITH_KM = new RegExp(String.raw`(?<![\d'’])(${NUMBER})\s*(?:km|KM)(?![a-z])`, "g");
const LABELED = new RegExp(
  String.raw`\b(?:kilom[eé]trage|kilometerstand|laufleistung|chilometraggio|odometer|km)\s*[:=]\s*(${NUMBER})(?!\d)`,
  "gi"
);
const SERVICE_CONTEXT = /\b(?:service|entretien|courroie|belt|riemen|wartung|inspection|r[eé]vision|revisione|prochain|next|n[aä]chste|future?)\b/i;

function isServiceReading(text: string, index: number): boolean {
  const before = text.slice(Math.max(0, index - 100), index);
  const sentence = before.slice(Math.max(before.lastIndexOf("."), before.lastIndexOf(";"), before.lastIndexOf("!")) + 1);
  return SERVICE_CONTEXT.test(sentence);
}

export function extractVehicleMileageKm(cardText: string): number | undefined {
  const candidates: number[] = [];
  for (const pattern of [LABELED, WITH_KM]) {
    pattern.lastIndex = 0;
    for (const match of cardText.matchAll(pattern)) {
      if (isServiceReading(cardText, match.index)) continue;
      const value = Number(match[1].replace(/[^\d]/g, ""));
      if (value > 0 && value <= 999999) candidates.push(value);
    }
  }

  const distinct = [...new Set(candidates)];
  return distinct.length === 1 ? distinct[0] : undefined;
}

export function filterByMaxMileage(results: FinderResult[], maxMileageKm?: number): FinderResult[] {
  if (maxMileageKm === undefined) return results;
  // Unknown mileage is not evidence that the listing exceeds the requested maximum.
  return results.filter((result) =>
    result.mileageKm === undefined || result.mileageKm <= maxMileageKm
  );
}
