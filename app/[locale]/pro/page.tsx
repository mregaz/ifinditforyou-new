import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProPage({
  params,
}: {
  params: { locale: string };
}) {
  const supabase = await createClient(); // FIX: await

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${params.locale}/login`);
  }

  const { data: userRow, error } = await supabase
    .from("User")
    .select(
      "is_pro, stripe_status, cancel_at_period_end, stripe_current_period_end"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Pro page DB error:", error);
  }

  const isPro = !!userRow?.is_pro;

  // UI server-rendered semplice + script inline per chiamare le API
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Piano PRO
          </h1>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            Sblocca ricerche illimitate e supporto prioritario.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/40">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-300">Stato attuale</p>
            <p className="text-lg font-semibold">
              {isPro ? "PRO attivo" : "FREE"}
            </p>

            {userRow?.stripe_status && (
              <p className="text-sm text-slate-300">
                Stripe status:{" "}
                <span className="text-slate-50">{userRow.stripe_status}</span>
              </p>
            )}

            {userRow?.stripe_current_period_end && (
              <p className="text-sm text-slate-300">
                Fine periodo:{" "}
                <span className="text-slate-50">
                  {new Date(userRow.stripe_current_period_end).toLocaleString()}
                </span>
              </p>
            )}

            {userRow?.cancel_at_period_end && (
              <p className="text-sm text-amber-300">
                Cancellazione programmata a fine periodo.
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {!isPro ? (
              <>
                <button
                  id="btn-pro-monthly"
                  className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Attiva PRO (Mensile)
                </button>
                <button
                  id="btn-pro-yearly"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3 font-semibold text-slate-50 hover:bg-slate-900/60"
                >
                  Attiva PRO (Annuale)
                </button>
              </>
            ) : (
              <>
                <button
                  id="btn-manage"
                  className="rounded-xl bg-slate-50 px-4 py-3 font-semibold text-slate-950 hover:bg-slate-200"
                >
                  Gestisci abbonamento
                </button>
                <a
                  href={`/${params.locale}`}
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-center font-semibold text-slate-50 hover:bg-slate-900/60"
                >
                  Torna alla home
                </a>
              </>
            )}
          </div>

          {!isPro && (
            <p className="mt-4 text-xs text-slate-400">
              Pagamento gestito da Stripe. Puoi cancellare in qualsiasi momento.
            </p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">
            Cosa include il PRO
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300 md:text-base">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Ricerche illimitate ogni mese</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Risposte prioritarie rispetto al piano Free</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Supporto dedicato via email</span>
            </li>
          </ul>
        </section>

        {/* Script inline per chiamare le API */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.style.opacity = loading ? "0.7" : "1";
  }

  async function startCheckout(billingPeriod) {
    const monthlyBtn = document.getElementById("btn-pro-monthly");
    const yearlyBtn = document.getElementById("btn-pro-yearly");
    setLoading(monthlyBtn, true);
    setLoading(yearlyBtn, true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod: billingPeriod, lang: "${params.locale}" })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Errore nella creazione della sessione di pagamento");

      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("URL checkout mancante");
    } catch (e) {
      alert(e.message || "Errore imprevisto");
    } finally {
      setLoading(monthlyBtn, false);
      setLoading(yearlyBtn, false);
    }
  }

  async function openPortal() {
    const btn = document.getElementById("btn-manage");
    setLoading(btn, true);

    try {
      // Nota: questo endpoint deve esistere nel tuo progetto
      const res = await fetch("/api/create-customer-portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Errore apertura portale");
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("URL portale mancante");
    } catch (e) {
      alert(e.message || "Errore imprevisto");
    } finally {
      setLoading(btn, false);
    }
  }

  const monthlyBtn = document.getElementById("btn-pro-monthly");
  const yearlyBtn = document.getElementById("btn-pro-yearly");
  const manageBtn = document.getElementById("btn-manage");

  if (monthlyBtn) monthlyBtn.addEventListener("click", function () { startCheckout("monthly"); });
  if (yearlyBtn) yearlyBtn.addEventListener("click", function () { startCheckout("yearly"); });
  if (manageBtn) manageBtn.addEventListener("click", function () { openPortal(); });
})();
            `,
          }}
        />
      </main>
    </div>
  );
}
