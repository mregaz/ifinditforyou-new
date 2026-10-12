import { describe, expect, it, vi } from "vitest";

import { runProvidersDetailed } from "./providerManager";
import type { SearchProvider } from "../contracts/SearchProvider";
import type { ParsedQuery } from "../types";

describe("Phoenix Provider Manager resilience", () => {
  it("preserves results when another provider fails", async () => {
    const query: ParsedQuery = {
      raw: "Vespa GTS 300",
      normalized: "vespa gts 300",
      lang: "it",
    };

    const workingProvider: SearchProvider = {
      name: "working",
      search: vi.fn(async () => [
        {
          id: "test-vespa-1",
          title: "Vespa GTS 300",
          source: "working",
          url: "https://example.com/vespa",
          score: 80,
        },
      ]),
    };

    const failingProvider: SearchProvider = {
      name: "failing",
      search: vi.fn(async () => {
        throw new Error("Simulated provider failure");
      }),
    };

    const result = await runProvidersDetailed({
      providers: [workingProvider, failingProvider],
      query,
    });

    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.id).toBe("test-vespa-1");

    expect(result.executions).toEqual([
      expect.objectContaining({
        provider: "working",
        status: "success",
        resultCount: 1,
      }),
      expect.objectContaining({
        provider: "failing",
        status: "error",
        resultCount: 0,
      }),
    ]);
  });
});
