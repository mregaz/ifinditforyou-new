import { toLocale } from "@/lib/ui-copy"; // o il path reale dove stanno toLocale + DECIDE_COPY
import { DECIDE_COPY } from "@/lib/ui-copy";


type Vertical = "watches" | "ev" | "generic";

type Budget =
  | {
      kind: "max";
      amount: number;
      currency: "CHF" | "EUR" | "USD" | "UNKNOWN";
    }
  | null;

type DecideOkResponse = {
  status: "ok";
  vertical: Vertical;
  budget: Budget;
  understanding: string;
  recommendations: Array<{
    slot: "primary" | "budget" | "premium";
    title: string;
    why: string;
    tradeoff: string;
  }>;
  decision: string;
  disclaimer: string[];
};

type DecideNoResultsResponse = {
  status: "no_results";
  vertical: Vertical;
  budget: Budget;
  understanding: string;
  diagnosis: string;
  compromises: Array<{
    title: string;
    why: string;
    tradeoff: string;
  }>;
  question: string;
  decision: string;
  disclaimer: string[];
};


type DecideErrorResponse = {
  status: "error";
  message: string;
};

type DecideResponse = DecideOkResponse | DecideNoResultsResponse | DecideErrorResponse;

function detectVertical(query: string): Vertical {
  const q = query.toLowerCase();

  const watchWords = ["orologio", "watch", "rolex", "omega", "seiko", "tissot", "longines"];
  if (watchWords.some((w) => q.includes(w))) return "watches";

  const evWords = ["ev", "tesla", "auto elettrica", "elettrica", "electric car", "ricarica", "wallbox"];
  if (evWords.some((w) => q.includes(w))) return "ev";

  return "generic";
}

function detectCurrency(text: string): "CHF" | "EUR" | "USD" | "UNKNOWN" {
  const t = text.toLowerCase();
  if (t.includes("chf") || t.includes("fr.")) return "CHF";
  if (t.includes("€") || t.includes("eur")) return "EUR";
  if (t.includes("$") || t.includes("usd")) return "USD";
  return "UNKNOWN";
}

function parseNumber(raw: string): number | null {
  // accetta: "60k", "60'000", "60.000", "60000", "2k"
  let s = raw.toLowerCase().trim();
  const hasK = s.endsWith("k");
  if (hasK) s = s.slice(0, -1);

  s = s.replace(/['’\s]/g, "").replace(/\./g, "");
  s = s.replace(/,/g, ".");

  const n = Number(s);
  if (!Number.isFinite(n)) return null;

  return hasK ? n * 1000 : n;
}

function extractMaxBudget(query: string): Budget {
  const patterns: RegExp[] = [
    /sotto\s+([0-9][0-9'’\s.,]*k?)/i,
    /max(?:imum)?\s+([0-9][0-9'’\s.,]*k?)/i,
    /meno\s+di\s+([0-9][0-9'’\s.,]*k?)/i,
    /fino\s+a\s+([0-9][0-9'’\s.,]*k?)/i,
  ];

  for (const re of patterns) {
    const m = query.match(re);
    if (!m) continue;

    const amount = parseNumber(m[1]);
    if (amount === null) continue;

    return {
      kind: "max",
      amount,
      currency: detectCurrency(query),
    };
  }

  return null;
}

function formatBudget(budget: Budget): string | null {
  if (!budget) return null;
  if (budget.currency === "UNKNOWN") return `${budget.amount}`;
  return `${budget.amount} ${budget.currency}`;
}

function budgetTier(vertical: Vertical, budget: Budget): "low" | "mid" | "high" | "unknown" {
  if (!budget) return "unknown";
  const a = budget.amount;

  if (vertical === "watches") {
    if (a < 400) return "low";
    if (a < 2000) return "mid";
    return "high";
  }

  if (vertical === "ev") {
    if (a < 25000) return "low";
    if (a < 55000) return "mid";
    return "high";
  }

  if (a < 200) return "low";
  if (a < 2000) return "mid";
  return "high";
}

function hasAny(q: string, words: string[]) {
  return words.some((w) => q.includes(w));
}

function extractEVSignals(query: string) {
  const q = query.toLowerCase();

  const chargingHome =
    hasAny(q, ["wallbox", "ricarica a casa", "garage", "box", "presa", "colonnina a casa"])
      ? true
      : hasAny(q, ["no wallbox", "senza wallbox", "non posso caricare a casa", "niente garage"])
      ? false
      : null;

  const seats =
    hasAny(q, ["7 posti", "sette posti"]) ? 7 :
    hasAny(q, ["5 posti", "cinque posti"]) ? 5 :
    null;

  const usage =
    hasAny(q, ["autostrada", "highway"]) ? "highway" :
    hasAny(q, ["città", "city", "urbano"]) ? "city" :
    hasAny(q, ["misto", "mixed"]) ? "mixed" :
    null;

  const winterConcern = hasAny(q, ["inverno", "freddo", "montagna", "neve"]) ? true : null;

  return { chargingHome, seats, usage, winterConcern };
}

function shouldGateEVFamily(query: string) {
  const q = query.toLowerCase();
  const looksFamily = hasAny(q, ["famiglia", "bambini", "seggiolino", "passeggino", "bagagliaio", "7 posti", "5 posti"]);
  return looksFamily;
}

function buildNoResultsEV(
  vertical: Vertical,
  budget: Budget,
  query: string,
  T: any // poi lo tipizziamo meglio, ora deve solo compilare
): DecideNoResultsResponse {
  const budgetStr = formatBudget(budget);

  const decisionText = budgetStr
    ? T.evGateDecisionWithBudget(budgetStr)
    : T.evGateDecisionNoBudget;

  return {
    status: "no_results",
    vertical,
    budget,
    understanding: `Ho capito che stai cercando: ${query}`,
    diagnosis: T.evGateDiagnosis,
    compromises: [
      {
        title: T.evGateCompA_Title,
        why: T.evGateCompA_Why,
        tradeoff: T.evGateCompA_Tradeoff,
      },
      {
        title: T.evGateCompB_Title,
        why: T.evGateCompB_Why,
        tradeoff: T.evGateCompB_Tradeoff,
      },
    ],
    question: T.evGateQuestion,
    decision: decisionText,
    disclaimer: [T.disclaimer],
  };
}
function copyFor(vertical: Vertical, tier: "low" | "mid" | "high" | "unknown") {
  if (vertical === "watches") {
    if (tier === "low") {
      return {
        primary: {
          title: "Scelta migliore: quarzo ben fatto (esempio)",
          why: "Nel budget basso, il valore vero è affidabilità e finiture solide: il quarzo riduce manutenzione e sorprese.",
          tradeoff: "Meno “fascino meccanico” e rivendibilità più debole.",
        },
        budget: {
          title: "Più economica: essenziale e robusta (esempio)",
          why: "Taglia su estetica e dettagli, ma resta portabile tutti i giorni.",
          tradeoff: "Finiture e materiali più basici; esperienza più “piatta”.",
        },
        premium: {
          title: "Premium (nel tuo budget): paga solo ciò che conta (esempio)",
          why: "Se vuoi un salto percepibile, metti budget su vetro/cassa/cinturino e qualità generale, non su marketing.",
          tradeoff: "Rischio di pagare brand invece di qualità reale.",
        },
        decisionTone:
          "Con budget basso, io eviterei il “finto premium”. Prendi una scelta semplice e ben fatta: ti dà più soddisfazione nel tempo.",
      };
    }

    if (tier === "mid") {
      return {
        primary: {
          title: "Scelta migliore: automatico equilibrato (esempio)",
          why: "Qui ha senso puntare su un automatico con buona costruzione: feeling migliore senza entrare in prezzi gonfiati.",
          tradeoff: "Manutenzione nel tempo e precisione variabile rispetto al quarzo.",
        },
        budget: {
          title: "Più economica: quarzo di qualità (esempio)",
          why: "Se vuoi zero pensieri, un buon quarzo massimizza affidabilità e precisione a parità di spesa.",
          tradeoff: "Meno “storia” e meno valore collezionistico.",
        },
        premium: {
          title: "Premium: finiture/materiali migliori (esempio)",
          why: "Il premium sensato in fascia media è pagare per comfort, finiture e materiali, non per complicazioni inutili.",
          tradeoff: "Diminishing returns: paghi tanto per miglioramenti piccoli.",
        },
        decisionTone:
          "Con un budget medio, io sceglierei la primary se vuoi piacere d’uso. Se vuoi praticità totale, vai budget (quarzo).",
      };
    }

    return {
      primary: {
        title: "Scelta migliore: qualità reale, non status (esempio)",
        why: "Con budget alto, la scelta migliore è quella che massimizza qualità del calibro e finiture senza pagare solo prestigio.",
        tradeoff: "Serve disciplina: è facile overpayare per il nome.",
      },
      budget: {
        title: "Più economica: valore e rivendibilità (esempio)",
        why: "In fascia alta, la “budget” non è cheap: è quella con miglior valore, mercato usato sano e costi futuri più prevedibili.",
        tradeoff: "Meno esclusività o complicazioni.",
      },
      premium: {
        title: "Premium: il massimo che ha senso (esempio)",
        why: "Premium vuol dire materiali e lavorazioni superiori e un oggetto che ti piace davvero, non una scheda tecnica più lunga.",
        tradeoff: "Manutenzione e immobilizzo di capitale più alti.",
      },
      decisionTone:
        "Con budget alto, io metterei un vincolo: pagare per qualità e piacere, non per status. È lì che si buttano soldi.",
    };
  }

  if (vertical === "ev") {
    if (tier === "low") {
      return {
        primary: {
          title: "Scelta migliore: EV pratico e efficiente (esempio)",
          why: "Budget basso: priorità a efficienza e praticità (consumi reali, spazio utile, ricarica semplice).",
          tradeoff: "Meno autonomia “da brochure” e meno comfort premium.",
        },
        budget: {
          title: "Più economica: costo minimo per entrare nell’EV (esempio)",
          why: "Se l’obiettivo è spendere il meno possibile, accetti compromessi su range e dotazioni.",
          tradeoff: "Peggiore esperienza in autostrada/inverno; rivendibilità più incerta.",
        },
        premium: {
          title: "Premium (nel tuo budget): scegli dove spendere (esempio)",
          why: "Se vuoi un “premium” con budget basso, scegli UNA cosa: sicurezza/ADAS o comfort o ricarica, non tutto.",
          tradeoff: "Se pretendi tutto, finisci su un cattivo affare.",
        },
        decisionTone:
          "Con budget basso, io ottimizzo per uso reale: spazio + ricarica + efficienza. Il resto è rumore.",
      };
    }

    if (tier === "mid") {
      return {
        primary: {
          title: "Scelta migliore: familiare bilanciato (esempio)",
          why: "Budget medio: equilibrio tra spazio per famiglia, autonomia reale e velocità/semplicità di ricarica.",
          tradeoff: "Non avrai il massimo comfort o la massima autonomia insieme.",
        },
        budget: {
          title: "Più economica: massimizza valore (esempio)",
          why: "Riduci optional e scegli un setup più semplice: spesso è la scelta più razionale per costo totale.",
          tradeoff: "Comfort inferiore; meno “wow”.",
        },
        premium: {
          title: "Premium: comfort e ricarica superiore (esempio)",
          why: "Premium sensato in fascia media: comfort reale, silenziosità, ricarica più semplice, assistenza guida utile.",
          tradeoff: "Paghi caro ciò che non influisce sulla funzione (design/status).",
        },
        decisionTone:
          "Per famiglia, io parto dalla primary: spazio e ricarica contano più di prestazioni e schermi.",
      };
    }

    // high
    return {
      primary: {
        title: "Scelta migliore: familiare completo (esempio)",
        why: "Con questo budget puoi scegliere un EV adatto alla famiglia senza compromessi grossi su spazio, comfort e autonomia reale.",
        tradeoff: "Non è necessariamente il più veloce o il più “wow”, ma è quello che funziona meglio ogni giorno.",
      },
      budget: {
        title: "Più economica (razionale): valore e costi prevedibili (esempio)",
        why: "Anche con budget alto, la scelta più intelligente spesso è quella con miglior valore nel tempo e costi più prevedibili.",
        tradeoff: "Meno lusso o tecnologia “da vetrina”.",
      },
      premium: {
        title: "Premium: massimo comfort e ricarica (esempio)",
        why: "Se vuoi spendere di più, fallo per comfort reale, silenziosità, qualità interni e un’esperienza di ricarica migliore.",
        tradeoff: "Pagare solo brand o hype è il modo più veloce per perdere valore.",
      },
      decisionTone:
        "Per una famiglia, io ottimizzo prima su spazio e ricarica, poi su autonomia reale. Il resto è secondario.",
    };
  }

  return {
    primary: {
      title: "Scelta migliore (esempio)",
      why: "Buon equilibrio tra qualità e prezzo.",
      tradeoff: "Non è la più economica.",
    },
    budget: {
      title: "Opzione budget (esempio)",
      why: "Priorità al costo mantenendo caratteristiche accettabili.",
      tradeoff: "Qualità e prestazioni inferiori rispetto alla primary.",
    },
    premium: {
      title: "Opzione premium (esempio)",
      why: "Priorità a qualità e caratteristiche, con meno compromessi.",
      tradeoff: "Costo più alto.",
    },
    decisionTone:
      "Io partirei dalla primary: è quasi sempre la scelta più razionale.",
  };
}

function buildOkResponse(vertical: Vertical, budget: Budget, query: string): DecideOkResponse {
  const tier = budgetTier(vertical, budget);
  const c = copyFor(vertical, tier);
  const b = formatBudget(budget);

  const recommendations: DecideOkResponse["recommendations"] = [
    { slot: "primary", ...c.primary },
    { slot: "budget", ...c.budget },
    { slot: "premium", ...c.premium },
  ];

  const decision = b ? `${c.decisionTone} (Budget massimo: ${b}.)` : c.decisionTone;

  return {
    status: "ok",
    vertical,
    budget,
    understanding: `Ho capito che stai cercando: ${query}`,
    recommendations,
    decision,
    disclaimer: [
      "Queste sono scelte di esempio: non cito modelli o prezzi reali finché non colleghiamo dati affidabili.",
    ],
  };
}

export async function POST(request: Request) {
  let body: any = null;
const locale = toLocale(body?.lang);
const T = DECIDE_COPY[locale];

  try {
    body = await request.json();
  const locale = toLocale(body?.lang);
   const T = DECIDE_COPY[locale];

  } catch {
    const resp: DecideErrorResponse = { status: "error", message: "Body must be valid JSON" };
    return Response.json(resp, { status: 400 });
  }

  const query = String(body?.query ?? "").trim();
  if (!query) {
    const resp: DecideErrorResponse = { status: "error", message: "Missing query" };
    return Response.json(resp, { status: 400 });
  }

  const vertical = detectVertical(query);
  const budget = extractMaxBudget(query);

  // QUALITY GATE: EV + “famiglia” senza info minima => NO_RESULTS
  if (vertical === "ev" && shouldGateEVFamily(query)) {
    const s = extractEVSignals(query);

    // chiediamo SOLO se manca la ricarica a casa (la più determinante)
    if (s.chargingHome === null) {
     const resp = buildNoResultsEV(vertical, budget, query, T);
      return Response.json(resp, { status: 200 });
    }
  }

  const resp: DecideResponse = buildOkResponse(vertical, budget, query);
  return Response.json(resp, { status: 200 });
}
