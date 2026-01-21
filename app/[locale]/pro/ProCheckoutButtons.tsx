"use client";

import { supabase } from "@/lib/supabaseClient";
import { toLocale } from "@/lib/lang";
import { PRO_COPY } from "@/lib/pro-copy";

type Props = { locale: string };

export default function ProCheckoutButtons({ locale }: Props) {
  const safeLang = toLocale(locale);
  const t = PRO_COPY[safeLang];

  async function startCheckout(billingPeriod: "monthly" | "yearly") {
    // 1) Leggiamo la sessione Supabase
    const { data: sessionData, error } = await supabase.auth.getSession();

    const accessToken = sessionData?.session?.access_token;

    // 2) Se non loggato → login
    if (!accessToken || error) {
      window.location.href = `/${safeLang}/login?next=/${safeLang}/pro`;
      return;
    }

    // 3) Chiamiamo il server PASSANDO accessToken
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        billingPeriod,
        lang: safeLang,
        accessToken,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      alert(data?.error ?? "Checkout creation failed");
      return;
    }

    if (!data?.url) {
      alert("Missing checkout url");
      return;
    }

    // 4) Redirect a Stripe Checkout
    window.location.href = data.url;
  }

  return (
    <div className="flex gap-3">
      <button
        className="rounded-md bg-emerald-600 px-4 py-2 text-white"
        onClick={() => startCheckout("monthly")}
      >
        {t.monthly}
      </button>

      <button
        className="rounded-md bg-emerald-600 px-4 py-2 text-white"
        onClick={() => startCheckout("yearly")}
      >
        {t.yearly}
      </button>
    </div>
  );
}
