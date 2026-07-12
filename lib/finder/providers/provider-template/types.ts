/**
 * Raw listing extracted from a marketplace.
 *
 * Each provider extends this type with its own fields.
 */
export type MarketplaceListing = {
  id: string;
  url: string;

  title: string;

  price?: string;

  location?: string;

  imageUrl?: string;
};