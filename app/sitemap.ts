import type { MetadataRoute } from "next";
import { i18n, type Locale, baseUrl } from "@/lib/i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
 const sitemapLocales = i18n.locales;

  const basePaths = ["/", "/about", "/faq", "/terms", "/privacy", "/pro"];

  const entries: MetadataRoute.Sitemap = [];

  entries.push({
    url: `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });

  for (const locale of sitemapLocales) {
    const prefix = locale === "it" ? "" : `/${locale}`;

    for (const path of basePaths) {
      if (locale === "it" && path === "/") continue;

      entries.push({
        url: `${baseUrl}${prefix}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.8,
      });
    }
  }

  return entries;
}

