import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountOverviewPage({
  params,
}: {
  params: { locale: string };
}) {
  const supabase = await createClient(); // <-- FIX: await

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
    // non blocchiamo la pagina, ma mostriamo fallback
    console.error("Account overview DB error:", error);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Account</h1>

      <div className="mt-6 rounded-lg border p-4">
        <p className="text-sm text-gray-500">Email</p>
        <p className="mt-1">{userRow?.email ?? user.email}</p>
      </div>

      <div className="mt-4 rounded-lg border p-4">
        <p className="text-sm text-gray-500">Piano</p>
        <p className="mt-1 font-medium">{userRow?.is_pro ? "PRO" : "FREE"}</p>

        {userRow?.stripe_status && (
          <p className="mt-2 text-sm text-gray-600">
            Stato Stripe: <span className="font-medium">{userRow.stripe_status}</span>
          </p>
        )}

        {userRow?.stripe_current_period_end && (
          <p className="mt-1 text-sm text-gray-600">
            Fine periodo:{" "}
            <span className="font-medium">
              {new Date(userRow.stripe_current_period_end).toLocaleString()}
            </span>
          </p>
        )}

        {userRow?.cancel_at_period_end && (
          <p className="mt-1 text-sm text-gray-600">
            Cancellazione a fine periodo: <span className="font-medium">Sì</span>
          </p>
        )}
      </div>
    </main>
  );
}




