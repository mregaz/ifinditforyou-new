"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function RegisterPageClient() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "it";

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

    // Se hai email confirmation attiva, potresti voler mostrare una pagina "controlla email".
    // Per ora: manda al login (localizzato).
    router.replace(`/${locale}/login`);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-slate-900 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Crea un account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            Password
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
            {loading ? "Creazione in corso..." : "Registrati"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          Hai già un account?{" "}
          <Link href={`/${locale}/login`} className="text-emerald-600 underline">
            Accedi
          </Link>
        </p>
      </div>
    </main>
  );
}
