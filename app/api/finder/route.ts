 // app/api/finder/route.ts
import { NextResponse } from "next/server";
import { Lang, isSupportedLocale } from "@/lib/lang";

const SERPER_KEY = process.env.SERPER_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

type FinderTexts = {
  publicTitleMain: (q: string) => string;
  publicTitleAlt: string;
  noResult: string;
  aiSystem: string;
  summaryFree: string;
  summaryPro: string;
};

const TEXTS: Record<Lang, FinderTexts> = {
  it: {
    publicTitleMain: (q: string) => `Risultato base per “${q}” su eBay`,
    publicTitleAlt: "Risultato simile su Vinted",
    noResult: "Nessun risultato preciso trovato.",
    aiSystem:
      "Sei un assistente che trova prodotti rari o equivalenti utili. Rispondi in italiano.",
    summaryFree: "🔎 Risultati base dalle fonti pubbliche.",
    summaryPro: "🔍 Ricerca Pro completata con fonti IA avanzate.",
  },
  en: {
    publicTitleMain: (q: string) => `Basic result for “${q}” on eBay`,
    publicTitleAlt: "Similar result on Vinted",
    noResult: "No precise result found.",
    aiSystem:
      "You are an assistant that finds rare or equivalent useful products. Answer in English.",
    summaryFree: "🔎 Basic results from public sources.",
    summaryPro: "🔍 Pro search completed with advanced AI sources.",
  },
  fr: {
    publicTitleMain: (q: string) => `Résultat de base pour « ${q} » sur eBay`,
    publicTitleAlt: "Résultat similaire sur Vinted",
    noResult: "Aucun résultat précis trouvé.",
    aiSystem:
      "Tu es un assistant qui trouve des produits rares ou équivalents utiles. Réponds en français.",
    summaryFree: "🔎 Résultats de base provenant de sources publiques.",
    summaryPro: "🔍 Recherche Pro terminée avec des sources IA avancées.",
  },
  de: {
    publicTitleMain: (q: string) => `Basis-Ergebnis für „${q}“ auf eBay`,
    publicTitleAlt: "Ähnliches Ergebnis auf Vinted",
    noResult: "Kein genaues Ergebnis gefunden.",
    aiSystem:
      "Du bist ein Assistent, der seltene oder passende Produkte findet. Antworte auf Deutsch.",
    summaryFree: "🔎 Basis-Ergebnisse aus öffentlichen Quellen.",
    summaryPro: "🔍 Pro-Suche mit erweiterten KI-Quellen abgeschlossen.",
  },
  es: {
    publicTitleMain: (q: string) => `Resultado básico para “${q}” en eBay`,
    publicTitleAlt: "Resultado similar en Vinted",
    noResult: "No se ha encontrado un resultado preciso.",
    aiSystem:
      "Eres un asistente que encuentra productos raros o equivalentes útiles. Responde en español.",
    summaryFree: "🔎 Resultados básicos de fuentes públicas.",
    summaryPro: "🔍 Búsqueda Pro completada con fuentes de IA avanzadas.",
  },
} as const;

async function searchPublic(query: string, lang: Lang) {
  const t = TEXTS[lang];

  return [
    {
      title: t.publicTitleMain(query),
      price: "—",
      url: "https://www.ebay.com",
      source: "eBay",
    },
    {
      title: t.publicTitleAlt,
      price: "—",
      url: "https://www.vinted.com",
      source: "Vinted",
    },
  ];
}

async function searchPro(query: string, lang: Lang) {
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

  const sourceLabel =
    lang === "fr"
      ? "Moteur Pro"
      : lang === "de"
      ? "Pro-Suche"
      : lang === "en"
      ? "Pro engine"
      : lang === "es"
      ? "Motor Pro"
      : "Motore Pro";

  return data.organic.slice(0, 5).map((r: any) => ({
    title: r.title,
    url: r.link,
    price: "—",
    source: sourceLabel,
  }));
}

async function aiFallback(query: string, lang: Lang) {
  const t = TEXTS[lang];

  if (!OPENAI_KEY) return t.noResult;

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
          content: t.aiSystem,
        },
        {
          role: "user",
          content: `Trova / trouve / find / finde / encuentra questo: ${query}`,
        },
      ],
    }),
  });

  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? t.noResult;
}

export async function POST(req: Request) {
  const { query, plan, lang: rawLang } = (await req.json()) as {
    query: string;
    plan?: "free" | "pro";
    lang?: string;
  };

  if (!query) {
    return NextResponse.json(
      { error: "Nessuna query." },
      { status: 400 }
    );
  }

  // Normalizzazione lingua usando isSupportedLocale
  const lang: Lang =
    rawLang && isSupportedLocale(rawLang) ? (rawLang as Lang) : "it";

  const texts = TEXTS[lang];

  const base = await searchPublic(query, lang);
  const pro = plan === "pro" ? await searchPro(query, lang) : [];
  const items = [...base, ...pro];

  if (items.length === 0) {
    const summary = await aiFallback(query, lang);
    return NextResponse.json({ items: [], summary });
  }

  return NextResponse.json({
    items,
    summary: plan === "pro" ? texts.summaryPro : texts.summaryFree,
  });
}











