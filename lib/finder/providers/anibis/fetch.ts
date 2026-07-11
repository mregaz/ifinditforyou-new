export async function fetchAnibis(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Anibis fetch failed: ${response.status}`);
  }

  return response.text();
}