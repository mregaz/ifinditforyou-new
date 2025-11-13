// app/pro/page.tsx
import ProPageClient from "./ProPageClient";

export const metadata = {
  title: "IFindItForYou PRO – Ricerche illimitate e risultati migliori",
  description:
    "Passa a IFindItForYou PRO per avere ricerche illimitate, risultati più completi e priorità nelle richieste.",
};

export default function ProPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <ProPageClient />
      </div>
    </main>
  );
}

