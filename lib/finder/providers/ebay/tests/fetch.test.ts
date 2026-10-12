import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("../oauth", () => ({
  getEbayAccessToken: vi.fn(async () => "fake-test-token"),
}));

const originalFetch = globalThis.fetch;
const originalMarketplace = process.env.EBAY_MARKETPLACE_ID;

async function loadFetch() {
  return import("../fetch");
}

describe("eBay Browse API fetch", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.EBAY_MARKETPLACE_ID = "EBAY_CH";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;

    if (originalMarketplace === undefined) {
      delete process.env.EBAY_MARKETPLACE_ID;
    } else {
      process.env.EBAY_MARKETPLACE_ID = originalMarketplace;
    }

    vi.restoreAllMocks();
  });

  it("returns search results", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        total: 1,
        itemSummaries: [{
          itemId: "123",
          title: "Test iPhone",
          itemWebUrl: "https://www.ebay.ch/itm/123",
          price: { value: "200.00", currency: "CHF" },
        }],
      }),
    } as Response);

    globalThis.fetch = fetchMock;

    const { fetchEbay } = await loadFetch();
    const result = await fetchEbay("iPhone");

    expect(result.total).toBe(1);
    expect(result.itemSummaries).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];

    expect(String(url)).toContain("q=iPhone");
    expect(options.headers["X-EBAY-C-MARKETPLACE-ID"])
      .toBe("EBAY_CH");
  });

  it("returns empty results for an empty query", async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock;

    const { fetchEbay } = await loadFetch();

    expect(await fetchEbay("   ")).toEqual({
      total: 0,
      itemSummaries: [],
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("handles an HTTP error", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    const { fetchEbay } = await loadFetch();

    await expect(fetchEbay("iPhone")).rejects.toThrow(
      "eBay Browse API request failed with HTTP 429"
    );
  });

  it("rejects malformed item summaries", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        total: 1,
        itemSummaries: "invalid",
      }),
    } as Response);

    const { fetchEbay } = await loadFetch();

    await expect(fetchEbay("iPhone")).rejects.toThrow(
      "Invalid eBay item summaries"
    );
  });

  it("rejects an unsupported marketplace", async () => {
    process.env.EBAY_MARKETPLACE_ID = "EBAY_US";

    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock;

    const { fetchEbay } = await loadFetch();

    await expect(fetchEbay("iPhone")).rejects.toThrow(
      "Unsupported eBay marketplace configuration"
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("eBay Browse category metadata", () => {
  it("preserves optional categories from the API response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        total: 1,
        itemSummaries: [{
          itemId: "vehicle-123",
          title: "Vespa GTS 300",
          itemWebUrl: "https://www.ebay.ch/itm/123",
          price: { value: "4500.00", currency: "CHF" },
          categories: [{
            categoryId: "TEST-VEHICLE",
            categoryName: "Scooters",
          }],
        }],
      }),
    } as Response);

    globalThis.fetch = fetchMock;

    const { fetchEbay } = await loadFetch();
    const result = await fetchEbay("Vespa GTS 300");

    expect(result.itemSummaries?.[0]?.categories).toEqual([
      {
        categoryId: "TEST-VEHICLE",
        categoryName: "Scooters",
      },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
