import { describe, expect, it, vi } from "vitest";
import type { FinderResult } from "./types";

const runProvidersDetailedMock = vi.hoisted(() => vi.fn());
vi.mock("./manager/providerManager", () => ({
  runProvidersDetailed: runProvidersDetailedMock,
}));

import { runFinderEngine } from "./engine";

const result = (id: string, title: string, matchClassification?: FinderResult["matchClassification"]): FinderResult => ({
  id, title, source: "ebay", url: `https://www.ebay.ch/itm/${id}`, score: 50,
  ...(matchClassification && { matchClassification }),
});

describe("Finder Engine classification", () => {
  it("keeps relevant alternatives and uncertainty distinct from exact results", async () => {
    runProvidersDetailedMock.mockResolvedValueOnce({
      results: [
        result("exact", "Vespa GTS 300 Super 2022", "exact"),
        result("alternative", "Vespa Primavera 125 2022", "alternative"),
        result("unknown", "Vespa scooter usata", "unverified"),
        { ...result("accessory", "Parabrezza Vespa GTS 300"), isAccessory: true },
      ],
      executions: [{ provider: "ebay", status: "success", durationMs: 1, resultCount: 4 }],
    });

    const response = await runFinderEngine({ query: "Vespa GTS 300", lang: "it", plan: "free" });
    expect(response.results.map(({ id, matchClassification }) => [id, matchClassification])).toEqual([
      ["exact", "exact"], ["alternative", "alternative"], ["unknown", "unverified"],
    ]);
  });

  it("does not classify unrelated searches", async () => {
    runProvidersDetailedMock.mockResolvedValueOnce({
      results: [result("phone", "iPhone 13 mini")],
      executions: [{ provider: "ebay", status: "success", durationMs: 1, resultCount: 1 }],
    });
    const response = await runFinderEngine({ query: "iPhone 13 mini", lang: "it", plan: "free" });
    expect(response.results).toEqual([result("phone", "iPhone 13 mini")]);
  });
});
