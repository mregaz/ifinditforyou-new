"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "it";

  // ... tuoi state ...

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // ... login ...
    router.push(`/${locale}/account`);
  }

  return (
    // ...
    <p className="mt-4 text-center text-xs text-gray-600">
      Non hai ancora un account?{" "}
      <Link href={`/${locale}/register`} className="text-emerald-600 underline">
        Registrati
      </Link>
    </p>
  );
}
