import type { MetadataRoute } from "next";
import { i18n, baseUrl } from "@/lib/i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = i18n.locales;

  const paths = [
    "/",
    "/about",
    "/faq",
    "/how-it-works",
    "/terms",
    "/privacy",
    "/pro",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      const url =
        path === "/"
          ? `${baseUrl}/${locale}`
          : `${baseUrl}/${locale}${path}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.8,
      });
    }
  }

  return entries;
}


