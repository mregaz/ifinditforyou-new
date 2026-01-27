"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { REGISTER_COPY } from "@/lib/ui-copy";
import { toLocale } from "@/lib/lang";


export default function RegisterPageClient() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = toLocale(params?.locale);

  const t = REGISTER_COPY[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Post-signup: manda al login localizzato
    router.replace(`/${locale}/login`);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-slate-900 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold">{t.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            {t.email}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            {t.password}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
          >
            {loading ? t.loading : t.cta}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          {t.haveAccount}{" "}
          <Link href={`/${locale}/login`} className="text-emerald-600 underline">
            {t.login}
          </Link>
        </p>
      </div>
    </main>
  );
}
