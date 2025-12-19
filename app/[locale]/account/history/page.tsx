// app/[locale]/account/history/page.tsx
import { SearchHistoryTable } from "./SearchHistoryTable";
import { getDashboardCopy } from "@/lib/i18n/dashboard";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDashboardCopy(locale);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">{t.history}</h1>
        <p className="text-sm text-slate-400">{t.historyTitle}</p>
      </header>

      <SearchHistoryTable locale={locale} />
    </div>
  );
}
