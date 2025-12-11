"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/lang";

const LANGUAGE_INFO: Record<Locale, { label: string; flag: string }> = {
  it: { label: "Italiano", flag: "🇮🇹" },
  en: { label: "English", flag: "🇬🇧" },
  fr: { label: "Français", flag: "🇫🇷" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  es: { label: "Español", flag: "🇪🇸" },
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const prefixedLangs: Locale[] = ["en", "fr", "de", "es"];

  const getCurrentLang = (): Locale => {
    const segments = pathname.split("/"); // es: ["", "en", "pro"]
    const maybe = segments[1];
    return prefixedLangs.includes(maybe as Locale) ? (maybe as Locale) : "it";
  };

  const currentLang = getCurrentLang();

  const changeLang = (nextLang: Locale) => {
    if (nextLang === currentLang) return;

    const segments = pathname.split("/");

    if (nextLang === "it") {
      // Da /en/... /fr/... /de/... /es/... -> /...
      if (prefixedLangs.includes(segments[1] as Locale)) {
        const withoutLang = ["", ...segments.slice(2)];
        const path = withoutLang.join("/");
        router.push(path === "" ? "/" : path);
      } else {
        router.push("/");
      }
    } else {
      // Destinazione: /en /fr /de /es
      if (!prefixedLangs.includes(segments[1] as Locale)) {
        // Eravamo in IT (nessun prefisso): aggiungi /xx davanti
        const base = pathname === "/" ? "" : pathname;
        router.push(`/${nextLang}${base}`);
      } else {
        // Cambio tra lingue prefissate: /en/... -> /fr/...
        segments[1] = nextLang;
        const path = segments.join("/");
        router.push(path === "" ? "/" : path);
      }
    }
  };

  return (
    <div className="flex gap-2">
      {locales.map((l) => {
        const info = LANGUAGE_INFO[l];
        const isActive = l === currentLang;

        return (
          <button
            key={l}
            type="button"
            onClick={() => changeLang(l)}
            className={
              "flex items-center gap-1 text-xs px-3 py-1 border rounded-full " +
              (isActive ? "bg-gray-200 font-semibold" : "bg-white")
            }
          >
            <span>{info.flag}</span>
            <span>{info.label}</span>
          </button>
        );
      })}
    </div>
  );
}

