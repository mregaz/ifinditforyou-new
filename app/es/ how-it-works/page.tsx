import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo funciona | iFindItForYou",
  description:
    "Descripción sencilla de cómo funciona iFindItForYou: de tu solicitud a los resultados filtrados.",
};

export default function HowItWorksPageEs() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Cómo funciona</h1>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <div>
          <h2 className="text-lg font-semibold">1. Describe lo que buscas</h2>
          <p>
            Empiezas escribiendo una descripción lo más clara posible de lo que
            necesitas: un producto, un servicio, una idea de regalo, un viaje,
            etc. Puedes incluir criterios como presupuesto, lugar, marca
            preferida o cualquier detalle relevante.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            2. IA + búsqueda en la web
          </h2>
          <p>
            El sistema combina búsquedas en fuentes públicas con modelos de IA
            para interpretar mejor tu solicitud y filtrar resultados ruidosos o
            irrelevantes.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            3. Pocas opciones, ya filtradas
          </h2>
          <p>
            En lugar de cientos de enlaces, recibes pocas opciones seleccionadas
            que se ajustan a tus criterios. Para algunas búsquedas, el sistema
            puede aportar también un resumen o explicación adicional.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            4. Plan Free y plan PRO
          </h2>
          <p>
            Puedes probar el servicio con un número limitado de búsquedas
            gratuitas. Si lo utilizas con frecuencia, el plan PRO te ofrece
            búsquedas ilimitadas y un tratamiento prioritario de tus
            solicitudes.
          </p>
        </div>
      </section>
    </main>
  );
}
