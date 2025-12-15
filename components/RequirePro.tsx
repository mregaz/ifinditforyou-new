"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type RequireProProps = {
  children: React.ReactNode;
};

export function RequirePro({ children }: RequireProProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    const run = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        const redirectTo = encodeURIComponent(pathname || "/pro");
        router.replace(`/login?redirectTo=${redirectTo}`);
        return;
      }

      const res = await fetch("/api/subscription-status", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!data || data.plan !== "pro") {
        router.replace("/pro");
        return;
      }

      setStatus("allowed");
    };

    run();
  }, [router, pathname]);

  if (status === "checking") {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-gray-500">Verifica del tuo abbonamento PRO in corso...</p>
      </div>
    );
  }

  return <>{children}</>;
}
