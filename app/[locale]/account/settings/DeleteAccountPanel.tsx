// app/[locale]/account/settings/DeleteAccountPanel.tsx
"use client";

import { useState } from "react";
import { getDashboardCopy } from "@/lib/i18n/dashboard";

type Props = { locale: string };

export function DeleteAccountPanel({ locale }: Props) {
  const t = getDashboardCopy(locale);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (confirmText !== t.deleteConfirmText) {
      setError("Testo di conferma non corretto.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) throw new Error("Failed to delete account");
      setDone(true);
      window.location.href = `/${locale}`;
    } catch (e) {
      console.error(e);
      setError("Errore durante la cancellazione.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-red-700">{t.deleteTitle}</h2>
      <p className="text-sm text-red-700 mb-4">{t.deleteWarning}</p>

      <label className="block text-sm mb-2">{t.deleteConfirmLabel}</label>
      <input
        type="text"
        className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm"
        placeholder={t.deletePlaceholder}
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      <div className="mt-4">
        <button
          type="button"
          disabled={loading}
          onClick={handleDelete}
          className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Eliminazione..." : t.deleteButton}
        </button>
      </div>

      {done && <p className="mt-3 text-xs text-slate-600">Account eliminato.</p>}
    </section>
  );
}
