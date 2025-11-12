// app/api/finder/route.ts
import { NextResponse } from "next/server";

const SERPER_KEY = process.env.SERPER_API_KEY; // facoltativo: ricerca IA Pro
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// --- 1️⃣ FUNZIONE RICERCA PUBBLICA (es. eBay / Vinted demo) ---
async function searchPublic(query: string) {
  // Simuliamo API reali — in futuro integri eBay, Vinted, Discogs
  return [
    {
      title: `Risultato base per “${query}” su eBay`,
      price: "45 CHF",
      url: "https://www.ebay.com/",
      source: "eBay",
    },
    {
      title: `Risultato simile su Vinted`,
      price: "38 CHF",
      url: "https://www.vinted.com/",
      source: "Vinted",
    },
  ];
}

// --- 2️⃣ FUNZIONE RICERCA PRO (motori a pagamento tipo Serper) ---
async function searchPro(query: string) {
  if (!SERPER_KEY) return [];

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": SERPER_KEY,
    },
    body: JSON.stringify({ q: query }),
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

// --- 3️⃣ FALLBACK GPT: genera testo o link suggeriti ---
async function aiFallback(query: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sei un assistente che trova prodotti rari o fuori produzione. Dai suggerimenti pratici o siti specifici.",
        },
        { role: "user", content: `Trova questo: ${query}` },
      ],
    }),
  });

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "Nessun risultato preciso trovato.";
}

// --- 4️⃣ ENTRYPOINT PRINCIPALE ---
export async function POST(req: Request) {
  const body = await req.json();
  const { query, plan } = body; // plan: "free" | "pro"

  if (!query) {
    return NextResponse.json({ error: "Nessuna query ricevuta." }, { status: 400 });
  }

  try {
    // 1. ricerca base
    const publicResults = await searchPublic(query);

    // 2. se Pro, aggiungi IA
    const proResults = plan === "pro" ? await searchPro(query) : [];

    // 3. se entrambi vuoti → fallback AI
    const results = [...publicResults, ...proResults];
    if (results.length === 0) {
      const aiSuggestion = await aiFallback(query);
      return NextResponse.json({
        items: [],
        summary: aiSuggestion,
      });
    }

    return NextResponse.json({
      items: results,
      summary:
        plan === "pro"
          ? "🔍 Ricerca Pro completata con fonti IA avanzate."
          : "🔎 Risultati base dalle fonti pubbliche.",
    });
  } catch (err) {
    console.error("Finder error:", err);
    return NextResponse.json({ error: "Errore interno del finder" }, { status: 500 });
  }
}









