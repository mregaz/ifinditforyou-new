import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupportedLocale, type Locale } from "@/lib/lang";
import { createClient } from "@/lib/supabaseServer";
import { ProCheckoutButtons } from "./ProCheckoutButtons";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isSupportedLocale(rawLocale) ? (rawLocale as Locale) : "it";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Stato PRO dal DB (adatta se la tua tabella/colonna differisce)
  const { data: dbUser } = await supabase
    .from("User")
    .select("is_pro")
    .eq("id", user.id)
    .maybeSingle();

  const isPro = Boolean(dbUser?.is_pro);

  return (
    <main className="min-h-screen bg-white text-slate-900 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold">Pro</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Attiva Pro per sbloccare funzionalità avanzate e gestire il tuo abbonamento.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 p-6 shadow-sm">
          {isPro ? (
            <>
              <div className="text-sm font-medium text-emerald-700">
                ✅ Il tuo account è già Pro.
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/account`}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Vai al tuo account
                </Link>

                <Link
                  href={`/${locale}/account/settings`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  Gestisci abbonamento
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-medium">Scegli un piano</div>

              <ProCheckoutButtons locale={locale} />

              <p className="mt-4 text-xs text-slate-500">
                Verrai reindirizzato al checkout Stripe.
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Dopo il pagamento verrai riportato su <code>/{locale}/pay/success</code>.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
