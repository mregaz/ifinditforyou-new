import * as cheerio from "cheerio";
import type { Cheerio } from "cheerio";
import type { Element } from "domhandler";
import type { AnibisListing } from "./types";

const ANIBIS_BASE_URL = "https://www.anibis.ch";

function extractListingUrl(card: Cheerio<Element>): string | undefined {
  const href = card.find('a[href*="/it/vi/"]').first().attr("href");

  if (!href) {
    return undefined;
  }

  return new URL(href, ANIBIS_BASE_URL).toString();
}
function extractTitle(card: Cheerio<Element>): string | undefined {
  const links = card.find('a[href*="/it/vi/"]').toArray();

  for (const element of links) {
    const cleanedLink = card.find(element).clone();

    cleanedLink.find("style, noscript, img, svg").remove();

    const title = cleanedLink
      .text()
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (title.length > 2) {
      return title;
    }
  }

  return (
    card.find("noscript img[alt]").first().attr("alt")?.trim() ??
    card.find("img[alt]").first().attr("alt")?.trim()
  );
}

function extractImageUrl(card: Cheerio<Element>): string | undefined {
  const noscriptImage = card.find("noscript img[src]").first().attr("src");

  if (noscriptImage?.startsWith("http")) {
    return noscriptImage;
  }

 const image = card
  .find("img[src]")
  .toArray()
  .map((element) => card.find(element).attr("src"))
  .find((src) => {
    if (!src) {
      return false;
    }

    return (
      !src.startsWith("data:image") &&
      src.startsWith("http")
    );
  }); 

  return image;
}
function extractCleanCardText(card: Cheerio<Element>): string {
  const cleanedCard = card.clone();

  cleanedCard.find("style, script, noscript, svg").remove();

  return cleanedCard
    .text()
    .replace(/\s+/g, " ")
    .trim();
}

function extractPrice(card: Cheerio<Element>): string | undefined {
  const text = extractCleanCardText(card);

  const matches = text.match(
    /(?:CHF\s*)?\d[\d'’\s]*(?:[.,]\d{1,2})?\s*(?:\.-|.–|–|-)/g
  );

  if (!matches || matches.length === 0) {
    return undefined;
  }

  return matches.at(-1)?.replace(/\s+/g, " ").trim();
}

function extractLocation(card: Cheerio<Element>): string | undefined {
  const text = extractCleanCardText(card);

  const match = text.match(
    /([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’ -]+),\s*(\d{4})\b/
  );

  if (!match) {
    return undefined;
  }

  const city = match[1].trim();
  const postalCode = match[2];

  return `${city}, ${postalCode}`;
}
export function parseAnibisHtml(html: string): AnibisListing[] {
  const $ = cheerio.load(html);
  const listings: AnibisListing[] = [];
  const seenIds = new Set<string>();

  $('[data-private-srp-listing-item-id]').each((_, element) => {
    const card = $(element);

    const id = card.attr("data-private-srp-listing-item-id")?.trim();

    if (!id || seenIds.has(id)) {
      return;
    }

    const title = extractTitle(card);
    const url = extractListingUrl(card);

    if (!title || !url) {
      return;
    }

    seenIds.add(id);

    listings.push({
  id: `anibis-${id}`,
  title,
  url,
  price: extractPrice(card),
  location: extractLocation(card),
  imageUrl: extractImageUrl(card),
});
  });

  return listings.slice(0, 5);
}