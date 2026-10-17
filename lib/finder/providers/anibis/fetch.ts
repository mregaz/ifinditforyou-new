
const ANIBIS_REQUEST_TIMEOUT_MS = 2000;

export async function fetchAnibis(url: string): Promise<string> {
  const response = await fetch(url, {
    method: "GET",
    signal: AbortSignal.timeout(ANIBIS_REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Anibis fetch failed: ${response.status}`);
  }

  return response.text();
}
