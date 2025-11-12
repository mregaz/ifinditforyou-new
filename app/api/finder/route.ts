// app/api/finder/route.ts
import { NextResponse } from "next/server";

const SERPER_KEY = process.env.SERPER_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function searchPublic(query: string) {
  return [
    {
      title: `Risultato base per “${query}” su eBay`,
      price: "—",
      url: "https://www.ebay.com",
      source: "eBay",
    },
    {
      title: `Risultato simile su Vinted`,
      price: "—",
      url: "https://www.vinted.com",
      source: "Vinted",
    },
  ];
}

async function searchPro(query: string) {
  if (!SERPER_KEY) return [];
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": SERPER_KEY!,
    },
    body: JSON.stringify({ q: query }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!data?.organic) return [];
  return data.organic.slice(0, 5).map((r: any) => ({
    title: r.title,
    url: r.link,
    price: "—",
    source: "Motore Pro",
  }));
}

async function aiFallback(query: string) {
  if (!OPENAI_KEY) return "Nessun risultato preciso trovato.";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Trova prodotti rari o equivalenti utili." },
        { role: "user", content: `Trova questo: ${query}` },
      ],
    }),
  });
  const json = await res.json();
  return (
    json?.choices?.[0]?.message?.content ??
    "Nessun risultato preciso trovato."
  );
}

export async function POST(req: Request) {
  const { query, plan } = (await req.json()) as {
    query: string;
    plan?: "free" | "pro";
  };

  if (!query) {
    return NextResponse.json({ error: "Nessuna query." }, { status: 400 });
  }

  const base = await searchPublic(query);
  const pro = plan === "pro" ? await searchPro(query) : [];
  const items = [...base, ...pro];

  if (items.length === 0) {
    const summary = await aiFallback(query);
    return NextResponse.json({ items: [], summary });
  }

  return NextResponse.json({
    items,
    summary:
      plan === "pro"
        ? "🔍 Ricerca Pro completata con fonti IA avanzate."
        : "🔎 Risultati base dalle fonti pubbliche.",
  });
}









