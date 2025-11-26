"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Lang } from "@/lib/lang";

type UserState = {
  email: string | null;
  isPro: boolean;
  loading: boolean;
};

const LABELS: Record<
  Lang,
  { loading: string; login: string; register: string; account: string; logout: string }
> = {
  it: {
    loading: "Caricamento...",
    login: "Login",
    register: "Registrati",
    account: "Account",
    logout: "Logout",
  },
  fr: {
    loading: "Chargement...",
    login: "Connexion",
    register: "Créer un compte",
    account: "Compte",
    logout: "Se déconnecter",
  },
  en: {
    loading: "Loading...",
    login: "Login",
    register: "Sign up",
    account: "Account",
    logout: "Logout",
  },
  de: {
    loading: "Laden...",
    login: "Anmelden",
    register: "Registrieren",
    account: "Konto",
    logout: "Abmelden",
  },
};

export default function Header() {
  const [user, setUser] = useState<UserState>({
    email: null,
    isPro: false,
    loading: true,
  });

  // lingua di default
  const [lang, setLang] = useState<Lang>("it");

  // Legge la lingua salvata dalla Home (ifiy_lang)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("ifiy_lang") as Lang | null;
    if (stored && (["it", "fr", "en", "de"] as Lang[]).includes(stored)) {
      setLang(stored);
    }
  }, []);

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
    window.location.href = "/login";
  };

  const t = LABELS[lang];

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="text-xl font-semibold">
          IFindItForYou
        </Link>

        {user.loading ? (
          <span className="text-gray-500 text-sm">{t.loading}</span>
        ) : user.email ? (
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-700">{user.email}</span>

            <span
              className={`text-xs px-2 py-1 rounded ${
                user.isPro
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {user.isPro ? "PRO" : "FREE"}
            </span>

            <Link
              href="/account"
              className="text-sm underline text-blue-600 hover:text-blue-800"
            >
              {t.account}
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-red-600 underline hover:text-red-800"
            >
              {t.logout}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm underline text-blue-600 hover:text-blue-800"
            >
              {t.login}
            </Link>
            <Link
              href="/register"
              className="text-sm underline text-blue-600 hover:text-blue-800"
            >
              {t.register}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

