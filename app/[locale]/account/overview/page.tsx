import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountOverviewPage({
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
      "email, name, is_pro, stripe_status, stripe_current_period_end, cancel_at_period_end"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Account overview DB error:", error);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Account
      </h1>

      <div className="mt-8 space-y-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <p className="text-sm text-slate-300">Email</p>
          <p className="mt-1 text-slate-50">{userRow?.email ?? user.email}</p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <p className="text-sm text-slate-300">Piano</p>
          <p className="mt-1 font-semibold text-slate-50">
            {userRow?.is_pro ? "PRO" : "FREE"}
          </p>

          {userRow?.stripe_status && (
            <p className="mt-3 text-sm text-slate-300">
              Stato: <span className="text-slate-50">{userRow.stripe_status}</span>
            </p>
          )}

          {userRow?.stripe_current_period_end && (
            <p className="mt-1 text-sm text-slate-300">
              Fine periodo:{" "}
              <span className="text-slate-50">
                {new Date(userRow.stripe_current_period_end).toLocaleString()}
              </span>
            </p>
          )}

          {userRow?.cancel_at_period_end && (
            <p className="mt-1 text-sm text-slate-300">
              Cancellazione a fine periodo:{" "}
              <span className="text-slate-50">Sì</span>
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
