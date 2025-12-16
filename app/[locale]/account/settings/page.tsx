import { createClient } from "@/lib/supabase/server";
import { getDashboardCopy } from "@/lib/i18n/dashboard";
import { redirect } from "next/navigation";
import { LanguagePreferenceForm } from "./LanguagePreferenceForm";
import { DeleteAccountPanel } from "./DeleteAccountPanel";

export default async function SettingsPage({
  params,
}: {
  params: { locale: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${params.locale}/login`);
  }

  // Leggo la preferenza lingua dal tuo DB (tabella "User")
  const { data: row } = await supabase
    .from("User")
    .select("preferred_language")
    .eq("id", user.id)
    .single();

  const initialPreferredLanguage =
    (row?.preferred_language as string | null) ?? null;

  // Copia dashboard (server-side)
  const copy = await getDashboardCopy(params.locale);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 space-y-8">
      <LanguagePreferenceForm
        locale={params.locale}
        initialPreferredLanguage={initialPreferredLanguage}
        copy={copy}
      />

      <DeleteAccountPanel locale={params.locale} />

    </main>
  );
}
