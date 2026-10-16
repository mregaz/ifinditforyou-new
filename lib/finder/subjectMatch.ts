import type { FinderResult } from "./types";

type VehicleSubject = { brand: string; model: string; engineSize?: number };
type SubjectClassification = NonNullable<FinderResult["matchClassification"]>;

const GENERIC_AFTER_BRAND = new Set(["scooter", "moto", "motorrad", "motorcycle", "usato", "used"]);

function words(value: string): string[] {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()
    .match(/[a-z]+|\d+/g) ?? [];
}

function parseVehicleSubject(subject?: string): VehicleSubject | undefined {
  const match = subject?.trim().match(/^([a-z]+)\s+([a-z][a-z\d-]*)(?:\s+(\d{2,4}))?$/i);
  if (!match || GENERIC_AFTER_BRAND.has(match[1].toLowerCase())) return undefined;

  return {
    brand: match[1].toLowerCase(),
    model: words(match[2]).join(""),
    ...(match[3] && { engineSize: Number(match[3]) }),
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

  if (vehicle.engineSize !== undefined && engineSizes.length > 0 && !engineSizes.includes(vehicle.engineSize)) return false;
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

export function classifyVehicleSubject(
  title: string,
  subject: string
): SubjectClassification | undefined {
  const vehicle = parseVehicleSubject(subject);
  if (!vehicle) return undefined;

  const titleWords = words(title);
  const hasModel = containsModel(titleWords, vehicle.model);
  const brandPosition = titleWords.indexOf(vehicle.brand);
  if (brandPosition < 0 && !hasModel) return undefined;

  const engineSizes = titleWords
    .filter((word) => /^\d{2,4}$/.test(word))
    .map(Number)
    .filter((number) => number >= 50 && number <= 1500);
if (hasModel && (vehicle.engineSize === undefined || engineSizes.includes(vehicle.engineSize))) return "exact";
  if (hasModel && vehicle.engineSize !== undefined && engineSizes.length > 0) return "alternative";

  const followingWord = titleWords[brandPosition + 1];
  if (brandPosition >= 0 && followingWord && /^[a-z]+$/.test(followingWord) &&
      !GENERIC_AFTER_BRAND.has(followingWord) && followingWord !== vehicle.model) {
    return "alternative";
  }
  return "unverified";
}

export function filterByStructuredSubject(
  results: FinderResult[],
  searchSubject?: string,
  vehicleIntent = false
): FinderResult[] {
  if (!searchSubject || !parseVehicleSubject(searchSubject)) return results;
  if (!vehicleIntent) return results.filter((result) =>
    result.isAccessory === true || titleMatchesSubject(result.title, searchSubject)
  );

  return results.flatMap((result) => {
    const classification = classifyVehicleSubject(result.title, searchSubject);
    if (!classification) return [];
    return [{
      ...result,
      matchClassification: result.matchClassification ??
        (classification === "exact" ? "unverified" : classification),
    }];
  });
}
