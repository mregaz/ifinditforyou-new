// app/[locale]/account/overview/page.tsx
import PlanCard from "./PlanCard";
import { createClient } from "@/lib/supabase/server";
import { toLocale } from "@/lib/lang";


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

  if (!user) {
    return <PlanCard locale={locale} isPro={false} />;
  }

  const { data: profile } = await supabase
    .from("User")
    .select("is_pro")
    .eq("id", user.id)
    .maybeSingle();

  const isPro = profile?.is_pro ?? false;

  return <PlanCard locale={locale} isPro={isPro} />;
}
