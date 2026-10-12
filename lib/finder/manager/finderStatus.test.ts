import { describe, expect, it } from "vitest";
import { resolveFinderStatus } from "./finderStatus";

describe("Phoenix Finder execution status", () => {
  it("returns no_providers when none were selected", () => {
    expect(resolveFinderStatus([])).toBe("no_providers");
  });

  it("returns success when every provider succeeds", () => {
    expect(
      resolveFinderStatus([
        { status: "success" },
        { status: "success" },
      ])
    ).toBe("success");
  });

  it("returns partial when some providers fail", () => {
    expect(
      resolveFinderStatus([
        { status: "success" },
        { status: "error" },
      ])
    ).toBe("partial");
  });

  it("returns unavailable when all providers fail", () => {
    expect(
      resolveFinderStatus([
        { status: "error" },
        { status: "error" },
      ])
    ).toBe("unavailable");
  });
});
