import "server-only";

const EBAY_TOKEN_URL =
  "https://api.ebay.com/identity/v1/oauth2/token";

const EBAY_SCOPE =
  "https://api.ebay.com/oauth/api_scope";

const TOKEN_EXPIRY_MARGIN_MS = 60_000;
const REQUEST_TIMEOUT_MS = 2_000;

type EbayTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;
let pendingTokenRequest: Promise<string> | null = null;

async function requestEbayToken(): Promise<string> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("eBay OAuth credentials are missing");
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(EBAY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: EBAY_SCOPE,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `eBay OAuth request failed with HTTP ${response.status}`
    );
  }

  const data = (await response.json()) as EbayTokenResponse;

  if (
    !data.access_token ||
    !["bearer", "application access token"].includes(
      data.token_type?.toLowerCase()
    ) ||
    !Number.isFinite(data.expires_in) ||
    data.expires_in <= 0
  ) {
    throw new Error("Invalid eBay OAuth token response");
  }

  cachedToken = data.access_token;

  tokenExpiresAt =
    Date.now() +
    Math.max(
      0,
      data.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS
    );

  return cachedToken;
}

export async function getEbayAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  if (!pendingTokenRequest) {
    pendingTokenRequest = requestEbayToken().finally(() => {
      pendingTokenRequest = null;
    });
  }

  return pendingTokenRequest;
}
