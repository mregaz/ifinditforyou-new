// app/[locale]/account/settings/LanguagePreferenceForm.tsx
"use client";

import { useMemo, useState } from "react";

type DashboardCopy = ReturnType<
  typeof import("@/lib/i18n/dashboard").getDashboardCopy
>;

type Props = {
  locale: string;
  initialPreferredLanguage: string | null;
  copy: DashboardCopy;
};

const OPTIONS = [
  {
    value: "auto",
    labelByLocale: {
      it: "Automatica (browser)",
      en: "Automatic (browser)",
      fr: "Automatique (navigateur)",
      de: "Automatisch (Browser)",
      es: "Automático (navegador)",
    },
  },
  { value: "it", labelByLocale: { it: "Italiano", en: "Italian", fr: "Italien", de: "Italienisch", es: "Italiano" } },
  { value: "en", labelByLocale: { it: "Inglese", en: "English", fr: "Anglais", de: "Englisch", es: "Inglés" } },
  { value: "fr", labelByLocale: { it: "Francese", en: "French", fr: "Français", de: "Französisch", es: "Francés" } },
  { value: "de", labelByLocale: { it: "Tedesco", en: "German", fr: "Allemand", de: "Deutsch", es: "Alemán" } },
  { value: "es", labelByLocale: { it: "Spagnolo", en: "Spanish", fr: "Espagnol", de: "Spanisch", es: "Español" } },
];

function labelForLocale(opt: (typeof OPTIONS)[number], locale: string) {
  const key = (locale || "en").split("-")[0] as "it" | "en" | "fr" | "de" | "es";
  return opt.labelByLocale[key] ?? opt.labelByLocale.en;
}

export function LanguagePreferenceForm({
  locale,
  initialPreferredLanguage,
  copy,
}: Props) {
  const t = copy;

  const ui = useMemo(() => {
    const l = (locale || "en").split("-")[0];
    switch (l) {
      case "it":
        return { saving: "Salvataggio..." };
      case "fr":
        return { saving: "Enregistrement..." };
      case "de":
        return { saving: "Wird gespeichert..." };
      case "es":
        return { saving: "Guardando..." };
      default:
        return { saving: "Saving..." };
    }
  }, [locale]);

  const [value, setValue] = useState(initialPreferredLanguage ?? "auto");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(newValue: string) {
    setValue(newValue);
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/user/update-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredLanguage: newValue === "auto" ? null : newValue,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-50">{t.languageLabel}</h2>

      <div className="space-y-2">
        <select
          className="w-full max-w-xs rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.value === "auto" ? t.languageAuto : labelForLocale(opt, locale)}
            </option>
          ))}
        </select>

        <div className="text-xs text-slate-400 h-4">
          {saving && ui.saving}
          {!saving && saved && t.languageSaved}
        </div>
      </div>
    </section>
  );
}

