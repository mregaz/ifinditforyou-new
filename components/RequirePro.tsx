"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type RequireProProps = {
  children: React.ReactNode;
};

export function RequirePro({ children }: RequireProProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    const checkProStatus = async () => {
      // 1) Controllo se l'utente è loggato
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        // Non loggato → mando alla login, con redirect di ritorno alla pagina PRO
        router.replace("/login?redirectTo=/pro");
        return;
      }

      // 2) Leggo il flag is_pro dalla tabella User
      const { data, error: profileError } = await supabase
        .from("User")
        .select("is_pro")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Errore caricando User.is_pro:", profileError);
        // In caso di errore, lo mando alla pagina /pro (free) o a una pagina di errore
        router.replace("/pro"); // oppure "/pricing"
        return;
      }

      if (!data?.is_pro) {
        // Utente non PRO → lo rimando alla pagina dove può fare l'upgrade
        router.replace("/pro"); // oppure "/pricing"
        return;
      }

      // Se arriviamo qui → utente PRO
      setStatus("allowed");
    };

    checkProStatus();
  }, [router]);

  if (status === "checking") {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Verifica del tuo abbonamento PRO in corso...
        </p>
      </div>
    );
  }

  // Utente PRO → mostro il contenuto
  return <>{children}</>;
}
