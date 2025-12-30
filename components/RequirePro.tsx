"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type RequireProProps = {
  children: React.ReactNode;
};

function getLocaleFromPathname(pathname: string | null) {
  if (!pathname) return null;
  const seg = pathname.split("/").filter(Boolean)[0]; // "fr" da "/fr/account/overview"
  // se vuoi essere più stretto, limita ai tuoi locali: it/en/fr/de/es
  if (!seg) return null;
  return seg;
}

export function RequirePro({ children }: RequireProProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    let cancelled = false;

    const locale = getLocaleFromPathname(pathname);
    const loginPath = locale ? `/${locale}/login` : `/login`;
    const proPath = locale ? `/${locale}/pro` : `/pro`;
    const redirectTo = pathname || proPath;

    async function check() {
      try {
        const res = await fetch("/api/subscription-status", {
          method: "GET",
          cache: "no-store",
        });

        if (res.status === 401) {
          router.replace(`${loginPath}?redirectTo=${encodeURIComponent(redirectTo)}`);
          return;
        }

        if (!res.ok) {
          router.replace(proPath);
          return;
        }

        const data = (await res.json()) as { isPro?: boolean };

        if (!data?.isPro) {
          router.replace(proPath);
          return;
        }

        if (!cancelled) setStatus("allowed");
      } catch {
        router.replace(proPath);
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (status === "checking") {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Verifica del tuo abbonamento PRO in corso...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}


