// app/[locale]/account/overview/page.tsx
import PlanCard from "./PlanCard";
import { createClient } from "@/lib/supabase/server";
import { toLocale } from "@/lib/ui-copy";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se per qualche motivo arrivi qui senza utente (dovrebbe già bloccare il layout),
  // mettiamo fallback safe:
  if (!user) {
    return <PlanCard locale={locale} isPro={false} />;
  }

  // Legge is_pro dal tuo DB (tabella "User" come nel tuo Header)
  const { data: profile } = await supabase
    .from("User")
    .select("is_pro")
    .eq("id", user.id)
    .single();

  const isPro = profile?.is_pro ?? false;

  return <PlanCard locale={locale} isPro={isPro} />;
}
