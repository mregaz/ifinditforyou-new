import type { FinderResult } from "./types";

function plausibleYear(value: string): number | undefined {
  const year = Number(value);
  return year >= 1950 && year <= new Date().getUTCFullYear() + 1 ? year : undefined;
}

export function extractVehicleYear(title: string, cardText = ""): number | undefined {
  // Only explicit vehicle-year labels in seller text count; dates and other numbers do not.
  const labeled = [...cardText.matchAll(
    /\b(?:jahrgang|baujahr|ann[eé]e|anno|mod[eè]le|model year|immatricolazione)\s*[:\-]?\s*\(?((?:19|20)\d{2})\)?\b/gi
  )].map((match) => plausibleYear(match[1])).filter((year): year is number => year !== undefined);

  // In titles, accept only a parenthesized year or a year at the end.
  const inTitle = [...title.matchAll(/\(((?:19|20)\d{2})\)|\b((?:19|20)\d{2})\b\s*$/g)]
    .filter((match) => !/\b(?:CHF|Fr\.?|km|ID|Nr\.?)\s*$/i.test(title.slice(0, match.index)))
    .map((match) => plausibleYear(match[1] ?? match[2]))
    .filter((year): year is number => year !== undefined);

  const distinct = [...new Set([...labeled, ...inTitle])];
  return distinct.length === 1 ? distinct[0] : undefined;
}

export function filterByMinYear(results: FinderResult[], minYear?: number): FinderResult[] {
  if (minYear === undefined) return results;
  // An unknown year is not evidence that the listing is too old.
  return results.filter((result) => result.year === undefined || result.year >= minYear);
}
