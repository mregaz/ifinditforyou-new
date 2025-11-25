export default function HomePage() {
  const [lang, setLang] = useState<Lang>("it");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(2);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const t = UI_TEXTS[lang];

  // Carica stato iniziale da localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ifiy_lang") as Lang | null;
      if (savedLang && UI_TEXTS[savedLang]) {
        setLang(savedLang);
      }

      const savedCredits = localStorage.getItem("ifiy_credits");
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits, 10));
      }

      const savedPro = localStorage.getItem("ifiy_isPro");
      if (savedPro === "true") {
        setIsPro(true);
      }

      const savedEmail = localStorage.getItem("ifiy_email");
      if (savedEmail) {
        setUserEmail(savedEmail);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sincronizza lo stato PRO con Supabase (se l'utente è loggato)
  useEffect(() => {
    async function syncProFromSupabase() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Errore lettura user Supabase:", userError);
          return;
        }

        if (!user) {
          // Utente anonimo → resta Free
          return;
        }

        const { data, error } = await supabase
          .from("User")
          .select("is_pro, email")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Errore lettura is_pro da Supabase:", error);
          return;
        }

        if (data?.is_pro) {
          setIsPro(true);

          if (user.email) {
            setUserEmail(user.email);
          }

          // Per i PRO i crediti non contano, ma teniamo un valore coerente
          setCredits(2);
        }
      } catch (err) {
        console.error("Errore generale syncProFromSupabase:", err);
      }
    }

    syncProFromSupabase();
  }, []);

  // Salva stato su localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ifiy_credits", String(credits));
      localStorage.setItem("ifiy_isPro", isPro ? "true" : "false");
      localStorage.setItem("ifiy_lang", lang);
      if (userEmail) {
        localStorage.setItem("ifiy_email", userEmail);
      }
    } catch {
      // ignore
    }
  }, [credits, isPro, lang, userEmail]);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (!isPro) {
      if (credits <= 0) {
        alert(t.outOfCredits);
        return;
      }
      if (credits === 1 && !userEmail) {
        setShowEmailGate(true);
        return;
      }
    }

    setLoading(true);
    setResults([]);
    setSummary("");

    const plan = isPro ? "pro" : "free";

    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, lang, plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(t.errorSearch);
        return;
      }

      setResults(Array.isArray(data.items) ? data.items : []);
      setSummary(typeof data.summary === "string" ? data.summary : "");

      if (!isPro) {
        setCredits((c) => (c > 0 ? c - 1 : 0));
      }
    } catch (err) {
      console.error(err);
      alert(t.errorNetwork);
    } finally {
      setLoading(false);
    }
  }

  const handleEmailCollected = async (email: string) => {
    setUserEmail(email);
    setShowEmailGate(false);

    try {
      await fetch("/api/collect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error("Errore nel salvataggio email:", error);
    }

    await handleSearch();
  };

  function handleGoPro() {
    window.location.href = `/pro?lang=${lang}`;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          borderBottom: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>
            iFindItForYou
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 14,
            }}
          >
            <span
              style={{
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.5)",
                background: isPro ? "#0f172a" : "#f8fafc",
                color: isPro ? "#f9fafb" : "#0f172a",
                fontWeight: 500,
              }}
            >
              {isPro ? "PRO" : "Free"}
            </span>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.7)",
                padding: "4px 10px",
                background: "#ffffff",
              }}
            >
              <option value="it">🇮🇹 Italiano</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>
      </header>

      {/* HERO + SEARCH */}
      <section
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 44px)",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            iFindItForYou
          </h1>
          <p
            style={{
              fontSize: 16,
              opacity: 0.7,
              marginBottom: 24,
            }}
          >
            {t.tagline}
          </p>

          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                maxWidth: 640,
                gap: 8,
              }}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
                style={{
                  flex: 1,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.8)",
                  padding: "12px 18px",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  borderRadius: 999,
                  border: "none",
                  padding: "0 22px",
                  fontWeight: 600,
                  fontSize: 15,
                  background: "#0f172a",
                  color: "#f9fafb",
                  cursor: loading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "..." : t.search}
              </button>
            </div>
          </form>

          {isPro ? (
            // Banner ben visibile per gli utenti PRO
            <div
              style={{
                marginTop: 12,
                padding: "10px 16px",
                borderRadius: 12,
                background: "#16a34a",
                color: "#f9fafb",
                fontWeight: 700,
                fontSize: 15,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(248,250,252,0.9)",
                  fontSize: 12,
                }}
              >
                PRO
              </span>
              <span>{t.creditsLabel(credits, true)}</span>
            </div>
          ) : (
            // Stato Free: testo crediti + bottone "Diventa PRO"
            <>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                  marginBottom: 8,
                }}
              >
                {t.creditsLabel(credits, false)}
              </div>

              <button
                type="button"
                onClick={handleGoPro}
                style={{
                  marginTop: 4,
                  borderRadius: 999,
                  border: "1px solid rgba(79,70,229,0.8)",
                  padding: "8px 18px",
                  fontSize: 14,
                  background: "#eef2ff",
                  color: "#312e81",
                  cursor: "pointer",
                }}
              >
                {t.proCta}
              </button>
            </>
          )}
        </div>
      </section>

      {/* RISULTATI + SEZIONI INFO */}
      <section
        style={{
          borderTop: "1px solid rgba(148,163,184,0.25)",
          background: "#f8fafc",
          padding: "24px 16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.5fr)",
            gap: 24,
          }}
        >
          {/* Colonna risultati */}
          <div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              {t.resultsTitle}
            </h2>

            {results.length > 0 && (
              <p
                style={{
                  fontSize: 13,
                  opacity: 0.8,
                  marginBottom: 8,
                }}
              >
                {t.resultsCount(results.length)}
              </p>
            )}

            {results.length === 0 && !summary && (
              <p style={{ fontSize: 14, opacity: 0.7 }}>{t.empty}</p>
            )}

            {summary && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#e5e7eb",
                  fontSize: 14,
                }}
              >
                {summary}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {results.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    borderRadius: 12,
                    padding: "10px 12px",
                    background: "#ffffff",
                    border: "1px solid rgba(148,163,184,0.4)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    {item.title ?? "Senza titolo"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  >
                    {item.source && <span>{item.source}</span>}
                    {item.price && (
                      <span>
                        {" "}
                        • <strong>{item.price}</strong>
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Colonna testo marketing */}
          <div
            style={{
              fontSize: 13,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <InfoBlock title={t.sectionHowTitle} text={t.sectionHowText} />
            <InfoBlock title={t.sectionWhyTitle} text={t.sectionWhyText} />
            <InfoBlock
              title={t.sectionProTitle}
              text={`${t.sectionProFree} ${t.sectionProPaid}`}
            />
            <InfoBlock title={t.sectionFaqTitle} text={t.sectionFaqText} />
          </div>
        </div>
      </section>

      {/* Modale email-gate */}
      <EmailGateModal
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onConfirm={handleEmailCollected}
      />
    </main>
  );
}


function EmailGateModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();

    if (!trimmed || !trimmed.includes("@")) {
      setError("Per favore inserisci un'email valida.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(trimmed);
    } catch (err) {
      console.error(err);
      setError("C'è stato un problema, riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: 8 }}>Sblocca la seconda ricerca gratuita</h2>
        <p style={{ marginBottom: 16, fontSize: 14, opacity: 0.9 }}>
          Ti chiediamo solo la tua email per concederti la seconda ricerca
          gratuita.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="la-tua-email@esempio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 10,
            }}
          />

          {error && (
            <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
              {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 8,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? "Invio..." : "Sblocca ricerca"}
            </button>
          </div>
        </form>

        <p style={{ marginTop: 10, fontSize: 11, opacity: 0.7 }}>
          Niente spam, solo aggiornamenti importanti su iFindItForYou.
        </p>
      </div>
    </div>
  );
}
