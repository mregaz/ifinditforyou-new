// app/api/finder/route.ts
import { NextResponse } from "next/server";

const SERPER_KEY = process.env.SERPER_API_KEY;   // opzionale
const OPENAI_KEY = process.env.OPENAI_API_KEY;   // opzionale

type FinderItem = {
  title: string;
  url?: string;
  price?: string;
  source?: string;
};

// -------- 1) Ricerca "pubblica" (MVP: stub) --------
// Qui poi colleghiamo eBay/Vinted/Discogs con le loro API ufficiali
async function searchPublic(query: string): Promise<FinderItem[]> {
  return [
    {
      title: `Possibile match su eBay per “${query}”`,
      url: "https://www.ebay.com/",
      price: "—",
      source: "eBay",
    },
    {
      title: `Risultato simile su Vinted`,
      url: "https://www.vinted.com/",
      price: "—",
      source: "Vinted",
    },
    {
      title: `Controlla anche Discogs (musica, vintage)`,
      url: "https://www.discogs.com/",
      price: "—",
      source: "Discogs",
    },
  ];
}

// -------- 2) Ricerca "Pro" (Serper / Google API) --------
async function searchPro(query: string): Promise<FinderItem[]> {
  if (!SERPER_KEY) return [];

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": SERPER_KEY,
      },
      body: JSON.stringify({ plan: aiCreditsLeft ? "pro" : "free",}),
      // Serper risponde velocemente; evitiamo timeout lunghi
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();

    const organic = Array.isArray(data?.organic) ? data.organic : [];
    return organic.slice(0, 5).map((r: any) => ({
      title: r.title ?? "Sorgente Pro",
      url: r.link,
      price: "—",
      source: "Pro",
    }));
  } catch {
    return [];
  }
}

// -------- 3) Fallback AI (OpenAI) --------
async function aiFallback(query: string, lang: string): Promise<string> {
  if (!OPENAI_KEY) {
    return lang === "it"
      ? "Suggerimento: prova a cercare varianti del nome, anni o modelli vicini. Controlla eBay, Vinted, Etsy e forum di collezionisti."
      : lang === "fr"
      ? "Astuce : essaie des variantes du nom, des années ou des modèles proches. Regarde eBay, Vinted, Etsy et les forums de collectionneurs."
      : lang === "de"
      ? "Tipp: Versuche Varianten des Namens, Baujahre oder nahe Modelle. Prüfe eBay, Vinted, Etsy und Sammlerforen."
      : "Tip: try name variants, years or close models. Check eBay, Vinted, Etsy and collector forums.";
  }

  try {
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
              "Sei un assistente che trova prodotti rari o fuori produzione. Rispondi in modo breve e pratico con siti/strategie concrete.",
          },
          { role: "user", content: `Trova questo: ${query}\nLingua: ${lang}` },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) throw new Error("openai error");
    const json = await res.json();
    return json?.choices?.[0]?.message?.content?.trim() ?? "";
  } catch {
    return lang === "it"
      ? "Non ho trovato risultati chiari al momento. Ti consiglio di impostare alert su eBay, cercare nei forum e verificare le aste concluse."
      : lang === "fr"
      ? "Pas de résultats clairs pour l’instant. Configure des alertes eBay, vérifie les forums et les ventes terminées."
      : lang === "de"
      ? "Derzeit keine klaren Treffer. Richte eBay-Alerts ein, prüfe Foren und beendete Auktionen."
      : "No clear hits right now. Set eBay alerts, check forums and completed auctions.";
  }
}

// -------- 4) Entrypoint API --------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = (body?.query as string | undefined)?.trim();
    const lang = (body?.lang as string | undefined) ?? "it";
    const plan = (body?.plan as "free" | "pro" | undefined) ?? "free";

    if (!query) {
      return NextResponse.json({ error: "Query mancante." }, { status: 400 });
    }

    // 1) fonti pubbliche (sempre)
    const base = await searchPublic(query);

    // 2) fonti Pro se richieste e disponibili
    const pro = plan === "pro" ? await searchPro(query) : [];

    const items: FinderItem[] = [...base, ...pro];

    if (items.length === 0) {
      const summary = await aiFallback(query, lang);
      // formato compatibile col tuo frontend
      return NextResponse.json({
        data: JSON.stringify({ items: [], summary }),
      });
    }

    const summary =
      plan === "pro"
        ? lang === "it"
          ? "🔍 Ricerca Pro: includo anche fonti IA avanzate."
          : lang === "fr"
          ? "🔍 Recherche Pro : j’inclus des sources IA avancées."
          : lang === "de"
          ? "🔍 Pro-Suche: auch erweiterte KI-Quellen."
          : "🔍 Pro Search: includes advanced AI sources."
        : lang === "it"
        ? "🔎 Risultati base dalle fonti pubbliche."
        : lang === "fr"
        ? "🔎 Résultats de base à partir de sources publiques."
        : lang === "de"
        ? "🔎 Basisresultate aus öffentlichen Quellen."
        : "🔎 Base results from public sources.";

    return NextResponse.json({
      data: JSON.stringify({ items, summary }),
    });
  } catch (err) {
    console.error("finder error:", err);
    return NextResponse.json(
      { error: "Errore interno del finder" },
      { status: 500 }
    );
  }
}










