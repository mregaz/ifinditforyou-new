export type Lang = "it" | "fr" | "en" | "de" | "es";

export type FinderPlan = "free" | "pro";

export type ParsedQuery = {
  raw: string;
  normalized: string;
  lang: Lang;
};

export type FinderResult = {
  id: string;
  title: string;
  source: string;
  url: string;
  snippet?: string;
  score: number;
};

export type FinderResponse = {
  query: ParsedQuery;
  results: FinderResult[];
  summary: string;
};