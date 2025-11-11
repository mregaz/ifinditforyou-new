// app/api/finder/route.ts
import { NextResponse } from "next/server";

// funzione di esempio: qui poi metti la tua AI vera
async function runFinder(query: string, lang: string) {
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

  const aiData = await runFinder(query, lang);

  return NextResponse.json({
    data: JSON.stringify(aiData),
  });
}









