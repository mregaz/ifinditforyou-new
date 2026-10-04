export type Lang = "it" | "fr" | "en" | "de" | "es";

export type FinderPlan = "free" | "pro";

export type ParsedQuery = {
  raw: string;
  normalized: string;
  lang: Lang;
  searchSubject?: string;
  maxPriceChf?: number;
  minYear?: number;
  maxMileageKm?: number;
  vehicleIntent?: boolean;
};

export type FinderResult = {
  id: string;
  title: string;
  source: string;
  url: string;
  snippet?: string;
  priceChf?: number;
  isAccessory?: boolean;
  score: number;
};

export type FinderResponse = {
  query: ParsedQuery;
  results: FinderResult[];
  summary: string;
};
