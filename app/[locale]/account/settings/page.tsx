// app/[locale]/account/settings/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardCopy } from "@/lib/i18n/dashboard";

import { LanguagePreferenceForm } from "./LanguagePreferenceForm";
import { DeleteAccountPanel } from "./DeleteAccountPanel";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: row } = await supabase
    .from("User")
    .select("preferred_language")
    .eq("id", user.id)
    .single();

  const initialPreferredLanguage =
    (row?.preferred_language as string | null) ?? null;

  const copy = getDashboardCopy(locale);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 space-y-8">
      <h1 className="text-2xl font-semibold text-slate-50">{copy.settingsTitle}</h1>

      <LanguagePreferenceForm
        locale={locale}
        initialPreferredLanguage={initialPreferredLanguage}
        copy={copy}
      />

      <DeleteAccountPanel locale={locale} />
    </main>
  );
}
