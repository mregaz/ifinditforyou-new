// app/[locale]/account/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AccountLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default async function AccountLayout(props: any) {
  const { children, params } = props as AccountLayoutProps;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${params.locale}/login`);

  return <>{children}</>;
}
