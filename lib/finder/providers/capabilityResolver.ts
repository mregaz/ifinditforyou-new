import type { ParsedQuery } from "../types";
import type { ProviderCapability } from "./registry";

const capabilityKeywords: Record<
  Exclude<ProviderCapability, "all" | "general-marketplace">,
  string[]
> = {
  vehicles: [
    "auto",
    "automobile",
    "car",
    "voiture",
    "wagen",
    "moto",
    "motociclo",
    "motorcycle",
    "motorrad",
    "scooter",
    "vespa",
    "piaggio",
    "bmw",
    "mercedes",
    "audi",
    "volkswagen",
    "vw",
    "porsche",
    "renault",
    "peugeot",
    "citroen",
    "fiat",
    "opel",
    "ford",
    "toyota",
    "honda",
    "yamaha",
    "ducati",
  ],

  watches: [
    "orologio",
    "orologi",
    "watch",
    "watches",
    "montre",
    "montres",
    "uhr",
    "uhren",
    "rolex",
    "omega",
    "cartier",
    "tissot",
    "breitling",
    "tag heuer",
    "patek philippe",
    "audemars piguet",
  ],

  electronics: [
    "telefono",
    "smartphone",
    "iphone",
    "samsung",
    "computer",
    "ordinateur",
    "ordinateur portable",
    "laptop",
    "notebook",
    "macbook",
    "ipad",
    "tablet",
    "televisore",
    "television",
    "tv",
    "fotocamera",
    "camera",
    "appareil photo",
    "console",
    "playstation",
    "xbox",
    "nintendo",
  ],
};

export function resolveCapability(
  query: ParsedQuery
): ProviderCapability {
  const normalizedQuery = query.normalized.toLowerCase();

  for (const [capability, keywords] of Object.entries(
    capabilityKeywords
  ) as [
    Exclude<ProviderCapability, "all" | "general-marketplace">,
    string[],
  ][]) {
    const matches = keywords.some((keyword) =>
      normalizedQuery.includes(keyword)
    );

    if (matches) {
      return capability;
    }
  }

  return "general-marketplace";
}
