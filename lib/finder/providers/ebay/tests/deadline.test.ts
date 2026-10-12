import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const getTokenMock = vi.hoisted(() => vi.fn());

vi.mock("../oauth", () => ({
  getEbayAccessToken: getTokenMock,
}));

import { fetchEbay } from "../fetch";

describe("eBay search deadline", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("stops waiting when the overall search budget expires", async () => {
    vi.useFakeTimers();

    getTokenMock.mockImplementation(
      () => new Promise<string>(() => {})
    );

    const searchPromise = fetchEbay("Vespa GTS 300");

    const assertion = expect(searchPromise).rejects.toThrow();

    await vi.advanceTimersByTimeAsync(2501);

    await assertion;
  });
});
