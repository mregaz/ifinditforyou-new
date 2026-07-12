import type { SearchProvider } from "../contracts/SearchProvider";
import { providerRegistry } from "./index";
import type { ProviderCapability } from "./registry";

type ResolveProvidersParams = {
  capability: ProviderCapability;
};

export function resolveProviders({
  capability,
}: ResolveProvidersParams): SearchProvider[] {
  return providerRegistry
    .filter((provider) => provider.enabled)
    .filter(
      (provider) =>
        provider.capabilities.includes("all") ||
        provider.capabilities.includes(capability)
    )
    .sort((a, b) => b.priority - a.priority)
    .map((provider) => provider.provider);
}
