import { afterEach, describe, expect, it, vi } from "vitest";
import { finderLogger } from "./logger";

afterEach(() => vi.restoreAllMocks());

describe("provider failure diagnostics", () => {
  it("logs a fetch error and its cause instead of an empty object", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const cause = Object.assign(
      new Error("connect https://www.anibis.ch/it/q?query=private"),
      { code: "ETIMEDOUT" }
    );
    const error = new TypeError("fetch failed", { cause });

    finderLogger.error("provider failed", {
      provider: "anibis",
      durationMs: 108,
      error,
    });

    const line = String(log.mock.calls[0][0]);
    expect(line).toContain('"provider":"anibis"');
    expect(line).toContain('"durationMs":108');
    expect(line).toContain('"name":"TypeError"');
    expect(line).toContain('"message":"fetch failed"');
    expect(line).toContain('"code":"ETIMEDOUT"');
    expect(line).not.toContain("query=private");
    expect(line).not.toContain('"error":{}');
  });

  it("logs HTTP details and only the hostname of a request URL", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = Object.assign(new Error("Anibis fetch failed: 403"), {
      status: 403,
      statusText: "Forbidden",
      requestUrl: "https://www.anibis.ch/it/q?query=private",
    });

    finderLogger.error("provider failed", { provider: "anibis", error });

    const line = String(log.mock.calls[0][0]);
    expect(line).toContain('"status":403');
    expect(line).toContain('"statusText":"Forbidden"');
    expect(line).toContain('"hostname":"www.anibis.ch"');
    expect(line).not.toContain("query=private");
  });
});
