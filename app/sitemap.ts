// app/sitemap.ts

import type { MetadataRoute } from "next";
import { baseUrl, type Locale, localePathname } from "../lib/i18n-config";

// Lingue che vogliamo includere nella sitemap
// (qui limitiamo a IT/EN/FR/DE per evitare URL non ancora pronti)
const sitemapLocales: Locale[] = ["it", "en", "fr", "de", "es"];

// Pagine "base" del sito (senza prefisso lingua)
const basePaths = [
  "/",          // home IT
  "/about",
  "/faq",
  "/how-it-works",
  "/privacy",
  "/terms",
  "/pro",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  for (const path of basePaths) {
    for (const locale of sitemapLocales) {
      const url = `${baseUrl}${localePathname(locale, path)}`;

      entries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
