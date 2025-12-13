import ProPageClient from "./ProPageClient";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type ProPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ProPage({ params }: ProPageProps) {
  const { locale } = await params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPro = false;

  if (user) {
    const { data: userRow } = await supabase
      .from("User")
      .select("is_pro")
      .eq("id", user.id)
      .maybeSingle();

    isPro = !!userRow?.is_pro;
  }

  return (
    <ProPageClient
      locale={locale}
      isLoggedIn={!!user}
      isPro={isPro}
    />
  );
}
