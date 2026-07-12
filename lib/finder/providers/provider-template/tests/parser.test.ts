import { describe, expect, it } from "vitest";
import { parseMarketplaceHtml } from "../parser";

describe("parseMarketplaceHtml", () => {
  it("throws until implemented", () => {
    expect(() =>
      parseMarketplaceHtml("<html></html>")
    ).toThrow(
      "Provider template: parseMarketplaceHtml must be implemented",
    );
  });
});