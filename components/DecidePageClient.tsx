"use client";

import { useMemo, useState } from "react";
import { toLocale } from "@/lib/lang";

type Props = { locale: string };

export default function DecidePageClient({ locale }: Props) {
  const lang = toLocale(locale);
  const isIT = lang === "it";

  const UI = {
  title: isIT ? "Playground Decide API" : "Decide API playground",
  subtitle: "POST /api/decide",
  button: isIT ? "Decidi" : "Decide",
  loading: isIT ? "Sto decidendo…" : "Deciding…",
  placeholder: isIT
    ? "Esempio: auto elettrica per famiglia sotto 60000 CHF, ho wallbox a casa"
    : "Example: family EV under 60000 CHF, I have a wallbox at home",
  queryLabel: isIT ? "Query" : "Query",
};
 

  const templates = useMemo(() => {
    return [
      {
        label: "EV (family) — needs charging answer (gate)",
        value: "family EV under 60000 CHF",
      },
      {
        label: "EV (family) — with home charging (ok)",
        value: "family EV under 60000 CHF, I have a wallbox at home",
      },
      {
        label: "EV (CH) — IT example",
        value: "auto elettrica per famiglia sotto 60000 CHF, ho wallbox a casa",
      },
      {
        label: "Watches — budget mid",
        value: "watch under 2000 CHF for everyday use, not flashy",
      },
      {
        label: "Generic — laptop",
        value: "best laptop for studying under 1200 CHF",
      },
    ];
  }, []);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  async function onDecide() {
    setErrorMsg(null);
    setResult(null);

    const q = query.trim();
    if (!q) {
     setErrorMsg(lang === "it" ? "Scrivi prima una query." : "Write a query first.");

      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          lang, // it/en/fr/de/es
          debug: true, // utile in dev
        }),
      });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        const msg = data?.message ?? `Request failed (${r.status})`;
        setErrorMsg(msg);
        return;
      }

      setResult(data);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{UI.title}</h1>
        <p className="text-sm opacity-70">
          Lang: <span className="font-mono">{lang}</span> — POST /api/decide
        </p>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.label}
              type="button"
              className="rounded-full border px-3 py-1 text-xs opacity-90 hover:opacity-100"
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
          {loading ? UI.loading : UI.button}

          </button>

          <button
            className="rounded-xl border px-4 py-2 text-sm opacity-80 disabled:opacity-50"
            onClick={() => {
              setQuery("");
              setErrorMsg(null);
              setResult(null);
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        {errorMsg ? (
          <div className="mt-4 rounded-xl border p-3 text-sm">
            <div className="font-semibold">Error</div>
            <div className="mt-1 font-mono whitespace-pre-wrap">{errorMsg}</div>
          </div>
        ) : null}

        {result ? (
          <div className="mt-4 rounded-xl border p-3">
            <div className="mb-2 text-sm font-semibold">Response JSON</div>
            <pre className="overflow-auto rounded-lg bg-black/5 p-3 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </main>
  );
}
