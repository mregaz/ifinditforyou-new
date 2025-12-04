// app/sitemap.ts
import type { MetadataRoute } from "next";

const baseUrl = "https://ifinditforyou.com";

const staticPaths = [
  "/",              // home IT
  "/about",
  "/how-it-works",
  "/faq",
  "/privacy",
  "/termini",
  "/terms",
  "/login",
  "/register",
  "/account",
  "/pro",
  "/success",
  "/pay",

  // Home multilingua
  "/en",
  "/fr",
  "/de",

  // Pagine informative EN (se presenti)
  "/en/about",
  "/en/how-it-works",
  "/en/faq",

  // Pagine informative FR (quando le avremo)
  "/fr/about",
  "/fr/how-it-works",
  "/fr/faq",

  // Pagine informative DE (quando le avremo)
  "/de/about",
  "/de/how-it-works",
  "/de/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
  }));
}

