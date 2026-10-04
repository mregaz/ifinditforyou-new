import type { FinderResult } from "./types";

type VehicleSubject = { brand: string; model: string; engineSize: number };

const GENERIC_AFTER_BRAND = new Set(["scooter", "moto", "motorrad", "motorcycle", "usato", "used"]);

function words(value: string): string[] {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()
    .match(/[a-z]+|\d+/g) ?? [];
}

function parseVehicleSubject(subject?: string): VehicleSubject | undefined {
  const match = subject?.trim().match(/^([a-z]+)\s+([a-z][a-z\d-]*)\s+(\d{2,4})$/i);
  if (!match) return undefined;

  return {
    brand: match[1].toLowerCase(),
    model: words(match[2]).join(""),
    engineSize: Number(match[3]),
  };
}

function containsModel(titleWords: string[], model: string): boolean {
  for (let start = 0; start < titleWords.length; start++) {
    let joined = "";
    for (let end = start; end < Math.min(start + 4, titleWords.length); end++) {
      joined += titleWords[end];
      if (joined === model) return true;
      if (joined.length >= model.length) break;
    }
  }
  return false;
}

export function titleMatchesSubject(title: string, subject: string): boolean {
  const vehicle = parseVehicleSubject(subject);
  if (!vehicle) return true;

  const titleWords = words(title);
  const hasModel = containsModel(titleWords, vehicle.model);
  const engineSizes = titleWords
    .filter((word) => /^\d{2,4}$/.test(word))
    .map(Number)
    .filter((number) => number >= 50 && number <= 1500);

  if (engineSizes.length > 0 && !engineSizes.includes(vehicle.engineSize)) return false;
  if (hasModel) return true;

  const brandPosition = titleWords.indexOf(vehicle.brand);
  const followingWord = titleWords[brandPosition + 1];
  if (brandPosition >= 0 && followingWord && /^[a-z]+$/.test(followingWord) &&
      !GENERIC_AFTER_BRAND.has(followingWord)) {
    return false;
  }

  // Missing model or engine evidence is unknown, so keep the plausible listing.
  return true;
}

export function filterByStructuredSubject(
  results: FinderResult[],
  searchSubject?: string,
  vehicleIntent = false
): FinderResult[] {
  if (!searchSubject || !parseVehicleSubject(searchSubject)) return results;
  return results.filter((result) =>
    (!vehicleIntent && result.isAccessory === true) ||
    titleMatchesSubject(result.title, searchSubject)
  );
}
