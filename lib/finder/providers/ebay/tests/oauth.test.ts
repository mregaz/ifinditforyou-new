import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("server-only", () => ({}));

const originalFetch = globalThis.fetch;

const originalClientId = process.env.EBAY_CLIENT_ID;
const originalClientSecret = process.env.EBAY_CLIENT_SECRET;

async function loadOAuth() {
  return import("../oauth");
}

function mockTokenResponse(token = "test-token") {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      access_token: token,
      token_type: "Bearer",
      expires_in: 7200,
    }),
  } as Response;
}

describe("eBay OAuth client", () => {
  beforeEach(() => {
    vi.resetModules();

    process.env.EBAY_CLIENT_ID = "test-client-id";
    process.env.EBAY_CLIENT_SECRET = "test-client-secret";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;

    if (originalClientId === undefined) {
      delete process.env.EBAY_CLIENT_ID;
    } else {
      process.env.EBAY_CLIENT_ID = originalClientId;
    }

    if (originalClientSecret === undefined) {
      delete process.env.EBAY_CLIENT_SECRET;
    } else {
      process.env.EBAY_CLIENT_SECRET = originalClientSecret;
    }

    vi.restoreAllMocks();
  });

  it("obtains an OAuth token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockTokenResponse()
    );

    globalThis.fetch = fetchMock;

    const { getEbayAccessToken } = await loadOAuth();

    const token = await getEbayAccessToken();

    expect(token).toBe("test-token");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reuses a valid cached token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockTokenResponse()
    );

    globalThis.fetch = fetchMock;

    const { getEbayAccessToken } = await loadOAuth();

    await getEbayAccessToken();
    await getEbayAccessToken();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shares one request between concurrent callers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockTokenResponse()
    );

    globalThis.fetch = fetchMock;

    const { getEbayAccessToken } = await loadOAuth();

    const tokens = await Promise.all([
      getEbayAccessToken(),
      getEbayAccessToken(),
      getEbayAccessToken(),
    ]);

    expect(tokens).toEqual([
      "test-token",
      "test-token",
      "test-token",
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("handles an OAuth authentication error", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    globalThis.fetch = fetchMock;

    const { getEbayAccessToken } = await loadOAuth();

    await expect(
      getEbayAccessToken()
    ).rejects.toThrow(
      "eBay OAuth request failed with HTTP 401"
    );
  });
});
