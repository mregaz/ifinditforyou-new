import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("../oauth", () => ({
  getEbayAccessToken: vi.fn(async () => "fake-test-token"),
}));

import { fetchEbay } from "../fetch";

const originalFetch = globalThis.fetch;

describe("eBay Browse cancellation", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("aborts a slow Browse request", async () => {
    let receivedSignal: AbortSignal | undefined;

    globalThis.fetch = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) => {
        receivedSignal = init?.signal ?? undefined;

        return new Promise<Response>((_resolve, reject) => {
          if (!receivedSignal) {
            reject(new Error("Missing AbortSignal"));
            return;
          }

          receivedSignal.addEventListener(
            "abort",
            () => reject(receivedSignal?.reason),
            { once: true }
          );
        });
      }
    );

    await expect(fetchEbay("Vespa GTS 300"))
      .rejects.toThrow();

    expect(receivedSignal).toBeDefined();
    expect(receivedSignal?.aborted).toBe(true);
  }, 5000);
});
