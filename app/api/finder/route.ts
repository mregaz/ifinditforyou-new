// app/api/finder/route.ts
import { NextResponse } from "next/server";

// QUI ci metterai la tua logica AI vera
async function runFinder(query: string, lang: string) {
  // dummy response per non far fallire il file
  return {
    items: [
      {
        title: "Esempio risultato 1",
        price: "N/D",
        source: "demo",
      },
    ],
    summary:
      lang === "it"
        ? "Risultato generato dall’AI di prova."
        : "AI demo result.",
  };
}

export async function POST(req: Request) {
  const body = await req.json();
  const query = (body.query as string) ?? "";
  const lang = (body.lang as string) ?? "it";

  // NIENTE cookies qui
  // il limite delle 3 ricerche lo facciamo sul frontend

  const aiData = await runFinder(query, lang);

  return NextResponse.json({
    data: JSON.stringify(aiData),
  });
}









