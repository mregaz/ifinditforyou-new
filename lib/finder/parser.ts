import type { Lang, ParsedQuery } from "./types";

function parseSwissNumber(value: string): number {
  return Number(value.replace(/[^\d]/g, ""));
}

export function parseQuery(query: string, lang: Lang): ParsedQuery {
  const searchSubject = query.match(/\b(?:yamaha|honda)\s+[a-z][a-z\d-]*\s+\d{2,4}\b/i)?.[0]
    .replace(/\s+/g, " ");
  const maxPrice = query.match(/\bmassimo\s+(?:CHF\s*)?(\d{1,3}(?:['’\s]\d{3})+|\d+)\b/i);
  const minYear = query.match(/\bdal\s+((?:19|20)\d{2})\s+in\s+poi\b/i);
  const maxMileage = query.match(/\bmeno\s+di\s+(\d{1,3}(?:['’\s]\d{3})+|\d+)\s*km\b/i);
    const vehicleIntent =
    /\b(?:scooter|moto|motociclo|motocicletta)\b/i.test(query) ||
    (
      /\b(?:vespa\s+gts\s+300|yamaha\s+xmax\s+300|honda\s+forza\s+350)\b/i.test(query) &&
      !/\b(?:ricambi|ricambio|ersatzteile|ersatzteil|spare\s+parts|parabrezza|sella|scarico|windshield|windscreen)\b/i.test(query)
    );

  return {
    raw: query,
    normalized: query.trim().toLowerCase(),
    lang,
    ...(searchSubject && { searchSubject }),
    ...(maxPrice && { maxPriceChf: parseSwissNumber(maxPrice[1]) }),
    ...(minYear && { minYear: Number(minYear[1]) }),
    ...(maxMileage && { maxMileageKm: parseSwissNumber(maxMileage[1]) }),
    ...(vehicleIntent && { vehicleIntent }),
  };
}
