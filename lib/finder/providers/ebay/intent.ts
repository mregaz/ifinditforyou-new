import type { ParsedQuery } from "../../types";

export type EbaySearchIntent = "VEHICLE" | "ACCESSORY" | "UNKNOWN";

const ACCESSORY_TERMS =
  /\b(?:parabrezza|sella|selle|sattel|scarico|ricambi|ricambio|windshield|windscreen|ersatzteile|ersatzteil|spare parts)\b/;

const VEHICLE_TERMS =
  /\b(?:scooter|moto|motocicletta|vespa)\b/;

const EQUIPMENT_CONNECTORS =
  /\b(?:con|with|avec|mit)\s+(?:parabrezza|sella|scarico|windshield|windscreen)\b/;

const KNOWN_MODELS =
  /\b(?:vespa\s+gts\s+300|yamaha\s+xmax\s+300|honda\s+forza\s+350)\b/;

export function classifyEbaySearchIntent(
  query: ParsedQuery
): EbaySearchIntent {
  const text = query.raw
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

  const accessoryRequested = ACCESSORY_TERMS.test(text);
  const equipmentRequested = EQUIPMENT_CONNECTORS.test(text);

  const explicitSpareParts =
    /\b(?:ricambi|ricambio|ersatzteile|ersatzteil)\b/.test(text) ||
    /\bspare\s+parts\b/.test(text);

  const vehicleWithIncludedParts =
    /\b(?:con|with|avec|mit)\s+(?:ricambi|ricambio|ersatzteile|ersatzteil)\s+inclusi\b/.test(
      text
    ) &&
    /\b(?:vespa|scooter|moto|motocicletta)\b/.test(text);

  if (vehicleWithIncludedParts) {
    return "VEHICLE";
  }

  if (explicitSpareParts) {
    return "ACCESSORY";
  }

  const explicitVehicleRequest =
    query.vehicleIntent === true ||
    VEHICLE_TERMS.test(text);

  const knownModel = KNOWN_MODELS.test(text);

  if (accessoryRequested && !equipmentRequested) {
    return "ACCESSORY";
  }

  if (explicitVehicleRequest || knownModel) {
    return "VEHICLE";
  }

  if (accessoryRequested) {
    return "ACCESSORY";
  }

  return "UNKNOWN";
}
