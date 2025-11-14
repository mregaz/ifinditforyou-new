// app/pay/cancel/page.tsx
import Link from "next/link";

export default function PayCancelPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="mb-4 text-2xl font-semibold">Pagamento annullato</h1>
      <p className="mb-6 text-sm text-gray-600">
        Non è stato effettuato alcun addebito. Puoi riprovare quando vuoi.
      </p>
      <Link
        href="/pro"
        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Torna alla pagina PRO
      </Link>
    </main>
  );
}

