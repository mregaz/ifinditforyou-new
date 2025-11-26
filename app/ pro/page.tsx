// app/pro/page.tsx
import { RequirePro } from "@/components/RequirePro";

export default function ProPage() {
  return (
    <RequirePro>
      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-4">
          Area PRO di IFindItForYou
        </h1>
        <p className="mb-4">
          Qui puoi utilizzare tutte le funzionalità avanzate riservate agli
          utenti PRO.
        </p>

        {/* Qui sotto metterai le vere feature PRO */}
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-gray-700">
            Contenuto PRO di esempio. Sostituisci questo blocco con la tua
            logica di ricerca avanzata, crediti illimitati, ecc.
          </p>
        </div>
      </main>
    </RequirePro>
  );
}
