import { mockProvider } from "./mock/provider";
import { anibisProvider } from "./anibis";
import type { SearchProvider } from "../contracts/SearchProvider";

export const providers: SearchProvider[] = [
  mockProvider,
  anibisProvider,
];