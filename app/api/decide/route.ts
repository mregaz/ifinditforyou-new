import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const query = String(body?.query ?? "");

  if (!query.trim()) {
    return NextResponse.json({ status: "error", error: "Missing query" }, { status: 400 });
  }

  return NextResponse.json({
    status: "ok",
    vertical: "watches",
    understanding: {
      summary: "Cerchi un orologio automatico affidabile, sotto i 2.000€, adatto all’uso quotidiano.",
      hard_constraints: { budget_max: 2000, currency: "EUR", type: "automatic", use_case: "daily" },
      assumptions: ["Preferisci affidabilità e versatilità rispetto al collezionismo."]
    },
    recommendations: [
      {
        slot: "primary",
        title: "Hamilton Khaki Field",
        price_range: "800–1.100€",
        why: "È robusto, leggibile e facile da mantenere: ideale per l’uso quotidiano.",
        tradeoff: "Design più funzionale che elegante."
      },
      {
        slot: "budget",
        title: "Seiko Presage",
        price_range: "450–700€",
        why: "Ottimo rapporto qualità/prezzo con uno stile più raffinato.",
        tradeoff: "Movimento meno evoluto e finiture più semplici."
      },
      {
        slot: "premium",
        title: "Tissot Gentleman Powermatic 80",
        price_range: "900–1.200€",
        why: "Maggiore riserva di carica e finiture più curate.",
        tradeoff: "Prezzo vicino al limite del budget."
      }
    ],
    decision: "Se dovessi scegliere io, prenderei Hamilton Khaki Field per affidabilità e versatilità.",
    disclaimer: ["Prezzi e disponibilità possono variare in base al mercato."]
  });
}
