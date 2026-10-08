
import type { SearchProvider } from "../contracts/SearchProvider";
import { providerRegistry } from "./index";
import type { ProviderCapability } from "./registry";

type ResolveProvidersParams = {
  capability: ProviderCapability;
};

export function resolveProviders({
  capability,
}: ResolveProvidersParams): SearchProvider[] {
  const finderMode = process.env.FINDER_MODE ?? "real";

  return providerRegistry
    .filter((provider) => provider.enabled)
    .filter((provider) => {
      if (finderMode === "demo") {
        return provider.id === "mock";
      }

      if (finderMode === "real") {
        return provider.id !== "mock";
      }

      // Modalità sconosciuta: nessun provider.
      return false;
    })
    .filter(
      (provider) =>
        provider.capabilities.includes("all") ||
        provider.capabilities.includes(capability)
    )
    .sort((a, b) => b.priority - a.priority)
    .map((provider) => provider.provider);
}
