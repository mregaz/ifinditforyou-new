// app/[locale]/account/overview/page.tsx
import { redirect } from "next/navigation";
import { PlanCard } from "./PlanCard";
import { getDashboardCopy } from "@/lib/i18n/dashboard";
import { createClient} from "@/lib/supabaseServer";


type Props = { params: { locale: string } };

export default async function OverviewPage({ params }: Props) {
  const t = getDashboardCopy(params.locale);

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${params.locale}/login`);

  const { data: userRow } = await supabase
    .from("User")
    .select("is_pro")
    .eq("id", user.id)
    .maybeSingle();

  const isPro = !!userRow?.is_pro;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">{t.overview}</h1>
        <p className="text-sm text-slate-500">{t.planTitle}</p>
      </header>

      <PlanCard locale={params.locale} isPro={isPro} />
    </div>
  );
}


