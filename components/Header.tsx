"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type UserState = {
  email: string | null;
  isPro: boolean;
  loading: boolean;
};

export default function Header() {
  const [user, setUser] = useState<UserState>({
    email: null,
    isPro: false,
    loading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      // 1) Recupera utente loggato
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser({ email: null, isPro: false, loading: false });
        return;
      }

      // 2) Recupera flag is_pro dalla tabella User
      const { data: profile } = await supabase
        .from("User")
        .select("is_pro")
        .eq("id", user.id)
        .single();

      setUser({
        email: user.email ?? null,      // ← FIX QUI
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

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="text-xl font-semibold">
          IFindItForYou
        </Link>

        {user.loading ? (
          <span className="text-gray-500 text-sm">Caricamento...</span>
        ) : user.email ? (
          <div className="flex items-center gap-4">
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
              Account
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-red-600 underline hover:text-red-800"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm underline text-blue-600 hover:text-blue-800"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm underline text-blue-600 hover:text-blue-800"
            >
              Registrati
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

