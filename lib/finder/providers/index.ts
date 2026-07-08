import { mockProvider } from "./mock/provider";
import type { SearchProvider } from "../contracts/SearchProvider";

export const providers: SearchProvider[] = [
  mockProvider,
];