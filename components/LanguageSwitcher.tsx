"use client";

export default function LanguageSwitcher() {
  const setLanguage = (lang: "it" | "fr" | "en" | "de") => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ifind_lang", lang);
    window.location.reload(); // ricarica la pagina con la nuova lingua
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage("it")}
        className="text-xs px-2 py-1 border rounded"
      >
        IT
      </button>
      <button
        onClick={() => setLanguage("fr")}
        className="text-xs px-2 py-1 border rounded"
      >
        FR
      </button>
      <button
        onClick={() => setLanguage("en")}
        className="text-xs px-2 py-1 border rounded"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("de")}
        className="text-xs px-2 py-1 border rounded"
      >
        DE
      </button>
    </div>
  );
}
