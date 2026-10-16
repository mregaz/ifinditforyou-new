/**
 * Conservative classification of clearly identified eBay accessories.
 * Unknown listings remain unclassified.
 */

const ACCESSORY_TERMS = [
  "anbauteile",
  "zubehor",
  "accessories",
  "accesories",
  "parabrezza",
  "sella",
  "selle",
  "sattel",
  "scarico",
  "windshield",
  "windscreen",
  "replacement",
  "ersatzteile",
  "ersatzteil",
  "ricambio",
  "ricambi",
  "spare parts",
  "schutzfolie",
  "taillight",
  "bauletto",
  "emblem",
  "spiegellochabdeckung",
  "storage bag",
  "bag",
  "helmet",
  "manuale officina",
  "throttle body",
  "gepacktrager",
  "schutzbugel",
  "albero motore",
  "auspuffrohr",
  "kennzeichenhalter",
  "forcella",
    "portapacchi",
  "ammortizzatori",
  "specchietti",
  "mirror",
  "rearview mirror",
  "fender",
  "variator",
  "variomatik",
  "auspuffanlage",
  "schalldampfer",
  "rucklicht",
  "lenkerschalter",
  "benzinpumpe",
  "kraftstoffpumpe",
  "centralina",
  "tacho",
  "sitzbank",
  "kotflugelverlangerung",
  "transmission",
  "exhaust",
  "schwungrad",
  "portabagagli",
];

export function isEbayAccessory(title: string): boolean {
  const normalized = title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

  const words = normalized.match(/[a-z]+/g) ?? [];

  const completeVehicleWithEquipment =
    /\b(?:vespa|yamaha|honda)\b/.test(normalized) &&
    /\b(?:gts|xmax|forza)\s+\d{2,4}\b/.test(normalized) &&
    /\b(?:con|with|avec|mit)\s+(?:parabrezza|sella|selle|sattel|scarico|windshield|windscreen)\b/.test(
      normalized
    );

  const explicitSpareParts =
    /\b(?:ricambi|ricambio|ersatzteile|ersatzteil|replacement)\b/.test(
      normalized
    ) ||
    /\bspare\s+parts\b/.test(normalized);

  if (explicitSpareParts) {
    return true;
  }

  if (completeVehicleWithEquipment) {
    return false;
  }

  return ACCESSORY_TERMS.some((term) => {
    const termWords = term.split(" ");

    return words.some((_, index) =>
      termWords.every(
        (word, offset) => words[index + offset] === word
      )
    );
  });
}
