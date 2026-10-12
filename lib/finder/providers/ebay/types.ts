
export type EbayMoney = {
  value: string;
  currency: string;
};

export type EbayItemSummary = {
  itemId: string;
  title: string;
  itemWebUrl?: string;
  price?: EbayMoney;
  condition?: string;
  categories?: Array<{
    categoryId: string;
    categoryName?: string;
  }>;
  shortDescription?: string;
  shippingOptions?: Array<{
    shippingCost?: EbayMoney;
  }>;
};

export type EbaySearchResponse = {
  total?: number;
  itemSummaries?: EbayItemSummary[];
};
