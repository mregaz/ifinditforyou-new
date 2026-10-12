
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
  shortDescription?: string;
  shippingOptions?: Array<{
    shippingCost?: EbayMoney;
  }>;
};

export type EbaySearchResponse = {
  total?: number;
  itemSummaries?: EbayItemSummary[];
};
