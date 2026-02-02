"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  if (!b || typeof b !== "object") return null;
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
  const sp = useSearchParams();
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const lang = toLocale(locale);
  const isIT = lang === "it";

  const UI = useMemo(() => {
    return {
      title: isIT ? "iFindEV — Decisione" : "iFindEV — Decision",
      subtitle: isIT
        ? "3 scelte ragionate (migliore / più economica / premium)."
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

      copyLink: isIT ? "Copia link" : "Copy link",
      copied: isIT ? "Copiato ✓" : "Copied ✓",

      errEmpty: isIT ? "Scrivi prima una query." : "Write a query first.",
      errGeneric: isIT ? "Errore richiesta" : "Request error",

      decisionTitle: isIT ? "Decisione" : "Decision",
      disclaimerTitle: isIT ? "Nota" : "Note",

      gateTitle: isIT ? "Mi manca un dato critico" : "I’m missing a critical detail",
      gateHint: isIT ? "Rispondi e poi ti do 3 scelte sensate." : "Answer this and I’ll give you 3 solid options.",

      gateYes: isIT ? "Sì, posso caricare a casa" : "Yes, I can charge at home",
      gateNo: isIT ? "No, non posso caricare a casa" : "No, I can’t charge at home",

      whyLabel: isIT ? "Perché" : "Why",
      tradeoffLabel: isIT ? "Compromesso" : "Tradeoff",
      debugTitle: isIT ? "Debug JSON" : "Debug JSON",
      understandingLabel: isIT ? "Ho capito:" : "Understanding:",
    };
  }, [isIT]);

  const templates = useMemo(
    () => [
      { label: "EV (family) — needs charging answer (gate)", value: "family EV under 60000 CHF" },
      { label: "EV (family) — with home charging (ok)", value: "family EV under 60000 CHF, I have a wallbox at home" },
      { label: "EV (CH) — IT example", value: "auto elettrica per famiglia sotto 60000 CHF, ho wallbox a casa" },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [gateBusy, setGateBusy] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resp, setResp] = useState<ApiResp | null>(null);

  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  async function callDecide(q: string) {
    setErrorMsg(null);
    setResp(null);

    const cleaned = q.trim();
    if (!cleaned) {
      setErrorMsg(UI.errEmpty);
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${window.location.origin}/api/decide`;
      const r = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: cleaned, lang, debug: true }),
        redirect: "manual",
      });

      const text = await r.text();
      let data: ApiResp | null = null;
      try {
        data = JSON.parse(text);
      } catch {
        setErrorMsg(`Expected JSON but got non-JSON (HTTP ${r.status}).`);
        return;
      }

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
      setLastQuery(cleaned);

      // scroll ai risultati
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function onDecide() {
    await callDecide(query);
  }

  // Prefill da URL + auto-run solo se auto=1
  useEffect(() => {
    const q = sp.get("q");
    const auto = sp.get("auto");
    if (q && q.trim()) {
      setQuery(q);
      // auto decide solo se auto=1
      if (auto === "1") {
        // evita doppio run in dev strict mode: controlliamo se lastQuery è già uguale
        if (lastQuery !== q.trim()) {
          callDecide(q);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  function makeShareUrl() {
    const base = `${window.location.origin}/${lang}/decide`;
    const q = query.trim();
    if (!q) return base;
    return `${base}?q=${encodeURIComponent(q)}`;
  }

  async function onCopyLink() {
    try {
      await navigator.clipboard.writeText(makeShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: niente
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

        <div className="mt-3 flex flex-wrap items-center gap-3">
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
              setLastQuery(null);
              setErrorMsg(null);
              setResp(null);
              setShowJson(false);
              setCopied(false);
            }}
            disabled={loading}
          >
            {UI.clearBtn}
          </button>

          <button
            className="rounded-xl border px-4 py-2 text-sm opacity-80 disabled:opacity-50"
            type="button"
            onClick={onCopyLink}
            disabled={!query.trim()}
          >
            {copied ? UI.copied : UI.copyLink}
          </button>

          {resp && resp.status !== "error" ? (
            <button
              className="ml-auto rounded-xl border px-4 py-2 text-sm opacity-80 disabled:opacity-50"
              type="button"
              disabled={loading}
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

      <div ref={resultsRef} />

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
              <span className="opacity-70">{UI.understandingLabel}</span>{" "}
              <span className="font-medium">{resp.understanding}</span>
            </div>
          </div>

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
                      <div className="font-medium opacity-80">{UI.whyLabel}</div>
                      <div className="opacity-90">{r.why}</div>
                    </div>

                    <div className="mt-2 text-sm">
                      <div className="font-medium opacity-80">{UI.tradeoffLabel}</div>
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

          {resp.status === "no_results" ? (
            <>
              <div className="rounded-2xl border p-4">
                <div className="text-sm font-semibold">{UI.gateTitle}</div>
                <div className="mt-2 text-sm opacity-90 whitespace-pre-wrap">{resp.diagnosis}</div>

                <div className="mt-3 rounded-xl border p-3">
                  <div className="text-sm font-semibold">{resp.question}</div>
                  <div className="mt-1 text-xs opacity-70">{UI.gateHint}</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-50"
                      disabled={loading || gateBusy}
                      onClick={async () => {
                        if (!lastQuery) return;
                        setGateBusy(true);
                        try {
                          const q2 =
                            lastQuery + (isIT ? ", ho wallbox a casa" : ", I can charge at home (wallbox/garage)");
                          setQuery(q2);
                          await callDecide(q2);
                        } finally {
                          setGateBusy(false);
                        }
                      }}
                    >
                      {UI.gateYes}
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border px-4 py-2 text-sm font-medium opacity-90 disabled:opacity-50"
                      disabled={loading || gateBusy}
                      onClick={async () => {
                        if (!lastQuery) return;
                        setGateBusy(true);
                        try {
                          const q2 = lastQuery + (isIT ? ", non posso caricare a casa" : ", I can’t charge at home");
                          setQuery(q2);
                          await callDecide(q2);
                        } finally {
                          setGateBusy(false);
                        }
                      }}
                    >
                      {UI.gateNo}
                    </button>
                  </div>
                </div>
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

          {showJson ? (
            <div className="rounded-2xl border p-4">
              <div className="mb-2 text-sm font-semibold">{UI.debugTitle}</div>
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
