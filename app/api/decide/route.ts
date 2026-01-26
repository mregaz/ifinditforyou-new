export async function POST(request: Request) {
  const body = await request.json();
  const query = String(body?.query ?? "").trim();

  if (!query) {
    return Response.json(
      { status: "error", message: "Missing query" },
      { status: 400 }
    );
  }

  // Risposta minima (per testare che tutto funzioni)
  const response = {
    status: "ok",
    vertical: "generic",
    understanding: `Ho capito che stai cercando: ${query}`,
    recommendations: [
      {
        slot: "primary",
        title: "Scelta migliore (esempio)",
        why: "Buon equilibrio tra qualità e prezzo.",
        tradeoff: "Non è la più economica."
      },
      {
        slot: "budget",
        title: "Più economica (esempio)",
        why: "Costa meno mantenendo caratteristiche accettabili.",
        tradeoff: "Qualità e durata inferiori."
      },
      {
        slot: "premium",
        title: "Premium (esempio)",
        why: "Massima qualità e migliori caratteristiche.",
        tradeoff: "Costo più alto."
      }
    ],
    decision: "Se vuoi il miglior rapporto qualità/prezzo, scegli la 'Scelta migliore'.",
    disclaimer: [
      "Queste sono scelte di esempio: nei prossimi step aggiungiamo dati e regole."
    ]
  };

  return Response.json(response, { status: 200 });
}
