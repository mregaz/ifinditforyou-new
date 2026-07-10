import * as cheerio from "cheerio";
import type { AnibisListing } from "./types";

export function parseAnibisHtml(html: string): AnibisListing[] {
  const $ = cheerio.load(html);
  const listings: AnibisListing[] = [];
  const seenTitles = new Set<string>();

  $("img[alt]").each((_, element) => {
    const title = $(element).attr("alt")?.trim();

    if (!title) {
      return;
    }

    if (title === "Moto" || title === "Accessori moto") {
      return;
    }

    if (seenTitles.has(title)) {
      return;
    }

    seenTitles.add(title);

    listings.push({
      id: `anibis-${listings.length + 1}`,
      title,
      url: "",
      imageUrl: $(element).attr("src"),
    });
  });

  return listings.slice(0, 5);
}