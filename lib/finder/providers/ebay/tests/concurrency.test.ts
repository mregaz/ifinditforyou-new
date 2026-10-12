import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const getTokenMock = vi.hoisted(() => vi.fn());

vi.mock("../oauth", () => ({
  getEbayAccessToken: getTokenMock,
}));

import { fetchEbay } from "../fetch";

const originalFetch = globalThis.fetch;

describe("eBay concurrent searches", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it("allows a second search to finish after the first expires", async () => {
    let resolveToken!: (value: string) => void;

    const sharedToken = new Promise<string>((resolve) => {
      resolveToken = resolve;
    });

    getTokenMock.mockReturnValue(sharedToken);

    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        total: 0,
        itemSummaries: [],
      }),
    })) as unknown as typeof fetch;

    const firstSearch = fetchEbay("Vespa GTS 300");

    const firstResult = expect(firstSearch).rejects.toThrow();

    await new Promise((resolve) => setTimeout(resolve, 300));

    const secondSearch = fetchEbay("Vespa GTS 300");

    await new Promise((resolve) => setTimeout(resolve, 2300));

    await firstResult;

    resolveToken("shared-test-token");

    const result = await secondSearch;

    expect(result.itemSummaries).toEqual([]);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(getTokenMock).toHaveBeenCalledTimes(2);
  }, 6000);
});
