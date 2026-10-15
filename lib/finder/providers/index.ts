import { mockProvider } from "./mock/provider";
import { anibisProvider } from "./anibis";
import { ebayProvider } from "./ebay";
import type { RegisteredProvider } from "./registry";

export const providerRegistry: RegisteredProvider[] = [
  {
    id: "mock",
    provider: mockProvider,
    enabled: true,
    priority: 100,
    countries: ["CH"],
    languages: ["it", "fr", "de", "en"],
    categories: ["general-marketplace"],
    capabilities: ["all"],
  },
  {
    id: "anibis",
    provider: anibisProvider,
    enabled: false,
    priority: 90,
    countries: ["CH"],
    languages: ["it", "fr", "de"],
    categories: ["general-marketplace", "vehicles"],
    capabilities: ["general-marketplace", "vehicles"],
  },
  {
    id: "ebay",
    provider: ebayProvider,
    enabled: true,
    priority: 80,
    countries: ["CH"],
    languages: ["it", "fr", "de", "en"],
    categories: ["general-marketplace", "vehicles"],
    capabilities: ["general-marketplace", "vehicles"],
  },
];