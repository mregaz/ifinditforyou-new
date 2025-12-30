"use client";

type Props = { locale: string };

export default function ProCheckoutButtons({ locale }: Props) {
  async function startCheckout(billingPeriod: "monthly" | "yearly") {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billingPeriod, lang: locale }),
    });

    // Se non sei loggato, manda al login e ritorna qui
    if (res.status === 401) {
      window.location.href = `/login?redirectTo=${encodeURIComponent(`/${locale}/pro`)}`;
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("create-checkout-session error:", res.status, data);
      alert(data?.error || "Errore checkout");
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Checkout URL mancante");
    }
  }

  return (
    <div className="flex gap-3">
      <button
        className="rounded-md bg-emerald-600 px-4 py-2 text-white"
        onClick={() => startCheckout("monthly")}
      >
        Mensile
      </button>

      <button
        className="rounded-md bg-emerald-600 px-4 py-2 text-white"
        onClick={() => startCheckout("yearly")}
      >
        Annuale
      </button>
    </div>
  );
}
