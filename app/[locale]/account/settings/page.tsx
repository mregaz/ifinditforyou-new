// app/[locale]/account/settings/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { getDashboardCopy } from "@/lib/i18n/dashboard";
import { LanguagePreferenceForm } from "./LanguagePreferenceForm";
import { DeleteAccountPanel } from "./DeleteAccountPanel";

type Props = { params: { locale: string } };

export default async function SettingsPage({ params }: Props) {
  const t = getDashboardCopy(params.locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${params.locale}/login`);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">{t.settings}</h1>
        <p className="text-sm text-slate-500">{t.settingsTitle}</p>
      </header>

      <div className="space-y-6">
        <LanguagePreferenceForm
          locale={params.locale}
          initialPreferredLanguage={null} // TODO: caricare da DB se serve
        />
        <DeleteAccountPanel locale={params.locale} />
      </div>
    </div>
  );
}
