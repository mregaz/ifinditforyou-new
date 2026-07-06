import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 32 }}>
      <h1>Phoenix — Leads</h1>

      <p style={{ opacity: 0.7 }}>
        Richieste ricevute tramite il modulo Phoenix.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
        <thead>
          <tr>
            <th align="left">Data</th>
            <th align="left">Email</th>
            <th align="left">Lingua</th>
            <th align="left">Status</th>
            <th align="left">Messaggio</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} style={{ borderTop: "1px solid #ddd" }}>
              <td style={{ padding: "12px 8px" }}>
                {lead.createdAt.toLocaleString("it-CH")}
              </td>
              <td style={{ padding: "12px 8px" }}>{lead.email}</td>
              <td style={{ padding: "12px 8px" }}>{lead.lang ?? "it"}</td>
              <td style={{ padding: "12px 8px" }}>{lead.status ?? "RECEIVED"}</td>
              <td style={{ padding: "12px 8px" }}>{lead.message}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {leads.length === 0 && (
        <p style={{ marginTop: 24 }}>Nessun lead ricevuto.</p>
      )}
    </main>
  );
}
