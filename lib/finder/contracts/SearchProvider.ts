import type { ParsedQuery, FinderResult } from "../types";

export interface SearchProvider {
  name: string;
  search(query: ParsedQuery): Promise<FinderResult[]>;
}
