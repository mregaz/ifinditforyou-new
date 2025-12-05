import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AccountClient from "./AccountClient";
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("AccountPage getUser error:", authError);
  }

  // se non loggato → manda a /login
  if (!user) {
    redirect("/login");
  }

  const { data: userRow, error: userError } = await supabase
    .from("User")
    .select("is_pro")
    .eq("id", user.id)
    .maybeSingle();

  if (userError) {
    console.error("AccountPage read User error:", userError);
  }

  const propsUser = {
    email: user.email ?? "",
    isPro: !!userRow?.is_pro,
  };

  return <AccountClient user={propsUser} />;
}
