"use client";

export function ProCheckoutButtons({ locale }: { locale: string }) {
  async function startCheckout(billingPeriod: "monthly" | "yearly") {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billingPeriod, lang: locale }),
    });

    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        onClick={() => startCheckout("monthly")}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Attiva Mensile
      </button>

      <button
        onClick={() => startCheckout("yearly")}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
      >
        Attiva Annuale
      </button>
    </div>
  );
}
