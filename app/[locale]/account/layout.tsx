// app/[locale]/account/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

type AccountLayoutProps = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export default async function AccountLayout(props: any) {
  // cast interno: fuori teniamo any così TS non rompe
  const { children, params } = props as AccountLayoutProps;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // usiamo locale solo per evitare warning "unused"
  void params.locale;

  return <>{children}</>;
}
