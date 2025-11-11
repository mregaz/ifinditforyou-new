// app/api/finder/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// qui ci andrebbe la tua logica AI vera
async function runFinder(query: string, lang: string) {
  // QUI ora restituisco un finto risultato
  return {
    items: [
      { title: "Esempio risultato 1", price: "N/D", source: "demo" },
      { title: "Esempio risultato 2", price: "N/D", source: "demo" },
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

  // 1) leggo il cookie
  const cookieStore = cookies();
  const usedStr = cookieStore.get("ai_uses")?.value;
  const used = usedStr ? parseInt(usedStr, 10) : 0;

  // 2) se ha già usato 3 volte → chiedi pagamento
  if (used >= 3) {
    return NextResponse.json(
      {
        action: "purchase",
        message:
          lang === "it"
            ? "Hai usato le 3 ricerche gratuite. Acquista nuovi crediti per continuare."
            : "You used the 3 free searches. Buy credits to continue.",
      },
      { status: 402 }
    );
  }

  // 3) altrimenti esegui l’AI
  const aiData = await runFinder(query, lang);

  // 4) incrementa il cookie
  const res = NextResponse.json({
    data: JSON.stringify(aiData),
    creditsLeft: Math.max(0, 2 - used), // solo info per il frontend
  });
  res.cookies.set("ai_uses", String(used + 1), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
  return res;
}







