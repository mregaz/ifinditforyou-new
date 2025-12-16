"use client";

import { useState } from "react";

type DashboardCopy = Awaited<ReturnType<any>>; // fallback typing semplice

type Props = {
  locale: string;
  initialPreferredLanguage: string | null;
  copy: any; // usiamo any per evitare altri errori TS adesso
};

const OPTIONS = [
  {
    value: "auto",
    labelByLocale: {
      it: "Automatica (browser)",
      en: "Automatic",
      fr: "Automatique",
      de: "Automatisch",
      es: "Automático",
    },
  },
  {
    value: "it",
    labelByLocale: {
      it: "Italiano",
      en: "Italian",
      fr: "Italien",
      de: "Italienisch",
      es: "Italiano",
    },
  },
  {
    value: "en",
    labelByLocale: {
      it: "Inglese",
      en: "English",
      fr: "Anglais",
      de: "Englisch",
      es: "Inglés",
    },
  },
  {
    value: "fr",
    labelByLocale: {
      it: "Francese",
      en: "French",
      fr: "Français",
      de: "Französisch",
      es: "Francés",
    },
  },
  {
    value: "de",
    labelByLocale: {
      it: "Tedesco",
      en: "German",
      fr: "Allemand",
      de: "Deutsch",
      es: "Alemán",
    },
  },
  {
    value: "es",
    labelByLocale: {
      it: "Spagnolo",
      en: "Spanish",
      fr: "Espagnol",
      de: "Spanisch",
      es: "Español",
    },
  },
];

function getLabel(opt: (typeof OPTIONS)[number], locale: string) {
  const key = locale.split("-")[0] as "it" | "en" | "fr" | "de" | "es";
  return opt.labelByLocale[key] ?? opt.labelByLocale.en;
}

export function LanguagePreferenceForm({
  locale,
  initialPreferredLanguage,
  copy,
}: Props) {
  const t = copy;
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
    <section className="border border-slate-200 rounded-xl p-6 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">{t.languageLabel}</h2>

      <div className="space-y-2">
        <select
          className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.value === "auto" ? t.languageAuto : getLabel(opt, locale)}
            </option>
          ))}
        </select>

        <div className="text-xs text-slate-500 h-4">
          {saving && "Saving..."}
          {saved && t.languageSaved}
        </div>
      </div>
    </section>
  );
}

