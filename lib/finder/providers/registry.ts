import type { SearchProvider } from "../contracts/SearchProvider";

export type ProviderCountry = "CH";

export type ProviderLanguage = "it" | "fr" | "de" | "en";

export type ProviderCategory =
  | "general-marketplace"
  | "vehicles"
  | "watches"
  | "electronics";

export type ProviderCapability =
  | "all"
  | "general-marketplace"
  | "vehicles"
  | "watches"
  | "electronics";

export interface RegisteredProvider {
  id: string;
  provider: SearchProvider;
  enabled: boolean;
  priority: number;
  countries: ProviderCountry[];
  languages: ProviderLanguage[];
  categories: ProviderCategory[];
  capabilities: ProviderCapability[];
}