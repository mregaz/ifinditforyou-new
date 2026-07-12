export type FetchMarketplaceHtmlParams = {
  query: string;
};

export async function fetchMarketplaceHtml({
  query,
}: FetchMarketplaceHtmlParams): Promise<string> {
  void query;

  throw new Error(
    "Provider template: fetchMarketplaceHtml must be implemented",
  );
}