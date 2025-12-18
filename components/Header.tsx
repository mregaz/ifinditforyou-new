"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Lang } from "@/lib/lang";

type UserState = {
  email: string | null;
  isPro: boolean;
  loading: boolean;
};

type HeaderLabels = {
  loading: string;
  login: string;
  register: string;
  account: string;
  logout: string;
};

const LABELS: Record<Lang, HeaderLabels> = {
  it: { loading: "Caricamento...", login: "Login", register: "Registrati", account: "Account", logout: "Logout" },
  fr: { loading: "Chargement...", login: "Connexion", register: "Créer un compte", account: "Compte", logout: "Se déconnecter" },
  en: { loading: "Loading...", login: "Login", register: "Sign up", account: "Account", logout: "Logout" },
  de: { loading: "Laden...", login: "Login", register: "Registrieren", account: "Konto", logout: "Logout" },
  es: { loading: "Cargando...", login: "Iniciar sesión", register: "Crear cuenta", account: "Cuenta", logout: "Cerrar sesión" },
};

const SUPPORTED: Lang[] = ["it", "fr", "en", "de", "es"];
const DEFAULT_LANG: Lang = "it";

function localePath(locale: string, path: string) {
  const cleanLocale = (locale || "").replace(/^\/+|\/+$/g, "");
  const cleanPath = (path || "").startsWith("/") ? path : `/${path}`;
  return `/${cleanLocale}${cleanPath}`.replace(/\/{2,}/g, "/");
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserState>({ email: null, isPro: false, loading: true });

  // 1) locale dall'URL (prima scelta)
  // 2) fallback da localStorage (ifiy_lang)
  // 3) default
  const locale = useMemo<Lang>(() => {
    const firstSeg = pathname?.split("/").filter(Boolean)[0] as Lang | undefined;
    if (firstSeg && SUPPORTED.includes(firstSeg)) return firstSeg;

    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("ifiy_lang") as Lang | null;
      if (stored && SUPPORTED.includes(stored)) return stored;
    }

    return DEFAULT_LANG;
  }, [pathname]);

  const t = LABELS[locale];

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser({ email: null, isPro: false, loading: false });
        return;
      }

      const { data: profile } = await supabase
        .from("User")
        .select("is_pro")
        .eq("id", user.id)
        .single();

      setUser({
        email: user.email ?? null,
        isPro: profile?.is_pro ?? false,
        loading: false,
      });
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace(localePath(locale, "/login"));
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
        <Link href={localePath(locale, "/")} className="text-xl font-semibold">
          IFindItForYou
        </Link>

        {user.loading ? (
          <span className="text-gray-500 text-sm">{t.loading}</span>
        ) : user.email ? (
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-700">{user.email}</span>

            <span
              className={`text-xs px-2 py-1 rounded ${
                user.isPro ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"
              }`}
            >
              {user.isPro ? "PRO" : "FREE"}
            </span>

            <Link href={localePath(locale, "/account")} className="text-sm underline text-blue-600 hover:text-blue-800">
              {t.account}
            </Link>

            <button onClick={handleLogout} className="text-sm text-red-600 underline hover:text-red-800">
              {t.logout}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link href={localePath(locale, "/login")} className="text-sm underline text-blue-600 hover:text-blue-800">
              {t.login}
            </Link>
            <Link href={localePath(locale, "/register")} className="text-sm underline text-blue-600 hover:text-blue-800">
              {t.register}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}


