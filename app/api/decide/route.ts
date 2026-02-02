import { randomUUID } from "crypto";
import { toLocale } from "@/lib/lang";

/* =========================
   Types
========================= */

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

/* =========================
   Soft rate-limit (in memory)
========================= */

const RL_WINDOW_MS = 60_000;
const RL_MAX_PER_WINDOW = 30;
const rlBuckets = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = request.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "unknown";
}

function rateLimitHit(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const cutoff = now - RL_WINDOW_MS;
  const arr = rlBuckets.get(key) ?? [];
  const recent = arr.filter((t) => t > cutoff);

  if (recent.length >= RL_MAX_PER_WINDOW) {
    const oldest = recent[0];
    const retryAfterMs = Math.max(0, oldest + RL_WINDOW_MS - now);
    rlBuckets.set(key, recent);
    return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  recent.push(now);
  rlBuckets.set(key, recent);
  return { ok: true };
}

/* =========================
   Helpers
========================= */

function detectVertical(query: string): Vertical {
  const q = query.toLowerCase();

  if (
    q.includes("ev") ||
    q.includes("electric") ||
    q.includes("elettric") ||
    q.includes("tesla")
  )
    return "ev";

  if (q.includes("watch") || q.includes("orolog")) return "watches";

  return "generic";
}

function detectCurrency(text: string): Budget["currency"] {
  const t = text.toLowerCase();
  if (t.includes("chf")) return "CHF";
  if (t.includes("eur") || t.includes("€")) return "EUR";
  if (t.includes("usd") || t.includes("$")) return "USD";
  return "UNKNOWN";
}

function parseNumber(raw: string): number | null {
  let s = raw.toLowerCase().trim();
  const hasK = s.endsWith("k");
  if (hasK) s = s.slice(0, -1);
  s = s.replace(/['’\s]/g, "").replace(/\./g, "").replace(/,/g, ".");
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return hasK ? n * 1000 : n;
}

function extractMaxBudget(query: string): Budget {
  const patterns = [
    /sotto\s+([0-9][0-9'’\s.,]*k?)/i,
    /under\s+([0-9][0-9'’\s.,]*k?)/i,
    /max\s+([0-9][0-9'’\s.,]*k?)/i,
  ];

  for (const re of patterns) {
    const m = query.match(re);
    if (!m) continue;
    const amount = parseNumber(m[1]);
    if (amount == null) continue;
    return { kind: "max", amount, currency: detectCurrency(query) };
  }
  return null;
}

function hasAny(q: string, words: string[]) {
  return words.some((w) => q.includes(w));
}

function shouldGateEVFamily(query: string) {
  const q = query.toLowerCase();
  return hasAny(q, ["family", "famiglia", "kids", "bambini"]);
}

function extractEVSignals(query: string) {
  const q = query.toLowerCase();
  const chargingHome =
    hasAny(q, ["wallbox", "charge at home", "caricare a casa"])
      ? true
      : hasAny(q, ["no wallbox", "can't charge at home", "non posso caricare a casa"])
      ? false
      : null;
  return { chargingHome };
}

/* =========================
   COPY (IT / EN)
========================= */

type CopyLang = "it" | "en";

const COPY: Record<
  CopyLang,
  {
    disclaimer: string;
    gateDiagnosis: string;
    gateQuestion: string;
    gateYes: string;
    gateNo: string;
    gateDecisionWithBudget: (b: string) => string;
    gateDecisionNoBudget: string;
  }
> = {
  it: {
    disclaimer:
      "Queste sono scelte di esempio: non cito modelli o prezzi reali finché non colleghiamo dati affidabili.",
    gateDiagnosis:
      "Per scegliere un’auto elettrica da famiglia senza sparare consigli a caso, mi manca un’informazione critica.",
    gateQuestion: "Puoi caricare a casa (wallbox/garage)?",
    gateYes: "Sì, posso caricare a casa",
    gateNo: "No, non posso caricare a casa",
    gateDecisionWithBudget: (b) =>
      `Con budget massimo ${b}, posso darti 3 scelte sensate appena chiarisci la ricarica.`,
    gateDecisionNoBudget:
      "Posso darti 3 scelte sensate appena chiarisci la ricarica.",
  },
  en: {
    disclaimer:
      "These are example choices: I won’t name real models or prices until we connect reliable data.",
    gateDiagnosis:
      "To recommend a family EV without guessing, I’m missing a critical detail.",
    gateQuestion: "Can you charge at home (wallbox/garage)?",
    gateYes: "Yes, I can charge at home",
    gateNo: "No, I can’t charge at home",
    gateDecisionWithBudget: (b) =>
      `With a max budget of ${b}, I can give you 3 solid options once charging is clear.`,
    gateDecisionNoBudget:
      "I can give you 3 solid options once charging is clear.",
  },
};

/* =========================
   GET probe (debug)
========================= */

export async function GET() {
  return Response.json({ ok: true, route: "/api/decide" }, { status: 200 });
}

/* =========================
   POST /api/decide
========================= */

export async function POST(request: Request) {
  let body: any = null;

  try {
    body = await request.json();
  } catch {
    const resp: DecideErrorResponse = {
      status: "error",
      message: "Body must be valid JSON",
    };
    return Response.json(resp, { status: 400 });
  }

  const query = String(body?.query ?? "").trim();
  if (!query) {
    const resp: DecideErrorResponse = {
      status: "error",
      message: "Missing query",
    };
    return Response.json(resp, { status: 400 });
  }

  // rate-limit
  const ip = getClientIp(request);
  const rl = rateLimitHit(`decide:${ip}`);
  if (!rl.ok) {
    return Response.json(
      {
        status: "error",
        message: `Too many requests. Retry after ${rl.retryAfterSec}s.`,
      },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const locale = toLocale(body?.lang);
  const L: CopyLang = locale === "it" ? "it" : "en";

  const vertical = detectVertical(query);
  const budget = extractMaxBudget(query);

  const requestId = randomUUID();
  console.log("[decide]", { requestId, locale, vertical });

  // QUALITY GATE EV
  if (vertical === "ev" && shouldGateEVFamily(query)) {
    const s = extractEVSignals(query);
    if (s.chargingHome === null) {
      const b =
        budget && budget.currency !== "UNKNOWN"
          ? `${budget.amount} ${budget.currency}`
          : budget
          ? `${budget.amount}`
          : null;

      const resp: DecideNoResultsResponse = {
        status: "no_results",
        vertical,
        budget,
        understanding: query,
        diagnosis: COPY[L].gateDiagnosis,
        compromises: [],
        question: COPY[L].gateQuestion,
        decision: b
          ? COPY[L].gateDecisionWithBudget(b)
          : COPY[L].gateDecisionNoBudget,
        disclaimer: [COPY[L].disclaimer],
      };

      return Response.json(resp, { status: 200 });
    }
  }

  // OK (placeholder recommendations)
  const resp: DecideOkResponse = {
    status: "ok",
    vertical,
    budget,
    understanding: query,
    recommendations: [
      {
        slot: "primary",
        title: L === "it" ? "Scelta migliore" : "Best choice",
        why:
          L === "it"
            ? "Equilibrio generale per il tuo caso."
            : "Best overall balance for your case.",
        tradeoff:
          L === "it"
            ? "Non è la più economica."
            : "Not the cheapest option.",
      },
      {
        slot: "budget",
        title: L === "it" ? "Più economica" : "Cheaper option",
        why:
          L === "it"
            ? "Riduce il costo accettando compromessi."
            : "Lower cost with acceptable compromises.",
        tradeoff:
          L === "it"
            ? "Meno comfort o autonomia."
            : "Less comfort or range.",
      },
      {
        slot: "premium",
        title: L === "it" ? "Premium" : "Premium",
        why:
          L === "it"
            ? "Massimo comfort e qualità."
            : "Maximum comfort and quality.",
        tradeoff:
          L === "it"
            ? "Costo più alto."
            : "Higher cost.",
      },
    ],
    decision:
      L === "it"
        ? "Questa è la decisione più razionale per il tuo scenario."
        : "This is the most rational decision for your scenario.",
    disclaimer: [COPY[L].disclaimer],
  };

  return Response.json(resp, { status: 200 });
}
