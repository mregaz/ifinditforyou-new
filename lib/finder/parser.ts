import type { Lang, ParsedQuery } from "./types";

export function parseQuery(query: string, lang: Lang): ParsedQuery {
  return {
    raw: query,
    normalized: query.trim().toLowerCase(),
    lang,
  };
}