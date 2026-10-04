import { afterEach, describe, expect, it, vi } from "vitest";
import { runFinderEngine } from "../../../engine";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("active Anibis search", () => {
  it.each([
    ["Yamaha XMAX 300", "https://www.anibis.ch/it/q?query=Yamaha+XMAX+300"],
    ["Honda Forza 350", "https://www.anibis.ch/it/q?query=Honda+Forza+350"],
    ["Yamaha XMAX 300 & more", "https://www.anibis.ch/it/q?query=Yamaha+XMAX+300+%26+more"],
  ])("sends %s to Anibis", async (query, expectedUrl) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html></html>", { status: 200 })
    );

    await runFinderEngine({ query, lang: "it", plan: "free" });

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(expectedUrl);
  });
});
