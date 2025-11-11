// app/api/finder/route.ts
import { NextResponse } from "next/server";

// qui metti la tua logica vera di ricerca AI
async function runFinder(query: string, lang: string) {
  // metto un esempio così il file è valido
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

  // qui NON leggiamo più cookie
  // il limite lo gestiamo sul frontend

  const aiData = await runFinder(query, lang);

  return NextResponse.json({
    data: JSON.stringify(aiData),
  });
}








