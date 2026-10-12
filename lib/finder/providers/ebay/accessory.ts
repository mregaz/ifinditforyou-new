/**
 * Conservative classification of clearly identified eBay accessories.
 * Unknown listings remain unclassified.
 */

const ACCESSORY_TERMS = [
  "parabrezza",
  "sella",
  "scarico",
  "windshield",
  "windscreen",
  "replacement",
  "ersatzteile",
  "ersatzteil",
  "ricambio",
  "ricambi",
  "spare parts",
];

export function isEbayAccessory(title: string): boolean {
  const normalized = title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

  const words = normalized.match(/[a-z]+/g) ?? [];

  return ACCESSORY_TERMS.some((term) => {
    const termWords = term.split(" ");

    return words.some((_, index) =>
      termWords.every(
        (word, offset) => words[index + offset] === word
      )
    );
  });
}
