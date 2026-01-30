"use client";

import { useMemo, useState } from "react";
import { toLocale } from "@/lib/lang";

type Props = { locale: string };

type ApiOk = {
  status: "ok";
  vertical: string;
  budget: any;
  understanding: string;
  recommendations: Array<{
    slot: "primary" | "budget" | "premium";
    title: string;
    why: string;
    tradeoff: string;
  }>;
  decision: string;
  disclaimer?: string[];
  debug?: any;
};

type ApiNoResults = {
  status: "no_results";
  vertical: string;
  budget: any;
  understanding: string;
  diagnosis: string;
  compromises: Array<{ title: string; why: string; tradeoff: string }>;
  question: string;
  decision: string;
  disclaimer?: string[];
  debug?: any;
};

type ApiError = { status: "error"; message: string; debug?: any };
type ApiResp = ApiOk | ApiNoResults | ApiError;

function prettyBudget(b: any): string | null {
  if (!b) return null;
  if (typeof b !== "object") return null;
  if (b.kind !== "max") return null;
  const amount = b.amount;
  const cur = b.currency && b.currency !== "UNKNOWN" ? ` ${b.currency}` : "";
  return `${amount}${cur}`;
}

function slotLabel(slot: "primary" | "budget" | "premium", lang: string) {
  const it = lang === "it";
  if (slot === "primary") return it ? "Migliore" : "Best";
  if (slot === "budget") return it ? "Più economica" : "Cheaper";
  return it ? "Premium" : "Premium";
}

export default function DecidePageClient({ locale }: Props) {
  const lang = toLocale(locale);
  const isIT = lang === "it";

  const UI = useMemo(() => {
    return {
      title: isIT ? "iFindEV — Decisione" : "iFindEV — Decision",
      subtitle: isIT
        ? "Scegliamo 3 opzioni ragionate (migliore / più economica / premium)."
        : "3 reasoned picks (best / cheaper / premium).",
      queryLabel: isIT ? "Cosa stai cercando?" : "What are you looking for?",
      placeholder: isIT
        ? "Esempio: auto elettrica per famiglia sotto 60000 CHF, ho wallbox a casa"
        : "Example: family EV under 60000 CHF, I have a wallbox at home",
      decideBtn: isIT ? "Decidi" : "Decide",
      decidingBtn: isIT ? "Sto decidendo…" : "Deciding…",
      clearBtn: isIT ? "Pulisci" : "Clear",
      showJson: isIT ? "Mostra JSON" : "Show JSON",
      hideJson: isIT ? "Nascondi JSON" : "Hide JSON",
      errEmpty: isIT ? "Scrivi prima una query." : "Write a query first.",
      errGeneric: isIT ? "Errore richiesta" : "Request error",
      gateTitle: isIT ? "Mi manca un dato critico" : "I’m missing a critical detail",
      gateHint: isIT
        ? "Rispondi e poi ti do 3 scelte sensate."
        : "Answer this and I’ll give you 3 solid options.",
      decisionTitle: isIT ? "Decisione" : "Decision",
      disclaimerTitle: isIT ? "Nota" : "Note",
    };
  }, [isIT]);

  const templates = useMemo(
    () => [
      { label: "EV (family) — needs charging answer (gate)", value: "family EV under 60000 CHF" },
      { label: "EV (family) — with home charging (ok)", value: "family EV under 60000 CHF, I have a wallbox at home" },
      { label: "EV (CH) — IT example", value: "auto elettrica per famiglia sotto 60000 CHF, ho wallbox a casa" },
      { label: "Watches — budget mid", value: "watch under 2000 CHF for everyday use, not flashy" },
      { label: "Generic — laptop", value: "best laptop for studying under 1200 CHF" },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resp, setResp] = useState<ApiResp | null>(null);
  const [showJson, setShowJson] = useState(false);

  async function onDecide() {
    setErrorMsg(null);
    setResp(null);

    const q = query.trim();
    if (!q) {
      setErrorMsg(UI.errEmpty);
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, lang, debug: true }),
      });

      const data = (await r.json().catch(() => null)) as ApiResp | null;
      if (!r.ok || !data) {
        setErrorMsg(`${UI.errGeneric} (${r.status})`);
        return;
      }

      if (data.status === "error") {
        setErrorMsg(data.message || UI.errGeneric);
        setResp(data);
        return;
      }

      setResp(data);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  const budgetStr = resp && resp.status !== "error" ? prettyBudget(resp.budget) : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{UI.title}</h1>
        <p className="text-sm opacity-70">
          {UI.subtitle}{" "}
          <span className="opacity-70">
            (lang: <span className="font-mono">{lang}</span>)
          </span>
        </p>
      </header>

      <section className="rounded-2xl border p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.label}
              type="button"
              className="rounded-full border px-3 py-1 text-xs opacity-90 hover:opacity-100 disabled:opacity-50"
              onClick={() => setQuery(t.value)}
              disabled={loading}
              title={t.value}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="mb-2 block text-sm font-medium">{UI.queryLabel}</label>
        <textarea
          className="min-h-[120px] w-full rounded-xl border p-3 outline-none focus:ring-2"
          placeholder={UI.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="mt-3 flex items-center gap-3">
          <button
            className="rounded-xl border px-4 py-2 font-medium shadow-sm disabled:opacity-50"
            onClick={onDecide}
            disabled={loading}
          >
            {loading ? UI.decidingBtn : UI.decideBtn}
          </button>

          <button
            className="rounded-xl border px-4 py-2 text-sm opacity-80 disabled:opacity-50"
            onClick={() => {
              setQuery("");
              setErrorMsg(null);
              setResp(null);
            }}
            disabled={loading}
          >
            {UI.clearBtn}
          </button>

          {resp ? (
            <button
              className="ml-auto rounded-xl border px-4 py-2 text-sm opacity-80"
              type="button"
              onClick={() => setShowJson((v) => !v)}
            >
              {showJson ? UI.hideJson : UI.showJson}
            </button>
          ) : null}
        </div>

        {errorMsg ? (
          <div className="mt-4 rounded-xl border p-3 text-sm">
            <div className="font-semibold">Error</div>
            <div className="mt-1 whitespace-pre-wrap font-mono">{errorMsg}</div>
          </div>
        ) : null}
      </section>

      {/* RESULTS */}
      {resp && resp.status !== "error" ? (
        <section className="mt-6 space-y-4">
          <div className="rounded-2xl border p-4">
            <div className="text-sm opacity-70">
              vertical: <span className="font-mono">{resp.vertical}</span>
              {budgetStr ? (
                <>
                  {" "}
                  · budget: <span className="font-mono">{budgetStr}</span>
                </>
              ) : null}
            </div>
            <div className="mt-2 text-sm">
              <span className="opacity-70">understanding:</span>{" "}
              <span className="font-medium">{resp.understanding}</span>
            </div>
          </div>

          {/* OK */}
          {resp.status === "ok" ? (
            <>
              <div className="grid gap-3">
                {resp.recommendations.map((r) => (
                  <div key={r.slot} className="rounded-2xl border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-semibold">{slotLabel(r.slot, lang)}</div>
                      <div className="rounded-full border px-2 py-0.5 text-xs opacity-70">{r.slot}</div>
                    </div>

                    <div className="text-base font-semibold">{r.title}</div>

                    <div className="mt-2 text-sm">
                      <div className="font-medium opacity-80">Why</div>
                      <div className="opacity-90">{r.why}</div>
                    </div>

                    <div className="mt-2 text-sm">
                      <div className="font-medium opacity-80">Tradeoff</div>
                      <div className="opacity-90">{r.tradeoff}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border p-4">
                <div className="text-sm font-semibold">{UI.decisionTitle}</div>
                <div className="mt-2 text-sm opacity-90 whitespace-pre-wrap">{resp.decision}</div>
              </div>

              {resp.disclaimer?.length ? (
                <div className="rounded-2xl border p-4">
                  <div className="text-sm font-semibold">{UI.disclaimerTitle}</div>
                  <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                    {resp.disclaimer.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}

          {/* NO RESULTS (GATE) */}
          {resp.status === "no_results" ? (
            <>
              <div className="rounded-2xl border p-4">
                <div className="text-sm font-semibold">{UI.gateTitle}</div>
                <div className="mt-2 text-sm opacity-90 whitespace-pre-wrap">{resp.diagnosis}</div>
                <div className="mt-3 rounded-xl border p-3">
                  <div className="text-sm font-semibold">{resp.question}</div>
                  <div className="mt-1 text-xs opacity-70">{UI.gateHint}</div>
                </div>
              </div>

              <div className="grid gap-3">
                {resp.compromises.map((c, i) => (
                  <div key={i} className="rounded-2xl border p-4">
                    <div className="text-base font-semibold">{c.title}</div>
                    <div className="mt-2 text-sm">
                      <div className="font-medium opacity-80">Why</div>
                      <div className="opacity-90">{c.why}</div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="font-medium opacity-80">Tradeoff</div>
                      <div className="opacity-90">{c.tradeoff}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border p-4">
                <div className="text-sm font-semibold">{UI.decisionTitle}</div>
                <div className="mt-2 text-sm opacity-90 whitespace-pre-wrap">{resp.decision}</div>
              </div>

              {resp.disclaimer?.length ? (
                <div className="rounded-2xl border p-4">
                  <div className="text-sm font-semibold">{UI.disclaimerTitle}</div>
                  <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                    {resp.disclaimer.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}

          {/* DEBUG JSON */}
          {showJson ? (
            <div className="rounded-2xl border p-4">
              <div className="mb-2 text-sm font-semibold">Debug JSON</div>
              <pre className="overflow-auto rounded-lg bg-black/5 p-3 text-xs">
                {JSON.stringify(resp, null, 2)}
              </pre>
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
