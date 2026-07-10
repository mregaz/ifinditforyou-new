export async function fetchAnibis(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 PhoenixFinder/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Anibis request failed with status ${response.status}`);
  }

  return response.text();
}