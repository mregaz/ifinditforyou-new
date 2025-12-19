// app/[locale]/account/settings/DeleteAccountPanel.tsx
"use client";

import { useMemo, useState } from "react";
import { getDashboardCopy } from "@/lib/i18n/dashboard";

type Props = { locale: string };

export function DeleteAccountPanel({ locale }: Props) {
  const t = useMemo(() => getDashboardCopy(locale), [locale]);

  const ui = useMemo(() => {
    const l = (locale || "en").split("-")[0];
    switch (l) {
      case "it":
        return {
          confirmWrong: "Testo di conferma non corretto.",
          deleting: "Eliminazione...",
          deleted: "Account eliminato.",
          deleteError: "Errore durante la cancellazione.",
        };
      case "fr":
        return {
          confirmWrong: "Texte de confirmation incorrect.",
          deleting: "Suppression...",
          deleted: "Compte supprimé.",
          deleteError: "Erreur lors de la suppression.",
        };
      case "de":
        return {
          confirmWrong: "Bestätigungstext ist nicht korrekt.",
          deleting: "Wird gelöscht...",
          deleted: "Konto gelöscht.",
          deleteError: "Fehler beim Löschen.",
        };
      case "es":
        return {
          confirmWrong: "Texto de confirmación incorrecto.",
          deleting: "Eliminando...",
          deleted: "Cuenta eliminada.",
          deleteError: "Error al eliminar la cuenta.",
        };
      default:
        return {
          confirmWrong: "Confirmation text is incorrect.",
          deleting: "Deleting...",
          deleted: "Account deleted.",
          deleteError: "Error while deleting the account.",
        };
    }
  }, [locale]);

  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (confirmText !== t.deleteConfirmText) {
      setError(ui.confirmWrong);
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
      setError(ui.deleteError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-red-900/40 bg-slate-900/40 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-red-300">{t.deleteTitle}</h2>
      <p className="text-sm text-red-200/90 mb-4">{t.deleteWarning}</p>

      <label className="block text-sm mb-2 text-slate-200">
        {t.deleteConfirmLabel}
      </label>

      <input
        type="text"
        className="w-full max-w-xs rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500"
        placeholder={t.deletePlaceholder}
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />

      {error && <p className="text-xs text-red-300 mt-2">{error}</p>}

      <div className="mt-4">
        <button
          type="button"
          disabled={loading}
          onClick={handleDelete}
          className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? ui.deleting : t.deleteButton}
        </button>
      </div>

      {done && <p className="mt-3 text-xs text-slate-300">{ui.deleted}</p>}
    </section>
  );
}
