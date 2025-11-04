// app/en/page.tsx
"use client";

import { useState } from "react";

const UI_TEXTS = {
  en: {
    beta: "Free beta",
    title: "iFindItForYou",
    subtitle: "You tell me what you need, I send you the right link / option by email.",
    placeholder: "What do you want me to find?",
    button: "Find it for me",
    langLabel: "Interface language",
    resultsTitle: "Here are some options:",
    empty: "Type what you need above 👆",
    formTitle: "Want me to send it by email?",
    formSubtitle: "Leave me the details, I’ll reply as soon as I can.",
    emailLabel: "Your email",
    msgLabel: "What should I find?",
    replyLabel: "Reply in",
    submit: "Send me the perfect option",
    ok: "Got it! I’ll email you soon 👍",
    ko: "There was an error. Please try again.",
  },
} as const;

export default function Page() {
  const t = UI_TEXTS.en;

  // search
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [searchError, setSearchError] = useState("");

  // lead form
  const [email, setEmail] = useState("");
  const [leadMsg, setLeadMsg] = useState("");
  const [leadLang, setLeadLang] = useState<"it" | "en" | "fr" | "de">("en");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadOk, setLeadOk] = useState(false);
  const [leadErr, setLeadErr] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearchLoading(true);
    setSearchError("");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&lang=en`);
      if (!res.ok) throw new Error("API not available");
      const data = await res.json();
      setResults(
        Array.isArray(data.results) && data.results.length > 0
          ? data.results
          : [`I didn’t find much about “${q}”. Tell me more in the form below 👇`]
      );
    } catch (err) {
      setSearchError("I can’t call the AI right now, here are 3 ideas:");
      setResults([
        `1) Look for comparison sites about “${q}”`,
        `2) Check marketplaces / directories for “${q}”`,
        `3) If you want me to pick it for you, fill the form below.`,
      ]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    setLeadOk(false);
    setLeadErr(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: leadMsg || query,
          lang: leadLang,
        }),
      });
      if (!res.ok) throw new Error("send fail");
      setLeadOk(true);
      setEmail("");
      setLeadMsg("");
    } catch (err) {
      setLeadErr(true);
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 40,
        padding: "32px 16px 24px",
      }}
    >
      {/* HERO */}
      <div
        style={{
          maxWidth: 1000,
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p style={{ opacity: 0.7, marginBottom: 8 }}>{t.beta}</p>
        <h1
          style={{
            fontSize: "clamp(48px, 6vw, 72px)",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {t.title}
        </h1>
        <p
          style={{
            fontSize: 20,
            opacity: 0.9,
            maxWidth: 700,
            margin: "0 auto 32px",
          }}
        >
          {t.subtitle}
        </p>

        {/* search bar */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t.placeholder}
            style={{
              minWidth: 280,
              width: "50%",
              background: "rgba(255,255,255,0.03)",
              border: "2px solid rgba(148,163,184,0.2)",
              borderRadius: 999,
              padding: "14px 20px",
              color: "white",
              fontSize: 16,
            }}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={{
              background: searchLoading ? "#7c3aed" : "#a855f7",
              border: "none",
              borderRadius: 999,
              padding: "14px 32px",
              fontSize: 16,
              fontWeight: 600,
              cursor: searchLoading ? "not-allowed" : "pointer",
            }}
          >
            {searchLoading ? "Searching…" : t.button}
          </button>
        </div>

        {/* results */}
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>{t.resultsTitle}</h3>
          {searchError && (
            <p style={{ color: "#f97316", marginBottom: 10 }}>{searchError}</p>
          )}
          {results.length === 0 ? (
            <p style={{ opacity: 0.5 }}>{t.empty}</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {results.map((r, i) => (
                <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      borderRadius: 16,
                      padding: "12px 18px",
                      textAlign: "left",
                    }}
                  >
                    {r}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* LEAD FORM */}
      <div
        style={{
          maxWidth: 850,
          width: "100%",
          margin: "0 auto",
          background: "rgba(15,23,42,0.4)",
          border: "1px solid rgba(148,163,184,0.15)",
          borderRadius: 20,
          padding: "24px 22px 20px",
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>{t.formTitle}</h2>
        <p style={{ opacity: 0.6, marginBottom: 18 }}>{t.formSubtitle}</p>

        <form
          onSubmit={handleLead}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              {t.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "white",
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              {t.msgLabel}
            </label>
            <textarea
              rows={4}
              value={leadMsg}
              onChange={(e) => setLeadMsg(e.target.value)}
              placeholder="e.g. Best tool for…, Flights to…, Alternatives to…"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "white",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              {t.replyLabel}
            </label>
            <select
              value={leadLang}
              onChange={(e) => setLeadLang(e.target.value as any)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 10,
                padding: "8px 10px",
                color: "white",
              }}
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={leadLoading}
            style={{
              background: leadLoading ? "#7c3aed" : "#a855f7",
              border: "none",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 15,
              fontWeight: 600,
              cursor: leadLoading ? "not-allowed" : "pointer",
            }}
          >
            {leadLoading ? "Sending…" : t.submit}
          </button>

          {leadOk && <p style={{ color: "#22c55e" }}>{t.ok}</p>}
          {leadErr && <p style={{ color: "#f97316" }}>{t.ko}</p>}
        </form>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          fontSize: 14,
          opacity: 0.7,
        }}
      >
        <p>© 2025 iFindItForYou</p>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/privacy" style={{ color: "white" }}>
            Privacy
          </a>
          <a href="/terms" style={{ color: "white" }}>
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}

        
