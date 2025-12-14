import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();


  const { data, error: authError } = await supabase.auth.getUser();

  // Se l'errore è 400 (nessuna sessione), è il caso normale: redirect /login.
  // Logghiamo solo errori diversi (problemi reali di backend/config).
  if (authError && authError.status !== 400) {
    console.error("AccountPage getUser error:", authError);
  }

  const user = data?.user;

  if (!user) {
    redirect("/login");
  }

  const { data: userRow, error: userError } = await supabase
    .from("User")
    .select("is_pro, preferred_language")
    .eq("id", user.id)
    .maybeSingle();

  if (userError) {
    console.error("AccountPage read User error:", userError);
  }

  return (
    <AccountClient
      user={{
        email: user.email ?? "",
        isPro: !!userRow?.is_pro,
        preferredLanguage: userRow?.preferred_language ?? null,
      }}
    />
  );
}

