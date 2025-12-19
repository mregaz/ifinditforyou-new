// app/[locale]/account/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardCopy } from "@/lib/i18n/dashboard";

export default async function AccountLayout({
  children,
  params,
}: {
  children: ReactNode;
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

  const t = getDashboardCopy(locale);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <nav className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-2">
          <Link
            href={`/${locale}/account/overview`}
            className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
          >
            {t.overview}
          </Link>

          <Link
            href={`/${locale}/account/history`}
            className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
          >
            {t.history}
          </Link>

          <Link
            href={`/${locale}/account/settings`}
            className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
          >
            {t.settings}
          </Link>
        </nav>

        {children}
      </div>
    </div>
  );
}

