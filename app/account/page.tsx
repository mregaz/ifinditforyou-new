// app/account/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// Se usi @supabase/ssr, puoi sostituire la import con:
// import { createServerClient } from "@supabase/ssr";

import AccountClient from "./AccountClient";

type UserInfo = {
  email: string;
  isPro: boolean;
};

export const dynamic = "force-dynamic"; // per sicurezza con l'auth

export default async function AccountPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Errore getUser in /account:", userError);
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";

  // legge la tabella User (dove hai is_pro)
  const { data: userRow, error: userError2 } = await supabase
    .from("User")
    .select("is_pro")
    .eq("id", user.id)
    .maybeSingle();

  if (userError2) {
    console.error("Errore lettura User in /account:", userError2);
  }

  const userInfo: UserInfo = {
    email,
    isPro: !!userRow?.is_pro,
  };

  // Passiamo i dati "puliti" al client component che gestisce UI/Stripe
  return <AccountClient user={userInfo} />;
}
