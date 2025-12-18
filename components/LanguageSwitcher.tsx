"use client";

import { usePathname, useRouter } from "next/navigation";

const LOCALES = ["it", "en", "fr", "de", "es"] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(v: string | undefined): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

function setLocaleCookies(locale: Locale) {
  // 1 anno
  const maxAge = 60 * 60 * 24 * 365;

  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${maxAge}; samesite=lax`;
  document.cookie = `ifiy_lang=${locale}; path=/; max-age=${maxAge}; samesite=lax`;

  // compatibilità con ciò che già usavi
  localStorage.setItem("ifiy_lang", locale);
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const current = isLocale(segments[0]) ? segments[0] : "it";

  function go(to: Locale) {
    if (to === current) return;

    setLocaleCookies(to);

    let nextPath = pathname;

    if (isLocale(segments[0])) {
      // sostituisce il primo segmento locale mantenendo il resto del path
      const rest = segments.slice(1).join("/");
      nextPath = `/${to}${rest ? `/${rest}` : ""}`;
    } else {
      // se non c'era locale, lo prefissa
      nextPath = `/${to}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => go(l)}
          className={`rounded px-2 py-1 text-sm ${
            l === current ? "font-semibold underline" : "opacity-80 hover:opacity-100"
          }`}
          type="button"
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
